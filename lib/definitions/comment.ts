import { z } from "zod";

/**
 * Schéma de validation pour l'ajout d'un commentaire.
 * L'auteur et la date sont définis automatiquement côté serveur.
 * Un commentaire est rattaché à un seul article (non récursif).
 */

export const COMMENT_LIMITS = {
  contentMin: 1,
  contentMax: 2000,
} as const;

export const createCommentSchema = z.object({
  content: z
    .string()
    .trim()
    .min(COMMENT_LIMITS.contentMin, { message: "Le commentaire est vide." })
    .max(COMMENT_LIMITS.contentMax, {
      message: `Le commentaire ne doit pas dépasser ${COMMENT_LIMITS.contentMax} caractères.`,
    }),
});

export type CreateCommentInput = z.infer<typeof createCommentSchema>;

/** État renvoyé par la Server Action d'ajout de commentaire. */
export type CommentFormState = {
  errors?: Record<string, string[]>;
  message?: string;
} | null;
