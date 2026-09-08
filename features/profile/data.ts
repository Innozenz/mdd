import "server-only";

import { prisma } from "@/lib/prisma";

/**
 * Couche d'accès aux données pour le profil utilisateur.
 */

/** Informations de profil affichées (jamais le mot de passe). */
export type UserProfile = { id: string; email: string; username: string };

/** Retourne le profil (sans le mot de passe) d'un utilisateur, ou `null`. */
export const getUserProfile = (userId: string): Promise<UserProfile | null> => {
  return prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, username: true },
  });
};

/**
 * Met à jour le profil. Seuls les champs fournis sont modifiés ; le mot de
 * passe (déjà haché par l'appelant) n'est présent que s'il change.
 *
 * @throws PrismaClientKnownRequestError `P2002` si e-mail/username déjà pris.
 */
export const updateUserProfile = (
  userId: string,
  data: { email: string; username: string; password?: string },
) => {
  return prisma.user.update({
    where: { id: userId },
    data,
  });
};
