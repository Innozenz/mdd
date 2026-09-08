import type { DefaultSession } from "next-auth";

/**
 * Augmentation des types Auth.js pour exposer l'`id` de l'utilisateur
 * dans la session (le `name` porte le nom d'utilisateur MDD).
 */
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}
