import { Router, type RequestHandler } from "express";
import {
  activoPayloadSchema,
  grupoEstablecimientoPayloadSchema,
  grupoTrabajoEstadoSchema,
  grupoTrabajoPayloadSchema,
  miembroGrupoContactoSchema,
  miembroGrupoDeleteSchema,
  miembroGrupoPayloadSchema,
} from "./grupos-trabajo.schemas.js";
import type { GruposTrabajoService } from "./grupos-trabajo.service.js";

function validationError(
  res: Parameters<RequestHandler>[1],
  message: string,
  error: unknown,
) {
  const details =
    error && typeof error === "object" && "flatten" in error
      ? (error as { flatten: () => unknown }).flatten()
      : null;
  res.status(400).json({ message, details });
}

export function createGruposTrabajoRouter(
  service: GruposTrabajoService,
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
    const parsed = grupoTrabajoPayloadSchema.safeParse(req.body);
    if (!parsed.success) {
      validationError(res, "Datos de grupo de trabajo inválidos", parsed.error);
      return;
    }
    try {
      res.status(201).json(await service.createGrupo(parsed.data));
    } catch (error) {
      next(error);
    }
  });

  router.post("/:grupoId/establecimientos", async (req, res, next) => {
    const parsed = grupoEstablecimientoPayloadSchema.safeParse(req.body);
    if (!parsed.success) {
      validationError(res, "Datos de establecimiento inválidos", parsed.error);
      return;
    }
    try {
      res
        .status(201)
        .json(
          await service.createEstablecimiento(req.params.grupoId, parsed.data),
        );
    } catch (error) {
      next(error);
    }
  });

  router.post("/:grupoId/miembros", async (req, res, next) => {
    const parsed = miembroGrupoPayloadSchema.safeParse(req.body);
    if (!parsed.success) {
      validationError(res, "Datos de miembro de grupo inválidos", parsed.error);
      return;
    }
    try {
      res
        .status(201)
        .json(await service.createMiembro(req.params.grupoId, parsed.data));
    } catch (error) {
      next(error);
    }
  });

  router.patch(
    "/:grupoId/miembros/:miembroId/contacto",
    async (req, res, next) => {
      const parsed = miembroGrupoContactoSchema.safeParse(req.body);
      if (!parsed.success) {
        validationError(
          res,
          "Datos de contacto de miembro inválidos",
          parsed.error,
        );
        return;
      }
      try {
        res.json(
          await service.updateMiembroContacto(
            req.params.grupoId,
            req.params.miembroId,
            parsed.data,
          ),
        );
      } catch (error) {
        next(error);
      }
    },
  );

  router.patch(
    "/:grupoId/miembros/:miembroId/activo",
    async (req, res, next) => {
      const parsed = activoPayloadSchema.safeParse(req.body);
      if (!parsed.success) {
        validationError(res, "Estado de miembro inválido", parsed.error);
        return;
      }
      try {
        res.json(
          await service.setMiembroActivo(
            req.params.grupoId,
            req.params.miembroId,
            parsed.data.activo,
          ),
        );
      } catch (error) {
        next(error);
      }
    },
  );

  router.delete("/:grupoId/miembros/:miembroId", async (req, res, next) => {
    const parsed = miembroGrupoDeleteSchema.safeParse(req.body);
    if (!parsed.success) {
      validationError(res, "Motivo de eliminación inválido", parsed.error);
      return;
    }
    try {
      res.json(
        await service.deleteMiembro(
          req.params.grupoId,
          req.params.miembroId,
          parsed.data,
        ),
      );
    } catch (error) {
      next(error);
    }
  });

  router.patch("/:id/estado", async (req, res, next) => {
    const parsed = grupoTrabajoEstadoSchema.safeParse(req.body);
    if (!parsed.success) {
      validationError(res, "Datos de estado inválidos", parsed.error);
      return;
    }
    try {
      res.json(
        await service.updateGrupoEstado(
          req.params.id,
          parsed.data.estado,
          parsed.data.observaciones,
        ),
      );
    } catch (error) {
      next(error);
    }
  });

  return router;
}
