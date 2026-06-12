import { useEffect, useMemo, useState } from "react";
import { ApiError } from "../../../shared/api";
import {
  archiveTipoActorSocial,
  listTiposActorSocial,
  setTipoActorSocialActivo,
} from "../tipos-actor-social-api";
import type {
  TipoActorSocialFormState,
  TipoActorSocialRecord,
} from "../tipos-actor-social-types";
import {
  emptyTipoActorSocialForm,
  filterTiposActorSocial,
  toTipoActorSocialForm,
} from "../tipos-actor-social-utils";

export function TiposActorSocialPage() {
  const [records, setRecords] = useState<TipoActorSocialRecord[]>([]);
  const [query, setQuery] = useState("");
  const [form, setForm] = useState<TipoActorSocialFormState>(emptyTipoActorSocialForm);
  const [viewingRecord, setViewingRecord] = useState<TipoActorSocialRecord | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Filter states
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState<"active" | "inactive" | "">("");

  const filteredRecords = useMemo(
    () => filterTiposActorSocial(records, query, statusFilter),
    [records, query, statusFilter],
  );

  useEffect(() => {
    void loadRecords();
  }, []);

  async function loadRecords() {
    setIsLoading(true);
    setError(null);
    try {
      setRecords(await listTiposActorSocial());
    } catch (loadError) {
      setError(getErrorMessage(loadError));
    } finally {
      setIsLoading(false);
    }
  }

  function openDetails(record: TipoActorSocialRecord) {
    setViewingRecord(record);
    setForm(toTipoActorSocialForm(record));
    setError(null);
    setMessage(null);
    setIsFormOpen(true);
  }

  function closeForm() {
    setIsFormOpen(false);
    setViewingRecord(null);
    setForm(emptyTipoActorSocialForm);
  }

  async function handleToggleActivo(record: TipoActorSocialRecord) {
    const nextActivo = !record.activo;
    const action = nextActivo ? "activar" : "inactivar";
    const confirmed = window.confirm(
      `¿Deseas ${action} el tipo de actor social ${record.tipoActor}?`,
    );

    if (!confirmed) {
      return;
    }

    setError(null);
    setMessage(null);

    try {
      const updated = await setTipoActorSocialActivo(record.id, nextActivo);
      setRecords((current) => upsertRecord(current, updated));
      setMessage(
        nextActivo
          ? "Tipo de actor social activado correctamente."
          : "Tipo de actor social inactivado correctamente.",
      );
    } catch (toggleError) {
      setError(getErrorMessage(toggleError));
    }
  }

  async function handleArchivar(record: TipoActorSocialRecord) {
    const confirmed = window.confirm(
      `¿Deseas archivar el tipo de actor social ${record.tipoActor}? Esto lo retirará del uso normal.`,
    );

    if (!confirmed) {
      return;
    }

    setError(null);
    setMessage(null);

    try {
      await archiveTipoActorSocial(record.id);
      setRecords((current) => current.filter((item) => item.id !== record.id));
      setMessage("Tipo de actor social archivado correctamente.");
    } catch (archiveError) {
      setError(getErrorMessage(archiveError));
    }
  }

  return (
    <>
      <section className="admin-page-heading">
        <div>
          <h1>Tipos de Actor Social</h1>
          <p>
            Consulta los tipos de actor social, sus tarifas de pago y su orden operativo.
          </p>
        </div>
        <div className="breadcrumb-card" aria-label="Ruta actual">
          <span aria-hidden="true">⌂</span>
          <span>Configuración</span>
          <strong>Tipo Actor Social</strong>
        </div>
      </section>

      <section className="admin-content-card" aria-label="Tipos de Actor Social">
        <div className="admin-actions-row">
          <label className="admin-search-field">
            <span aria-hidden="true">⌕</span>
            <input
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Buscar por tipo de actor o código..."
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
          </div>
        ) : null}

        {message ? <p className="alert alert-success">{message}</p> : null}
        {error ? <p className="alert alert-error">{error}</p> : null}

        {isFormOpen ? (
          <div
            aria-labelledby="tipo-actor-modal-title"
            aria-modal="true"
            className="admin-modal-backdrop"
            role="dialog"
          >
            <div className="admin-modal">
              <div className="admin-modal-header">
                <div>
                  <h2 id="tipo-actor-modal-title">
                    Detalles del Tipo de Actor Social
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
                  Código
                  <input disabled value={form.codigo} />
                </label>
                <label className="field">
                  Orden
                  <input disabled type="number" value={form.orden} />
                </label>
                <label className="field admin-form-wide">
                  Tipo de Actor
                  <input disabled value={form.tipoActor} />
                </label>
                <label className="field">
                  Tarifa Rural (S/.)
                  <input disabled type="number" value={form.tarifaRural} />
                </label>
                <label className="field">
                  Tarifa Urbana (S/.)
                  <input disabled type="number" value={form.tarifaUrbana} />
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
          <span>{filteredRecords.length} resultados</span>
          <span>
            {isLoading
              ? "Cargando..."
              : `1-${filteredRecords.length} de ${filteredRecords.length}`}
          </span>
        </div>

        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Código</th>
                <th>Orden</th>
                <th>Tipo de Actor</th>
                <th>Tarifa Rural</th>
                <th>Tarifa Urbana</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.map((record) => (
                <tr key={record.id}>
                  <td>{record.codigo}</td>
                  <td>{record.orden}</td>
                  <td>{record.tipoActor}</td>
                  <td>S/. {Number(record.tarifaRural).toFixed(2)}</td>
                  <td>S/. {Number(record.tarifaUrbana).toFixed(2)}</td>
                  <td>
                    <span
                      className={
                        record.activo
                          ? "status-pill is-active"
                          : "status-pill is-muted"
                      }
                    >
                      {record.activo ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td>
                    <div className="admin-row-actions">
                      <button
                        className="admin-icon-button"
                        onClick={() => openDetails(record)}
                        type="button"
                      >
                        Ver
                      </button>
                      <button
                        className="admin-icon-button"
                        onClick={() => void handleToggleActivo(record)}
                        type="button"
                      >
                        {record.activo ? "Inactivar" : "Activar"}
                      </button>
                      <button
                        className="admin-icon-button"
                        onClick={() => void handleArchivar(record)}
                        type="button"
                      >
                        Archivar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!isLoading && filteredRecords.length === 0 ? (
                <tr>
                  <td className="admin-empty-cell" colSpan={7}>
                    No se encontraron tipos de actor social.
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

function upsertRecord(
  records: TipoActorSocialRecord[],
  record: TipoActorSocialRecord,
) {
  const exists = records.some((item) => item.id === record.id);

  if (!exists) {
    return [record, ...records];
  }

  return records.map((item) =>
    item.id === record.id ? record : item,
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
