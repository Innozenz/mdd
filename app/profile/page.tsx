import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { auth } from "@/auth";
import { getUserProfile } from "@/features/profile/data";
import { getSubscribedTopics } from "@/features/subscriptions/data";
import { ProfileForm } from "@/features/profile/components/profile-form";
import { UnsubscribeButton } from "@/features/subscriptions/components/unsubscribe-button";
import { LogoutButton } from "@/features/auth/components/logout-button";

export const metadata: Metadata = {
  title: "Mon profil — MDD",
};

/**
 * Page de profil (route protégée) : consultation et modification des
 * informations (e-mail, nom d'utilisateur, mot de passe) et gestion des
 * abonnements (désabonnement).
 */
const ProfilePage = async () => {
  const session = await auth();
  const userId = session!.user.id;

  const [profile, subscribedTopics] = await Promise.all([
    getUserProfile(userId),
    getSubscribedTopics(userId),
  ]);

  if (!profile) {
    notFound();
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col gap-8 p-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Link href="/feed" className="text-sm text-primary hover:underline">
            ← Retour au fil
          </Link>
          <h1 className="mt-2 text-2xl font-bold">Mon profil</h1>
        </div>
        <LogoutButton />
      </header>

      <section aria-labelledby="infos-title" className="flex flex-col gap-4">
        <h2 id="infos-title" className="text-lg font-semibold">
          Informations
        </h2>
        <ProfileForm profile={profile} />
      </section>

      <section aria-labelledby="subs-title" className="flex flex-col gap-4">
        <h2 id="subs-title" className="text-lg font-semibold">
          Mes abonnements
        </h2>

        {subscribedTopics.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Vous n&apos;êtes abonné à aucun thème.{" "}
            <Link href="/themes" className="text-primary hover:underline">
              Découvrir les thèmes
            </Link>
          </p>
        ) : (
          <ul className="flex flex-col gap-3">
            {subscribedTopics.map((topic) => (
              <li
                key={topic.id}
                className="flex items-center justify-between gap-4 rounded-lg border p-4"
              >
                <div>
                  <p className="font-medium">{topic.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {topic.description}
                  </p>
                </div>
                <UnsubscribeButton topicId={topic.id} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
};

export default ProfilePage;
