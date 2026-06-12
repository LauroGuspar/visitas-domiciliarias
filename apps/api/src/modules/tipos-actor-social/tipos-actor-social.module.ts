import { requireAuth } from "../../shared/auth.middleware.js";
import { prisma } from "../../shared/prisma.js";
import { PrismaTiposActorSocialRepository } from "./tipos-actor-social.repository.js";
import { createTiposActorSocialRouter } from "./tipos-actor-social.routes.js";
import { TiposActorSocialService } from "./tipos-actor-social.service.js";
export function createDefaultTiposActorSocialRouter() {
  return createTiposActorSocialRouter(
    new TiposActorSocialService(new PrismaTiposActorSocialRepository(prisma)),
    requireAuth(),
  );
}
