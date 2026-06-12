import { Router, type RequestHandler } from "express";
import {
  activoPayloadSchema,
  municipalidadPayloadSchema,
} from "./municipalidades.schemas.js";
import type { MunicipalidadesService } from "./municipalidades.service.js";

export function createMunicipalidadesRouter(
  service: MunicipalidadesService,
  auth: RequestHandler,
) {
  const router = Router();
  router.use(auth);
  router.get("/", async (_req, res, next) => {
    try {
      res.json(await service.list());
    } catch (error) {
      next(error);
    }
  });
  router.post("/", async (req, res, next) => {
    const parsed = municipalidadPayloadSchema.safeParse(req.body);
    if (!parsed.success) {
      res
        .status(400)
        .json({
          message: "Datos de municipalidad inválidos",
          details: parsed.error.flatten().fieldErrors,
        });
      return;
    }
    try {
      res.status(201).json(await service.create(parsed.data));
    } catch (error) {
      next(error);
    }
  });
  router.put("/:id", async (req, res, next) => {
    const parsed = municipalidadPayloadSchema.safeParse(req.body);
    if (!parsed.success) {
      res
        .status(400)
        .json({
          message: "Datos de municipalidad inválidos",
          details: parsed.error.flatten().fieldErrors,
        });
      return;
    }
    try {
      res.json(await service.update(req.params.id, parsed.data));
    } catch (error) {
      next(error);
    }
  });
  router.patch("/:id/activo", async (req, res, next) => {
    const parsed = activoPayloadSchema.safeParse(req.body);
    if (!parsed.success) {
      res
        .status(400)
        .json({
          message: "Estado de municipalidad inválido",
          details: parsed.error.flatten().fieldErrors,
        });
      return;
    }
    try {
      res.json(await service.setActivo(req.params.id, parsed.data.activo));
    } catch (error) {
      next(error);
    }
  });
  return router;
}
