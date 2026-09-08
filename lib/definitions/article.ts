import { z } from "zod";

/**
 * Schéma de validation pour la création d'un article.
 * L'auteur et la date sont définis automatiquement côté serveur (jamais saisis).
 */

export const ARTICLE_LIMITS = {
  titleMin: 3,
  titleMax: 150,
  contentMin: 1,
  contentMax: 10000,
} as const;

export const createArticleSchema = z.object({
  topicId: z.string().min(1, { message: "Veuillez choisir un thème." }),
  title: z
    .string()
    .trim()
    .min(ARTICLE_LIMITS.titleMin, {
      message: `Le titre doit contenir au moins ${ARTICLE_LIMITS.titleMin} caractères.`,
    })
    .max(ARTICLE_LIMITS.titleMax, {
      message: `Le titre ne doit pas dépasser ${ARTICLE_LIMITS.titleMax} caractères.`,
    }),
  content: z
    .string()
    .trim()
    .min(ARTICLE_LIMITS.contentMin, { message: "Le contenu est requis." })
    .max(ARTICLE_LIMITS.contentMax, {
      message: `Le contenu ne doit pas dépasser ${ARTICLE_LIMITS.contentMax} caractères.`,
    }),
});

export type CreateArticleInput = z.infer<typeof createArticleSchema>;

/**
 * État renvoyé par la Server Action de création d'article (via `useActionState`).
 */
export type ArticleFormState = {
  errors?: Record<string, string[]>;
  message?: string;
  values?: { topicId?: string; title?: string; content?: string };
} | null;
