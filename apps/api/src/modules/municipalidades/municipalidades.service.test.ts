import { describe, expect, it, vi } from "vitest";
import { HttpError } from "../../shared/http-error.js";
import { MunicipalidadesService } from "./municipalidades.service.js";

const createInput = {
  ubigeo: "150101",
  departamento: "Lima",
  provincia: "Lima",
  distrito: "Lima",
  codigo: "001",
  nombre: "Municipalidad de Lima",
  tipo: "PROVINCIAL" as const,
  prioridad: 1,
};

describe("MunicipalidadesService", () => {
  it("creates an active non-archived municipalidad when ubigeo and codigo are unique", async () => {
    const findByUbigeoAndCodigo = vi.fn().mockResolvedValue(null);
    const create = vi
      .fn()
      .mockResolvedValue({
        id: "mun-1",
        ...createInput,
        activo: true,
        archivado: false,
      });
    const service = new MunicipalidadesService({
      findByUbigeoAndCodigo,
      create,
      update: vi.fn(),
      findById: vi.fn(),
      setActivo: vi.fn(),
      list: vi.fn(),
    });

    const result = await service.create(createInput);

    expect(result).toMatchObject({
      id: "mun-1",
      activo: true,
      archivado: false,
    });
    expect(create).toHaveBeenCalledWith({
      ...createInput,
      activo: true,
      archivado: false,
    });
  });

  it("rejects duplicate ubigeo and codigo", async () => {
    const service = new MunicipalidadesService({
      findByUbigeoAndCodigo: vi.fn().mockResolvedValue({ id: "existing" }),
      create: vi.fn(),
      update: vi.fn(),
      findById: vi.fn(),
      setActivo: vi.fn(),
      list: vi.fn(),
    });

    await expect(service.create(createInput)).rejects.toMatchObject({
      statusCode: 409,
      message: "Ya existe una municipalidad con ese ubigeo y código",
    } satisfies Partial<HttpError>);
  });

  it("updates an existing municipalidad", async () => {
    const findById = vi.fn().mockResolvedValue({ id: "mun-1" });
    const update = vi
      .fn()
      .mockResolvedValue({
        id: "mun-1",
        ...createInput,
        nombre: "Municipalidad Actualizada",
      });
    const service = new MunicipalidadesService({
      findByUbigeoAndCodigo: vi.fn(),
      create: vi.fn(),
      update,
      findById,
      setActivo: vi.fn(),
      list: vi.fn(),
    });

    const result = await service.update("mun-1", {
      ...createInput,
      nombre: "Municipalidad Actualizada",
    });

    expect(result).toMatchObject({
      id: "mun-1",
      nombre: "Municipalidad Actualizada",
    });
    expect(findById).toHaveBeenCalledWith("mun-1");
  });

  it("toggles active state for an existing municipalidad", async () => {
    const findById = vi.fn().mockResolvedValue({ id: "mun-1" });
    const setActivo = vi.fn().mockResolvedValue({ id: "mun-1", activo: false });
    const service = new MunicipalidadesService({
      findByUbigeoAndCodigo: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      findById,
      setActivo,
      list: vi.fn(),
    });

    await expect(service.setActivo("mun-1", false)).resolves.toMatchObject({
      activo: false,
    });
    expect(setActivo).toHaveBeenCalledWith("mun-1", false);
  });
});
