import { useEffect, useMemo, useState } from "react";
import { ApiError } from "../../../shared/api";
import {
  createCargo,
  listCargos,
  setCargoActivo,
  updateCargo,
} from "../cargos-api";
import { getCargoFormTitle } from "../cargos-form";
import type { CargoMiembroFormState, CargoMiembroRecord } from "../cargos-types";
import {
  buildCargoPayload,
  emptyCargoForm,
  filterCargos,
  toCargoForm,
} from "../cargos-utils";

export function CargosMiembroPage() {
  const [cargos, setCargos] = useState<CargoMiembroRecord[]>([]);
  const [query, setQuery] = useState("");
  const [form, setForm] = useState<CargoMiembroFormState>(emptyCargoForm);
  const [editingCargo, setEditingCargo] = useState<CargoMiembroRecord | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Filter states
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState<"active" | "inactive" | "">("");

  const filteredCargos = useMemo(
    () => filterCargos(cargos, query, statusFilter),
    [cargos, query, statusFilter],
  );

  useEffect(() => {
    void loadCargos();
  }, []);

  async function loadCargos() {
    setIsLoading(true);
    setError(null);
    try {
      setCargos(await listCargos());
    } catch (loadError) {
      setError(getErrorMessage(loadError));
    } finally {
      setIsLoading(false);
    }
  }

  function openCreateForm() {
    setEditingCargo(null);
    setForm(emptyCargoForm);
    setError(null);
    setMessage(null);
    setIsFormOpen(true);
  }

  function openEditForm(cargo: CargoMiembroRecord) {
    setEditingCargo(cargo);
    setForm(toCargoForm(cargo));
    setError(null);
    setMessage(null);
    setIsFormOpen(true);
  }

  function closeForm() {
    setIsFormOpen(false);
    setEditingCargo(null);
    setForm(emptyCargoForm);
  }

  function updateForm<K extends keyof CargoMiembroFormState>(
    field: K,
    value: CargoMiembroFormState[K],
  ) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setError(null);
    setMessage(null);

    try {
      const payload = buildCargoPayload(form);
      const saved = editingCargo
        ? await updateCargo(editingCargo.id, payload)
        : await createCargo(payload);

      setCargos((current) => upsertCargo(current, saved));
      setMessage(
        editingCargo
          ? "Cargo actualizado correctamente."
          : "Cargo creado correctamente.",
      );
      closeForm();
    } catch (saveError) {
      setError(getErrorMessage(saveError));
    } finally {
      setIsSaving(false);
    }
  }

  async function handleToggleActivo(cargo: CargoMiembroRecord) {
    const nextActivo = !cargo.activo;
    const action = nextActivo ? "activar" : "inactivar";
    const confirmed = window.confirm(
      `¿Deseas ${action} el cargo ${cargo.nombre}?`,
    );

    if (!confirmed) {
      return;
    }

    setError(null);
    setMessage(null);

    try {
      const updated = await setCargoActivo(cargo.id, nextActivo);
      setCargos((current) => upsertCargo(current, updated));
      setMessage(
        nextActivo
          ? "Cargo activado correctamente."
          : "Cargo inactivado correctamente.",
      );
    } catch (toggleError) {
      setError(getErrorMessage(toggleError));
    }
  }

  return (
    <>
      <section className="admin-page-heading">
        <div>
          <h1>Cargos de Miembro</h1>
          <p>
            Gestiona los cargos administrativos para los miembros del grupo de trabajo.
          </p>
        </div>
        <div className="breadcrumb-card" aria-label="Ruta actual">
          <span aria-hidden="true">⌂</span>
          <span>Configuración</span>
          <strong>Cargos de Miembro</strong>
        </div>
      </section>

      <section className="admin-content-card" aria-label="Cargos de Miembro">
        <div className="admin-actions-row">
          <label className="admin-search-field">
            <span aria-hidden="true">⌕</span>
            <input
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Buscar por nombre o descripción..."
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
            <button
              className="admin-button is-primary"
              onClick={openCreateForm}
              type="button"
            >
              + Nuevo cargo
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
            aria-labelledby="cargo-modal-title"
            aria-modal="true"
            className="admin-modal-backdrop"
            role="dialog"
          >
            <form className="admin-modal" onSubmit={handleSubmit}>
              <div className="admin-modal-header">
                <div>
                  <h2 id="cargo-modal-title">
                    {getCargoFormTitle(editingCargo)}
                  </h2>
                  <p>Completa los datos requeridos por el backend V1.</p>
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
                <label className="field admin-form-wide">
                  Nombre del Cargo
                  <input
                    maxLength={100}
                    onChange={(event) => updateForm("nombre", event.target.value)}
                    required
                    value={form.nombre}
                  />
                </label>
                <label className="field admin-form-wide">
                  Descripción
                  <textarea
                    maxLength={1000}
                    onChange={(event) => updateForm("descripcion", event.target.value)}
                    rows={3}
                    value={form.descripcion}
                  />
                </label>
                <label className="field">
                  Orden
                  <input
                    min={0}
                    max={32767}
                    onChange={(event) => updateForm("orden", event.target.value)}
                    required
                    type="number"
                    value={form.orden}
                  />
                </label>
              </div>

              <div className="admin-form-actions">
                <button
                  className="admin-button is-ghost"
                  onClick={closeForm}
                  type="button"
                >
                  Cancelar
                </button>
                <button
                  className="admin-button is-primary"
                  disabled={isSaving}
                  type="submit"
                >
                  {isSaving ? "Guardando..." : "Guardar cargo"}
                </button>
              </div>
            </form>
          </div>
        ) : null}

        <div className="admin-table-meta">
          <span>{filteredCargos.length} resultados</span>
          <span>
            {isLoading
              ? "Cargando..."
              : `1-${filteredCargos.length} de ${filteredCargos.length}`}
          </span>
        </div>

        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Orden</th>
                <th>Nombre del Cargo</th>
                <th>Descripción</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredCargos.map((cargo) => (
                <tr key={cargo.id}>
                  <td>{cargo.orden}</td>
                  <td>{cargo.nombre}</td>
                  <td>{cargo.descripcion || "—"}</td>
                  <td>
                    <span
                      className={
                        cargo.activo
                          ? "status-pill is-active"
                          : "status-pill is-muted"
                      }
                    >
                      {cargo.activo ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td>
                    <div className="admin-row-actions">
                      <button
                        className="admin-icon-button"
                        onClick={() => openEditForm(cargo)}
                        type="button"
                      >
                        Editar
                      </button>
                      <button
                        className="admin-icon-button"
                        onClick={() => void handleToggleActivo(cargo)}
                        type="button"
                      >
                        {cargo.activo ? "Inactivar" : "Activar"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!isLoading && filteredCargos.length === 0 ? (
                <tr>
                  <td className="admin-empty-cell" colSpan={5}>
                    No se encontraron cargos de miembro.
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

function upsertCargo(
  cargos: CargoMiembroRecord[],
  cargo: CargoMiembroRecord,
) {
  const exists = cargos.some((item) => item.id === cargo.id);

  if (!exists) {
    return [cargo, ...cargos];
  }

  return cargos.map((item) =>
    item.id === cargo.id ? cargo : item,
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
