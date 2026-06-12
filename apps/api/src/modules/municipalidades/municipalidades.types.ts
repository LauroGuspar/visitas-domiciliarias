export type TipoMunicipalidad = "PROVINCIAL" | "DISTRITAL";

export type MunicipalidadRecord = {
  id: string;
  ubigeo: string;
  departamento: string;
  provincia: string;
  distrito: string;
  codigo: string;
  nombre: string;
  tipo: TipoMunicipalidad;
  prioridad: number;
  activo: boolean;
  archivado: boolean;
};

export type MunicipalidadCreateInput = Omit<
  MunicipalidadRecord,
  "id" | "activo" | "archivado"
>;

export type MunicipalidadUpdateInput = MunicipalidadCreateInput;

export type MunicipalidadCreateData = MunicipalidadCreateInput & {
  activo: true;
  archivado: false;
};

export type MunicipalidadesRepository = {
  list(): Promise<MunicipalidadRecord[]>;
  findById(id: string): Promise<MunicipalidadRecord | { id: string } | null>;
  findByUbigeoAndCodigo(
    ubigeo: string,
    codigo: string,
  ): Promise<MunicipalidadRecord | { id: string } | null>;
  create(data: MunicipalidadCreateData): Promise<MunicipalidadRecord>;
  update(
    id: string,
    data: MunicipalidadUpdateInput,
  ): Promise<MunicipalidadRecord>;
  setActivo(id: string, activo: boolean): Promise<MunicipalidadRecord>;
};
