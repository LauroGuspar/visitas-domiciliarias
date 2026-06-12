import { describe, expect, it } from "vitest";
import { signAccessToken, verifyAccessToken } from "./jwt.js";

describe("jwt helpers", () => {
  it("signs and verifies an access token payload", () => {
    const token = signAccessToken(
      {
        userId: "11111111-1111-4111-8111-111111111111",
        rol: "ADMIN_GENERAL",
        municipalidadId: null,
        actorSocialId: null,
      },
      { secret: "test-secret", expiresIn: "15m" },
    );

    const payload = verifyAccessToken(token, { secret: "test-secret" });

    expect(payload).toMatchObject({
      userId: "11111111-1111-4111-8111-111111111111",
      rol: "ADMIN_GENERAL",
      municipalidadId: null,
      actorSocialId: null,
    });
  });

  it("rejects a token signed with another secret", () => {
    const token = signAccessToken(
      {
        userId: "11111111-1111-4111-8111-111111111111",
        rol: "ADMIN_GENERAL",
        municipalidadId: null,
        actorSocialId: null,
      },
      { secret: "test-secret", expiresIn: "15m" },
    );

    expect(() => verifyAccessToken(token, { secret: "wrong-secret" })).toThrow(
      "Token inválido",
    );
  });
});
