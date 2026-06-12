import { describe, expect, it, vi } from "vitest";
import { EntidadesService } from "./entidades.service.js";

describe("EntidadesService", () => {
  it("creates an active entidad when tipo and codigo are unique", async () => {
    const findByTipoAndCodigo = vi.fn().mockResolvedValue(null);
    const create = vi
      .fn()
      .mockResolvedValue({
        id: "ent-1",
        tipoEntidad: "MIDIS",
        codigo: "001",
        nombre: "MIDIS",
        activo: true,
      });
    const service = new EntidadesService({
      list: vi.fn(),
      findById: vi.fn(),
      findByTipoAndCodigo,
      create,
      update: vi.fn(),
      setActivo: vi.fn(),
    });

    const result = await service.create({
      tipoEntidad: "MIDIS",
      codigo: "001",
      nombre: "MIDIS",
    });

    expect(result).toMatchObject({ id: "ent-1", activo: true });
    expect(create).toHaveBeenCalledWith({
      tipoEntidad: "MIDIS",
      codigo: "001",
      nombre: "MIDIS",
      activo: true,
    });
  });

  it("rejects duplicate tipo and codigo", async () => {
    const service = new EntidadesService({
      list: vi.fn(),
      findById: vi.fn(),
      findByTipoAndCodigo: vi.fn().mockResolvedValue({ id: "ent-1" }),
      create: vi.fn(),
      update: vi.fn(),
      setActivo: vi.fn(),
    });

    await expect(
      service.create({ tipoEntidad: "MIDIS", codigo: "001", nombre: "MIDIS" }),
    ).rejects.toMatchObject({ statusCode: 409 });
  });
});
