import { vi, describe, it, expect } from "vitest";

vi.mock("@/lib/prisma", () => ({
  prisma: { topic: { findMany: vi.fn() } },
}));

import { prisma } from "@/lib/prisma";
import { getTopics } from "./data";

describe("getTopics", () => {
  it("récupère les thèmes triés par nom", async () => {
    // Arrange
    vi.mocked(prisma.topic.findMany).mockResolvedValue([]);
    // Act
    await getTopics();
    // Assert
    expect(prisma.topic.findMany).toHaveBeenCalledWith({
      orderBy: { name: "asc" },
    });
  });
});
