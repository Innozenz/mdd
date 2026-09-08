"use client";

import { useTransition } from "react";

import { subscribeAction } from "@/features/subscriptions/actions";
import { Button } from "@/components/ui/button";

/**
 * Bouton d'abonnement à un thème.
 *
 * Comportement conforme aux spécifications : une fois abonné, le bouton
 * devient inactif et son libellé passe de « S'abonner » à « Déjà abonné ».
 * L'état `isSubscribed` est calculé côté serveur ; après l'action, la page
 * est revalidée et le bouton reflète le nouvel état.
 */
export const SubscribeButton = ({
  topicId,
  isSubscribed,
}: {
  topicId: string;
  isSubscribed: boolean;
}) => {
  const [isPending, startTransition] = useTransition();

  if (isSubscribed) {
    return (
      <Button variant="secondary" disabled aria-label="Déjà abonné">
        Déjà abonné
      </Button>
    );
  }

  return (
    <Button
      onClick={() => startTransition(() => subscribeAction(topicId))}
      disabled={isPending}
    >
      {isPending ? "Abonnement…" : "S'abonner"}
    </Button>
  );
};
