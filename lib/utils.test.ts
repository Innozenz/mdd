import { describe, it, expect } from "vitest";

import { cn } from "./utils";

describe("cn", () => {
  it("concatène les classes", () => {
    expect(cn("a", "b")).toBe("a b");
  });

  it("ignore les valeurs conditionnelles falsy", () => {
    expect(cn("a", false && "b", undefined, "c")).toBe("a c");
  });

  it("fusionne les classes Tailwind conflictuelles (dernière gagne)", () => {
    // Arrange / Act
    const result = cn("px-2", "px-4");
    // Assert
    expect(result).toBe("px-4");
  });
});
