import { describe, expect, it } from "vitest";
import {
  emptyCargoForm,
  toCargoForm,
  buildCargoPayload,
  filterCargos,
} from "./cargos-utils";
import type { CargoMiembroRecord } from "./cargos-types";

const dummyRecords: CargoMiembroRecord[] = [
  {
    id: "1",
    nombre: "Presidente",
    descripcion: "Presidente del grupo de trabajo",
    orden: 1,
    activo: true,
  },
  {
    id: "2",
    nombre: "Secretario",
    descripcion: null,
    orden: 2,
    activo: false,
  },
];

describe("cargos-utils", () => {
  it("returns empty form", () => {
    expect(emptyCargoForm).toEqual({
      nombre: "",
      descripcion: "",
      orden: "",
    });
  });

  it("converts record to form", () => {
    expect(toCargoForm(dummyRecords[0])).toEqual({
      nombre: "Presidente",
      descripcion: "Presidente del grupo de trabajo",
      orden: "1",
    });
    expect(toCargoForm(dummyRecords[1])).toEqual({
      nombre: "Secretario",
      descripcion: "",
      orden: "2",
    });
  });

  it("builds payload with clean values", () => {
    const form = {
      nombre: "  Coordinador  ",
      descripcion: "  Encargado de coordinar  ",
      orden: "3",
    };
    expect(buildCargoPayload(form)).toEqual({
      nombre: "Coordinador",
      descripcion: "Encargado de coordinar",
      orden: 3,
    });
  });

  it("filters records by query", () => {
    expect(filterCargos(dummyRecords, "presi")).toHaveLength(1);
    expect(filterCargos(dummyRecords, "")).toHaveLength(2);
  });

  it("filters records by status", () => {
    expect(filterCargos(dummyRecords, "", "active")).toHaveLength(1);
    expect(filterCargos(dummyRecords, "", "inactive")).toHaveLength(1);
  });
});
