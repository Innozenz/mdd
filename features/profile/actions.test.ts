import { vi, describe, it, expect, beforeEach } from "vitest";
import type { User } from "@prisma/client";

vi.mock("@/auth", () => ({ auth: vi.fn() }));
vi.mock("./data", () => ({ updateUserProfile: vi.fn() }));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
vi.mock("bcryptjs", () => ({
  default: { hash: vi.fn().mockResolvedValue("hashed-new") },
}));

import { Prisma } from "@prisma/client";
import type { Session } from "next-auth";
import { auth } from "@/auth";
import bcrypt from "bcryptjs";
import { updateUserProfile } from "./data";
import { updateProfileAction } from "./actions";

const authMock = vi.mocked(auth as unknown as () => Promise<Session | null>);
const withUser = (id: string): Session => ({ user: { id }, expires: "" });

const fakeUser = (): User => ({
  id: "u1",
  email: "user@mdd.dev",
  username: "user",
  password: "hash",
  createdAt: new Date(),
  updatedAt: new Date(),
});

const formData = (fields: Record<string, string>): FormData => {
  const fd = new FormData();
  for (const [k, v] of Object.entries(fields)) fd.set(k, v);
  return fd;
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe("updateProfileAction", () => {
  it("refuse si l'utilisateur n'est pas connecté", async () => {
    authMock.mockResolvedValue(null);
    const state = await updateProfileAction(
      null,
      formData({ email: "user@mdd.dev", username: "user", password: "" }),
    );
    expect(state?.message).toMatch(/connecté/i);
    expect(updateUserProfile).not.toHaveBeenCalled();
  });

  it("retourne des erreurs si les champs sont invalides", async () => {
    authMock.mockResolvedValue(withUser("u1"));
    const state = await updateProfileAction(
      null,
      formData({ email: "invalide", username: "user", password: "" }),
    );
    expect(state?.errors).toBeDefined();
    expect(updateUserProfile).not.toHaveBeenCalled();
  });

  it("met à jour sans changer le mot de passe s'il est vide", async () => {
    // Arrange
    authMock.mockResolvedValue(withUser("u1"));
    vi.mocked(updateUserProfile).mockResolvedValue(fakeUser());
    // Act
    const state = await updateProfileAction(
      null,
      formData({ email: "user@mdd.dev", username: "user", password: "" }),
    );
    // Assert
    expect(bcrypt.hash).not.toHaveBeenCalled();
    expect(updateUserProfile).toHaveBeenCalledWith(
      "u1",
      expect.not.objectContaining({ password: expect.anything() }),
    );
    expect(state?.success).toBe(true);
  });

  it("hache et met à jour le mot de passe s'il est fourni", async () => {
    authMock.mockResolvedValue(withUser("u1"));
    vi.mocked(updateUserProfile).mockResolvedValue(fakeUser());
    await updateProfileAction(
      null,
      formData({ email: "user@mdd.dev", username: "user", password: "NewPass1!" }),
    );
    expect(bcrypt.hash).toHaveBeenCalledOnce();
    expect(updateUserProfile).toHaveBeenCalledWith(
      "u1",
      expect.objectContaining({ password: "hashed-new" }),
    );
  });

  it("signale un nom d'utilisateur déjà pris (P2002)", async () => {
    authMock.mockResolvedValue(withUser("u1"));
    vi.mocked(updateUserProfile).mockRejectedValueOnce(
      new Prisma.PrismaClientKnownRequestError("dup", {
        code: "P2002",
        clientVersion: "6",
        meta: { target: ["username"] },
      }),
    );
    const state = await updateProfileAction(
      null,
      formData({ email: "user@mdd.dev", username: "taken", password: "" }),
    );
    expect(state?.errors?.username).toBeDefined();
  });
});
