El backend de la V1 (Express + Prisma + Postgres) ya está 100% finalizado y validado. Ahora debemos implementar el Frontend V1 en la aplicación React + Vite (`apps/web`).

### 1. Estado Actual de la Aplicación y Arquitectura
- **Stack**: React (v19), Vite, TypeScript.
- **Rutas del Backend**: La URL base es `/api/v1` y requiere autenticación Bearer Token (JWT) en la mayoría de sus endpoints.

### 2. Flujo de Pantallas y Funcionalidades a Desarrollar en V1
Debes implementar una estructura de vistas y ruteo (puedes instalar `react-router-dom` si lo consideras adecuado):

1. **Flujo de Autenticación**:
   - **Login**: Formulario de login (`username` y `password`). Debe guardar el token JWT en localStorage o sessionStorage, y restaurar la sesión al recargar la página.
   - **Recuperación de Contraseña**:
     - Vista para solicitar restablecimiento (ingresando `email`). Llama a `POST /api/v1/auth/forgot-password`.
     - Vista de ingreso de nueva contraseña (`/reset-password?token=XYZ`). Debe validar visualmente y en tiempo real la fortaleza de la nueva contraseña (mínimo 8 caracteres, al menos una mayúscula, una minúscula, un número y un carácter especial: _, $, *, @, #). Llama a `POST /api/v1/auth/reset-password`.

2. **Diseño de Layout Principal (Dashboard / Shell)**:
   - Panel de navegación superior responsivo.
   - Debe variar las secciones visibles en base al rol decodificado del JWT (`ADMIN_GENERAL` o `ADMIN_MUNICIPAL`).
   - Botón para cerrar sesión (logout) que limpie los tokens de forma segura.

3. **Vistas para ADMIN_GENERAL (Mantenimiento Global)**:
   - **Municipalidades**: Tabla para ver listado, y formulario modal/vista para crear/editar municipalidad (ubigeo, departamento, provincia, distrito, código, tipo y prioridad), y toggle para activar/desactivar.
   - **Entidades**: Listado, creación, edición, toggle de activación y botón de archivar.
   - **Tipos de Actor Social**: Formulario de tarifas (rural/urbano), código, orden, toggle de activación y botón de archivar.
   - **Cargos de Miembro**: Crear, editar y activar/desactivar.

4. **Vistas para ADMIN_MUNICIPAL (Gestión Municipal)**:
   - **Grupos de Trabajo**:
     - Listado y creación de grupo.
     - Sección de detalles del grupo donde se administren sus **Establecimientos** (creación) y **Miembros del grupo** (creación, edición de teléfono/correo, toggle activo/inactivo).
     - **Regla de eliminación de Miembro**: Al hacer clic en eliminar, debe aparecer un modal de "Por Implementar" (por regla funcional de la V1).
   - **Sectores**:
     - Listado y creación/edición de sectores.
     - Formulario con toggle estricto entre Urbano (pide zona y manzana) y Rural (pide latitud, longitud y población), validando la exclusividad.
   - **Actores Sociales**:
     - Listado de actores de la municipalidad.
     - Formulario de creación: pide datos personales generales, grupo de trabajo, tipo de actor, entidad y datos de cuenta (`username` y `password`, validando la fortaleza de la contraseña).
     - Formulario de edición de datos personales/administrativos permitidos.
     - Acciones rápidas: toggle de activación, selector para cambiar su estado funcional (`BORRADOR`, `REGISTRADO`, `VALIDO`, `CAPACITADO`, `APROBADO`), botón de archivar.
     - **Regla de eliminación de Actor**: Al hacer clic en eliminar, debe aparecer un modal de "Por Implementar" (por regla de V1).

### 3. Tareas Técnicas Iniciales
Para empezar, por favor implementa lo siguiente:
1. Instala `react-router-dom` (o define un router simple por estados si prefieres) y cualquier dependencia de iconos livianos.
2. Crea el cliente de API (`apps/web/src/shared/api.ts`) que maneje los fetchs de forma centralizada inyectando el header `Authorization: Bearer <token>` cuando esté presente, e interceptando errores 401 para hacer logout automático.
3. Configura el sistema de rutas principales (`/login`, `/forgot-password`, `/reset-password`, y el dashboard con rutas hijas protegidas).
4. Crea la hoja de estilos base con un diseño estético premium (usa fuentes de Google Fonts, variables CSS para modo oscuro/claro y transiciones fluidas en botones e inputs).

Comencemos implementando la infraestructura de API, el ruteo básico y la pantalla de Login y Recuperación de Contraseña.
