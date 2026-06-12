# V1: alcance funcional detallado

## Objetivo de V1

La V1 debe entregar una base administrativa funcional hasta **Actor Social**, sin incluir todavía asignación territorial a actores, niños ni visitas.

## Módulos V1

### 1. Autenticación

Funcionalidades:

- Login por `username` y contraseña.
- Emisión de JWT.
- Validación de usuario activo.
- Restablecer contraseña por enlace enviado por Gmail, como último bloque de V1.

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

- Crear entidad.
- Editar entidad.
- Importación prevista.
- Activar/inactivar.
- Archivar.

Reglas:

- Archivar retira la entidad del uso normal.
- No aplica eliminación con motivo en V1.

### 4. Tipo Actor Social

Funcionalidades:

- Crear tipo de actor social.
- Editar tipo de actor social.
- Mantener tarifas rural/urbana.
- Mantener orden, código y activo.
- Activar/inactivar.
- Archivar.

Reglas:

- Archivar retira el tipo del uso normal.
- No aplica eliminación con motivo en V1.

### 5. Cargo Miembro Grupo

Funcionalidades:

- Crear cargo administrativo.
- Editar cargo administrativo.
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
- Asociar municipalidad.
- Registrar representante.
- Registrar fecha límite y periodo.
- Administrar sus establecimientos y miembros.

Reglas:

- En V1, después de crear el grupo, la administración se concentra en sus miembros y establecimientos.
- No se contempla edición de datos generales, activación/inactivación ni archivado del grupo en V1.
- Los estados quedan preparados en la base de datos, pero no habilitan un flujo funcional adicional en V1.
- No incluye actas, documentos u otros anexos del grupo.

Estados:

- `BORRADOR`
- `REGISTRADO`
- `OBSERVADO`
- `VALIDADO`

### 7. Establecimientos del grupo

Funcionalidades:

- Crear establecimientos asociados al grupo.

Reglas:

- En V1 no se contempla edición ni activación/inactivación de establecimientos.

### 8. Miembros del grupo

Los miembros son personal administrativo del grupo de trabajo, no actores sociales.

Funcionalidades:

- Crear miembro.
- Asociar cargo por catálogo.
- Editar solo establecimiento al que pertenece, teléfono y correo.
- Activar/inactivar.
- Archivar.
- Eliminar lógicamente con motivo.

Regla de eliminación:

- En la interfaz V1, cuando se intente realizar una eliminación, se mostrará un modal con el mensaje "Por Implementar".
- El flujo de eliminación real (aplazado a la V2) constará de:
  1. Apertura de un modal pidiendo el motivo obligatorio de eliminación.
  2. Guardado de `archivado = true`, `deleted_at = now()` y `motivo_eliminacion`.
  3. Muestra del mensaje: "Se ha notificado al administrador".
  4. Evaluación del administrador para su posterior aprobación o rechazo.

### 9. Sectores

Funcionalidades:

- Crear sector.
- Editar sector.
- Activar/inactivar.
- Archivar.
- Eliminar según regla del módulo.
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
- Editar datos administrativos/personales permitidos: grupo de trabajo, email, teléfono, dirección, centro poblado, grado de educación, tipo de entidad y otros datos propios del registro.
- Asociar a tipo actor social.
- Asociar a grupo de trabajo.
- Asociar a entidad.
- Crear usuario y contraseña.
- Cambiar estado.
- Activar/inactivar.
- Archivar.
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
2. Administrar municipalidad/catálogos base con sus reglas de crear, editar, activar/inactivar y archivar cuando aplique.
3. Crear grupos de trabajo y administrar sus establecimientos y miembros según las restricciones de V1.
4. Mantener sectores urbanos/rurales.
5. Registrar actores sociales con usuario y estado, sin asignación territorial en V1.
6. Restablecer contraseña por enlace como último bloque de V1.
7. Respetar alcance por municipalidad en backend.
