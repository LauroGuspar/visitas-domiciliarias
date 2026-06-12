import { FormEvent, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { apiRequest, ApiError } from "../../../shared/api";
import { getPasswordRules, isStrongPassword } from "../password-strength";

type MessageResponse = { message: string };

export function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const rules = useMemo(() => getPasswordRules(password), [password]);
  const canSubmit =
    token.length > 0 && isStrongPassword(password) && !isSubmitting;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit) {
      return;
    }

    setMessage(null);
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await apiRequest<MessageResponse>(
        "/auth/reset-password",
        {
          method: "POST",
          auth: false,
          body: { token, password },
        },
      );
      setMessage(response.message);
      setPassword("");
    } catch (requestError) {
      setError(
        requestError instanceof ApiError
          ? requestError.message
          : "No se pudo restablecer la contraseña.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="auth-layout auth-layout-centered">
      <section className="auth-card" aria-labelledby="reset-password-title">
        <div className="section-heading">
          <p className="eyebrow">Nueva clave</p>
          <h1 id="reset-password-title">Crear nueva contraseña</h1>
          <p>Usa una contraseña fuerte para proteger tu cuenta.</p>
        </div>

        {!token && (
          <p className="alert alert-error">
            El enlace no contiene un token válido. Solicita un nuevo enlace de
            recuperación.
          </p>
        )}

        <form className="form-stack" onSubmit={handleSubmit}>
          <label className="field">
            <span>Nueva contraseña</span>
            <input
              autoComplete="new-password"
              autoFocus
              name="password"
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Nueva contraseña"
              required
              type="password"
              value={password}
            />
          </label>

          <ul className="password-rules" aria-label="Reglas de contraseña">
            {rules.map((rule) => (
              <li className={rule.valid ? "rule-valid" : ""} key={rule.id}>
                <span aria-hidden="true">{rule.valid ? "✓" : "•"}</span>
                {rule.label}
              </li>
            ))}
          </ul>

          {message && <p className="alert alert-success">{message}</p>}
          {error && <p className="alert alert-error">{error}</p>}

          <button
            className="button button-primary"
            disabled={!canSubmit}
            type="submit"
          >
            {isSubmitting ? "Guardando..." : "Restablecer contraseña"}
          </button>
        </form>

        <Link className="text-link" to="/login">
          Volver al login
        </Link>
      </section>
    </main>
  );
}
