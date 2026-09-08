import { test, expect } from "@playwright/test";

import { registerNewUser } from "./helpers";

test.describe("Authentification", () => {
  test("inscription puis connexion automatique vers le fil", async ({ page }) => {
    // Act : inscription d'un nouvel utilisateur
    await registerNewUser(page);

    // Assert : on est sur le fil, connecté
    await expect(page).toHaveURL(/\/feed/);
    await expect(
      page.getByRole("link", { name: "Créer un article" }),
    ).toBeVisible();
  });

  test("déconnexion puis reconnexion par nom d'utilisateur", async ({
    page,
  }) => {
    // Arrange : un compte existe et est connecté
    const user = await registerNewUser(page);

    // Act : déconnexion
    await page.getByRole("button", { name: "Se déconnecter" }).click();
    await page.waitForURL("**/");

    // Act : reconnexion via le nom d'utilisateur
    await page.goto("/login");
    await page.getByLabel("E-mail ou nom d'utilisateur").fill(user.username);
    await page.getByLabel("Mot de passe").fill(user.password);
    await page.getByRole("button", { name: "Se connecter" }).click();

    // Assert
    await expect(page).toHaveURL(/\/feed/);
  });

  test("les identifiants incorrects affichent un message générique", async ({
    page,
  }) => {
    // Act
    await page.goto("/login");
    await page.getByLabel("E-mail ou nom d'utilisateur").fill("inconnu");
    await page.getByLabel("Mot de passe").fill("Mauvais123!");
    await page.getByRole("button", { name: "Se connecter" }).click();

    // Assert : message sans fuite d'information
    await expect(page.getByText(/mot de passe incorrect/i)).toBeVisible();
  });

  test("une route protégée redirige vers la connexion", async ({ page }) => {
    await page.goto("/profile");
    await expect(page).toHaveURL(/\/login/);
  });
});
