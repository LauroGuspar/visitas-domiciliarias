import { requireAuth } from "../../shared/auth.middleware.js";
import { prisma } from "../../shared/prisma.js";
import { PrismaCargosMiembroGrupoRepository } from "./cargos-miembro-grupo.repository.js";
import { createCargosMiembroGrupoRouter } from "./cargos-miembro-grupo.routes.js";
import { CargosMiembroGrupoService } from "./cargos-miembro-grupo.service.js";
export function createDefaultCargosMiembroGrupoRouter() {
  return createCargosMiembroGrupoRouter(
    new CargosMiembroGrupoService(
      new PrismaCargosMiembroGrupoRepository(prisma),
    ),
    requireAuth(),
  );
}
