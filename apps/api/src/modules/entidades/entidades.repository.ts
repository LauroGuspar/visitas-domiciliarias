import type { PrismaClient } from "@prisma/client";
import type {
  EntidadCreateInput,
  EntidadRecord,
  EntidadesRepository,
  EntidadUpdateInput,
} from "./entidades.types.js";
export class PrismaEntidadesRepository implements EntidadesRepository {
  constructor(private readonly prisma: PrismaClient) {}
  list(): Promise<EntidadRecord[]> {
    return this.prisma.entidad.findMany({
      orderBy: [{ tipoEntidad: "asc" }, { nombre: "asc" }],
    }) as Promise<EntidadRecord[]>;
  }
  findById(id: string) {
    return this.prisma.entidad.findUnique({ where: { id } });
  }
  findByTipoAndCodigo(tipoEntidad: string, codigo: string) {
    return this.prisma.entidad.findUnique({
      where: { tipoEntidad_codigo: { tipoEntidad, codigo } },
    });
  }
  create(data: EntidadCreateInput & { activo: true }): Promise<EntidadRecord> {
    return this.prisma.entidad.create({ data }) as Promise<EntidadRecord>;
  }
  update(id: string, data: EntidadUpdateInput): Promise<EntidadRecord> {
    return this.prisma.entidad.update({
      where: { id },
      data,
    }) as Promise<EntidadRecord>;
  }
  setActivo(id: string, activo: boolean): Promise<EntidadRecord> {
    return this.prisma.entidad.update({
      where: { id },
      data: { activo },
    }) as Promise<EntidadRecord>;
  }
}
