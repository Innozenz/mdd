import type { NextAuthConfig } from "next-auth";

/**
 * Configuration Auth.js « edge-safe » : ne contient aucune dépendance Node
 * (ni Prisma, ni bcrypt), afin de pouvoir être importée par le middleware
 * qui s'exécute sur le runtime Edge. Le provider Credentials est ajouté
 * séparément dans `auth.ts`.
 */

/** Préfixes de routes accessibles uniquement une fois connecté. */
const PROTECTED_PREFIXES = ["/feed", "/articles", "/themes", "/profile"];

/** Routes réservées aux visiteurs non connectés (login / inscription). */
const AUTH_PREFIXES = ["/login", "/register"];

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
    // 30 jours : la connexion persiste entre les sessions du navigateur
    // (cookie persistant), conformément aux spécifications.
    maxAge: 30 * 24 * 60 * 60,
  },
  // Fait confiance à l'hôte courant (utile en local et en preview).
  trustHost: true,
  callbacks: {
    /**
     * Contrôle d'accès appelé par le middleware sur chaque requête.
     * Protège les routes authentifiées et évite qu'un utilisateur connecté
     * revoie les pages de connexion / inscription.
     */
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const { pathname } = nextUrl;

      const isProtected = PROTECTED_PREFIXES.some(
        (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
      );
      const isAuthPage = AUTH_PREFIXES.some((prefix) => pathname === prefix);

      if (isProtected) return isLoggedIn;

      if (isAuthPage && isLoggedIn) {
        return Response.redirect(new URL("/feed", nextUrl));
      }

      return true;
    },
    /**
     * Expose l'id utilisateur dans la session. `token.sub` est renseigné
     * automatiquement par Auth.js avec l'`id` retourné par `authorize`.
     */
    session({ session, token }) {
      if (token.sub) session.user.id = token.sub;
      return session;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
