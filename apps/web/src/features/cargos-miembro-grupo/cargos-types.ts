export type CargoMiembroRecord = {
  id: string;
  nombre: string;
  descripcion: string | null;
  orden: number;
  activo: boolean;
};

export type CargoMiembroFormState = {
  nombre: string;
  descripcion: string;
  orden: string;
};
