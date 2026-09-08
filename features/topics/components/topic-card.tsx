import type { Topic } from "@prisma/client";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

/**
 * Carte présentant un thème (nom + description).
 *
 * Le bouton d'abonnement sera ajouté à l'étape 4 (gestion des abonnements) ;
 * à ce stade, la carte est en lecture seule — elle valide l'affichage d'une
 * donnée issue de la base à travers toute la chaîne.
 */
export const TopicCard = ({ topic }: { topic: Topic }) => {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>{topic.name}</CardTitle>
        <CardDescription>{topic.description}</CardDescription>
      </CardHeader>
    </Card>
  );
};
