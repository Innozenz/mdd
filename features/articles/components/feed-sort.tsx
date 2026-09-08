import Link from "next/link";

import type { FeedSort as FeedSortValue } from "@/features/articles/data";
import { cn } from "@/lib/utils";

/**
 * Contrôle de tri du fil (récent ↔ ancien).
 * Implémenté en liens vers `?sort=` : accessible et fonctionnel sans JavaScript,
 * l'état actif est marqué via `aria-current`.
 */
export const FeedSort = ({ current }: { current: FeedSortValue }) => {
  const options: { value: FeedSortValue; label: string }[] = [
    { value: "desc", label: "Plus récents" },
    { value: "asc", label: "Plus anciens" },
  ];

  return (
    <nav aria-label="Trier le fil" className="inline-flex rounded-md border p-0.5">
      {options.map((option) => {
        const active = option.value === current;
        return (
          <Link
            key={option.value}
            href={`/feed?sort=${option.value}`}
            aria-current={active ? "true" : undefined}
            className={cn(
              "rounded px-3 py-1 text-sm transition-colors",
              active
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {option.label}
          </Link>
        );
      })}
    </nav>
  );
};
