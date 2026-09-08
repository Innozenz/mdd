"use client";

import { useTransition } from "react";

import { unsubscribeAction } from "@/features/subscriptions/actions";
import { Button } from "@/components/ui/button";

/**
 * Bouton de désabonnement d'un thème, utilisé sur la page de profil.
 * Appelle la Server Action ; la page est ensuite revalidée.
 */
export const UnsubscribeButton = ({ topicId }: { topicId: string }) => {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => startTransition(() => unsubscribeAction(topicId))}
      disabled={isPending}
    >
      {isPending ? "…" : "Se désabonner"}
    </Button>
  );
};
