import type { CargoMiembroRecord } from "./cargos-types";

export function getCargoFormTitle(record: CargoMiembroRecord | null): string {
  return record ? "Editar cargo" : "Nuevo cargo";
}
