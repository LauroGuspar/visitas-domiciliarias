import type { AuthSession } from "./auth-types";

const AUTH_SESSION_KEY = "visitas.auth.session";
export const AUTH_SESSION_EXPIRED_EVENT = "visitas:auth-session-expired";

function isAuthSession(value: unknown): value is AuthSession {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<AuthSession>;
  return (
    typeof candidate.accessToken === "string" &&
    !!candidate.accessToken &&
    !!candidate.user &&
    typeof candidate.user === "object" &&
    typeof candidate.user.id === "string" &&
    typeof candidate.user.username === "string" &&
    typeof candidate.user.rol === "string"
  );
}

export function getStoredSession(): AuthSession | null {
  const raw = window.localStorage.getItem(AUTH_SESSION_KEY);
  if (!raw) {
    return null;
  }

  try {
    const parsed: unknown = JSON.parse(raw);
    return isAuthSession(parsed) ? parsed : null;
  } catch {
    window.localStorage.removeItem(AUTH_SESSION_KEY);
    return null;
  }
}

export function storeSession(session: AuthSession) {
  window.localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(session));
}

export function clearStoredSession() {
  window.localStorage.removeItem(AUTH_SESSION_KEY);
}

export function getAccessToken() {
  return getStoredSession()?.accessToken ?? null;
}

export function notifySessionExpired() {
  window.dispatchEvent(new Event(AUTH_SESSION_EXPIRED_EVENT));
}
