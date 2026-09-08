import NextAuth from "next-auth";

import { authConfig } from "./auth.config";

/**
 * Protection des routes via Auth.js (convention « proxy » de Next.js 16,
 * ex-« middleware »). S'appuie sur la configuration edge-safe (sans Prisma
 * ni bcrypt) et le callback `authorized` qui décide de l'accès.
 */
const { auth } = NextAuth(authConfig);

export default auth;

export const config = {
  // Exécute le proxy sur toutes les routes sauf les fichiers statiques,
  // les images optimisées et les endpoints d'auth.
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
