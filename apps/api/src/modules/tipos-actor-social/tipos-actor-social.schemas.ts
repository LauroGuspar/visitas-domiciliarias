import { z } from "zod";
export const tipoActorSocialPayloadSchema = z.object({
  tipoActor: z.string().trim().min(1).max(150),
  tarifaRural: z.coerce.number().min(0),
  tarifaUrbana: z.coerce.number().min(0),
  orden: z.coerce.number().int().min(0).max(32767),
  codigo: z.string().trim().min(1).max(3),
});
export const activoPayloadSchema = z.object({ activo: z.boolean() });
