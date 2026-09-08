import type { Metadata } from "next";

import { auth } from "@/auth";
import { LogoutButton } from "@/features/auth/components/logout-button";

export const metadata: Metadata = {
  title: "Fil d'actualité — MDD",
};

/**
 * Placeholder du fil d'actualité (route protégée par le middleware).
 *
 * Sert pour l'instant à valider la boucle d'authentification de bout en bout.
 * Le vrai fil (articles + tri chronologique) sera implémenté à l'étape 4.
 */
const FeedPage = async () => {
  const session = await auth();

  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col gap-6 p-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Fil d&apos;actualité</h1>
        <LogoutButton />
      </header>

      <p className="text-muted-foreground">
        Connecté en tant que{" "}
        <strong className="text-foreground">{session?.user?.name}</strong>.
        Le fil d&apos;actualité sera disponible prochainement.
      </p>
    </main>
  );
};

export default FeedPage;
