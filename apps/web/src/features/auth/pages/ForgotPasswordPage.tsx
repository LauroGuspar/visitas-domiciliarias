import { FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import { apiRequest, ApiError } from "../../../shared/api";

type MessageResponse = { message: string };

export function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await apiRequest<MessageResponse>(
        "/auth/forgot-password",
        {
          method: "POST",
          auth: false,
          body: { email },
        },
      );
      setMessage(response.message);
    } catch (requestError) {
      setError(
        requestError instanceof ApiError
          ? requestError.message
          : "No se pudo solicitar la recuperación.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="auth-layout auth-layout-centered">
      <section className="auth-card" aria-labelledby="forgot-password-title">
        <div className="section-heading">
          <p className="eyebrow">Recuperación</p>
          <h1 id="forgot-password-title">Restablecer contraseña</h1>
          <p>Ingresa tu correo para recibir el enlace de recuperación.</p>
        </div>

        <form className="form-stack" onSubmit={handleSubmit}>
          <label className="field">
            <span>Correo electrónico</span>
            <input
              autoComplete="email"
              autoFocus
              name="email"
              onChange={(event) => setEmail(event.target.value)}
              placeholder="usuario@municipalidad.gob.pe"
              required
              type="email"
              value={email}
            />
          </label>

          {message && <p className="alert alert-success">{message}</p>}
          {error && <p className="alert alert-error">{error}</p>}

          <button
            className="button button-primary"
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting ? "Enviando..." : "Enviar enlace"}
          </button>
        </form>

        <Link className="text-link" to="/login">
          Volver al login
        </Link>
      </section>
    </main>
  );
}
