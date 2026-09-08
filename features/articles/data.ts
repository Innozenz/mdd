import "server-only";

import { prisma } from "@/lib/prisma";
import type { Article } from "@prisma/client";

/**
 * Couche d'accès aux données pour les articles.
 */

/** Sens de tri du fil d'actualité. */
export type FeedSort = "desc" | "asc";

/** Article enrichi de son auteur, son thème et le nombre de commentaires. */
export type FeedArticle = Article & {
  author: { username: string };
  topic: { name: string };
  _count: { comments: number };
};

/**
 * Retourne le fil d'actualité d'un utilisateur : les articles des thèmes
 * auxquels il est abonné, triés par date (récent → ancien par défaut).
 *
 * @param userId - Utilisateur dont on construit le fil.
 * @param sort - `desc` (plus récent d'abord) ou `asc` (plus ancien d'abord).
 */
export const getFeedArticles = (
  userId: string,
  sort: FeedSort = "desc",
): Promise<FeedArticle[]> => {
  return prisma.article.findMany({
    where: { topic: { subscriptions: { some: { userId } } } },
    orderBy: { createdAt: sort },
    include: {
      author: { select: { username: true } },
      topic: { select: { name: true } },
      _count: { select: { comments: true } },
    },
  });
};

/** Article complet pour la page de consultation (auteur + thème). */
export type ArticleDetail = Article & {
  author: { username: string };
  topic: { name: string };
};

/**
 * Retourne un article par son identifiant, avec son auteur et son thème,
 * ou `null` s'il n'existe pas.
 */
export const getArticleById = (id: string): Promise<ArticleDetail | null> => {
  return prisma.article.findUnique({
    where: { id },
    include: {
      author: { select: { username: true } },
      topic: { select: { name: true } },
    },
  });
};

/**
 * Crée un article. L'auteur (`authorId`) provient de la session, jamais du
 * formulaire ; la date est gérée par la base (`@default(now())`).
 */
export const createArticle = (data: {
  authorId: string;
  topicId: string;
  title: string;
  content: string;
}): Promise<Article> => {
  return prisma.article.create({ data });
};
