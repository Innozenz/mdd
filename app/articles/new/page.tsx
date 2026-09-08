import type { Metadata } from "next";
import Link from "next/link";

import { getTopics } from "@/features/topics/data";
import { ArticleForm } from "@/features/articles/components/article-form";

export const metadata: Metadata = {
  title: "Créer un article — MDD",
};

/**
 * Page de création d'article (route protégée). Les thèmes disponibles sont
 * chargés côté serveur et fournis au formulaire.
 */
const NewArticlePage = async () => {
  const topics = await getTopics();

  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col gap-6 p-6">
      <header>
        <Link href="/feed" className="text-sm text-primary hover:underline">
          ← Retour au fil
        </Link>
        <h1 className="mt-2 text-2xl font-bold">Créer un article</h1>
      </header>

      <ArticleForm topics={topics} />
    </main>
  );
};

export default NewArticlePage;
