"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { auth } from "@/auth";
import { subscribe, unsubscribe } from "./data";

/** Le thème ciblé est toujours identifié côté serveur, validé a minima. */
const topicIdSchema = z.string().min(1);

/**
 * Récupère l'utilisateur connecté. L'`userId` provient exclusivement de la
 * session (jamais d'une entrée client) — garantie d'autorisation.
 */
async function requireUserId(): Promise<string> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Non authentifié.");
  }
  return session.user.id;
}

/** Abonne l'utilisateur connecté au thème donné, puis rafraîchit les vues. */
export async function subscribeAction(topicId: string): Promise<void> {
  const userId = await requireUserId();
  const parsed = topicIdSchema.parse(topicId);

  await subscribe(userId, parsed);

  revalidatePath("/themes");
  revalidatePath("/profile");
}

/** Désabonne l'utilisateur connecté du thème donné, puis rafraîchit les vues. */
export async function unsubscribeAction(topicId: string): Promise<void> {
  const userId = await requireUserId();
  const parsed = topicIdSchema.parse(topicId);

  await unsubscribe(userId, parsed);

  revalidatePath("/themes");
  revalidatePath("/profile");
}
