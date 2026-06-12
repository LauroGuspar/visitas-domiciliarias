import type { NextFunction, Request, Response } from "express";
import { describe, expect, it, vi } from "vitest";
import { requireAuth } from "./auth.middleware.js";
import type { AuthenticatedRequest } from "./authenticated-request.js";
import type { AccessTokenPayload } from "./jwt.js";

function createResponse() {
  const res = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
  } as unknown as Response;
  return res;
}

describe("requireAuth", () => {
  it("rejects a request without bearer token", () => {
    const req = { headers: {} } as Request;
    const res = createResponse();
    const next = vi.fn() as NextFunction;

    requireAuth({ verifyAccessToken: vi.fn() })(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "Token requerido" });
    expect(next).not.toHaveBeenCalled();
  });

  it("rejects an invalid bearer token", () => {
    const req = { headers: { authorization: "Bearer invalid" } } as Request;
    const res = createResponse();
    const next = vi.fn() as NextFunction;

    requireAuth({
      verifyAccessToken: vi.fn(() => {
        throw new Error("bad token");
      }),
    })(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "Token inválido" });
    expect(next).not.toHaveBeenCalled();
  });

  it("stores the authenticated user and calls next for a valid token", () => {
    const req = {
      headers: { authorization: "Bearer valid" },
    } as AuthenticatedRequest;
    const res = createResponse();
    const next = vi.fn() as NextFunction;

    requireAuth({
      verifyAccessToken: vi.fn(
        (): AccessTokenPayload => ({
          userId: "11111111-1111-4111-8111-111111111111",
          rol: "ADMIN_GENERAL",
          municipalidadId: null,
          actorSocialId: null,
        }),
      ),
    })(req, res, next);

    expect(req.auth).toEqual({
      userId: "11111111-1111-4111-8111-111111111111",
      rol: "ADMIN_GENERAL",
      municipalidadId: null,
      actorSocialId: null,
    });
    expect(next).toHaveBeenCalledOnce();
  });
});
