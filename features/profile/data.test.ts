import { vi, describe, it, expect, beforeEach } from "vitest";

vi.mock("@/lib/prisma", () => ({
  prisma: { user: { findUnique: vi.fn(), update: vi.fn() } },
}));

import { prisma } from "@/lib/prisma";
import { getUserProfile, updateUserProfile } from "./data";

beforeEach(() => {
  vi.clearAllMocks();
});

describe("getUserProfile", () => {
  it("sélectionne id, e-mail et nom d'utilisateur (jamais le mot de passe)", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue(null);
    await getUserProfile("u1");
    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { id: "u1" },
      select: { id: true, email: true, username: true },
    });
  });
});

describe("updateUserProfile", () => {
  it("met à jour l'utilisateur ciblé par son id", async () => {
    const data = { email: "new@mdd.dev", username: "newname" };
    await updateUserProfile("u1", data);
    expect(prisma.user.update).toHaveBeenCalledWith({
      where: { id: "u1" },
      data,
    });
  });
});
