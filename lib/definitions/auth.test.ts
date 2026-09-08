import { describe, it, expect } from "vitest";

import {
  passwordSchema,
  usernameSchema,
  emailSchema,
  registerSchema,
  loginSchema,
} from "./auth";

describe("passwordSchema (règle métier MDD)", () => {
  it("accepte un mot de passe valide", () => {
    // Arrange
    const value = "Valid123!";
    // Act
    const result = passwordSchema.safeParse(value);
    // Assert
    expect(result.success).toBe(true);
  });

  it("refuse un mot de passe de moins de 8 caractères", () => {
    const result = passwordSchema.safeParse("Ab1!");
    expect(result.success).toBe(false);
  });

  it("refuse un mot de passe sans minuscule", () => {
    const result = passwordSchema.safeParse("PASSWORD123!");
    expect(result.success).toBe(false);
  });

  it("refuse un mot de passe sans majuscule", () => {
    const result = passwordSchema.safeParse("password123!");
    expect(result.success).toBe(false);
  });

  it("refuse un mot de passe sans chiffre", () => {
    const result = passwordSchema.safeParse("Password!");
    expect(result.success).toBe(false);
  });

  it("refuse un mot de passe sans caractère spécial", () => {
    const result = passwordSchema.safeParse("Password123");
    expect(result.success).toBe(false);
  });

  it("cumule plusieurs erreurs pour un mot de passe faible", () => {
    // Arrange
    const value = "weak";
    // Act
    const result = passwordSchema.safeParse(value);
    // Assert : longueur + majuscule + chiffre + spécial
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.length).toBeGreaterThanOrEqual(4);
    }
  });
});

describe("usernameSchema", () => {
  it("accepte un nom d'utilisateur alphanumérique", () => {
    expect(usernameSchema.safeParse("john_doe-3").success).toBe(true);
  });

  it("refuse un nom trop court", () => {
    expect(usernameSchema.safeParse("ab").success).toBe(false);
  });

  it("refuse les caractères non autorisés", () => {
    expect(usernameSchema.safeParse("john doe!").success).toBe(false);
  });
});

describe("emailSchema", () => {
  it("normalise l'e-mail en minuscules et sans espaces", () => {
    // Arrange
    const value = "  John@MDD.DEV  ";
    // Act
    const result = emailSchema.safeParse(value);
    // Assert
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toBe("john@mdd.dev");
    }
  });

  it("refuse un e-mail invalide", () => {
    expect(emailSchema.safeParse("pas-un-email").success).toBe(false);
  });
});

describe("registerSchema", () => {
  it("valide un ensemble email + username + password correct", () => {
    const result = registerSchema.safeParse({
      email: "new@mdd.dev",
      username: "newuser",
      password: "Valid123!",
    });
    expect(result.success).toBe(true);
  });

  it("échoue si un champ est invalide", () => {
    const result = registerSchema.safeParse({
      email: "new@mdd.dev",
      username: "newuser",
      password: "weak",
    });
    expect(result.success).toBe(false);
  });
});

describe("loginSchema", () => {
  it("accepte un identifiant et un mot de passe non vides", () => {
    const result = loginSchema.safeParse({
      identifier: "john",
      password: "whatever",
    });
    expect(result.success).toBe(true);
  });

  it("refuse un identifiant vide", () => {
    const result = loginSchema.safeParse({ identifier: "", password: "x" });
    expect(result.success).toBe(false);
  });
});
