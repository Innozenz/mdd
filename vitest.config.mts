import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

/**
 * Configuration Vitest — tests unitaires de la logique métier (back).
 * La couverture cible les couches testables (validation, actions, accès
 * données, utilitaires) ; l'UI est couverte par les tests e2e Playwright.
 */
export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./", import.meta.url)),
      // `server-only` est un no-op en environnement Node (tests).
      "server-only": fileURLToPath(new URL("./tests/stubs/empty.ts", import.meta.url)),
    },
  },
  test: {
    globals: true,
    environment: "node",
    include: ["lib/**/*.test.ts", "features/**/*.test.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "json-summary"],
      include: ["lib/**/*.ts", "features/**/*.ts"],
      exclude: ["**/*.test.ts", "lib/prisma.ts"],
    },
  },
});
