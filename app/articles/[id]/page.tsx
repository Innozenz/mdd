import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getArticleById } from "@/features/articles/data";
import { getCommentsByArticle } from "@/features/comments/data";
import { CommentList } from "@/features/comments/components/comment-list";
import { CommentForm } from "@/features/comments/components/comment-form";
import { formatDate } from "@/lib/format";

export const metadata: Metadata = {
  title: "Article — MDD",
};

/**
 * Consultation d'un article (route protégée) : thème, titre, auteur, date et
 * contenu. La section des commentaires est ajoutée par la feature Commentaires.
 */
const ArticlePage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const article = await getArticleById(id);

  if (!article) {
    notFound();
  }

  const comments = await getCommentsByArticle(article.id);

  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col gap-6 p-6">
      <Link href="/feed" className="text-sm text-primary hover:underline">
        ← Retour au fil
      </Link>

      <article className="flex flex-col gap-4">
        <header className="flex flex-col gap-3">
          <span className="w-fit rounded-full bg-accent px-2.5 py-0.5 text-xs font-medium text-accent-foreground">
            {article.topic.name}
          </span>
          <h1 className="text-3xl font-bold">{article.title}</h1>
          <p className="text-sm text-muted-foreground">
            Par {article.author.username} · {formatDate(article.createdAt)}
          </p>
        </header>

        <div className="whitespace-pre-wrap leading-relaxed">
          {article.content}
        </div>
      </article>

      <section aria-labelledby="comments-title" className="flex flex-col gap-6">
        <h2 id="comments-title" className="text-lg font-semibold">
          Commentaires ({comments.length})
        </h2>
        <CommentForm articleId={article.id} />
        <CommentList comments={comments} />
      </section>
    </main>
  );
};

export default ArticlePage;
