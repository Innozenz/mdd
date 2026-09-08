import { vi, describe, it, expect, beforeEach } from "vitest";
import type { Article } from "@prisma/client";

vi.mock("@/auth", () => ({ auth: vi.fn() }));
vi.mock("./data", () => ({ createArticle: vi.fn() }));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
vi.mock("next/navigation", () => ({ redirect: vi.fn() }));

import type { Session } from "next-auth";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { createArticle } from "./data";
import { createArticleAction } from "./actions";

const authMock = vi.mocked(auth as unknown as () => Promise<Session | null>);
const withUser = (id: string): Session => ({ user: { id }, expires: "" });

const fakeArticle = (id: string): Article => ({
  id,
  title: "",
  content: "",
  createdAt: new Date(),
  updatedAt: new Date(),
  authorId: "",
  topicId: "",
});

const formData = (fields: Record<string, string>): FormData => {
  const fd = new FormData();
  for (const [k, v] of Object.entries(fields)) fd.set(k, v);
  return fd;
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe("createArticleAction", () => {
  it("refuse si l'utilisateur n'est pas connecté", async () => {
    authMock.mockResolvedValue(null);
    const state = await createArticleAction(
      null,
      formData({ topicId: "t1", title: "Titre valide", content: "Contenu." }),
    );
    expect(state?.message).toMatch(/connecté/i);
    expect(createArticle).not.toHaveBeenCalled();
  });

  it("retourne des erreurs de champ si les données sont invalides", async () => {
    authMock.mockResolvedValue(withUser("u1"));
    const state = await createArticleAction(
      null,
      formData({ topicId: "", title: "ab", content: "" }),
    );
    expect(state?.errors).toBeDefined();
    expect(createArticle).not.toHaveBeenCalled();
  });

  it("crée l'article avec l'auteur de la session puis redirige", async () => {
    // Arrange
    authMock.mockResolvedValue(withUser("u1"));
    vi.mocked(createArticle).mockResolvedValue(fakeArticle("a1"));
    // Act
    await createArticleAction(
      null,
      formData({ topicId: "t1", title: "Titre valide", content: "Contenu ok." }),
    );
    // Assert
    expect(createArticle).toHaveBeenCalledWith(
      expect.objectContaining({ authorId: "u1", topicId: "t1" }),
    );
    expect(redirect).toHaveBeenCalledWith("/articles/a1");
  });
});
