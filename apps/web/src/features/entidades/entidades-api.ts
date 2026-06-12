import { apiRequest } from "../../shared/api";
import type { EntidadFormState, EntidadRecord } from "./entidades-types";

const ENTIDADES_ENDPOINT = "/entidades";

export function listEntidades(): Promise<EntidadRecord[]> {
  return apiRequest<EntidadRecord[]>(ENTIDADES_ENDPOINT);
}

export function createEntidad(payload: EntidadFormState): Promise<EntidadRecord> {
  return apiRequest<EntidadRecord>(ENTIDADES_ENDPOINT, {
    method: "POST",
    body: payload,
  });
}

export function updateEntidad(
  id: string,
  payload: EntidadFormState,
): Promise<EntidadRecord> {
  return apiRequest<EntidadRecord>(`${ENTIDADES_ENDPOINT}/${id}`, {
    method: "PUT",
    body: payload,
  });
}

export function setEntidadActivo(
  id: string,
  activo: boolean,
): Promise<EntidadRecord> {
  return apiRequest<EntidadRecord>(`${ENTIDADES_ENDPOINT}/${id}/activo`, {
    method: "PATCH",
    body: { activo },
  });
}

export function archiveEntidad(id: string): Promise<EntidadRecord> {
  return apiRequest<EntidadRecord>(`${ENTIDADES_ENDPOINT}/${id}/archivar`, {
    method: "PATCH",
  });
}
