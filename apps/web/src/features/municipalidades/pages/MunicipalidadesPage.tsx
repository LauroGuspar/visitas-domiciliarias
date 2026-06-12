import { useEffect, useMemo, useState } from "react";
import { ApiError } from "../../../shared/api";
import {
  listMunicipalidades,
  setMunicipalidadActivo,
} from "../municipalidades-api";
import type {
  MunicipalidadFormState,
  MunicipalidadRecord,
} from "../municipalidades-types";
import {
  emptyMunicipalidadForm,
  filterMunicipalidades,
  formatTipoMunicipalidad,
  toMunicipalidadForm,
} from "../municipalidades-utils";

export function MunicipalidadesPage() {
  const [municipalidades, setMunicipalidades] = useState<
    MunicipalidadRecord[]
  >([]);
  const [query, setQuery] = useState("");
  const [form, setForm] = useState<MunicipalidadFormState>(
    emptyMunicipalidadForm,
  );
  const [viewingMunicipalidad, setViewingMunicipalidad] =
    useState<MunicipalidadRecord | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Filter states
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState<"active" | "inactive" | "">("");
  const [tipoFilter, setTipoFilter] = useState<"PROVINCIAL" | "DISTRITAL" | "">("");

  const filteredMunicipalidades = useMemo(
    () => filterMunicipalidades(municipalidades, query, statusFilter, tipoFilter),
    [municipalidades, query, statusFilter, tipoFilter],
  );

  useEffect(() => {
    void loadMunicipalidades();
  }, []);

  async function loadMunicipalidades() {
    setIsLoading(true);
    setError(null);

    try {
      setMunicipalidades(await listMunicipalidades());
    } catch (loadError) {
      setError(getErrorMessage(loadError));
    } finally {
      setIsLoading(false);
    }
  }

  function openDetails(municipalidad: MunicipalidadRecord) {
    setViewingMunicipalidad(municipalidad);
    setForm(toMunicipalidadForm(municipalidad));
    setError(null);
    setMessage(null);
    setIsFormOpen(true);
  }

  function closeForm() {
    setIsFormOpen(false);
    setViewingMunicipalidad(null);
    setForm(emptyMunicipalidadForm);
  }

  async function handleToggleActivo(municipalidad: MunicipalidadRecord) {
    const nextActivo = !municipalidad.activo;
    const action = nextActivo ? "activar" : "inactivar";
    const confirmed = window.confirm(
      `¿Deseas ${action} ${municipalidad.nombre}?`,
    );

    if (!confirmed) {
      return;
    }

    setError(null);
    setMessage(null);

    try {
      const updated = await setMunicipalidadActivo(
        municipalidad.id,
        nextActivo,
      );
      setMunicipalidades((current) => upsertMunicipalidad(current, updated));
      setMessage(
        nextActivo
          ? "Municipalidad activada correctamente."
          : "Municipalidad inactivada correctamente.",
      );
    } catch (toggleError) {
      setError(getErrorMessage(toggleError));
    }
  }

  return (
    <>
      <section className="admin-page-heading">
        <div>
          <h1>Municipalidades</h1>
          <p>
            Consulta las municipalidades distritales y provinciales registradas en el sistema.
          </p>
        </div>
        <div className="breadcrumb-card" aria-label="Ruta actual">
          <span aria-hidden="true">⌂</span>
          <span>Configuración</span>
          <strong>Municipalidades</strong>
        </div>
      </section>

      <section className="admin-content-card" aria-label="Municipalidades">
        <div className="admin-actions-row">
          <label className="admin-search-field">
            <span aria-hidden="true">⌕</span>
            <input
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Buscar por ubigeo, departamento, provincia, distrito o municipalidad..."
              type="search"
              value={query}
            />
          </label>

          <div className="admin-actions-group">
            <button
              className={`admin-button is-ghost${showFilters ? " is-active" : ""}`}
              onClick={() => setShowFilters(!showFilters)}
              type="button"
            >
              Filtros
            </button>
            <button className="admin-button is-ghost" type="button">
              Exportar
            </button>
          </div>
        </div>

        {showFilters ? (
          <div
            className="admin-filters-panel"
            style={{
              display: "flex",
              gap: "1rem",
              marginBottom: "1rem",
              padding: "1rem",
              background: "var(--color-bg-alt, rgba(0,0,0,0.02))",
              borderRadius: "8px",
              border: "1px solid var(--color-border, rgba(0,0,0,0.08))",
            }}
          >
            <label className="field" style={{ margin: 0, flex: 1 }}>
              Estado
              <select
                onChange={(e) => setStatusFilter(e.target.value as any)}
                style={{ width: "100%", marginTop: "0.25rem" }}
                value={statusFilter}
              >
                <option value="">Todos</option>
                <option value="active">Activo</option>
                <option value="inactive">Inactivo</option>
              </select>
            </label>
            <label className="field" style={{ margin: 0, flex: 1 }}>
              Tipo
              <select
                onChange={(e) => setTipoFilter(e.target.value as any)}
                style={{ width: "100%", marginTop: "0.25rem" }}
                value={tipoFilter}
              >
                <option value="">Todos</option>
                <option value="DISTRITAL">Distrital</option>
                <option value="PROVINCIAL">Provincial</option>
              </select>
            </label>
          </div>
        ) : null}

        {message ? <p className="alert alert-success">{message}</p> : null}
        {error ? <p className="alert alert-error">{error}</p> : null}

        {isFormOpen ? (
          <div
            aria-labelledby="municipalidad-modal-title"
            aria-modal="true"
            className="admin-modal-backdrop"
            role="dialog"
          >
            <div className="admin-modal">
              <div className="admin-modal-header">
                <div>
                  <h2 id="municipalidad-modal-title">
                    Detalles de la Municipalidad
                  </h2>
                  <p>Información de registro del catálogo nacional.</p>
                </div>
                <button
                  aria-label="Cerrar modal"
                  className="admin-modal-close"
                  onClick={closeForm}
                  type="button"
                >
                  ×
                </button>
              </div>

              <div className="admin-form-grid">
                <label className="field">
                  Ubigeo
                  <input disabled value={form.ubigeo} />
                </label>
                <label className="field">
                  Departamento
                  <input disabled value={form.departamento} />
                </label>
                <label className="field">
                  Provincia
                  <input disabled value={form.provincia} />
                </label>
                <label className="field">
                  Distrito
                  <input disabled value={form.distrito} />
                </label>
                <label className="field">
                  Código
                  <input disabled value={form.codigo} />
                </label>
                <label className="field admin-form-wide">
                  Municipalidad
                  <input disabled value={form.nombre} />
                </label>
                <label className="field">
                  Provincial/Distrital
                  <select disabled value={form.tipo}>
                    <option value="DISTRITAL">Distrital</option>
                    <option value="PROVINCIAL">Provincial</option>
                  </select>
                </label>
                <label className="field">
                  Prioridad
                  <input disabled type="number" value={form.prioridad} />
                </label>
              </div>

              <div className="admin-form-actions">
                <button
                  className="admin-button is-primary"
                  onClick={closeForm}
                  type="button"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        ) : null}

        <div className="admin-table-meta">
          <span>{filteredMunicipalidades.length} resultados</span>
          <span>
            {isLoading
              ? "Cargando..."
              : `1-${filteredMunicipalidades.length} de ${filteredMunicipalidades.length}`}
          </span>
        </div>

        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Ubigeo</th>
                <th>Departamento</th>
                <th>Provincia</th>
                <th>Distrito</th>
                <th>Código</th>
                <th>Municipalidad</th>
                <th>Provincial/Distrital</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredMunicipalidades.map((municipalidad) => (
                <tr key={municipalidad.id}>
                  <td>{municipalidad.ubigeo}</td>
                  <td>{municipalidad.departamento}</td>
                  <td>{municipalidad.provincia}</td>
                  <td>{municipalidad.distrito}</td>
                  <td>{municipalidad.codigo || "—"}</td>
                  <td>{municipalidad.nombre}</td>
                  <td>{formatTipoMunicipalidad(municipalidad.tipo)}</td>
                  <td>
                    <span
                      className={
                        municipalidad.activo
                          ? "status-pill is-active"
                          : "status-pill is-muted"
                      }
                    >
                      {municipalidad.activo ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td>
                    <div className="admin-row-actions">
                      <button
                        className="admin-icon-button"
                        onClick={() => openDetails(municipalidad)}
                        type="button"
                      >
                        Ver
                      </button>
                      <button
                        className="admin-icon-button"
                        onClick={() => void handleToggleActivo(municipalidad)}
                        type="button"
                      >
                        {municipalidad.activo ? "Inactivar" : "Activar"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!isLoading && filteredMunicipalidades.length === 0 ? (
                <tr>
                  <td className="admin-empty-cell" colSpan={9}>
                    No se encontraron municipalidades para la búsqueda actual.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}

function upsertMunicipalidad(
  municipalidades: MunicipalidadRecord[],
  municipalidad: MunicipalidadRecord,
) {
  const exists = municipalidades.some((item) => item.id === municipalidad.id);

  if (!exists) {
    return [municipalidad, ...municipalidades];
  }

  return municipalidades.map((item) =>
    item.id === municipalidad.id ? municipalidad : item,
  );
}

function getErrorMessage(error: unknown) {
  if (error instanceof ApiError) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "No se pudo completar la operación.";
}
