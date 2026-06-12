import { requireAuth } from "../../shared/auth.middleware.js";
import { prisma } from "../../shared/prisma.js";
import { PrismaGruposTrabajoRepository } from "./grupos-trabajo.repository.js";
import { createGruposTrabajoRouter } from "./grupos-trabajo.routes.js";
import { GruposTrabajoService } from "./grupos-trabajo.service.js";

export function createDefaultGruposTrabajoRouter() {
  return createGruposTrabajoRouter(
    new GruposTrabajoService(new PrismaGruposTrabajoRepository(prisma)),
    requireAuth(),
  );
}
