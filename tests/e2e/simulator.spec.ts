import { test, expect } from "@playwright/test";

/**
 * Smoke test: end-to-end happy path for the full simulator wizard.
 * Assumes the seeded steps are present (run `pnpm seed` first).
 */
test("simulator happy path", async ({ page }) => {
  await page.goto("/simulateur");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

  // 1. Type de logement (RADIO)
  await page.getByLabel("Maison").click();
  await page.getByRole("button", { name: /Suivant/ }).click();

  // 2. Statut (RADIO)
  await page.getByLabel("Propriétaire occupant").click();
  await page.getByRole("button", { name: /Suivant/ }).click();

  // 3. Travaux (CHECKBOX)
  await page.getByLabel("Isolation des combles").check();
  await page.getByRole("button", { name: /Suivant/ }).click();

  // 4. Surface (NUMBER)
  await page.locator('input[type="number"]').fill("95");
  await page.getByRole("button", { name: /Suivant/ }).click();

  // 5. Chauffage actuel (SELECT)
  await page.locator("select").selectOption("gaz");
  await page.getByRole("button", { name: /Suivant/ }).click();

  // 6. Année construction (SELECT)
  await page.locator("select").selectOption("1990-2005");
  await page.getByRole("button", { name: /Suivant/ }).click();

  // 7. Foyer (NUMBER)
  await page.locator('input[type="number"]').fill("4");
  await page.getByRole("button", { name: /Suivant/ }).click();

  // 8. Revenus (RADIO)
  await page.getByLabel("Intermédiaires").click();
  await page.getByRole("button", { name: /Suivant/ }).click();

  // 9. Code postal (TEXT, validated server-side as "75001 Paris")
  await page.getByPlaceholder(/75001/).fill("75001 Paris");
  await page.getByRole("button", { name: /Suivant/ }).click();

  // 10. Coordonnées (compound)
  await page.getByLabel("Prénom").fill("Alice");
  await page.getByLabel("Nom").fill("Martin");
  await page.getByLabel("Email").fill("alice@example.com");
  await page.getByLabel("Téléphone").fill("0123456789");
  await page.getByLabel(/J'accepte/).check();
  await page.getByRole("button", { name: /Suivant/ }).click();

  // Recap
  await expect(page.getByRole("heading", { name: "Récapitulatif" })).toBeVisible();
  await expect(page.getByText("alice@example.com")).toBeVisible();

  // Submit
  await page.getByRole("button", { name: /Envoyer ma demande/ }).click();

  // Thank you page
  await expect(page).toHaveURL(/\/simulateur\/merci$/);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});

test("homepage renders critical sections", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.getByRole("link", { name: /Simuler/ }).first()).toBeVisible();
});

test("travaux dynamic page loads for a real slug", async ({ page }) => {
  await page.goto("/travaux/isolation-combles");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});
