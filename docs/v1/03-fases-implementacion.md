# Fases de implementación

## Enfoque

La documentación describe el sistema completo, pero la construcción se realizará por fases.

Esto permite que la V1 sea útil y entregable sin bloquearse por funcionalidades futuras como visitas, reportes o auditoría avanzada.

## V1: hasta Actor Social esencial

### Objetivo

Entregar una primera versión administrativa que permita configurar la municipalidad y mantener las entidades necesarias hasta registrar actores sociales.

### Incluye

1. Autenticación base
   - Login con `username` y contraseña.
   - JWT.
   - El restablecimiento de contraseña por enlace enviado vía Gmail queda al final de V1, después de cerrar los módulos administrativos principales.

2. Usuarios y roles mínimos
   - Administrador general.
   - Administrador municipal.
   - Actor social con usuario creado, pero sin pantallas operativas todavía.

3. Configuración base
   - Municipalidad.
   - Entidades: crear, editar, activar/inactivar y archivar.
   - Tipo actor social: crear, editar, activar/inactivar y archivar.
   - Cargo miembro grupo: crear, editar y activar/inactivar.

4. Grupo de trabajo
   - Crear grupo.
   - Administrar sus establecimientos y miembros.
   - No se contempla edición de datos generales, activación/inactivación ni archivado del grupo en V1.
   - Estados preparados: `BORRADOR`, `REGISTRADO`, `OBSERVADO`, `VALIDADO`.
   - No incluye actas ni otros documentos del grupo en V1.

5. Establecimientos del grupo
   - Crear establecimientos asociados al grupo.
   - No se contempla edición ni activación/inactivación de establecimientos en V1.

6. Miembros del grupo
   - Crear miembros administrativos.
   - Editar solo establecimiento al que pertenece, teléfono y correo.
   - Activar/inactivar.

7. Sectores
   - Crear, editar, activar/inactivar, archivar y eliminar según regla del módulo.
   - Sector padre.
   - Sector urbano.
   - Sector rural.
   - Regla: un sector es urbano o rural, nunca ambos.

8. Actor social
   - Mantenimiento esencial completo.
   - Usuario y contraseña.
   - Estados previstos.
   - Editar datos administrativos/personales permitidos: grupo de trabajo, email, teléfono, dirección, centro poblado, grado de educación, tipo de entidad y otros datos propios del registro.
   - Activar/inactivar y archivar.
   - Sin asignación de sectores ni manzanas en V1.

### No incluye

- Asignación de sectores a actores sociales.
- Asignación de manzanas.
- Niños.
- Responsables.
- Visitas.
- Reportes.
- Actas y otros documentos del grupo.
- Notificaciones reales.
- Aprobación funcional de eliminaciones por administrador general.

## V2: asignación territorial

### Objetivo

Permitir asignar territorios a actores sociales.

### Incluye

- Asignación de sectores a actores sociales.
- Asignación de manzanas cuando aplique.
- Detección de sectores por corregir.
- Preparación para asignación de niños por territorio.

## V3: niños, responsables y visitas

### Objetivo

Implementar el flujo operativo de seguimiento.

### Incluye

- Registro/importación de niños.
- Responsables del niño.
- Dirección referencial y dirección actual.
- Historial de ubicación/responsable/dirección.
- Asignación individual y masiva de niños a actor social.
- Programación de visitas por periodo.
- Registro de visita o seguimiento.
- Paneles del actor social.

## V4: reportes, documentos y auditoría avanzada

### Objetivo

Completar capacidades administrativas y de control.

### Incluye

- Reporte de actividad.
- Detalle por niño.
- Detalle por actor social.
- Reporte de número de visitas.
- Importación/exportación completa.
- Actas del grupo.
- Otros documentos.
- Adjuntos.
- Notas/mensajería.
- Notificación real al administrador general.
- Aprobación/rechazo de solicitudes de eliminación.
- Auditoría avanzada.
