import { z } from "zod";

/**
 * Schémas de validation Zod pour l'authentification.
 *
 * Centralisés ici (couche « definitions »), ils remplacent des DTO classiques
 * et servent de source de vérité unique, côté serveur (Server Actions, provider
 * Credentials) comme côté client (feedback de formulaire).
 */

/** Longueurs des champs, exposées pour rester cohérent entre schémas et UI. */
export const AUTH_LIMITS = {
  usernameMin: 3,
  usernameMax: 20,
  passwordMin: 8,
} as const;

/**
 * Règle métier du mot de passe (spécifications MDD) :
 * ≥ 8 caractères ET au moins une minuscule, une majuscule, un chiffre et un
 * caractère spécial (tout caractère non alphanumérique).
 */
export const passwordSchema = z
  .string()
  .min(AUTH_LIMITS.passwordMin, {
    message: `Le mot de passe doit contenir au moins ${AUTH_LIMITS.passwordMin} caractères.`,
  })
  .regex(/[a-z]/, { message: "Il doit contenir au moins une minuscule." })
  .regex(/[A-Z]/, { message: "Il doit contenir au moins une majuscule." })
  .regex(/[0-9]/, { message: "Il doit contenir au moins un chiffre." })
  .regex(/[^A-Za-z0-9]/, {
    message: "Il doit contenir au moins un caractère spécial.",
  });

/** Nom d'utilisateur : lettres, chiffres, tiret et underscore. */
export const usernameSchema = z
  .string()
  .trim()
  .min(AUTH_LIMITS.usernameMin, {
    message: `Le nom d'utilisateur doit contenir au moins ${AUTH_LIMITS.usernameMin} caractères.`,
  })
  .max(AUTH_LIMITS.usernameMax, {
    message: `Le nom d'utilisateur ne doit pas dépasser ${AUTH_LIMITS.usernameMax} caractères.`,
  })
  .regex(/^[a-zA-Z0-9_-]+$/, {
    message:
      "Le nom d'utilisateur ne peut contenir que des lettres, chiffres, tirets et underscores.",
  });

/** Adresse e-mail normalisée (minuscules, sans espaces superflus). */
export const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .email({ message: "L'adresse e-mail n'est pas valide." });

/** Inscription : e-mail + nom d'utilisateur + mot de passe. */
export const registerSchema = z.object({
  email: emailSchema,
  username: usernameSchema,
  password: passwordSchema,
});

/**
 * Connexion : un identifiant (e-mail OU nom d'utilisateur) + mot de passe.
 * Le mot de passe n'est pas revalidé selon la règle métier ici : on vérifie
 * seulement qu'il est présent, la comparaison au hash fait foi.
 */
export const loginSchema = z.object({
  identifier: z.string().trim().min(1, { message: "Ce champ est requis." }),
  password: z.string().min(1, { message: "Le mot de passe est requis." }),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;

/**
 * État renvoyé par les Server Actions d'authentification, consommé côté client
 * via `useActionState`. `errors` porte les messages par champ, `message` un
 * message global (ex. erreur d'identifiants), `values` réaffiche les champs
 * non sensibles après une erreur (le mot de passe n'est jamais renvoyé).
 */
export type AuthFormState = {
  errors?: Record<string, string[]>;
  message?: string;
  values?: {
    email?: string;
    username?: string;
    identifier?: string;
  };
} | null;
