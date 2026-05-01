import { test, expect } from "@playwright/test";

/**
 * Smoke e2e du simulateur happy-path après dynamisation :
 *  - Reduce-motion désactive l'auto-advance et les délais.
 *  - RADIO étapes utilisent les ChoiceCard (role=radio) avec illustrations.
 *  - SELECT subsiste pour `annee_construction`.
 *  - CHECKBOX `travaux` utilise les ChoiceCard (role=checkbox) — on coche
 *    une option puis on clique Suivant.
 */
test("simulator happy path", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/simulateur");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

  // ChoiceCard expose data-name/data-value : sélecteurs robustes (les
  // accessible-names des boutons sont combinés avec les aria-label des
  // illustrations SVG, ce qui complique les regex).

  // 1. Type de logement
  await page.locator('[data-name="logement_type"][data-value="maison"]').click();
  await page.getByRole("button", { name: /Suivant/ }).click();

  // 2. Statut
  await page.locator('[data-name="statut"][data-value="proprietaire-occupant"]').click();
  await page.getByRole("button", { name: /Suivant/ }).click();

  // 3. Travaux (multi-select)
  await page.locator('[data-name="travaux"][data-value="isolation-combles"]').click();
  await page.getByRole("button", { name: /Suivant/ }).click();

  // 4. Surface (NUMBER)
  await page.locator('input[type="number"]').fill("95");
  await page.getByRole("button", { name: /Suivant/ }).click();

  // 5. Chauffage actuel
  await page.locator('[data-name="chauffage_actuel"][data-value="gaz"]').click();
  await page.getByRole("button", { name: /Suivant/ }).click();

  // 6. Année construction (SELECT)
  await page.locator("select").selectOption("1990-2005");
  await page.getByRole("button", { name: /Suivant/ }).click();

  // 7. Foyer
  await page.locator('[data-name="foyer_personnes"][data-value="4"]').click();
  await page.getByRole("button", { name: /Suivant/ }).click();

  // 8. Revenus (RADIO sans illustration → RadioField classique avec input sr-only)
  await page.locator('label:has(input[name="revenus"][value="intermediaire"])').click();
  await page.getByRole("button", { name: /Suivant/ }).click();

  // 9. Code postal (TEXT)
  await page.getByPlaceholder(/75001/).fill("75001 Paris");
  await page.getByRole("button", { name: /Suivant/ }).click();

  // 10. Coordonnées : sélection par id (les labels accessibles peuvent
  // s'entre-recouvrir avec les emoji et accents).
  await page.locator("#firstName").fill("Alice");
  await page.locator("#lastName").fill("Martin");
  await page.locator("#email").fill("alice@example.com");
  await page.locator("#phone").fill("0123456789");
  await page.locator('input[type="checkbox"]').check();
  await page.getByRole("button", { name: /Suivant/ }).click();

  // Recap
  await expect(page.getByRole("heading", { name: /Récapitulatif/i })).toBeVisible();
  await expect(page.getByText("alice@example.com")).toBeVisible();

  // Submit
  await page.getByRole("button", { name: /Envoyer ma demande/ }).click();

  // Thank-you page
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
