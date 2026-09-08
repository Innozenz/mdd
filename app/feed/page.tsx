import type { Metadata } from "next";
import Link from "next/link";
import { PenSquare } from "lucide-react";

import { auth } from "@/auth";
import { getFeedArticles, type FeedSort } from "@/features/articles/data";
import { ArticleCard } from "@/features/articles/components/article-card";
import { FeedSort as FeedSortControl } from "@/features/articles/components/feed-sort";
import { LogoutButton } from "@/features/auth/components/logout-button";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Fil d'actualité — MDD",
};

/** Normalise le paramètre de tri de l'URL vers une valeur sûre. */
const parseSort = (value: string | undefined): FeedSort =>
  value === "asc" ? "asc" : "desc";

/**
 * Fil d'actualité (route protégée) : les articles des thèmes auxquels
 * l'utilisateur est abonné, triés du plus récent au plus ancien par défaut,
 * avec bascule du sens de tri.
 */
const FeedPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ sort?: string }>;
}) => {
  const session = await auth();
  const { sort: sortParam } = await searchParams;
  const sort = parseSort(sortParam);

  const articles = await getFeedArticles(session!.user.id, sort);

  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col gap-6 p-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Fil d&apos;actualité</h1>
          <p className="text-sm text-muted-foreground">
            Bonjour {session?.user?.name}.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild variant="outline" size="sm">
            <Link href="/themes">Thèmes</Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href="/profile">Profil</Link>
          </Button>
          <LogoutButton />
        </div>
      </header>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button asChild size="sm">
          <Link href="/articles/new">
            <PenSquare className="size-4" aria-hidden="true" />
            Créer un article
          </Link>
        </Button>
        {articles.length > 0 && <FeedSortControl current={sort} />}
      </div>

      {articles.length === 0 ? (
        <div className="rounded-lg border border-dashed p-8 text-center">
          <p className="text-muted-foreground">
            Votre fil est vide. Abonnez-vous à des thèmes pour voir leurs
            articles apparaître ici.
          </p>
          <Button asChild variant="link" className="mt-2">
            <Link href="/themes">Découvrir les thèmes</Link>
          </Button>
        </div>
      ) : (
        <ul className="flex flex-col gap-4">
          {articles.map((article) => (
            <li key={article.id}>
              <ArticleCard article={article} />
            </li>
          ))}
        </ul>
      )}
    </main>
  );
};

export default FeedPage;
