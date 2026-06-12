import { FormEvent, useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { storeSession, getStoredSession } from "../auth-storage";
import type { LoginResponse } from "../auth-types";
import { apiRequest, ApiError } from "../../../shared/api";
import { APP_NAME } from "../../../shared/config";

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (getStoredSession()) {
    return <Navigate to="/" replace />;
  }

  const redirectTo =
    typeof location.state === "object" &&
    location.state !== null &&
    "from" in location.state &&
    typeof location.state.from === "string"
      ? location.state.from
      : "/";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const session = await apiRequest<LoginResponse>("/auth/login", {
        method: "POST",
        auth: false,
        body: { username, password },
      });
      storeSession(session);
      navigate(redirectTo, { replace: true });
    } catch (requestError) {
      setError(
        requestError instanceof ApiError
          ? requestError.message
          : "No se pudo iniciar sesión. Intente nuevamente.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="auth-layout">
      <section className="auth-hero" aria-label="Resumen del sistema">
        <p className="eyebrow">V1 administrativa</p>
        <h1>{APP_NAME}</h1>
      </section>

      <section className="auth-card" aria-labelledby="login-title">
        <div className="section-heading">
          <p className="eyebrow">Acceso seguro</p>
          <h2 id="login-title">Iniciar sesión</h2>
          <p>Ingresa con tu usuario y contraseña institucional.</p>
        </div>

        <form className="form-stack" onSubmit={handleSubmit}>
          <label className="field">
            <span>Usuario</span>
            <input
              autoComplete="username"
              autoFocus
              name="username"
              onChange={(event) => setUsername(event.target.value)}
              placeholder="admin"
              required
              type="text"
              value={username}
            />
          </label>

          <label className="field">
            <span>Contraseña</span>
            <input
              autoComplete="current-password"
              name="password"
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••••"
              required
              type="password"
              value={password}
            />
          </label>

          {error && <p className="alert alert-error">{error}</p>}

          <button
            className="button button-primary"
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting ? "Validando..." : "Entrar al sistema"}
          </button>
        </form>

        <Link className="text-link" to="/forgot-password">
          ¿Olvidaste tu contraseña?
        </Link>
      </section>
    </main>
  );
}
