import { test, expect } from "@playwright/test";

import { registerNewUser } from "./helpers";

test.describe("Parcours de contenu", () => {
  test("s'abonner à un thème rend le bouton inactif (« Déjà abonné »)", async ({
    page,
  }) => {
    // Arrange
    await registerNewUser(page);
    await page.goto("/themes");

    // Act : s'abonner au thème TypeScript (identifié par sa description)
    const tsCard = page
      .getByRole("listitem")
      .filter({ hasText: "JavaScript typé pour des applications robustes." });
    await tsCard.getByRole("button", { name: "S'abonner" }).click();

    // Assert
    await expect(
      tsCard.getByRole("button", { name: "Déjà abonné" }),
    ).toBeVisible();
    await expect(
      tsCard.getByRole("button", { name: "Déjà abonné" }),
    ).toBeDisabled();
  });

  test("créer un article, le commenter et le retrouver dans le fil", async ({
    page,
  }) => {
    // Arrange : utilisateur abonné à TypeScript
    await registerNewUser(page);
    await page.goto("/themes");
    const tsCard = page
      .getByRole("listitem")
      .filter({ hasText: "JavaScript typé pour des applications robustes." });
    await tsCard.getByRole("button", { name: "S'abonner" }).click();
    await expect(
      tsCard.getByRole("button", { name: "Déjà abonné" }),
    ).toBeVisible();

    const title = `Article e2e ${Date.now()}`;

    // Act : création d'un article
    await page.goto("/articles/new");
    await page.getByLabel("Thème").selectOption({ label: "TypeScript" });
    await page.getByLabel("Titre").fill(title);
    await page.getByLabel("Contenu").fill("Contenu de test end-to-end.");
    await page.getByRole("button", { name: "Créer" }).click();

    // Assert : on est sur la page de l'article
    await expect(page).toHaveURL(/\/articles\/.+/);
    await expect(page.getByRole("heading", { name: title })).toBeVisible();

    // Act : ajout d'un commentaire
    await page.getByLabel("Ajouter un commentaire").fill("Super article !");
    await page.getByRole("button", { name: "Commenter" }).click();

    // Assert : le commentaire apparaît
    await expect(page.getByText("Super article !")).toBeVisible();

    // Assert : l'article est dans le fil
    await page.goto("/feed");
    await expect(page.getByText(title)).toBeVisible();
  });
});
