"use server";

import { AuthError } from "next-auth";
import { Prisma } from "@prisma/client";
import bcrypt from "bcryptjs";

import { signIn, signOut } from "@/auth";
import {
  registerSchema,
  loginSchema,
  type AuthFormState,
} from "@/lib/definitions/auth";
import { createUser } from "./data";

/** Nombre de tours bcrypt (coût du hachage). */
const BCRYPT_ROUNDS = 10;

/** Destination après une connexion réussie. */
const DEFAULT_REDIRECT = "/feed";

/**
 * Inscrit un nouvel utilisateur puis le connecte automatiquement.
 *
 * Valide les entrées (Zod), hache le mot de passe (bcrypt), crée l'utilisateur
 * puis délègue la connexion au provider Credentials. En cas de succès, `signIn`
 * lève une redirection (propagée volontairement).
 */
export async function registerAction(
  _prevState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  // Valeurs brutes conservées pour réafficher le formulaire en cas d'erreur.
  const values = {
    email: String(formData.get("email") ?? ""),
    username: String(formData.get("username") ?? ""),
  };

  const parsed = registerSchema.safeParse({
    email: formData.get("email"),
    username: formData.get("username"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return {
      errors: parsed.error.flatten().fieldErrors,
      message: "Veuillez corriger les champs en erreur.",
      values,
    };
  }

  const { email, username, password } = parsed.data;

  try {
    const hashedPassword = await bcrypt.hash(password, BCRYPT_ROUNDS);
    await createUser({ email, username, password: hashedPassword });
  } catch (error) {
    // Violation de contrainte d'unicité (e-mail ou nom d'utilisateur pris).
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      const target = (error.meta?.target as string[] | undefined) ?? [];
      const errors: Record<string, string[]> = {};
      if (target.includes("email")) {
        errors.email = ["Cette adresse e-mail est déjà utilisée."];
      }
      if (target.includes("username")) {
        errors.username = ["Ce nom d'utilisateur est déjà pris."];
      }
      return {
        errors,
        message: "Un compte existe déjà avec ces informations.",
        values,
      };
    }
    return {
      message: "Une erreur est survenue. Veuillez réessayer.",
      values,
    };
  }

  // Connexion automatique (lève une redirection vers DEFAULT_REDIRECT).
  await signIn("credentials", {
    identifier: email,
    password,
    redirectTo: DEFAULT_REDIRECT,
  });

  return null;
}

/**
 * Connecte un utilisateur via identifiant (e-mail ou nom d'utilisateur).
 * En cas de succès, `signIn` lève une redirection ; en cas d'échec
 * d'identifiants, on renvoie un message générique (pas de fuite d'info).
 */
export async function loginAction(
  _prevState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const identifier = String(formData.get("identifier") ?? "");

  const parsed = loginSchema.safeParse({
    identifier: formData.get("identifier"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return {
      errors: parsed.error.flatten().fieldErrors,
      message: "Veuillez renseigner vos identifiants.",
      values: { identifier },
    };
  }

  try {
    await signIn("credentials", {
      ...parsed.data,
      redirectTo: DEFAULT_REDIRECT,
    });
  } catch (error) {
    // `signIn` lève une redirection en cas de succès : il faut la laisser
    // remonter. On ne traite que les erreurs d'authentification Auth.js.
    if (error instanceof AuthError) {
      return {
        message: "Identifiant ou mot de passe incorrect.",
        values: { identifier },
      };
    }
    throw error;
  }

  return null;
}

/** Déconnecte l'utilisateur et le renvoie vers la page d'accueil. */
export async function logoutAction(): Promise<void> {
  await signOut({ redirectTo: "/" });
}
