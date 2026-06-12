import { HttpError } from "../../shared/http-error.js";
import type {
  GrupoEstablecimientoCreateInput,
  GrupoEstablecimientoRecord,
  GrupoTrabajoCreateInput,
  GrupoTrabajoRecord,
  GruposTrabajoRepository,
  MiembroGrupoContactoInput,
  MiembroGrupoCreateInput,
  MiembroGrupoDeleteInput,
  MiembroGrupoDeleteResult,
  MiembroGrupoRecord,
} from "./grupos-trabajo.types.js";

const NOTIFICATION_MESSAGE =
  "Se notificó al administrador general para su revisión.";

export class GruposTrabajoService {
  constructor(private readonly repository: GruposTrabajoRepository) {}

  list(): Promise<GrupoTrabajoRecord[]> {
    return this.repository.list();
  }

  createGrupo(input: GrupoTrabajoCreateInput): Promise<GrupoTrabajoRecord> {
    return this.repository.createGrupo({
      ...input,
      fechaLimite: normalizeDate(input.fechaLimite),
      estado: "BORRADOR",
      activo: true,
      archivado: false,
    });
  }

  async createEstablecimiento(
    grupoTrabajoId: string,
    input: GrupoEstablecimientoCreateInput,
  ): Promise<GrupoEstablecimientoRecord> {
    await this.ensureGrupoExists(grupoTrabajoId);
    return this.repository.createEstablecimiento({
      grupoTrabajoId,
      ...input,
      codigo: input.codigo ?? null,
      direccion: input.direccion ?? null,
      activo: true,
    });
  }

  async createMiembro(
    grupoTrabajoId: string,
    input: MiembroGrupoCreateInput,
  ): Promise<MiembroGrupoRecord> {
    await this.ensureGrupoExists(grupoTrabajoId);
    await this.ensureCargoExists(input.cargoMiembroGrupoId);
    await this.ensureEstablecimientoBelongsToGrupo(
      grupoTrabajoId,
      input.grupoEstablecimientoId ?? null,
    );

    return this.repository.createMiembro({
      grupoTrabajoId,
      ...input,
      grupoEstablecimientoId: input.grupoEstablecimientoId ?? null,
      celular: input.celular ?? null,
      email: input.email ?? null,
      activo: true,
      archivado: false,
    });
  }

  async updateMiembroContacto(
    grupoTrabajoId: string,
    miembroId: string,
    input: MiembroGrupoContactoInput,
  ): Promise<MiembroGrupoRecord> {
    await this.ensureGrupoExists(grupoTrabajoId);
    await this.ensureEstablecimientoBelongsToGrupo(
      grupoTrabajoId,
      input.grupoEstablecimientoId ?? null,
    );

    return this.repository.updateMiembroContacto(grupoTrabajoId, miembroId, {
      grupoEstablecimientoId: input.grupoEstablecimientoId ?? null,
      celular: input.celular ?? null,
      email: input.email ?? null,
    });
  }

  async setMiembroActivo(
    grupoTrabajoId: string,
    miembroId: string,
    activo: boolean,
  ): Promise<MiembroGrupoRecord> {
    await this.ensureGrupoExists(grupoTrabajoId);
    return this.repository.setMiembroActivo(grupoTrabajoId, miembroId, activo);
  }

  async deleteMiembro(
    grupoTrabajoId: string,
    miembroId: string,
    input: MiembroGrupoDeleteInput,
  ): Promise<MiembroGrupoDeleteResult> {
    const motivoEliminacion = input.motivoEliminacion.trim();
    if (!motivoEliminacion) {
      throw new HttpError(400, "El motivo de eliminación es obligatorio");
    }

    const record = await this.repository.deleteMiembro(
      grupoTrabajoId,
      miembroId,
      {
        motivoEliminacion,
      },
    );

    return { ...record, notificationMessage: NOTIFICATION_MESSAGE };
  }

  private async ensureGrupoExists(grupoTrabajoId: string): Promise<void> {
    if (!(await this.repository.findGrupoById(grupoTrabajoId))) {
      throw new HttpError(404, "Grupo de trabajo no encontrado");
    }
  }

  private async ensureCargoExists(cargoMiembroGrupoId: string): Promise<void> {
    if (!(await this.repository.findCargoById(cargoMiembroGrupoId))) {
      throw new HttpError(404, "Cargo de miembro de grupo no encontrado");
    }
  }

  private async ensureEstablecimientoBelongsToGrupo(
    grupoTrabajoId: string,
    grupoEstablecimientoId: string | null,
  ): Promise<void> {
    if (!grupoEstablecimientoId) return;

    const establecimiento = await this.repository.findEstablecimientoById(
      grupoEstablecimientoId,
    );

    if (!establecimiento) {
      throw new HttpError(404, "Establecimiento del grupo no encontrado");
    }

    if (establecimiento.grupoTrabajoId !== grupoTrabajoId) {
      throw new HttpError(
        400,
        "El establecimiento no pertenece al grupo de trabajo indicado",
      );
    }
  }
}

function normalizeDate(value: string | Date): Date {
  if (value instanceof Date) return value;
  return new Date(`${value}T00:00:00.000Z`);
}
