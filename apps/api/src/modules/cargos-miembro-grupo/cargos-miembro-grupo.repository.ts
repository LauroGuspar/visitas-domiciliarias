import type { PrismaClient } from "@prisma/client";
import type {
  CargoMiembroGrupoCreateInput,
  CargoMiembroGrupoRecord,
  CargoMiembroGrupoUpdateInput,
  CargosMiembroGrupoRepository,
} from "./cargos-miembro-grupo.types.js";
export class PrismaCargosMiembroGrupoRepository implements CargosMiembroGrupoRepository {
  constructor(private readonly prisma: PrismaClient) {}
  list(): Promise<CargoMiembroGrupoRecord[]> {
    return this.prisma.cargoMiembroGrupo.findMany({
      orderBy: [{ orden: "asc" }, { nombre: "asc" }],
    }) as Promise<CargoMiembroGrupoRecord[]>;
  }
  findById(id: string) {
    return this.prisma.cargoMiembroGrupo.findUnique({ where: { id } });
  }
  findByNombre(nombre: string) {
    return this.prisma.cargoMiembroGrupo.findUnique({ where: { nombre } });
  }
  create(
    data: CargoMiembroGrupoCreateInput & { activo: true },
  ): Promise<CargoMiembroGrupoRecord> {
    return this.prisma.cargoMiembroGrupo.create({
      data,
    }) as Promise<CargoMiembroGrupoRecord>;
  }
  update(
    id: string,
    data: CargoMiembroGrupoUpdateInput,
  ): Promise<CargoMiembroGrupoRecord> {
    return this.prisma.cargoMiembroGrupo.update({
      where: { id },
      data,
    }) as Promise<CargoMiembroGrupoRecord>;
  }
  setActivo(id: string, activo: boolean): Promise<CargoMiembroGrupoRecord> {
    return this.prisma.cargoMiembroGrupo.update({
      where: { id },
      data: { activo },
    }) as Promise<CargoMiembroGrupoRecord>;
  }
}
