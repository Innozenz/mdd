import { vi, describe, it, expect, beforeEach } from "vitest";

vi.mock("@/auth", () => ({ auth: vi.fn() }));
vi.mock("./data", () => ({ subscribe: vi.fn(), unsubscribe: vi.fn() }));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));

import type { Session } from "next-auth";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { subscribe, unsubscribe } from "./data";
import { subscribeAction, unsubscribeAction } from "./actions";

const authMock = vi.mocked(auth as unknown as () => Promise<Session | null>);
const withUser = (id: string): Session => ({ user: { id }, expires: "" });

beforeEach(() => {
  vi.clearAllMocks();
});

describe("subscribeAction", () => {
  it("abonne avec l'userId de la session et revalide les vues", async () => {
    // Arrange
    authMock.mockResolvedValue(withUser("u1"));
    // Act
    await subscribeAction("topic-1");
    // Assert
    expect(subscribe).toHaveBeenCalledWith("u1", "topic-1");
    expect(revalidatePath).toHaveBeenCalledWith("/themes");
    expect(revalidatePath).toHaveBeenCalledWith("/profile");
  });

  it("lève une erreur si l'utilisateur n'est pas authentifié", async () => {
    // Arrange
    authMock.mockResolvedValue(null);
    // Act / Assert
    await expect(subscribeAction("topic-1")).rejects.toThrow("Non authentifié");
    expect(subscribe).not.toHaveBeenCalled();
  });
});

describe("unsubscribeAction", () => {
  it("désabonne avec l'userId de la session", async () => {
    authMock.mockResolvedValue(withUser("u2"));
    await unsubscribeAction("topic-9");
    expect(unsubscribe).toHaveBeenCalledWith("u2", "topic-9");
    expect(revalidatePath).toHaveBeenCalledWith("/themes");
  });
});
