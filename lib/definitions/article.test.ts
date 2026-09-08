import { describe, it, expect } from "vitest";

import { createArticleSchema } from "./article";

describe("createArticleSchema", () => {
  const valid = {
    topicId: "topic-1",
    title: "Un titre correct",
    content: "Un contenu suffisant.",
  };

  it("valide un article complet", () => {
    // Arrange / Act
    const result = createArticleSchema.safeParse(valid);
    // Assert
    expect(result.success).toBe(true);
  });

  it("refuse un thème manquant", () => {
    const result = createArticleSchema.safeParse({ ...valid, topicId: "" });
    expect(result.success).toBe(false);
  });

  it("refuse un titre trop court", () => {
    const result = createArticleSchema.safeParse({ ...valid, title: "ab" });
    expect(result.success).toBe(false);
  });

  it("refuse un contenu vide", () => {
    const result = createArticleSchema.safeParse({ ...valid, content: "   " });
    expect(result.success).toBe(false);
  });

  it("nettoie les espaces autour du titre", () => {
    const result = createArticleSchema.safeParse({
      ...valid,
      title: "  Mon titre  ",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.title).toBe("Mon titre");
    }
  });
});
