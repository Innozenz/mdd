import type { Page } from "@playwright/test";

/** Identifiants d'un compte de test généré à la volée. */
export type TestUser = {
  username: string;
  email: string;
  password: string;
};

/** Génère un utilisateur unique (évite les collisions entre exécutions). */
export const makeUser = (): TestUser => {
  const suffix = Math.random().toString(36).slice(2, 10);
  return {
    username: `e2e_${suffix}`,
    email: `e2e_${suffix}@mdd.dev`,
    password: "Valid123!",
  };
};

/**
 * Inscrit un nouvel utilisateur via le formulaire et attend la redirection
 * vers le fil d'actualité (connexion automatique).
 */
export const registerNewUser = async (page: Page): Promise<TestUser> => {
  const user = makeUser();

  await page.goto("/register");
  await page.getByLabel("Nom d'utilisateur").fill(user.username);
  await page.getByLabel("Adresse e-mail").fill(user.email);
  await page.getByLabel("Mot de passe").fill(user.password);
  await page.getByRole("button", { name: "S'inscrire" }).click();

  await page.waitForURL("**/feed");
  return user;
};
