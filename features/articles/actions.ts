"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import {
  createArticleSchema,
  type ArticleFormState,
} from "@/lib/definitions/article";
import { createArticle } from "./data";

/**
 * Crée un article pour l'utilisateur connecté.
 *
 * L'auteur est déterminé côté serveur (session), la date par la base. En cas
 * de succès, redirige vers l'article créé.
 */
export async function createArticleAction(
  _prevState: ArticleFormState,
  formData: FormData,
): Promise<ArticleFormState> {
  const session = await auth();
  if (!session?.user?.id) {
    return { message: "Vous devez être connecté pour publier." };
  }

  const values = {
    topicId: String(formData.get("topicId") ?? ""),
    title: String(formData.get("title") ?? ""),
    content: String(formData.get("content") ?? ""),
  };

  const parsed = createArticleSchema.safeParse(values);
  if (!parsed.success) {
    return {
      errors: parsed.error.flatten().fieldErrors,
      message: "Veuillez corriger les champs en erreur.",
      values,
    };
  }

  let articleId: string;
  try {
    const article = await createArticle({
      authorId: session.user.id,
      ...parsed.data,
    });
    articleId = article.id;
  } catch {
    return {
      message: "La publication a échoué. Veuillez réessayer.",
      values,
    };
  }

  revalidatePath("/feed");
  redirect(`/articles/${articleId}`);
}
