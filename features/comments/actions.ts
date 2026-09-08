"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import {
  createCommentSchema,
  type CommentFormState,
} from "@/lib/definitions/comment";
import { createComment } from "./data";

/**
 * Ajoute un commentaire à un article pour l'utilisateur connecté.
 *
 * `articleId` est fourni par liaison (`bind`) côté serveur ; l'auteur provient
 * de la session, la date de la base. La page de l'article est revalidée pour
 * afficher le nouveau commentaire.
 */
export async function addCommentAction(
  articleId: string,
  _prevState: CommentFormState,
  formData: FormData,
): Promise<CommentFormState> {
  const session = await auth();
  if (!session?.user?.id) {
    return { message: "Vous devez être connecté pour commenter." };
  }

  const parsed = createCommentSchema.safeParse({
    content: formData.get("content"),
  });

  if (!parsed.success) {
    return {
      errors: parsed.error.flatten().fieldErrors,
      message: "Veuillez corriger le commentaire.",
    };
  }

  try {
    await createComment({
      authorId: session.user.id,
      articleId,
      content: parsed.data.content,
    });
  } catch {
    return { message: "L'ajout du commentaire a échoué. Veuillez réessayer." };
  }

  revalidatePath(`/articles/${articleId}`);
  revalidatePath("/feed");
  return null;
}
