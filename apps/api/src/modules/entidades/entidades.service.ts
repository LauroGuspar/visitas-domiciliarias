import { HttpError } from "../../shared/http-error.js";
import type {
  EntidadCreateInput,
  EntidadRecord,
  EntidadesRepository,
  EntidadUpdateInput,
} from "./entidades.types.js";

export class EntidadesService {
  constructor(private readonly repository: EntidadesRepository) {}
  list(): Promise<EntidadRecord[]> {
    return this.repository.list();
  }
  async create(input: EntidadCreateInput): Promise<EntidadRecord> {
    const existing = await this.repository.findByTipoAndCodigo(
      input.tipoEntidad,
      input.codigo,
    );
    if (existing)
      throw new HttpError(409, "Ya existe una entidad con ese tipo y código");
    return this.repository.create({ ...input, activo: true, archivado: false });
  }
  async update(id: string, input: EntidadUpdateInput): Promise<EntidadRecord> {
    await this.ensureExists(id);
    return this.repository.update(id, input);
  }
  async setActivo(id: string, activo: boolean): Promise<EntidadRecord> {
    await this.ensureExists(id);
    return this.repository.setActivo(id, activo);
  }
  async archive(id: string): Promise<EntidadRecord> {
    await this.ensureExists(id);
    return this.repository.archive(id);
  }
  private async ensureExists(id: string) {
    if (!(await this.repository.findById(id)))
      throw new HttpError(404, "Entidad no encontrada");
  }
}
