import { requireAuth } from "../../shared/auth.middleware.js";
import { prisma } from "../../shared/prisma.js";
import { PrismaEntidadesRepository } from "./entidades.repository.js";
import { createEntidadesRouter } from "./entidades.routes.js";
import { EntidadesService } from "./entidades.service.js";
export function createDefaultEntidadesRouter() {
  return createEntidadesRouter(
    new EntidadesService(new PrismaEntidadesRepository(prisma)),
    requireAuth(),
  );
}
