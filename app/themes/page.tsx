import type { Metadata } from "next";
import Link from "next/link";

import { auth } from "@/auth";
import { getTopics } from "@/features/topics/data";
import { getSubscribedTopicIds } from "@/features/subscriptions/data";
import { TopicCard } from "@/features/topics/components/topic-card";

export const metadata: Metadata = {
  title: "Thèmes — MDD",
};

/**
 * Page « Thèmes » (route protégée) : liste l'ensemble des thèmes disponibles,
 * que l'utilisateur y soit abonné ou non.
 *
 * Server Component : les données sont lues côté serveur via la couche d'accès
 * Prisma (`getTopics`), puis rendues directement — c'est la tranche verticale
 * qui valide l'architecture de bout en bout.
 */
const ThemesPage = async () => {
  const session = await auth();
  const [topics, subscribedIds] = await Promise.all([
    getTopics(),
    getSubscribedTopicIds(session!.user.id),
  ]);

  return (
    <main className="mx-auto flex min-h-screen max-w-4xl flex-col gap-8 p-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Thèmes</h1>
          <p className="text-muted-foreground">
            Explorez les thèmes de programmation du réseau.
          </p>
        </div>
        <Link href="/feed" className="text-sm text-primary hover:underline">
          ← Retour au fil
        </Link>
      </header>

      {topics.length === 0 ? (
        <p className="text-muted-foreground">Aucun thème pour le moment.</p>
      ) : (
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {topics.map((topic) => (
            <li key={topic.id}>
              <TopicCard topic={topic} isSubscribed={subscribedIds.has(topic.id)} />
            </li>
          ))}
        </ul>
      )}
    </main>
  );
};

export default ThemesPage;
