import { HttpError } from "../../shared/http-error.js";
import type {
  MunicipalidadCreateInput,
  MunicipalidadRecord,
  MunicipalidadesRepository,
  MunicipalidadUpdateInput,
} from "./municipalidades.types.js";

export class MunicipalidadesService {
  constructor(private readonly repository: MunicipalidadesRepository) {}

  list(): Promise<MunicipalidadRecord[]> {
    return this.repository.list();
  }

  async create(input: MunicipalidadCreateInput): Promise<MunicipalidadRecord> {
    const existing = await this.repository.findByUbigeoAndCodigo(
      input.ubigeo,
      input.codigo,
    );

    if (existing) {
      throw new HttpError(
        409,
        "Ya existe una municipalidad con ese ubigeo y código",
      );
    }

    return this.repository.create({ ...input, activo: true, archivado: false });
  }

  async update(
    id: string,
    input: MunicipalidadUpdateInput,
  ): Promise<MunicipalidadRecord> {
    await this.ensureExists(id);
    return this.repository.update(id, input);
  }

  async setActivo(id: string, activo: boolean): Promise<MunicipalidadRecord> {
    await this.ensureExists(id);
    return this.repository.setActivo(id, activo);
  }

  private async ensureExists(id: string): Promise<void> {
    const existing = await this.repository.findById(id);

    if (!existing) {
      throw new HttpError(404, "Municipalidad no encontrada");
    }
  }
}
