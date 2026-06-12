import type { Request } from "express";
import type { AccessTokenPayload } from "./jwt.js";

export type AuthenticatedRequest = Request & {
  auth?: AccessTokenPayload;
};
