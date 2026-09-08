# MDD — Monde de Dév

Réseau social pour développeurs (projet **P5** OpenClassrooms, **Option B** —
scénario ORION). MVP permettant de s'abonner à des thèmes de programmation, de
publier des articles, de commenter et de suivre un fil d'actualité
chronologique.

> Documentation technique complète et rapport de projet : **[DOCUMENTATION.md](./DOCUMENTATION.md)**

## Stack technique

- **Next.js 16** (App Router — Server Components & Server Actions)
- **TypeScript 5**
- **Prisma 6** + **PostgreSQL 17**
- **Auth.js v5** (Credentials + JWT, `bcryptjs`)
- **Zod** (validation centralisée)
- **Tailwind CSS 4** + **shadcn/ui**
- **Vitest** (tests unitaires) + **Playwright** (e2e)

## Prérequis

- **Node.js 24** (LTS active ; le projet fonctionne aussi sous Node 22)
- **npm**
- **Docker** (pour PostgreSQL en local)

## Installation

```bash
git clone https://github.com/Innozenz/mdd.git
cd mdd
npm install
```

### 1. Base de données (Docker)

```bash
# PostgreSQL 17 (port hôte 5433 pour éviter un conflit avec un 5432 déjà utilisé)
docker run --name mdd-postgres \
  -e POSTGRES_USER=user -e POSTGRES_PASSWORD=password -e POSTGRES_DB=mdd_db \
  -p 5433:5432 -d postgres:17
```

Arrêter / relancer : `docker stop mdd-postgres` · `docker start mdd-postgres`.

### 2. Variables d'environnement

```bash
cp .env.example .env
```

Ajuster `.env` (le port doit correspondre au conteneur ci-dessus) :

```env
DATABASE_URL="postgresql://user:password@localhost:5433/mdd_db?schema=public"
AUTH_SECRET="<générer : node -e \"console.log(require('crypto').randomBytes(32).toString('base64'))\">"
AUTH_URL="http://localhost:3000"
```

### 3. Initialiser la base

```bash
npx prisma generate
npx prisma migrate dev      # applique les migrations versionnées
npm run db:seed             # données de test (thèmes, articles, comptes démo)
```

Comptes de démonstration créés par le seed : `alice`, `bob`, `carol` —
mot de passe `Test1234!`.

### 4. Lancer l'application

```bash
npm run dev
```

→ http://localhost:3000

## Scripts

| Commande | Description |
| :---- | :---- |
| `npm run dev` | Serveur de développement |
| `npm run build` / `npm start` | Build de production / démarrage |
| `npm run lint` | Analyse ESLint |
| `npm run db:seed` | Peuple la base de données |
| `npm test` | Tests unitaires (Vitest) |
| `npm run test:cov` | Tests unitaires + rapport de couverture |
| `npm run test:e2e` | Tests end-to-end (Playwright) |

> Les tests e2e démarrent le serveur automatiquement (ou réutilisent celui déjà
> lancé) et nécessitent la base de données accessible. Première utilisation de
> Playwright : `npx playwright install chromium`.

## Structure du projet

```
app/
  (auth)/            # pages publiques : login, register
  (app)/             # routes authentifiées + en-tête partagé (layout)
    feed/  themes/  articles/[id]/  articles/new/  profile/
  api/auth/[...nextauth]/   # handler Auth.js
  layout.tsx  page.tsx  error.tsx  not-found.tsx
features/            # architecture par domaine métier
  auth/ topics/ subscriptions/ articles/ comments/ profile/
    data.ts  actions.ts  components/
lib/
  prisma.ts          # client Prisma (singleton)
  definitions/       # schémas Zod (auth, article, comment, profile)
  format.ts  utils.ts
components/           # mdd-logo, app-header, ui/ (shadcn)
auth.ts  auth.config.ts  proxy.ts    # Auth.js & protection des routes
prisma/              # schema.prisma, migrations/, seed.ts
e2e/                 # tests Playwright
```

## Sécurité

Authentification Auth.js (session JWT persistante), mots de passe hachés
(bcrypt), validation Zod côté serveur, protection des routes (`proxy.ts`),
en-têtes HTTP de sécurité, gestion d'erreurs sans fuite d'information.
Voir [DOCUMENTATION.md](./DOCUMENTATION.md) §3.3.
