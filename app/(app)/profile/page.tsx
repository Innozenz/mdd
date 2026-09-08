import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { auth } from "@/auth";
import { getUserProfile } from "@/features/profile/data";
import { getSubscribedTopics } from "@/features/subscriptions/data";
import { ProfileForm } from "@/features/profile/components/profile-form";
import { UnsubscribeButton } from "@/features/subscriptions/components/unsubscribe-button";

export const metadata: Metadata = {
  title: "Mon profil — MDD",
};

/**
 * Page de profil : consultation et modification des informations (e-mail,
 * nom d'utilisateur, mot de passe) et gestion des abonnements (désabonnement).
 * Mise en page conforme aux maquettes (profil centré + abonnements en cartes).
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
    <div className="mx-auto flex max-w-3xl flex-col gap-10 px-4 py-8 sm:px-6">
      <section aria-labelledby="infos-title" className="flex flex-col gap-5">
        <h1 id="infos-title" className="text-center text-2xl font-bold">
          Profil utilisateur
        </h1>
        <div className="mx-auto w-full max-w-md">
          <ProfileForm profile={profile} />
        </div>
      </section>

      <section aria-labelledby="subs-title" className="flex flex-col gap-4">
        <h2 id="subs-title" className="text-center text-lg font-semibold">
          Abonnements
        </h2>

        {subscribedTopics.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground">
            Vous n&apos;êtes abonné à aucun thème.{" "}
            <Link href="/themes" className="text-primary hover:underline">
              Découvrir les thèmes
            </Link>
          </p>
        ) : (
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {subscribedTopics.map((topic) => (
              <li
                key={topic.id}
                className="flex flex-col gap-3 rounded-lg border p-4"
              >
                <div className="flex-1">
                  <p className="font-medium">{topic.name}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {topic.description}
                  </p>
                </div>
                <UnsubscribeButton topicId={topic.id} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

export default ProfilePage;
