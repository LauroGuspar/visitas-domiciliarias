import type { CargoMiembroFormState, CargoMiembroRecord } from "./cargos-types";

export const emptyCargoForm: CargoMiembroFormState = {
  nombre: "",
  descripcion: "",
  orden: "",
};

export function toCargoForm(record: CargoMiembroRecord): CargoMiembroFormState {
  return {
    nombre: record.nombre,
    descripcion: record.descripcion || "",
    orden: String(record.orden),
  };
}

export function buildCargoPayload(form: CargoMiembroFormState) {
  return {
    nombre: form.nombre.trim(),
    descripcion: form.descripcion.trim() || null,
    orden: parseInt(form.orden, 10) || 0,
  };
}

export function filterCargos(
  records: CargoMiembroRecord[],
  query: string,
  statusFilter?: "active" | "inactive" | "",
): CargoMiembroRecord[] {
  let result = records;

  if (statusFilter === "active") {
    result = result.filter((r) => r.activo);
  } else if (statusFilter === "inactive") {
    result = result.filter((r) => !r.activo);
  }

  const cleanQuery = query.trim().toLowerCase();
  if (!cleanQuery) {
    return result;
  }

  return result.filter(
    (r) =>
      r.nombre.toLowerCase().includes(cleanQuery) ||
      (r.descripcion && r.descripcion.toLowerCase().includes(cleanQuery)),
  );
}
