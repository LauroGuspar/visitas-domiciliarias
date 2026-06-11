export const rolesUsuario = [
  "ADMIN_GENERAL",
  "ADMIN_MUNICIPAL",
  "ACTOR_SOCIAL"
] as const;

export type RolUsuario = (typeof rolesUsuario)[number];

export const tiposSector = ["URBANO", "RURAL"] as const;

export type TipoSector = (typeof tiposSector)[number];

export const estadosGrupoTrabajo = [
  "BORRADOR",
  "REGISTRADO",
  "OBSERVADO",
  "VALIDADO"
] as const;

export type EstadoGrupoTrabajo = (typeof estadosGrupoTrabajo)[number];

export const estadosActorSocial = [
  "BORRADOR",
  "REGISTRADO",
  "VALIDO",
  "CAPACITADO",
  "APROBADO"
] as const;

export type EstadoActorSocial = (typeof estadosActorSocial)[number];
