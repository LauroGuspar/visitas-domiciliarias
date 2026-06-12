export type EntidadRecord = {
  id: string;
  tipoEntidad: string;
  codigo: string;
  nombre: string;
  activo: boolean;
  archivado: boolean;
};
export type EntidadCreateInput = Omit<
  EntidadRecord,
  "id" | "activo" | "archivado"
>;
export type EntidadUpdateInput = EntidadCreateInput;
export type EntidadesRepository = {
  list(): Promise<EntidadRecord[]>;
  findById(id: string): Promise<EntidadRecord | { id: string } | null>;
  findByTipoAndCodigo(
    tipoEntidad: string,
    codigo: string,
  ): Promise<EntidadRecord | { id: string } | null>;
  create(
    data: EntidadCreateInput & { activo: true; archivado: false },
  ): Promise<EntidadRecord>;
  update(id: string, data: EntidadUpdateInput): Promise<EntidadRecord>;
  setActivo(id: string, activo: boolean): Promise<EntidadRecord>;
  archive(id: string): Promise<EntidadRecord>;
};
