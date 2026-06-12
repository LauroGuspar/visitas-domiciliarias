import { describe, expect, it, vi } from "vitest";
import { CargosMiembroGrupoService } from "./cargos-miembro-grupo.service.js";

describe("CargosMiembroGrupoService", () => {
  it("creates an active cargo when nombre is unique", async () => {
    const findByNombre = vi.fn().mockResolvedValue(null);
    const create = vi
      .fn()
      .mockResolvedValue({
        id: "cargo-1",
        nombre: "Presidente",
        descripcion: null,
        orden: 1,
        activo: true,
      });
    const service = new CargosMiembroGrupoService({
      list: vi.fn(),
      findById: vi.fn(),
      findByNombre,
      create,
      update: vi.fn(),
      setActivo: vi.fn(),
    });

    const result = await service.create({
      nombre: "Presidente",
      descripcion: null,
      orden: 1,
    });

    expect(result).toMatchObject({ id: "cargo-1", activo: true });
    expect(create).toHaveBeenCalledWith({
      nombre: "Presidente",
      descripcion: null,
      orden: 1,
      activo: true,
    });
  });
});
