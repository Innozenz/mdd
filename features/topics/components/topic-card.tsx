import type { Topic } from "@prisma/client";

import { SubscribeButton } from "@/features/subscriptions/components/subscribe-button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

/**
 * Carte présentant un thème (nom + description) et son bouton d'abonnement.
 *
 * `isSubscribed` est déterminé côté serveur (page « Thèmes ») et pilote
 * l'état du bouton.
 */
export const TopicCard = ({
  topic,
  isSubscribed,
}: {
  topic: Topic;
  isSubscribed: boolean;
}) => {
  return (
    <Card className="flex h-full flex-col">
      <CardHeader className="flex-1">
        <CardTitle>{topic.name}</CardTitle>
        <CardDescription>{topic.description}</CardDescription>
      </CardHeader>
      <CardFooter>
        <SubscribeButton topicId={topic.id} isSubscribed={isSubscribed} />
      </CardFooter>
    </Card>
  );
};
