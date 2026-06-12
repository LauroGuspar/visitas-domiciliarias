export type AuthRole = "ADMIN_GENERAL" | "ADMIN_MUNICIPAL" | "ACTOR_SOCIAL";

export type AuthUser = {
  id: string;
  username: string;
  rol: AuthRole;
  municipalidadId: string | null;
  actorSocialId: string | null;
};

export type AuthSession = {
  accessToken: string;
  user: AuthUser;
};

export type LoginResponse = AuthSession;
