import { vi, describe, it, expect, beforeEach } from "vitest";

vi.mock("@/lib/prisma", () => ({
  prisma: { user: { findFirst: vi.fn(), create: vi.fn() } },
}));

import { prisma } from "@/lib/prisma";
import { getUserByIdentifier, createUser } from "./data";

beforeEach(() => {
  vi.clearAllMocks();
});

describe("getUserByIdentifier", () => {
  it("recherche par e-mail (minuscule) OU nom d'utilisateur", async () => {
    // Arrange
    vi.mocked(prisma.user.findFirst).mockResolvedValue(null);
    // Act
    await getUserByIdentifier("  John  ");
    // Assert
    expect(prisma.user.findFirst).toHaveBeenCalledWith({
      where: { OR: [{ email: "john" }, { username: "John" }] },
    });
  });
});

describe("createUser", () => {
  it("crée l'utilisateur avec les données fournies (mot de passe déjà haché)", async () => {
    const data = { email: "a@mdd.dev", username: "a", password: "hash" };
    await createUser(data);
    expect(prisma.user.create).toHaveBeenCalledWith({ data });
  });
});
