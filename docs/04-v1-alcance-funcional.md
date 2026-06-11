# V1: alcance funcional detallado

## Objetivo de V1

La V1 debe entregar una base administrativa funcional hasta **Actor Social**, sin incluir todavía asignación territorial a actores, niños ni visitas.

## Módulos V1

### 1. Autenticación

Funcionalidades:

- Login por `username` y contraseña.
- Emisión de JWT.
- Validación de usuario activo.
- Restablecer contraseña por enlace enviado por Gmail.

Reglas:

- Las contraseñas se guardan hasheadas.
- Las credenciales de Gmail van por `.env`.
- Los tokens de restablecimiento se guardan hasheados, expiran y se invalidan al usarse.

### 2. Municipalidad

Funcionalidades:

- Crear/editar municipalidad según permisos.
- Mantener ubigeo, departamento, provincia, distrito, código, tipo y prioridad.
- Activar/inactivar.

No se espera eliminación frecuente de municipalidades.

### 3. Entidades

Funcionalidades:

- Mantenimiento de entidades.
- Importación prevista.
- Activar/inactivar.

No aplica eliminación con motivo en V1.

### 4. Tipo Actor Social

Funcionalidades:

- Crear/editar tipos de actor social.
- Tarifas rural/urbana.
- Orden, código y activo.

No aplica eliminación con motivo en V1.

### 5. Cargo Miembro Grupo

Funcionalidades:

- Crear/editar cargos administrativos.
- Activar/inactivar.
- Usar como catálogo controlado en miembros del grupo.

Ejemplos:

- Presidente.
- Secretario.
- Coordinador.
- Responsable de actividades.

### 6. Grupo de Trabajo

Funcionalidades:

- Crear grupo.
- Editar grupo.
- Cambiar estado.
- Activar/inactivar.
- Asociar municipalidad.
- Registrar representante.
- Registrar fecha límite y periodo.

Estados:

- `BORRADOR`
- `REGISTRADO`
- `OBSERVADO`
- `VALIDADO`

### 7. Establecimientos del grupo

Funcionalidades:

- Crear/editar establecimientos asociados al grupo.
- Activar/inactivar.

### 8. Miembros del grupo

Los miembros son personal administrativo del grupo de trabajo, no actores sociales.

Funcionalidades:

- Crear/editar miembro.
- Asociar cargo por catálogo.
- Activar/inactivar.
- Eliminar lógicamente con motivo.

Regla de eliminación:

- Al eliminar, el sistema pide motivo obligatorio.
- Guarda `archivado = true`, `deleted_at = now()` y `motivo_eliminacion`.
- Muestra mensaje: “Se notificó al administrador general para su revisión.”
- En V1 no hay notificación real ni aprobación funcional.

### 9. Sectores

Funcionalidades:

- Crear sector.
- Editar sector.
- Activar/inactivar.
- Archivar.
- Registrar datos comunes.
- Registrar datos específicos urbanos o rurales.

Regla:

- Un sector solo puede ser urbano o rural, nunca ambos.

No incluye en V1:

- Asignar sectores a actores sociales.
- Asignar manzanas a actores sociales.
- Sectores por corregir.

### 10. Actor Social

Funcionalidades:

- Crear actor social.
- Editar datos personales/contacto.
- Asociar a tipo actor social.
- Asociar a grupo de trabajo.
- Asociar a entidad.
- Crear usuario y contraseña.
- Cambiar estado.
- Activar/inactivar.
- Eliminar lógicamente con motivo.

Estados previstos:

- `BORRADOR`
- `REGISTRADO`
- `VALIDO`
- `CAPACITADO`
- `APROBADO`

V1 puede usar solo algunos estados, pero la BD queda preparada.

No incluye en V1:

- Asignación de sectores.
- Asignación de manzanas.
- Notas tipo correo.
- Adjuntos.
- Mensajería.
- Niños asignados.
- Visitas.
- Panel operativo del actor social.

## Criterio de aceptación de V1

La V1 se considera funcional si permite:

1. Iniciar sesión con JWT.
2. Restablecer contraseña por enlace.
3. Administrar municipalidad/catálogos base.
4. Crear grupos de trabajo con establecimientos y miembros.
5. Mantener sectores urbanos/rurales.
6. Registrar actores sociales con usuario y estado.
7. Respetar alcance por municipalidad en backend.
