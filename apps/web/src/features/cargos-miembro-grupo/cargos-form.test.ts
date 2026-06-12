import { describe, expect, it } from "vitest";
import { getCargoFormTitle } from "./cargos-form";

describe("cargos-form", () => {
  it("returns correct modal title", () => {
    expect(getCargoFormTitle(null)).toBe("Nuevo cargo");
    expect(
      getCargoFormTitle({
        id: "1",
        nombre: "X",
        descripcion: "Y",
        orden: 1,
        activo: true,
      }),
    ).toBe("Editar cargo");
  });
});
