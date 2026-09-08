import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

import { authConfig } from "./auth.config";
import { loginSchema } from "./lib/definitions/auth";
import { getUserByIdentifier } from "./features/auth/data";

/**
 * Instance Auth.js complète (runtime Node).
 *
 * Ajoute le provider Credentials à la configuration edge-safe : identifiant
 * (e-mail ou nom d'utilisateur) + mot de passe comparé au hash bcrypt.
 * Exporte les helpers `auth` (lecture de session), `signIn`, `signOut`
 * et les `handlers` de route.
 */
export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        identifier: {},
        password: {},
      },
      async authorize(credentials) {
        // Revalide les entrées côté serveur avant toute requête.
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const { identifier, password } = parsed.data;

        const user = await getUserByIdentifier(identifier);
        if (!user) return null;

        const passwordMatches = await bcrypt.compare(password, user.password);
        if (!passwordMatches) return null;

        // Ne jamais renvoyer le hash : on expose l'identité minimale.
        return {
          id: user.id,
          email: user.email,
          name: user.username,
        };
      },
    }),
  ],
});
