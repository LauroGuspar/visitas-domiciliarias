import { requireAuth } from "../../shared/auth.middleware.js";
import { prisma } from "../../shared/prisma.js";
import { PrismaMunicipalidadesRepository } from "./municipalidades.repository.js";
import { createMunicipalidadesRouter } from "./municipalidades.routes.js";
import { MunicipalidadesService } from "./municipalidades.service.js";

export function createDefaultMunicipalidadesRouter() {
  return createMunicipalidadesRouter(
    new MunicipalidadesService(new PrismaMunicipalidadesRepository(prisma)),
    requireAuth(),
  );
}
