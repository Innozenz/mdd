/**
 * Seed de données de test pour MDD.
 *
 * Crée un jeu cohérent : quelques utilisateurs, les thèmes de programmation,
 * des abonnements, des articles et des commentaires. Idempotent : nettoie
 * les tables avant de réinsérer, pour pouvoir relancer `prisma migrate reset`
 * ou `prisma db seed` sans doublon.
 *
 * Tous les comptes de test partagent le mot de passe « Test1234! »
 * (respecte la règle : >= 8 car., 1 min, 1 maj, 1 chiffre, 1 spécial).
 */
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const DEMO_PASSWORD = "Test1234!";
const BCRYPT_ROUNDS = 10;

async function main() {
  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, BCRYPT_ROUNDS);

  // Nettoyage (ordre respectant les contraintes de clés étrangères)
  await prisma.comment.deleteMany();
  await prisma.article.deleteMany();
  await prisma.subscription.deleteMany();
  await prisma.topic.deleteMany();
  await prisma.user.deleteMany();

  // --- Utilisateurs ---
  const [alice, bob, carol] = await Promise.all([
    prisma.user.create({
      data: { email: "alice@mdd.dev", username: "alice", password: passwordHash },
    }),
    prisma.user.create({
      data: { email: "bob@mdd.dev", username: "bob", password: passwordHash },
    }),
    prisma.user.create({
      data: { email: "carol@mdd.dev", username: "carol", password: passwordHash },
    }),
  ]);

  // --- Thèmes ---
  const topicsData = [
    { name: "JavaScript", description: "Le langage du web, côté client comme serveur." },
    { name: "TypeScript", description: "JavaScript typé pour des applications robustes." },
    { name: "React", description: "Bibliothèque UI à base de composants." },
    { name: "Next.js", description: "Framework React full-stack (App Router, RSC)." },
    { name: "Node.js", description: "Exécuter JavaScript côté serveur." },
    { name: "Python", description: "Langage polyvalent, du script à la data science." },
    { name: "DevOps", description: "Intégration continue, conteneurs et déploiement." },
    { name: "Bases de données", description: "SQL, NoSQL, modélisation et performance." },
  ];
  const topics = await Promise.all(
    topicsData.map((data) => prisma.topic.create({ data })),
  );
  const topicByName = Object.fromEntries(topics.map((t) => [t.name, t]));

  // --- Abonnements ---
  await prisma.subscription.createMany({
    data: [
      { userId: alice.id, topicId: topicByName["TypeScript"].id },
      { userId: alice.id, topicId: topicByName["Next.js"].id },
      { userId: alice.id, topicId: topicByName["React"].id },
      { userId: bob.id, topicId: topicByName["Node.js"].id },
      { userId: bob.id, topicId: topicByName["DevOps"].id },
      { userId: carol.id, topicId: topicByName["Python"].id },
    ],
  });

  // --- Articles (dates échelonnées pour tester le tri chronologique) ---
  const daysAgo = (n: number) => new Date(Date.now() - n * 24 * 60 * 60 * 1000);

  const article1 = await prisma.article.create({
    data: {
      title: "Bien démarrer avec l'App Router de Next.js 16",
      content:
        "Les Server Components changent la façon de structurer une application. " +
        "Dans cet article, on explore le rendu côté serveur, les Server Actions " +
        "et la frontière client/serveur pour construire une app typée de bout en bout.",
      authorId: alice.id,
      topicId: topicByName["Next.js"].id,
      createdAt: daysAgo(1),
      updatedAt: daysAgo(1),
    },
  });

  const article2 = await prisma.article.create({
    data: {
      title: "Pourquoi typer son code avec TypeScript",
      content:
        "Le typage statique attrape des erreurs avant l'exécution et documente " +
        "l'intention du code. On voit ici les gains concrets sur la maintenance " +
        "d'un projet à plusieurs mains.",
      authorId: bob.id,
      topicId: topicByName["TypeScript"].id,
      createdAt: daysAgo(3),
      updatedAt: daysAgo(3),
    },
  });

  const article3 = await prisma.article.create({
    data: {
      title: "Conteneuriser une base PostgreSQL avec Docker",
      content:
        "Un conteneur Postgres jetable accélère le développement local. " +
        "On met en place le service, on branche Prisma dessus et on gère les migrations.",
      authorId: carol.id,
      topicId: topicByName["DevOps"].id,
      createdAt: daysAgo(5),
      updatedAt: daysAgo(5),
    },
  });

  // --- Commentaires ---
  await prisma.comment.createMany({
    data: [
      {
        content: "Super clair, merci ! Les Server Actions m'ont fait gagner du temps.",
        authorId: bob.id,
        articleId: article1.id,
        createdAt: daysAgo(1),
      },
      {
        content: "Un exemple avec la gestion d'erreur serait bienvenu.",
        authorId: carol.id,
        articleId: article1.id,
        createdAt: daysAgo(0),
      },
      {
        content: "Le typage strict a vraiment changé ma manière de coder.",
        authorId: alice.id,
        articleId: article2.id,
        createdAt: daysAgo(2),
      },
    ],
  });

  console.log("Seed terminé :");
  console.log(`  ${topics.length} thèmes, 3 utilisateurs, 3 articles, 3 commentaires`);
  console.log(`  Comptes de test : alice / bob / carol — mot de passe : ${DEMO_PASSWORD}`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
