import type { AccessTokenPayload, AuthRole } from "../../shared/jwt.js";

export type LoginInput = {
  username: string;
  password: string;
};

export type AuthUserRecord = {
  id: string;
  username: string;
  passwordHash: string;
  rol: AuthRole;
  activo: boolean;
  municipalidadId: string | null;
  actorSocialId: string | null;
};

export type AuthenticatedUser = Omit<AuthUserRecord, "passwordHash" | "activo">;

export type LoginResult = {
  accessToken: string;
  user: AuthenticatedUser;
};

export type AuthUserRepository = {
  findByUsername(username: string): Promise<AuthUserRecord | null>;
};

export type PasswordVerifier = {
  verify(password: string, passwordHash: string): Promise<boolean>;
};

export type AccessTokenSigner = {
  signAccessToken(payload: AccessTokenPayload): string;
};

export type AuthServiceDependencies = {
  users: AuthUserRepository;
  password: PasswordVerifier;
  tokens: AccessTokenSigner;
};
