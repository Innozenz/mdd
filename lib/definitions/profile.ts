import { z } from "zod";

import { emailSchema, usernameSchema, passwordSchema } from "./auth";

/**
 * Schéma de mise à jour du profil : e-mail et nom d'utilisateur (requis),
 * mot de passe (optionnel — seulement s'il est modifié). Un mot de passe
 * fourni doit respecter la règle métier ; laissé vide, il n'est pas changé.
 */
export const updateProfileSchema = z.object({
  email: emailSchema,
  username: usernameSchema,
  // Chaîne vide = pas de changement ; sinon la règle complète s'applique.
  password: z.union([z.literal(""), passwordSchema]).optional(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

/**
 * État renvoyé par la Server Action de mise à jour du profil.
 * `success` déclenche le message de confirmation côté client.
 */
export type ProfileFormState = {
  errors?: Record<string, string[]>;
  message?: string;
  success?: boolean;
  values?: { email?: string; username?: string };
} | null;
