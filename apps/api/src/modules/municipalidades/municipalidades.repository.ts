import type { PrismaClient } from "@prisma/client";
import type {
  MunicipalidadCreateData,
  MunicipalidadRecord,
  MunicipalidadesRepository,
  MunicipalidadUpdateInput,
} from "./municipalidades.types.js";

export class PrismaMunicipalidadesRepository implements MunicipalidadesRepository {
  constructor(private readonly prisma: PrismaClient) {}
  list(): Promise<MunicipalidadRecord[]> {
    return this.prisma.municipalidad.findMany({
      where: { archivado: false },
      orderBy: [{ prioridad: "asc" }, { nombre: "asc" }],
    }) as Promise<MunicipalidadRecord[]>;
  }
  findById(id: string) {
    return this.prisma.municipalidad.findUnique({ where: { id } });
  }
  findByUbigeoAndCodigo(ubigeo: string, codigo: string) {
    return this.prisma.municipalidad.findUnique({
      where: { ubigeo_codigo: { ubigeo, codigo } },
    });
  }
  create(data: MunicipalidadCreateData): Promise<MunicipalidadRecord> {
    return this.prisma.municipalidad.create({
      data,
    }) as Promise<MunicipalidadRecord>;
  }
  update(
    id: string,
    data: MunicipalidadUpdateInput,
  ): Promise<MunicipalidadRecord> {
    return this.prisma.municipalidad.update({
      where: { id },
      data,
    }) as Promise<MunicipalidadRecord>;
  }
  setActivo(id: string, activo: boolean): Promise<MunicipalidadRecord> {
    return this.prisma.municipalidad.update({
      where: { id },
      data: { activo },
    }) as Promise<MunicipalidadRecord>;
  }
}
