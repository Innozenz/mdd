import { describe, it, expect } from "vitest";

import { formatDate } from "./format";

describe("formatDate", () => {
  it("formate une date en français (jour mois année)", () => {
    // Arrange : date locale (indépendante du fuseau horaire)
    const date = new Date(2026, 8, 8);
    // Act
    const formatted = formatDate(date);
    // Assert
    expect(formatted).toBe("8 septembre 2026");
  });
});
