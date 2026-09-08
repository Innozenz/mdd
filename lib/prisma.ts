import { PrismaClient } from "@prisma/client";

/**
 * Instance unique de PrismaClient.
 *
 * En développement, Next.js recharge les modules à chaud, ce qui recréerait
 * un client (et une nouvelle pool de connexions) à chaque changement. On mémorise
 * donc l'instance sur l'objet global pour la réutiliser entre les rechargements.
 */
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
