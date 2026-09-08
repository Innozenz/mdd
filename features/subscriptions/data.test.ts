import { vi, describe, it, expect, beforeEach } from "vitest";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    subscription: { findMany: vi.fn(), upsert: vi.fn(), deleteMany: vi.fn() },
    topic: { findMany: vi.fn() },
  },
}));

import { prisma } from "@/lib/prisma";
import {
  getSubscribedTopicIds,
  subscribe,
  unsubscribe,
} from "./data";

beforeEach(() => {
  vi.clearAllMocks();
});

describe("getSubscribedTopicIds", () => {
  it("retourne un Set des identifiants de thèmes abonnés", async () => {
    // Arrange
    vi.mocked(prisma.subscription.findMany).mockResolvedValue([
      { topicId: "t1" },
      { topicId: "t2" },
    ] as never);
    // Act
    const ids = await getSubscribedTopicIds("u1");
    // Assert
    expect(ids).toBeInstanceOf(Set);
    expect(ids.has("t1")).toBe(true);
    expect(ids.has("t2")).toBe(true);
    expect(ids.size).toBe(2);
  });
});

describe("subscribe", () => {
  it("upsert sur la contrainte d'unicité userId_topicId (idempotent)", async () => {
    await subscribe("u1", "t1");
    expect(prisma.subscription.upsert).toHaveBeenCalledWith({
      where: { userId_topicId: { userId: "u1", topicId: "t1" } },
      create: { userId: "u1", topicId: "t1" },
      update: {},
    });
  });
});

describe("unsubscribe", () => {
  it("supprime l'abonnement correspondant", async () => {
    await unsubscribe("u1", "t1");
    expect(prisma.subscription.deleteMany).toHaveBeenCalledWith({
      where: { userId: "u1", topicId: "t1" },
    });
  });
});
