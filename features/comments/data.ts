import "server-only";

import { prisma } from "@/lib/prisma";
import type { Comment } from "@prisma/client";

/**
 * Couche d'accès aux données pour les commentaires.
 */

/** Commentaire enrichi de son auteur. */
export type CommentWithAuthor = Comment & { author: { username: string } };

/**
 * Retourne les commentaires d'un article, du plus ancien au plus récent
 * (ordre de lecture d'une conversation).
 */
export const getCommentsByArticle = (
  articleId: string,
): Promise<CommentWithAuthor[]> => {
  return prisma.comment.findMany({
    where: { articleId },
    orderBy: { createdAt: "asc" },
    include: { author: { select: { username: true } } },
  });
};

/**
 * Crée un commentaire. L'auteur (`authorId`) provient de la session, la date
 * est gérée par la base. Un commentaire n'est rattaché qu'à un seul article.
 */
export const createComment = (data: {
  authorId: string;
  articleId: string;
  content: string;
}): Promise<Comment> => {
  return prisma.comment.create({ data });
};
