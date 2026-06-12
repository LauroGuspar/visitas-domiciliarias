import { requireAuth } from "../../shared/auth.middleware.js";
import { prisma } from "../../shared/prisma.js";
import { PrismaSectoresRepository } from "./sectores.repository.js";
import { createSectoresRouter } from "./sectores.routes.js";
import { SectoresService } from "./sectores.service.js";

export function createDefaultSectoresRouter() {
  return createSectoresRouter(
    new SectoresService(new PrismaSectoresRepository(prisma)),
    requireAuth(),
  );
}
