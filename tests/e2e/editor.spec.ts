import { test, expect } from "@playwright/test";


async function login(page: import("@playwright/test").Page) {
  await page.goto("/admin/login");
  await page.locator("#login-email").fill("admin@example.com");
  await page.locator("#login-pw").fill("ChangeMe!2026");
  await page.getByRole("button", { name: /Se connecter/ }).click();
  await page.waitForURL(/\/admin/);
}

test("editor shell mounts iframe + viewport switch resizes it", async ({ page }) => {
  await login(page);
  await page.goto("/admin/editor/home");
  await expect(page.getByRole("toolbar", { name: /Éditeur/i })).toBeVisible();

  const frame = page.locator("iframe");
  await expect(frame).toBeVisible();

  // Largeur initiale = desktop (1280)
  const desktopWidth = await frame.evaluate((el) => (el as HTMLIFrameElement).getBoundingClientRect().width);
  expect(desktopWidth).toBeGreaterThan(900);

  // Switch mobile (M) via raccourci
  await page.keyboard.press("m");
  await page.waitForTimeout(300);
  const mobileWidth = await frame.evaluate((el) => (el as HTMLIFrameElement).getBoundingClientRect().width);
  expect(mobileWidth).toBeLessThanOrEqual(400);
  expect(mobileWidth).toBeGreaterThan(380);

  // Switch tablette (T)
  await page.keyboard.press("t");
  await page.waitForTimeout(300);
  const tabletWidth = await frame.evaluate((el) => (el as HTMLIFrameElement).getBoundingClientRect().width);
  expect(tabletWidth).toBeGreaterThan(700);
  expect(tabletWidth).toBeLessThan(800);

  // Retour desktop (D)
  await page.keyboard.press("d");
  await page.waitForTimeout(300);
  const desktopAgain = await frame.evaluate((el) => (el as HTMLIFrameElement).getBoundingClientRect().width);
  expect(desktopAgain).toBeGreaterThan(900);
});

test("clicking a CTA inside the iframe edits the label and does NOT navigate", async ({ page }) => {
  await login(page);
  await page.goto("/admin/editor/home");
  await page.waitForLoadState("networkidle");

  const frame = page.frameLocator("iframe");
  const cta = frame.locator('[data-editable-key="home.hero.cta_primary"]').first();
  await expect(cta).toBeVisible({ timeout: 20_000 });

  // Clic sur le CTA dans l'iframe
  await cta.click();

  // L'URL principale ne doit PAS avoir changé (pas de navigation vers /simulateur)
  await expect(page).toHaveURL(/\/admin\/editor\/home/);

  // Le span du CTA doit être passé en contentEditable
  const isEditing = await cta.locator('[contenteditable="true"]').first().isVisible({ timeout: 2000 }).catch(() => false);
  expect(isEditing).toBe(true);
});
