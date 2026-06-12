export type TipoSector = "URBANO" | "RURAL";

export type SectorUrbanoInput = {
  zona: string;
  manzana: string;
};

export type SectorRuralInput = {
  latitud?: number | null;
  longitud?: number | null;
  poblacion?: number | null;
};

export type SectorRecord = {
  id: string;
  municipalidadId: string;
  codigo: string;
  departamento: string;
  provincia: string;
  distrito: string;
  centroPoblado: string;
  nombreSector: string;
  tipoSector: TipoSector;
  activo: boolean;
  archivado: boolean;
  urbano?: SectorUrbanoInput | null;
  rural?: SectorRuralInput | null;
};

export type SectorPayload = Omit<SectorRecord, "id" | "activo" | "archivado">;

export type SectorCreateData = SectorPayload & {
  activo: true;
  archivado: false;
};

export type SectoresRepository = {
  list(): Promise<SectorRecord[]>;
  findById(id: string): Promise<{ id: string } | null>;
  findByMunicipalidadAndCodigo(
    municipalidadId: string,
    codigo: string,
  ): Promise<{ id: string } | null>;
  create(data: SectorCreateData): Promise<SectorRecord>;
  update(id: string, data: SectorPayload): Promise<SectorRecord>;
  setActivo(id: string, activo: boolean): Promise<SectorRecord>;
  archive(id: string): Promise<SectorRecord>;
};
