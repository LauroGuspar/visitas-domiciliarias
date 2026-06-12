import { Link, useNavigate } from "react-router-dom";
import { clearStoredSession, getStoredSession } from "../../auth/auth-storage";
import type { AuthRole } from "../../auth/auth-types";
import { APP_NAME } from "../../../shared/config";

type NavItem = {
  label: string;
  description: string;
  path: string;
  roles: AuthRole[];
};

const navItems: NavItem[] = [
  {
    label: "Municipalidades",
    description: "Crear, editar y activar municipalidades.",
    path: "/municipalidades",
    roles: ["ADMIN_GENERAL"],
  },
  {
    label: "Entidades",
    description: "Mantenimiento global de entidades.",
    path: "/entidades",
    roles: ["ADMIN_GENERAL"],
  },
  {
    label: "Tipos de Actor Social",
    description: "Tarifas, códigos y orden de tipos de actor.",
    path: "/tipos-actor-social",
    roles: ["ADMIN_GENERAL"],
  },
  {
    label: "Cargos de Miembro",
    description: "Catálogo de cargos administrativos del grupo.",
    path: "/cargos-miembro-grupo",
    roles: ["ADMIN_GENERAL"],
  },
  {
    label: "Grupos de Trabajo",
    description: "Grupo, establecimientos y miembros administrativos.",
    path: "/grupos-trabajo",
    roles: ["ADMIN_MUNICIPAL"],
  },
  {
    label: "Sectores",
    description: "Sectores urbanos y rurales excluyentes.",
    path: "/sectores",
    roles: ["ADMIN_MUNICIPAL"],
  },
  {
    label: "Actores Sociales",
    description: "Registro esencial con usuario y estado funcional.",
    path: "/actores-sociales",
    roles: ["ADMIN_MUNICIPAL"],
  },
];

export function DashboardHomePage() {
  const navigate = useNavigate();
  const session = getStoredSession();
  const visibleItems = navItems.filter((item) =>
    session ? item.roles.includes(session.user.rol) : false,
  );

  function handleLogout() {
    clearStoredSession();
    navigate("/login", { replace: true });
  }

  return (
    <main className="dashboard-shell">
      <nav className="topbar" aria-label="Navegación principal">
        <div>
          <p className="eyebrow">Panel V1</p>
          <strong>{APP_NAME}</strong>
        </div>
        <div className="topbar-actions">
          <span className="user-pill">
            {session?.user.username} · {session?.user.rol}
          </span>
          <button
            className="button button-ghost"
            onClick={handleLogout}
            type="button"
          >
            Cerrar sesión
          </button>
        </div>
      </nav>

      <section className="dashboard-hero">
        <div>
          <p className="eyebrow">Arquitectura modular</p>
          <h1>Base frontend lista para crecer por módulos</h1>
          <p>
            Esta primera pantalla protege el acceso, restaura sesión y prepara
            la navegación por rol para los módulos administrativos de la V1.
          </p>
        </div>
      </section>

      <section className="module-grid" aria-label="Módulos disponibles por rol">
        {visibleItems.map((item) => (
          <Link className="module-tile" key={item.path} to={item.path}>
            <span>Próximo módulo</span>
            <h2>{item.label}</h2>
            <p>{item.description}</p>
          </Link>
        ))}
      </section>
    </main>
  );
}
