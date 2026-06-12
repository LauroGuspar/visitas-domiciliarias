import { requireAuth } from "../../shared/auth.middleware.js";
import { prisma } from "../../shared/prisma.js";
import { PrismaActoresSocialesRepository } from "./actores-sociales.repository.js";
import { createActoresSocialesRouter } from "./actores-sociales.routes.js";
import { ActoresSocialesService } from "./actores-sociales.service.js";

export function createDefaultActoresSocialesRouter() {
  const baseRepo = new PrismaActoresSocialesRepository(prisma);

  const repository = Object.assign(baseRepo, {
    findMunicipalidadById: async (id: string) => {
      return prisma.municipalidad.findFirst({
        where: { id, archivado: false },
        select: { id: true },
      });
    },
    findTipoActorById: async (id: string) => {
      return prisma.tipoActorSocial.findFirst({
        where: { id, archivado: false },
        select: { id: true },
      });
    },
    findGrupoById: async (id: string) => {
      return prisma.grupoTrabajo.findFirst({
        where: { id, archivado: false },
        select: { id: true, municipalidadId: true },
      });
    },
    findEntidadById: async (id: string) => {
      return prisma.entidad.findFirst({
        where: { id, archivado: false },
        select: { id: true },
      });
    },
  });

  return createActoresSocialesRouter(
    new ActoresSocialesService(repository),
    requireAuth()
  );
}
