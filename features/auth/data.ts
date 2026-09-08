import "server-only";

import { prisma } from "@/lib/prisma";
import type { User } from "@prisma/client";

/**
 * Couche d'accès aux données pour l'authentification.
 *
 * Isole les requêtes Prisma liées aux utilisateurs afin que les Server Actions
 * et le provider Credentials ne manipulent jamais directement l'ORM
 * (séparation des responsabilités, testabilité).
 */

/**
 * Retrouve un utilisateur par e-mail OU nom d'utilisateur.
 * Utilisé à la connexion, où l'identifiant peut être l'un ou l'autre.
 *
 * @param identifier - E-mail ou nom d'utilisateur saisi.
 * @returns L'utilisateur complet (mot de passe haché inclus) ou `null`.
 */
export const getUserByIdentifier = (identifier: string): Promise<User | null> => {
  const value = identifier.trim();
  return prisma.user.findFirst({
    where: {
      OR: [{ email: value.toLowerCase() }, { username: value }],
    },
  });
};

/**
 * Crée un utilisateur. Le mot de passe doit déjà être haché par l'appelant.
 *
 * @throws PrismaClientKnownRequestError (code `P2002`) si l'e-mail ou le nom
 * d'utilisateur est déjà pris.
 */
export const createUser = (data: {
  email: string;
  username: string;
  password: string;
}): Promise<User> => {
  return prisma.user.create({ data });
};
