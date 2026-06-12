import { Router, type RequestHandler } from "express";
import {
  activoPayloadSchema,
  entidadPayloadSchema,
} from "./entidades.schemas.js";
import type { EntidadesService } from "./entidades.service.js";
export function createEntidadesRouter(
  service: EntidadesService,
  auth: RequestHandler,
) {
  const router = Router();
  router.use(auth);
  router.get("/", async (_req, res, next) => {
    try {
      res.json(await service.list());
    } catch (e) {
      next(e);
    }
  });
  router.post("/", async (req, res, next) => {
    const parsed = entidadPayloadSchema.safeParse(req.body);
    if (!parsed.success) {
      res
        .status(400)
        .json({
          message: "Datos de entidad inválidos",
          details: parsed.error.flatten().fieldErrors,
        });
      return;
    }
    try {
      res.status(201).json(await service.create(parsed.data));
    } catch (e) {
      next(e);
    }
  });
  router.put("/:id", async (req, res, next) => {
    const parsed = entidadPayloadSchema.safeParse(req.body);
    if (!parsed.success) {
      res
        .status(400)
        .json({
          message: "Datos de entidad inválidos",
          details: parsed.error.flatten().fieldErrors,
        });
      return;
    }
    try {
      res.json(await service.update(req.params.id, parsed.data));
    } catch (e) {
      next(e);
    }
  });
  router.patch("/:id/activo", async (req, res, next) => {
    const parsed = activoPayloadSchema.safeParse(req.body);
    if (!parsed.success) {
      res
        .status(400)
        .json({
          message: "Estado de entidad inválido",
          details: parsed.error.flatten().fieldErrors,
        });
      return;
    }
    try {
      res.json(await service.setActivo(req.params.id, parsed.data.activo));
    } catch (e) {
      next(e);
    }
  });
  router.patch("/:id/archivar", async (req, res, next) => {
    try {
      res.json(await service.archive(req.params.id));
    } catch (e) {
      next(e);
    }
  });
  return router;
}
