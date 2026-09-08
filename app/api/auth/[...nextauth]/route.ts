import { handlers } from "@/auth";

/**
 * Point d'entrée HTTP d'Auth.js (callbacks OAuth, CSRF, session…).
 * Requis par NextAuth même avec le provider Credentials.
 */
export const { GET, POST } = handlers;
