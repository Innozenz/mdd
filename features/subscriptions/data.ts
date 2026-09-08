import "server-only";

import { prisma } from "@/lib/prisma";
import type { Topic } from "@prisma/client";

/**
 * Couche d'accès aux données pour les abonnements (Subscription).
 * La table Subscription est la jointure User <-> Topic.
 */

/**
 * Retourne l'ensemble des identifiants de thèmes auxquels l'utilisateur est
 * abonné, sous forme de `Set` pour un test d'appartenance en O(1) côté page.
 */
export const getSubscribedTopicIds = async (
  userId: string,
): Promise<Set<string>> => {
  const subscriptions = await prisma.subscription.findMany({
    where: { userId },
    select: { topicId: true },
  });
  return new Set(subscriptions.map((s) => s.topicId));
};

/**
 * Retourne les thèmes auxquels l'utilisateur est abonné (les plus récents
 * d'abord). Utilisé par la page de profil.
 */
export const getSubscribedTopics = (userId: string): Promise<Topic[]> => {
  return prisma.topic.findMany({
    where: { subscriptions: { some: { userId } } },
    orderBy: { name: "asc" },
  });
};

/**
 * Abonne un utilisateur à un thème. Idempotent : ne crée rien si l'abonnement
 * existe déjà (upsert sur la contrainte d'unicité `userId_topicId`).
 */
export const subscribe = (userId: string, topicId: string) => {
  return prisma.subscription.upsert({
    where: { userId_topicId: { userId, topicId } },
    create: { userId, topicId },
    update: {},
  });
};

/**
 * Désabonne un utilisateur d'un thème. Idempotent : ne lève pas d'erreur si
 * l'abonnement n'existe pas (`deleteMany`).
 */
export const unsubscribe = (userId: string, topicId: string) => {
  return prisma.subscription.deleteMany({
    where: { userId, topicId },
  });
};
