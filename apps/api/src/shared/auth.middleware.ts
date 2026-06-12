import type { RequestHandler } from "express";
import type { AccessTokenPayload } from "./jwt.js";
import { verifyAccessToken } from "./jwt.js";
import type { AuthenticatedRequest } from "./authenticated-request.js";

type AuthMiddlewareDependencies = {
  verifyAccessToken?: (token: string) => AccessTokenPayload;
};

export function requireAuth(
  dependencies: AuthMiddlewareDependencies = {},
): RequestHandler {
  const verify = dependencies.verifyAccessToken ?? verifyAccessToken;

  return (req, res, next) => {
    const token = extractBearerToken(req.headers.authorization);

    if (!token) {
      res.status(401).json({ message: "Token requerido" });
      return;
    }

    try {
      (req as AuthenticatedRequest).auth = verify(token);
      next();
    } catch {
      res.status(401).json({ message: "Token inválido" });
    }
  };
}

function extractBearerToken(authorizationHeader: unknown): string | null {
  if (typeof authorizationHeader !== "string") {
    return null;
  }

  const [scheme, token] = authorizationHeader.split(" ");

  if (scheme !== "Bearer" || !token) {
    return null;
  }

  return token;
}
