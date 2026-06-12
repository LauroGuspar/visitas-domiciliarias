import { apiRequest } from "../../shared/api";
import type { CargoMiembroRecord } from "./cargos-types";

const ENDPOINT = "/cargos-miembro-grupo";

export function listCargos(): Promise<CargoMiembroRecord[]> {
  return apiRequest<CargoMiembroRecord[]>(ENDPOINT);
}

export function createCargo(payload: Omit<CargoMiembroRecord, "id" | "activo">): Promise<CargoMiembroRecord> {
  return apiRequest<CargoMiembroRecord>(ENDPOINT, {
    method: "POST",
    body: payload,
  });
}

export function updateCargo(
  id: string,
  payload: Omit<CargoMiembroRecord, "id" | "activo">,
): Promise<CargoMiembroRecord> {
  return apiRequest<CargoMiembroRecord>(`${ENDPOINT}/${id}`, {
    method: "PUT",
    body: payload,
  });
}

export function setCargoActivo(id: string, activo: boolean): Promise<CargoMiembroRecord> {
  return apiRequest<CargoMiembroRecord>(`${ENDPOINT}/${id}/activo`, {
    method: "PATCH",
    body: { activo },
  });
}
