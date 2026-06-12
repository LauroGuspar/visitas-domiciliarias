import { Router, type RequestHandler } from "express";
import {
  activoPayloadSchema,
  cargoMiembroGrupoPayloadSchema,
} from "./cargos-miembro-grupo.schemas.js";
import type { CargosMiembroGrupoService } from "./cargos-miembro-grupo.service.js";
export function createCargosMiembroGrupoRouter(
  service: CargosMiembroGrupoService,
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
    const p = cargoMiembroGrupoPayloadSchema.safeParse(req.body);
    if (!p.success) {
      res
        .status(400)
        .json({
          message: "Datos de cargo inválidos",
          details: p.error.flatten().fieldErrors,
        });
      return;
    }
    try {
      res.status(201).json(await service.create(p.data));
    } catch (e) {
      next(e);
    }
  });
  router.put("/:id", async (req, res, next) => {
    const p = cargoMiembroGrupoPayloadSchema.safeParse(req.body);
    if (!p.success) {
      res
        .status(400)
        .json({
          message: "Datos de cargo inválidos",
          details: p.error.flatten().fieldErrors,
        });
      return;
    }
    try {
      res.json(await service.update(req.params.id, p.data));
    } catch (e) {
      next(e);
    }
  });
  router.patch("/:id/activo", async (req, res, next) => {
    const p = activoPayloadSchema.safeParse(req.body);
    if (!p.success) {
      res
        .status(400)
        .json({
          message: "Estado de cargo inválido",
          details: p.error.flatten().fieldErrors,
        });
      return;
    }
    try {
      res.json(await service.setActivo(req.params.id, p.data.activo));
    } catch (e) {
      next(e);
    }
  });
  return router;
}
