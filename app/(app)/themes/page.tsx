import type { Metadata } from "next";

import { auth } from "@/auth";
import { getTopics } from "@/features/topics/data";
import { getSubscribedTopicIds } from "@/features/subscriptions/data";
import { TopicCard } from "@/features/topics/components/topic-card";

export const metadata: Metadata = {
  title: "Thèmes — MDD",
};

/**
 * Page « Thèmes » : liste l'ensemble des thèmes disponibles (grille 2 colonnes
 * conforme aux maquettes), que l'utilisateur y soit abonné ou non.
 */
const ThemesPage = async () => {
  const session = await auth();
  const [topics, subscribedIds] = await Promise.all([
    getTopics(),
    getSubscribedTopicIds(session!.user.id),
  ]);

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-8 px-4 py-8 sm:px-6">
      <div>
        <h1 className="text-2xl font-bold">Thèmes</h1>
        <p className="text-muted-foreground">
          Explorez les thèmes de programmation du réseau.
        </p>
      </div>

      {topics.length === 0 ? (
        <p className="text-muted-foreground">Aucun thème pour le moment.</p>
      ) : (
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {topics.map((topic) => (
            <li key={topic.id}>
              <TopicCard topic={topic} isSubscribed={subscribedIds.has(topic.id)} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ThemesPage;
