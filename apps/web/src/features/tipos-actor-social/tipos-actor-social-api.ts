import { apiRequest } from "../../shared/api";
import type { TipoActorSocialRecord } from "./tipos-actor-social-types";

const ENDPOINT = "/tipos-actor-social";

export function listTiposActorSocial(): Promise<TipoActorSocialRecord[]> {
  return apiRequest<TipoActorSocialRecord[]>(ENDPOINT);
}

export function createTipoActorSocial(payload: Omit<TipoActorSocialRecord, "id" | "activo" | "archivado">): Promise<TipoActorSocialRecord> {
  return apiRequest<TipoActorSocialRecord>(ENDPOINT, {
    method: "POST",
    body: payload,
  });
}

export function updateTipoActorSocial(
  id: string,
  payload: Omit<TipoActorSocialRecord, "id" | "activo" | "archivado">,
): Promise<TipoActorSocialRecord> {
  return apiRequest<TipoActorSocialRecord>(`${ENDPOINT}/${id}`, {
    method: "PUT",
    body: payload,
  });
}

export function setTipoActorSocialActivo(
  id: string,
  activo: boolean,
): Promise<TipoActorSocialRecord> {
  return apiRequest<TipoActorSocialRecord>(`${ENDPOINT}/${id}/activo`, {
    method: "PATCH",
    body: { activo },
  });
}

export function archiveTipoActorSocial(id: string): Promise<TipoActorSocialRecord> {
  return apiRequest<TipoActorSocialRecord>(`${ENDPOINT}/${id}/archivar`, {
    method: "PATCH",
  });
}
