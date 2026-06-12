import { describe, expect, it, vi } from "vitest";
import { seedTiposActorSocial } from "./tipos-actor-social.loader.js";

describe("seedTiposActorSocial", () => {
  it("creates all default types if they do not exist", async () => {
    const findUnique = vi.fn().mockResolvedValue(null);
    const create = vi.fn().mockResolvedValue({ id: "tas-id" });

    const createdCount = await seedTiposActorSocial({ findUnique, create } as any);

    expect(createdCount).toBe(9);
    expect(findUnique).toHaveBeenCalledTimes(9);
    expect(create).toHaveBeenCalledTimes(9);
    expect(create).toHaveBeenNthCalledWith(1, {
      data: {
        tipoActor: "Agentes Comunitarios",
        tarifaRural: 5.0,
        tarifaUrbana: 4.0,
        orden: 1,
        codigo: "1",
        activo: true,
        archivado: false,
      },
    });
  });

  it("skips creating types that already exist by codigo", async () => {
    const findUnique = vi.fn().mockImplementation(({ where: { codigo } }) => {
      if (codigo === "1" || codigo === "2") {
        return Promise.resolve({ id: `tas-${codigo}` });
      }
      return Promise.resolve(null);
    });
    const create = vi.fn().mockResolvedValue({ id: "tas-id" });

    const createdCount = await seedTiposActorSocial({ findUnique, create } as any);

    expect(createdCount).toBe(7); // 9 total - 2 existing
    expect(findUnique).toHaveBeenCalledTimes(9);
    expect(create).toHaveBeenCalledTimes(7);
  });
});
