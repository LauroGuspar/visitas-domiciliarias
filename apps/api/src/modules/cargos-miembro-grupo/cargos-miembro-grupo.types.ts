export type CargoMiembroGrupoRecord = {
  id: string;
  nombre: string;
  descripcion: string | null;
  orden: number;
  activo: boolean;
};
export type CargoMiembroGrupoCreateInput = Omit<
  CargoMiembroGrupoRecord,
  "id" | "activo"
>;
export type CargoMiembroGrupoUpdateInput = CargoMiembroGrupoCreateInput;
export type CargosMiembroGrupoRepository = {
  list(): Promise<CargoMiembroGrupoRecord[]>;
  findById(
    id: string,
  ): Promise<CargoMiembroGrupoRecord | { id: string } | null>;
  findByNombre(
    nombre: string,
  ): Promise<CargoMiembroGrupoRecord | { id: string } | null>;
  create(
    data: CargoMiembroGrupoCreateInput & { activo: true },
  ): Promise<CargoMiembroGrupoRecord>;
  update(
    id: string,
    data: CargoMiembroGrupoUpdateInput,
  ): Promise<CargoMiembroGrupoRecord>;
  setActivo(id: string, activo: boolean): Promise<CargoMiembroGrupoRecord>;
};
