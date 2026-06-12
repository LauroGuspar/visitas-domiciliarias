import { HttpError } from "../../shared/http-error.js";
import type {
  CargoMiembroGrupoCreateInput,
  CargoMiembroGrupoRecord,
  CargoMiembroGrupoUpdateInput,
  CargosMiembroGrupoRepository,
} from "./cargos-miembro-grupo.types.js";

export class CargosMiembroGrupoService {
  constructor(private readonly repository: CargosMiembroGrupoRepository) {}
  list(): Promise<CargoMiembroGrupoRecord[]> {
    return this.repository.list();
  }
  async create(
    input: CargoMiembroGrupoCreateInput,
  ): Promise<CargoMiembroGrupoRecord> {
    const existing = await this.repository.findByNombre(input.nombre);
    if (existing) throw new HttpError(409, "Ya existe un cargo con ese nombre");
    return this.repository.create({ ...input, activo: true });
  }
  async update(
    id: string,
    input: CargoMiembroGrupoUpdateInput,
  ): Promise<CargoMiembroGrupoRecord> {
    await this.ensureExists(id);
    return this.repository.update(id, input);
  }
  async setActivo(
    id: string,
    activo: boolean,
  ): Promise<CargoMiembroGrupoRecord> {
    await this.ensureExists(id);
    return this.repository.setActivo(id, activo);
  }
  private async ensureExists(id: string) {
    if (!(await this.repository.findById(id)))
      throw new HttpError(404, "Cargo de miembro de grupo no encontrado");
  }
}
