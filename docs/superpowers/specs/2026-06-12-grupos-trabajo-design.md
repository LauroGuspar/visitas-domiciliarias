# Diseño: Módulo Grupos de Trabajo (`features/grupos-trabajo`)

Este documento detalla el diseño técnico para la implementación del módulo de **Grupos de Trabajo** en el frontend, que incluye el listado general de grupos, la creación de grupos, la vista de detalle de un grupo, la creación de establecimientos y el CRUD administrativo de sus miembros (con edición limitada y la acción de eliminación diferida mediante modal "Por Implementar").

---

## 1. Estructura de Archivos del Módulo

Se agrupará toda la lógica de la feature en `apps/web/src/features/grupos-trabajo/`:

*   **`grupos-types.ts`**: Definición de tipos TypeScript para grupos, establecimientos y miembros.
*   **`grupos-api.ts`**: Cliente API que interactúa con `/api/v1/grupos-trabajo`.
*   **`grupos-utils.ts`**: Funciones auxiliares de filtrado y mapeo de datos.
*   **`pages/GruposPage.tsx`**: Vista de listado general de grupos de trabajo con filtros y modal para la creación de un nuevo grupo.
*   **`pages/GrupoDetailPage.tsx`**: Vista detallada de un grupo que contiene la información general, el listado y creación de establecimientos, y la administración de los miembros.

---

## 2. Tipos de Datos (`grupos-types.ts`)

```typescript
export type EstadoGrupoTrabajo = "BORRADOR" | "REGISTRADO" | "OBSERVADO" | "VALIDADO";

export type GrupoTrabajoRecord = {
  id: string;
  municipalidadId: string;
  fechaLimite: string; // ISO date string
  nombreGrupo: string;
  periodoYear: number;
  dniRepresentante: string;
  nombreRepresentante: string;
  apellidosRepresentante: string;
  estado: EstadoGrupoTrabajo;
  activo: boolean;
  archivado: boolean;
};

export type GrupoEstablecimientoRecord = {
  id: string;
  grupoTrabajoId: string;
  nombre: string;
  codigo: string | null;
  direccion: string | null;
  activo: boolean;
};

export type MiembroGrupoRecord = {
  id: string;
  grupoTrabajoId: string;
  grupoEstablecimientoId: string | null;
  cargoMiembroGrupoId: string;
  dni: string;
  nombres: string;
  apellidos: string;
  celular: string | null;
  email: string | null;
  activo: boolean;
  archivado: boolean;
};

export type GrupoTrabajoFormState = {
  municipalidadId: string;
  fechaLimite: string;
  nombreGrupo: string;
  periodoYear: string;
  dniRepresentante: string;
  nombreRepresentante: string;
  apellidosRepresentante: string;
};

export type GrupoEstablecimientoFormState = {
  nombre: string;
  codigo: string;
  direccion: string;
};

export type MiembroGrupoFormState = {
  grupoEstablecimientoId: string;
  cargoMiembroGrupoId: string;
  dni: string;
  nombres: string;
  apellidos: string;
  celular: string;
  email: string;
};
```

---

## 3. Integración con la API (`grupos-api.ts`)

Endpoints expuestos por el backend:
*   `GET /grupos-trabajo`: Lista todos los grupos de trabajo.
*   `POST /grupos-trabajo`: Crea un nuevo grupo.
*   `POST /grupos-trabajo/:grupoId/establecimientos`: Agrega un establecimiento a un grupo.
*   `POST /grupos-trabajo/:grupoId/miembros`: Agrega un miembro a un grupo.
*   `PATCH /grupos-trabajo/:grupoId/miembros/:miembroId/contacto`: Edita los campos de contacto de un miembro (establecimiento, celular, email).
*   `PATCH /grupos-trabajo/:grupoId/miembros/:miembroId/activo`: Activa/desactiva a un miembro.

---

## 4. Flujo y Comportamiento por Pantalla

### 4.1. Listado de Grupos (`GruposPage.tsx`)
*   Se mapeará en la ruta `/grupos-trabajo` en `AppRouter.tsx`.
*   **Boton Filtros**: Abre un panel superior que permite filtrar localmente por:
    *   `Estado` (Todos / Borrador / Registrado / Observado / Validado).
    *   `Periodo` (Todos / Años detectados).
    *   `Municipalidad` (Todos / Lista de municipalidades activas - visible solo si el usuario logueado es `ADMIN_GENERAL`).
*   **Creación de Grupo**:
    *   Muestra modal con formulario.
    *   Si es `ADMIN_MUNICIPAL`, la municipalidad se asocia automáticamente usando `user.municipalidadId` (sin mostrar el campo en el formulario).
    *   Si es `ADMIN_GENERAL`, se muestra un dropdown obligatorio para elegir la municipalidad (cargada de `listMunicipalidades()`, mostrando solo las activas).
    *   Validaciones: DNI de 8 dígitos, periodo numérico entre 2000 y 32767.

### 4.2. Detalle de Grupo (`GrupoDetailPage.tsx`)
*   Se mapeará en la ruta `/grupos-trabajo/:id` en `AppRouter.tsx`.
*   **Información General**: Muestra en un panel lateral o superior los metadatos del grupo.
*   **Gestión de Establecimientos**:
    *   Muestra tabla con columnas: Nombre, Código, Dirección.
    *   Botón "+ Agregar establecimiento" abre un modal.
*   **Gestión de Miembros**:
    *   Muestra tabla con: DNI, Nombre Completo, Cargo, Establecimiento, Contacto (Celular / Email), Estado y Acciones.
    *   Botón "+ Agregar miembro" abre un modal de creación (DNI de 8 dígitos obligatorio, Cargo obligatorio de lista, Establecimiento de lista opcional, Celular de 9 dígitos opcional).
    *   **Edición de Miembro (Limitada)**: Abre el modal pero solo habilita modificar: `Establecimiento`, `Celular`, `Email`. Los campos DNI, nombres y cargo se muestran deshabilitados para cumplir con las reglas de V1.
    *   **Activar/Inactivar**: Alterna el estado activo con una confirmación `window.confirm`.
    *   **Eliminación (Visual)**: Al hacer clic en eliminar, se abre un modal diciendo **"Por Implementar"** (con el texto explicativo de que esta acción se diferirá a la V2) en lugar de proceder con la llamada DELETE del backend.

---

## 5. Filtros Dinámicos
Los filtros se realizarán localmente sobre los arreglos de datos recuperados para maximizar la velocidad de la interfaz, utilizando selectores nativos y aplicando clases CSS unificadas (`admin-filters-panel`, `admin-table`, etc.).
