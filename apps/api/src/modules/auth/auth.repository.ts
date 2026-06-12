import type { PrismaClient } from "@prisma/client";
import type { AuthUserRecord } from "./auth.types.js";

export class PrismaAuthUserRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findByUsername(username: string): Promise<AuthUserRecord | null> {
    const user = await this.prisma.usuario.findUnique({
      where: { username },
      include: {
        actorSocial: {
          select: { id: true },
        },
      },
    });

    if (!user) {
      return null;
    }

    return {
      id: user.id,
      username: user.username,
      passwordHash: user.passwordHash,
      rol: user.rol,
      activo: user.activo,
      municipalidadId: user.municipalidadId,
      actorSocialId: user.actorSocial?.id ?? null,
    };
  }
}
