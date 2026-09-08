"use server";

import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
import bcrypt from "bcryptjs";

import { auth } from "@/auth";
import {
  updateProfileSchema,
  type ProfileFormState,
} from "@/lib/definitions/profile";
import { updateUserProfile } from "./data";

const BCRYPT_ROUNDS = 10;

/**
 * Met à jour le profil de l'utilisateur connecté (e-mail, nom d'utilisateur,
 * et éventuellement mot de passe). L'id vient de la session.
 *
 * Remarque : le nom affiché dans l'en-tête provient du jeton de session et ne
 * sera rafraîchi qu'à la prochaine connexion ; la page de profil, elle, lit
 * les données à jour en base.
 */
export async function updateProfileAction(
  _prevState: ProfileFormState,
  formData: FormData,
): Promise<ProfileFormState> {
  const session = await auth();
  if (!session?.user?.id) {
    return { message: "Vous devez être connecté." };
  }

  const values = {
    email: String(formData.get("email") ?? ""),
    username: String(formData.get("username") ?? ""),
  };

  const parsed = updateProfileSchema.safeParse({
    email: formData.get("email"),
    username: formData.get("username"),
    password: formData.get("password") ?? "",
  });

  if (!parsed.success) {
    return {
      errors: parsed.error.flatten().fieldErrors,
      message: "Veuillez corriger les champs en erreur.",
      values,
    };
  }

  const { email, username, password } = parsed.data;

  // Le mot de passe n'est mis à jour que s'il a été saisi.
  const data: { email: string; username: string; password?: string } = {
    email,
    username,
  };
  if (password) {
    data.password = await bcrypt.hash(password, BCRYPT_ROUNDS);
  }

  try {
    await updateUserProfile(session.user.id, data);
  } catch (error) {
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
      return { errors, message: "Ces informations sont déjà utilisées.", values };
    }
    return { message: "La mise à jour a échoué. Veuillez réessayer.", values };
  }

  revalidatePath("/profile");
  return { success: true, message: "Profil mis à jour." };
}
