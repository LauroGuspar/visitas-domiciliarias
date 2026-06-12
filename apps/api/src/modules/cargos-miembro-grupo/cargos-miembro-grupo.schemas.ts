import { z } from "zod";
export const cargoMiembroGrupoPayloadSchema = z.object({
  nombre: z.string().trim().min(1).max(100),
  descripcion: z.string().trim().max(1000).nullable().default(null),
  orden: z.coerce.number().int().min(0).max(32767),
});
export const activoPayloadSchema = z.object({ activo: z.boolean() });
