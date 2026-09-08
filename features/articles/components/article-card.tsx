import Link from "next/link";
import { MessageSquare } from "lucide-react";

import type { FeedArticle } from "@/features/articles/data";
import { formatDate } from "@/lib/format";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

/**
 * Élément du fil d'actualité : titre, thème, auteur, date, extrait et
 * nombre de commentaires. Toute la carte renvoie vers l'article complet.
 */
export const ArticleCard = ({ article }: { article: FeedArticle }) => {
  return (
    <Card className="transition-colors hover:border-primary/50">
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <span className="rounded-full bg-accent px-2.5 py-0.5 text-xs font-medium text-accent-foreground">
            {article.topic.name}
          </span>
          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
            <MessageSquare className="size-3.5" aria-hidden="true" />
            {article._count.comments}
          </span>
        </div>

        <CardTitle className="mt-2">
          <Link
            href={`/articles/${article.id}`}
            className="hover:underline focus-visible:underline"
          >
            {article.title}
          </Link>
        </CardTitle>

        <CardDescription className="line-clamp-2">
          {article.content}
        </CardDescription>

        <p className="mt-1 text-xs text-muted-foreground">
          Par {article.author.username} · {formatDate(article.createdAt)}
        </p>
      </CardHeader>
    </Card>
  );
};
