import { vi, describe, it, expect, beforeEach } from "vitest";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    article: { findMany: vi.fn(), findUnique: vi.fn(), create: vi.fn() },
  },
}));

import { prisma } from "@/lib/prisma";
import { getFeedArticles, getArticleById, createArticle } from "./data";

beforeEach(() => {
  vi.clearAllMocks();
});

describe("getFeedArticles", () => {
  it("filtre par thèmes abonnés et trie du plus récent au plus ancien par défaut", async () => {
    // Arrange
    vi.mocked(prisma.article.findMany).mockResolvedValue([]);
    // Act
    await getFeedArticles("u1");
    // Assert
    expect(prisma.article.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { topic: { subscriptions: { some: { userId: "u1" } } } },
        orderBy: { createdAt: "desc" },
      }),
    );
  });

  it("respecte le sens de tri ascendant", async () => {
    vi.mocked(prisma.article.findMany).mockResolvedValue([]);
    await getFeedArticles("u1", "asc");
    expect(prisma.article.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ orderBy: { createdAt: "asc" } }),
    );
  });
});

describe("getArticleById", () => {
  it("recherche l'article par identifiant avec auteur et thème", async () => {
    vi.mocked(prisma.article.findUnique).mockResolvedValue(null);
    await getArticleById("a1");
    expect(prisma.article.findUnique).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: "a1" } }),
    );
  });
});

describe("createArticle", () => {
  it("crée l'article avec les données fournies", async () => {
    const data = { authorId: "u1", topicId: "t1", title: "T", content: "C" };
    await createArticle(data);
    expect(prisma.article.create).toHaveBeenCalledWith({ data });
  });
});
