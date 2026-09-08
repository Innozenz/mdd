import { describe, it, expect } from "vitest";

import { createCommentSchema } from "./comment";

describe("createCommentSchema", () => {
  it("valide un commentaire non vide", () => {
    const result = createCommentSchema.safeParse({ content: "Bien vu !" });
    expect(result.success).toBe(true);
  });

  it("refuse un commentaire vide (espaces uniquement)", () => {
    const result = createCommentSchema.safeParse({ content: "   " });
    expect(result.success).toBe(false);
  });

  it("refuse un commentaire trop long", () => {
    // Arrange
    const content = "a".repeat(2001);
    // Act
    const result = createCommentSchema.safeParse({ content });
    // Assert
    expect(result.success).toBe(false);
  });
});
