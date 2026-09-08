import "server-only";

import { prisma } from "@/lib/prisma";
import type { Topic } from "@prisma/client";

/**
 * Couche d'accès aux données pour les thèmes (Topic).
 * Isole les requêtes Prisma afin que les Server Components consomment des
 * fonctions métier plutôt que l'ORM directement.
 */

/**
 * Retourne tous les thèmes, triés par nom (ordre alphabétique stable).
 * Utilisé par la page « Thèmes » qui liste l'ensemble, que l'utilisateur
 * soit abonné ou non.
 */
export const getTopics = (): Promise<Topic[]> => {
  return prisma.topic.findMany({
    orderBy: { name: "asc" },
  });
};
