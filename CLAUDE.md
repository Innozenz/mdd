# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Contexte du projet

**MDD (Monde de Dév)** — projet **P5** de la formation OpenClassrooms (parcours 2935,
projet 6266), réalisé en **Option B** (scénario fictif entreprise « ORION »). L'utilisateur
est mentor OC et réalise ce projet avec l'aide de l'IA (posture de supervision demandée par
l'énoncé : déléguer des tâches à l'IA puis relire/valider).

MVP d'un **réseau social pour développeurs** : s'abonner à des thèmes de programmation,
publier des articles, commenter, lire un fil d'actualité chronologique. **Pas de back-office.**

> Toute la matière source (énoncé complet, specs PDF, guide mentor, maquettes) a été récupérée
> par l'outil `octool` de l'utilisateur et vit dans
> `C:\Users\max_l\WebstormProjects\octool\output\2935-6266\` (project.md + attachments/).
> À consulter en référence, mais **ne pas committer** ce contenu de cours ici (copyright OC).

## Périmètre fonctionnel (specs — à respecter strictement, ni plus ni moins)

- **Utilisateurs** : inscription (email + username + mot de passe) · connexion par email **ou**
  username + mdp · **session persistante entre sessions** · consulter/modifier son profil
  (email, username, mdp) · déconnexion.
- **Abonnements** : lister **tous** les thèmes (abonné ou non) sur une page dédiée · s'abonner
  (le bouton devient inactif, texte → « Déjà abonné ») · se désabonner depuis le profil.
- **Articles** : fil d'actualité sur l'accueil, chronologique, **tri récent↔ancien** ·
  créer un article (thème + titre + contenu) · consulter un article (thème, titre, auteur,
  date, contenu, commentaires) · ajouter un commentaire (contenu). Commentaires **non récursifs**.
- **Règles** : responsive mobile + desktop · auteur & date auto sur article/commentaire ·
  **mot de passe valide** = ≥ 8 caractères ET au moins 1 minuscule, 1 majuscule, 1 chiffre,
  1 caractère spécial.

## Contraintes techniques imposées (ORION)

- Back-end distinct du front-end, reliés par une **API sécurisée**.
- **Next.js 16 (App Router)** obligatoire — Server Components & **Server Actions**.
- **Node.js 22 LTS** imposé par l'énoncé. **Décision retenue : rester sur Node 24** (installé
  sur la machine). Justification à mettre dans la doc : Node 24 est la ligne **LTS active**
  actuelle, pleinement supportée par Next.js 16 ; on évite de gérer plusieurs runtimes. Écart
  mineur et vers une version plus récente — à mentionner en soutenance.
- **TypeScript**, **Prisma ORM** (pas de SQL brut), **PostgreSQL**.
- **Git**, un seul repository pour tout le projet, workflow **GitHub Flow**.
- **SOLID / Clean Code**.

## Stack fournie par le starter (déjà en place)

Next.js 16 · React 19 · TypeScript 5 · Tailwind CSS 4 · **shadcn/ui** (radix-ui) ·
**Prisma 6** · **Zod** · **Auth.js / NextAuth v5** prévu (`.env.example` a `AUTH_SECRET`,
`AUTH_URL`) · PostgreSQL via Docker. Le `prisma/schema.prisma` est **vide** (juste un TODO) ;
l'accueil (`app/page.tsx`) lie vers `/login` et `/register` **non encore créés**.
Un `DOCUMENTATION.md` **template à remplir** est fourni (c'est un livrable noté).

## Décisions techniques retenues (à justifier dans la doc — livrable noté)

| Sujet | Choix | Justification courte |
|---|---|---|
| Auth | Auth.js v5 (Credentials) + JWT + **bcrypt** | Recommandé par l'énoncé, session persistante, couvre les failles courantes |
| Front/back | **Server Actions** (pas d'API REST séparée) | Imposé App Router, typé bout-en-bout |
| Validation | **Zod** (schémas centralisés `lib/definitions`) | Déjà dans le starter, remplace les DTO |
| Architecture | **Feature-based** (`features/auth`, `features/articles`…) | Demandé, modulaire, SOLID |
| Tests | **Vitest** (unit) + **Playwright** (e2e) | Outils recommandés, seuil couverture ~70 % |

⚠️ **Piège** : le guide mentor mentionne « NestJS » dans un critère back-end (CE2). C'est un
**résidu de la variante Java** du projet. Pour Option B, le back = **Next.js Server Actions**,
PAS NestJS. Lire « archi modulaire NestJS » comme « archi Next.js modulaire + couche d'accès
données Prisma ».

## Critères d'évaluation (grille mentor — ce sur quoi le projet est noté)

Livrables = **repo GitHub** (archi + code front, archi + API back, code + données sécurisées,
tests, code aux conventions, README) **et** une **documentation** avec annexes (captures UI,
analyse besoins front, tâches déléguées à l'IA + vérif, définition des données, rapports de
tests/couverture, rapport de revue technique, **FAQ utilisateur**).

- Archi front & back **modulaires**, conventions respectées.
- **Toutes** les fonctionnalités des specs implémentées ; conformité aux **maquettes**.
- **Responsive** + **accessibilité** (ARIA, contrastes, navigation clavier).
- API structurée (routes/ressources claires), schémas cohérents front/back, **documentée**
  (Swagger/Postman ou équivalent), communication sécurisée (statuts HTTP, gestion d'erreurs).
- **Sécurité** : auth + autorisation, accès données protégés (validation, droits), pas de fuite
  d'info sensible dans logs/exceptions, prise en compte RGPD.
- **Tests** : unitaires front + back, **~70 % de couverture** (seuil explicite), intégration/e2e,
  pattern **Arrange-Act-Assert**, rapport de couverture.
- **Qualité** : SOLID, refactoring, pas de redondance/requêtes non optimisées, linter configuré.
- **Doc** : structure, install/exécution, endpoints/Server Actions, schémas de données ; FAQ.

Soutenance : 15 min présentation + 10 min questions + 5 min débrief (évaluateur = responsable
technique). Prévoir un argumentaire justifiant les choix techniques et l'usage supervisé de l'IA.

## Plan de réalisation (itérations verticales front→action→DB)

1. **Setup** : Docker Postgres, `.env`, **schéma Prisma complet** (User, Topic, Article,
   Comment, Subscription), migration + seed de données de test.
2. **Auth** : register / login (email ou username) / logout, session persistante, protection
   des routes, validation mot de passe (Zod).
3. **Slice de validation d'archi** : une fonctionnalité simple bout-en-bout (ex. lister les thèmes).
4. **Fonctionnalités** : abonnements → articles + fil (tri) → commentaires → profil.
5. **Intégration maquettes Figma** (responsive) + finitions sécurité.
6. **Tests + documentation** (DOCUMENTATION.md, FAQ, justification des choix, revue technique).

## Commandes

```bash
npm install
# PostgreSQL local (Docker) :
docker run --name mdd-postgres -e POSTGRES_USER=user -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=mdd_db -p 5432:5432 -d postgres:17
cp .env.example .env          # DATABASE_URL déjà réglée pour ce conteneur
npx prisma generate
npx prisma migrate dev        # créer/appliquer les migrations (préférer migrate à db push)
npm run dev                   # http://localhost:3000
npm run lint
# Tests (à mettre en place à l'étape 6) : Vitest + Playwright
```

## Maquettes

Figma (Juana) : `https://www.figma.com/file/Rflr3TVBog35BNMnn0DF09/Maquettes-MDD-(desktop-et-mobile)`.
Objectif : respecter **globalement** les écrans (pas de « pixel perfect »). Un tuto Figma est
lié dans l'énoncé (Vimeo). Claude peut ouvrir la maquette dans le Chrome de l'utilisateur
(extension) pour l'analyser visuellement.

## Conventions

- Respecter les specs **à la lettre** — ne pas ajouter de fonctionnalités hors périmètre (MVP).
- TSDoc sur le code ; commits réguliers et atomiques (GitHub Flow, branches par fonctionnalité).
- Posture de supervision : quand une tâche est déléguée « à l'IA », la tracer pour la doc
  (tableau « tâches déléguées + vérification ») — c'est un attendu noté.
