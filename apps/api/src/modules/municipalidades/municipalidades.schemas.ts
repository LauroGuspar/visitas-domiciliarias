import { z } from "zod";

export const municipalidadPayloadSchema = z.object({
  ubigeo: z.string().trim().length(6),
  departamento: z.string().trim().min(1).max(100),
  provincia: z.string().trim().min(1).max(100),
  distrito: z.string().trim().min(1).max(100),
  codigo: z.string().trim().min(1).max(3),
  nombre: z.string().trim().min(1).max(150),
  tipo: z.enum(["PROVINCIAL", "DISTRITAL"]),
  prioridad: z.coerce.number().int().min(0).max(32767),
});
export const activoPayloadSchema = z.object({ activo: z.boolean() });
