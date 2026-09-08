import { describe, it, expect } from "vitest";

import { updateProfileSchema } from "./profile";

describe("updateProfileSchema", () => {
  const base = { email: "user@mdd.dev", username: "user" };

  it("valide sans mot de passe (champ vide = inchangé)", () => {
    const result = updateProfileSchema.safeParse({ ...base, password: "" });
    expect(result.success).toBe(true);
  });

  it("valide avec un nouveau mot de passe conforme", () => {
    const result = updateProfileSchema.safeParse({
      ...base,
      password: "NewPass1!",
    });
    expect(result.success).toBe(true);
  });

  it("refuse un nouveau mot de passe non conforme", () => {
    const result = updateProfileSchema.safeParse({
      ...base,
      password: "weak",
    });
    expect(result.success).toBe(false);
  });

  it("refuse un e-mail invalide", () => {
    const result = updateProfileSchema.safeParse({
      ...base,
      email: "invalide",
      password: "",
    });
    expect(result.success).toBe(false);
  });
});
