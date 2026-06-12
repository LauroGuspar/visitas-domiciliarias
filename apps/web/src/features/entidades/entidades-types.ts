export type EntidadRecord = {
  id: string;
  tipoEntidad: string;
  codigo: string;
  nombre: string;
  activo: boolean;
  archivado: boolean;
};

export type EntidadFormState = {
  tipoEntidad: string;
  codigo: string;
  nombre: string;
};
