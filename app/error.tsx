"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";

/**
 * Frontière d'erreur globale de l'application.
 *
 * Affiche un message générique sans exposer le détail de l'exception
 * (ni message technique ni pile d'appels), afin de ne pas divulguer
 * d'information sensible à l'utilisateur.
 */
const GlobalError = ({ reset }: { error: Error; reset: () => void }) => {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-6 text-center">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">Une erreur est survenue</h1>
        <p className="max-w-md text-muted-foreground">
          Quelque chose s&apos;est mal passé. Vous pouvez réessayer ou revenir
          au fil d&apos;actualité.
        </p>
      </div>
      <div className="flex gap-3">
        <Button onClick={reset}>Réessayer</Button>
        <Button asChild variant="outline">
          <Link href="/feed">Retour au fil</Link>
        </Button>
      </div>
    </main>
  );
};

export default GlobalError;
