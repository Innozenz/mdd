import { vi, describe, it, expect, beforeEach } from "vitest";

vi.mock("next-auth", () => {
  class AuthError extends Error {}
  return { AuthError };
});
vi.mock("@/auth", () => ({ signIn: vi.fn(), signOut: vi.fn() }));
vi.mock("./data", () => ({ createUser: vi.fn(), getUserByIdentifier: vi.fn() }));
vi.mock("bcryptjs", () => ({
  default: { hash: vi.fn().mockResolvedValue("hashed"), compare: vi.fn() },
}));

import { Prisma } from "@prisma/client";
import { AuthError } from "next-auth";
import { signIn } from "@/auth";
import { createUser } from "./data";
import { registerAction, loginAction } from "./actions";

/** Construit un FormData à partir d'un objet simple. */
const formData = (fields: Record<string, string>): FormData => {
  const fd = new FormData();
  for (const [key, value] of Object.entries(fields)) fd.set(key, value);
  return fd;
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe("registerAction", () => {
  it("retourne des erreurs de champ si les données sont invalides", async () => {
    // Arrange
    const fd = formData({ email: "x", username: "a", password: "weak" });
    // Act
    const state = await registerAction(null, fd);
    // Assert
    expect(state?.errors).toBeDefined();
    expect(createUser).not.toHaveBeenCalled();
  });

  it("crée l'utilisateur puis le connecte si les données sont valides", async () => {
    // Arrange
    const fd = formData({
      email: "new@mdd.dev",
      username: "newuser",
      password: "Valid123!",
    });
    // Act
    await registerAction(null, fd);
    // Assert
    expect(createUser).toHaveBeenCalledOnce();
    expect(signIn).toHaveBeenCalledWith(
      "credentials",
      expect.objectContaining({ identifier: "new@mdd.dev" }),
    );
  });

  it("retourne un message générique en cas d'erreur inattendue de la base", async () => {
    // Arrange
    vi.mocked(createUser).mockRejectedValueOnce(new Error("db down"));
    const fd = formData({
      email: "err@mdd.dev",
      username: "erruser",
      password: "Valid123!",
    });
    // Act
    const state = await registerAction(null, fd);
    // Assert
    expect(state?.message).toMatch(/erreur/i);
    expect(signIn).not.toHaveBeenCalled();
  });

  it("signale un e-mail déjà utilisé (violation d'unicité P2002)", async () => {
    // Arrange
    vi.mocked(createUser).mockRejectedValueOnce(
      new Prisma.PrismaClientKnownRequestError("duplicate", {
        code: "P2002",
        clientVersion: "6",
        meta: { target: ["email"] },
      }),
    );
    const fd = formData({
      email: "dup@mdd.dev",
      username: "dupuser",
      password: "Valid123!",
    });
    // Act
    const state = await registerAction(null, fd);
    // Assert
    expect(state?.errors?.email).toBeDefined();
    expect(signIn).not.toHaveBeenCalled();
  });
});

describe("loginAction", () => {
  it("retourne des erreurs si les identifiants sont vides", async () => {
    const state = await loginAction(null, formData({ identifier: "", password: "" }));
    expect(state?.errors).toBeDefined();
    expect(signIn).not.toHaveBeenCalled();
  });

  it("retourne un message générique si les identifiants sont incorrects", async () => {
    // Arrange
    vi.mocked(signIn).mockRejectedValueOnce(new AuthError());
    // Act
    const state = await loginAction(
      null,
      formData({ identifier: "john", password: "whatever" }),
    );
    // Assert : pas de fuite d'information, identifiant conservé
    expect(state?.message).toMatch(/incorrect/i);
    expect(state?.values?.identifier).toBe("john");
  });

  it("laisse remonter la redirection en cas de succès (erreur non-Auth)", async () => {
    // Arrange : signIn lève une redirection (n'est pas une AuthError)
    const redirectError = new Error("NEXT_REDIRECT");
    vi.mocked(signIn).mockRejectedValueOnce(redirectError);
    // Act / Assert : l'action ne l'avale pas, elle la relance
    await expect(
      loginAction(null, formData({ identifier: "john", password: "ok" })),
    ).rejects.toThrow("NEXT_REDIRECT");
  });
});
