import { vi, describe, it, expect, beforeEach } from "vitest";

vi.mock("@/lib/prisma", () => ({
  prisma: { comment: { findMany: vi.fn(), create: vi.fn() } },
}));

import { prisma } from "@/lib/prisma";
import { getCommentsByArticle, createComment } from "./data";

beforeEach(() => {
  vi.clearAllMocks();
});

describe("getCommentsByArticle", () => {
  it("récupère les commentaires d'un article, du plus ancien au plus récent", async () => {
    vi.mocked(prisma.comment.findMany).mockResolvedValue([]);
    await getCommentsByArticle("a1");
    expect(prisma.comment.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { articleId: "a1" },
        orderBy: { createdAt: "asc" },
      }),
    );
  });
});

describe("createComment", () => {
  it("crée le commentaire avec les données fournies", async () => {
    const data = { authorId: "u1", articleId: "a1", content: "Bien" };
    await createComment(data);
    expect(prisma.comment.create).toHaveBeenCalledWith({ data });
  });
});
