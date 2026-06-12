import { Router, type RequestHandler } from "express";
import {
  activoPayloadSchema,
  actorSocialCreateSchema,
  actorSocialUpdateSchema,
  deletePayloadSchema,
  estadoPayloadSchema,
} from "./actores-sociales.schemas.js";
import { ActoresSocialesService } from "./actores-sociales.service.js";
import type { AuthenticatedRequest } from "../../shared/authenticated-request.js";

function validationError(
  res: Parameters<RequestHandler>[1],
  message: string,
  error: unknown
) {
  const details =
    error && typeof error === "object" && "flatten" in error
      ? (error as { flatten: () => unknown }).flatten()
      : null;
  res.status(400).json({ message, details });
}

export function createActoresSocialesRouter(
  service: ActoresSocialesService,
  auth: RequestHandler
) {
  const router = Router();
  router.use(auth);

  router.get("/", async (req, res, next) => {
    const authReq = req as AuthenticatedRequest;
    const { rol, municipalidadId } = authReq.auth!;
    try {
      if (rol === "ADMIN_MUNICIPAL") {
        res.json(await service.list(municipalidadId));
      } else {
        const queryMun = req.query.municipalidadId as string | undefined;
        res.json(await service.list(queryMun || null));
      }
    } catch (error) {
      next(error);
    }
  });

  router.post("/", async (req, res, next) => {
    const parsed = actorSocialCreateSchema.safeParse(req.body);
    if (!parsed.success) {
      validationError(res, "Datos de actor social inválidos", parsed.error);
      return;
    }

    const authReq = req as AuthenticatedRequest;
    const { rol, municipalidadId } = authReq.auth!;

    if (rol === "ADMIN_MUNICIPAL" && parsed.data.municipalidadId !== municipalidadId) {
      res.status(403).json({
        message: "No tiene permiso para crear un actor social en otra municipalidad",
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
    const parsed = actorSocialUpdateSchema.safeParse(req.body);
    if (!parsed.success) {
      validationError(res, "Datos de actor social inválidos", parsed.error);
      return;
    }

    const authReq = req as AuthenticatedRequest;
    const { rol, municipalidadId } = authReq.auth!;

    try {
      const existing = await service.getById(req.params.id);
      if (rol === "ADMIN_MUNICIPAL" && existing.municipalidadId !== municipalidadId) {
        res.status(403).json({
          message: "No tiene permiso para editar un actor social de otra municipalidad",
        });
        return;
      }
      res.json(await service.update(req.params.id, parsed.data));
    } catch (error) {
      next(error);
    }
  });

  router.patch("/:id/activo", async (req, res, next) => {
    const parsed = activoPayloadSchema.safeParse(req.body);
    if (!parsed.success) {
      validationError(res, "Estado activo inválido", parsed.error);
      return;
    }

    const authReq = req as AuthenticatedRequest;
    const { rol, municipalidadId } = authReq.auth!;

    try {
      const existing = await service.getById(req.params.id);
      if (rol === "ADMIN_MUNICIPAL" && existing.municipalidadId !== municipalidadId) {
        res.status(403).json({
          message: "No tiene permiso para modificar este actor social",
        });
        return;
      }
      res.json(await service.setActivo(req.params.id, parsed.data.activo));
    } catch (error) {
      next(error);
    }
  });

  router.patch("/:id/estado", async (req, res, next) => {
    const parsed = estadoPayloadSchema.safeParse(req.body);
    if (!parsed.success) {
      validationError(res, "Estado inválido", parsed.error);
      return;
    }

    const authReq = req as AuthenticatedRequest;
    const { rol, municipalidadId } = authReq.auth!;

    try {
      const existing = await service.getById(req.params.id);
      if (rol === "ADMIN_MUNICIPAL" && existing.municipalidadId !== municipalidadId) {
        res.status(403).json({
          message: "No tiene permiso para modificar este actor social",
        });
        return;
      }
      res.json(await service.setEstado(req.params.id, parsed.data.estado));
    } catch (error) {
      next(error);
    }
  });

  router.patch("/:id/archivar", async (req, res, next) => {
    const authReq = req as AuthenticatedRequest;
    const { rol, municipalidadId } = authReq.auth!;

    try {
      const existing = await service.getById(req.params.id);
      if (rol === "ADMIN_MUNICIPAL" && existing.municipalidadId !== municipalidadId) {
        res.status(403).json({
          message: "No tiene permiso para archivar este actor social",
        });
        return;
      }
      res.json(await service.archive(req.params.id));
    } catch (error) {
      next(error);
    }
  });

  router.delete("/:id", async (req, res, next) => {
    const parsed = deletePayloadSchema.safeParse(req.body);
    if (!parsed.success) {
      validationError(res, "Motivo de eliminación inválido", parsed.error);
      return;
    }

    const authReq = req as AuthenticatedRequest;
    const { rol, municipalidadId } = authReq.auth!;

    try {
      const existing = await service.getById(req.params.id);
      if (rol === "ADMIN_MUNICIPAL" && existing.municipalidadId !== municipalidadId) {
        res.status(403).json({
          message: "No tiene permiso para eliminar este actor social",
        });
        return;
      }
      res.json(await service.delete(req.params.id, parsed.data));
    } catch (error) {
      next(error);
    }
  });

  return router;
}
