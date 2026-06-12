import { z } from "zod";
export const entidadPayloadSchema = z.object({
  tipoEntidad: z.string().trim().min(1).max(100),
  codigo: z.string().trim().min(1).max(100),
  nombre: z.string().trim().min(1).max(150),
});
export const activoPayloadSchema = z.object({ activo: z.boolean() });
