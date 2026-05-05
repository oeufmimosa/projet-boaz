import { test, expect } from "@playwright/test";

test("chatbox opens and shows the two intro bubbles before options", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.waitForLoadState("networkidle");

  await page.getByRole("button", { name: /Ouvrir la chatbox/i }).click();

  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible({ timeout: 3000 });

  await expect(dialog.getByText(/Je suis Camille de Climat Hexagone/)).toBeVisible({ timeout: 5000 });
  await expect(dialog.getByText(/Quels travaux vous intéressent/)).toBeVisible({ timeout: 5000 });
  await expect(dialog.getByRole("button", { name: /Isolation/ })).toBeVisible();
});

test("chatbox full flow reaches handoff CTA after 4 steps", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.waitForLoadState("networkidle");

  await page.getByRole("button", { name: /Ouvrir la chatbox/i }).click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();

  await dialog.getByRole("button", { name: /Isolation/ }).click();
  await expect(dialog.getByText(/Vous habitez/)).toBeVisible({ timeout: 5000 });
  await dialog.getByRole("button", { name: /maison individuelle/i }).click();
  await expect(dialog.getByText(/Et vous êtes/)).toBeVisible({ timeout: 5000 });
  await dialog.getByRole("button", { name: /Propriétaire occupant/ }).click();
  await expect(dialog.getByText(/code postal/)).toBeVisible({ timeout: 5000 });
  await dialog.getByPlaceholder(/Code postal/).fill("75001");
  await dialog.getByRole("button", { name: /Valider/ }).click();

  await expect(dialog.getByText(/j'ai tout ce qu'il faut/i)).toBeVisible({ timeout: 5000 });
  await expect(dialog.getByRole("button", { name: /Voir mes aides/ })).toBeVisible({ timeout: 5000 });
});

test("chatbox handoff redirects with prefill to simulator and skips first 3 steps", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });

  // Capture les console.error éventuels du navigateur pour diag
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(`PAGEERR: ${e.message}`));
  page.on("console", (m) => { if (m.type() === "error") errors.push(`CONSOLE: ${m.text()}`); });

  await page.goto("/");
  await page.waitForLoadState("networkidle");

  await page.getByRole("button", { name: /Ouvrir la chatbox/i }).click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();

  await dialog.getByRole("button", { name: /Isolation/ }).click();
  await expect(dialog.getByText(/Vous habitez/)).toBeVisible({ timeout: 5000 });
  await dialog.getByRole("button", { name: /maison individuelle/i }).click();
  await expect(dialog.getByText(/Et vous êtes/)).toBeVisible({ timeout: 5000 });
  await dialog.getByRole("button", { name: /Propriétaire occupant/ }).click();
  await expect(dialog.getByText(/code postal/)).toBeVisible({ timeout: 5000 });
  await dialog.getByPlaceholder(/Code postal/).fill("75001");
  await dialog.getByRole("button", { name: /Valider/ }).click();

  await expect(dialog.getByRole("button", { name: /Voir mes aides/ })).toBeVisible({ timeout: 5000 });

  // Inspect sessionStorage juste avant de cliquer le CTA — devrait être vide
  // (pas encore écrit), puis on clique et la page change.
  await dialog.getByRole("button", { name: /Voir mes aides/ }).click();

  await expect(page).toHaveURL(/\/simulateur\?from=chatbox/, { timeout: 10_000 });
  await page.waitForLoadState("networkidle");

  // Diagnostic : dump heading + sessionStorage
  const allHeadings = await page.locator("h1, h2").allInnerTexts();
  const wizardStorage = await page.evaluate(() => sessionStorage.getItem("bz_simulator_state_v1"));
  const prefillStorage = await page.evaluate(() => sessionStorage.getItem("chatbox.prefill"));
  console.log("HEADINGS:", JSON.stringify(allHeadings));
  console.log("WIZARD_STORAGE:", wizardStorage);
  console.log("PREFILL_STORAGE:", prefillStorage);
  console.log("PAGE_ERRORS:", errors);

  // Bandeau de retour de chatbox
  await expect(page.getByText(/Reprenons où nous en étions/i)).toBeVisible({ timeout: 5000 });

  // Le wizard doit afficher l'étape SURFACE (m²) — pas la 1ère (logement)
  await expect(page.getByRole("heading", { name: /surface/i })).toBeVisible({ timeout: 5000 });
});
