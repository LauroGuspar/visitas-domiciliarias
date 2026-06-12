import { Router, type RequestHandler } from "express";
import {
  activoPayloadSchema,
  sectorPayloadSchema,
} from "./sectores.schemas.js";
import type { SectoresService } from "./sectores.service.js";

export function createSectoresRouter(
  service: SectoresService,
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
    const parsed = sectorPayloadSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        message: "Datos de sector inválidos",
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
    const parsed = sectorPayloadSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        message: "Datos de sector inválidos",
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
      res.status(400).json({
        message: "Estado de sector inválido",
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

  router.patch("/:id/archivar", async (req, res, next) => {
    try {
      res.json(await service.archive(req.params.id));
    } catch (error) {
      next(error);
    }
  });

  return router;
}
