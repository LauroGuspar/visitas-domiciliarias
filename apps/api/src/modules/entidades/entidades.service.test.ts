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
        archivado: false,
      });
    const service = new EntidadesService({
      list: vi.fn(),
      findById: vi.fn(),
      findByTipoAndCodigo,
      create,
      update: vi.fn(),
      setActivo: vi.fn(),
      archive: vi.fn(),
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
      archivado: false,
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
      archive: vi.fn(),
    });

    await expect(
      service.create({ tipoEntidad: "MIDIS", codigo: "001", nombre: "MIDIS" }),
    ).rejects.toMatchObject({ statusCode: 409 });
  });

  it("archives an existing entidad", async () => {
    const archive = vi.fn().mockResolvedValue({
      id: "ent-1",
      tipoEntidad: "MIDIS",
      codigo: "001",
      nombre: "MIDIS",
      activo: true,
      archivado: true,
    });
    const service = new EntidadesService({
      list: vi.fn(),
      findById: vi.fn().mockResolvedValue({ id: "ent-1" }),
      findByTipoAndCodigo: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      setActivo: vi.fn(),
      archive,
    });

    const result = await service.archive("ent-1");

    expect(result).toMatchObject({ id: "ent-1", archivado: true });
    expect(archive).toHaveBeenCalledWith("ent-1");
  });
});
