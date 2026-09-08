import { vi, describe, it, expect, beforeEach } from "vitest";
import type { Comment } from "@prisma/client";

vi.mock("@/auth", () => ({ auth: vi.fn() }));
vi.mock("./data", () => ({ createComment: vi.fn() }));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));

import type { Session } from "next-auth";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { createComment } from "./data";
import { addCommentAction } from "./actions";

const authMock = vi.mocked(auth as unknown as () => Promise<Session | null>);
const withUser = (id: string): Session => ({ user: { id }, expires: "" });

const fakeComment = (id: string): Comment => ({
  id,
  content: "",
  createdAt: new Date(),
  authorId: "",
  articleId: "",
});

const formData = (content: string): FormData => {
  const fd = new FormData();
  fd.set("content", content);
  return fd;
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe("addCommentAction", () => {
  it("refuse si l'utilisateur n'est pas connecté", async () => {
    authMock.mockResolvedValue(null);
    const state = await addCommentAction("art-1", null, formData("Salut"));
    expect(state?.message).toMatch(/connecté/i);
    expect(createComment).not.toHaveBeenCalled();
  });

  it("retourne une erreur si le commentaire est vide", async () => {
    authMock.mockResolvedValue(withUser("u1"));
    const state = await addCommentAction("art-1", null, formData("   "));
    expect(state?.errors?.content).toBeDefined();
    expect(createComment).not.toHaveBeenCalled();
  });

  it("crée le commentaire avec auteur et article, puis revalide", async () => {
    // Arrange
    authMock.mockResolvedValue(withUser("u1"));
    vi.mocked(createComment).mockResolvedValue(fakeComment("c1"));
    // Act
    const state = await addCommentAction("art-1", null, formData("Bien vu !"));
    // Assert
    expect(createComment).toHaveBeenCalledWith({
      authorId: "u1",
      articleId: "art-1",
      content: "Bien vu !",
    });
    expect(revalidatePath).toHaveBeenCalledWith("/articles/art-1");
    expect(state).toBeNull();
  });
});
