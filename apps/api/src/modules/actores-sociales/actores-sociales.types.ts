export type EstadoActorSocial =
  | "BORRADOR"
  | "REGISTRADO"
  | "VALIDO"
  | "CAPACITADO"
  | "APROBADO";

export type ActorSocialRecord = {
  id: string;
  usuarioId: string | null;
  municipalidadId: string;
  tipoActorSocialId: string;
  grupoTrabajoId: string;
  entidadId: string | null;
  dni: string;
  nombres: string;
  apellidos: string;
  direccion: string;
  centroPoblado: string | null;
  fechaNac: Date;
  email: string;
  celular: string;
  idiomaOrigen: string;
  gradoInstruccion: string;
  estado: EstadoActorSocial;
  activo: boolean;
  archivado: boolean;
  deletedAt: Date | null;
  motivoEliminacion: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type ActorSocialCreateInput = {
  municipalidadId: string;
  tipoActorSocialId: string;
  grupoTrabajoId: string;
  entidadId?: string | null;
  dni: string;
  nombres: string;
  apellidos: string;
  direccion: string;
  centroPoblado?: string | null;
  fechaNac: string | Date;
  email: string;
  celular: string;
  idiomaOrigen: string;
  gradoInstruccion: string;
  username: string;
  password: string;
};

export type ActorSocialUpdateInput = {
  tipoActorSocialId: string;
  grupoTrabajoId: string;
  entidadId?: string | null;
  email: string;
  celular: string;
  direccion: string;
  centroPoblado?: string | null;
  gradoInstruccion: string;
};

export type ActoresSocialesRepository = {
  list(municipalidadId?: string | null): Promise<ActorSocialRecord[]>;
  findById(id: string): Promise<ActorSocialRecord | null>;
  findByDni(municipalidadId: string, dni: string): Promise<ActorSocialRecord | null>;
  findByUsername(username: string): Promise<boolean>;
  create(
    data: Omit<ActorSocialCreateInput, "password"> & {
      passwordHash: string;
      estado: "BORRADOR";
      activo: boolean;
      archivado: boolean;
    }
  ): Promise<ActorSocialRecord>;
  update(id: string, data: ActorSocialUpdateInput): Promise<ActorSocialRecord>;
  setActivo(id: string, activo: boolean): Promise<ActorSocialRecord>;
  setEstado(id: string, estado: EstadoActorSocial): Promise<ActorSocialRecord>;
  archive(id: string): Promise<ActorSocialRecord>;
  delete(id: string, motivoEliminacion: string): Promise<ActorSocialRecord>;
};
