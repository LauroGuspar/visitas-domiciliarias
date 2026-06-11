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
   - Restablecimiento de contraseña por enlace enviado vía Gmail.

2. Usuarios y roles mínimos
   - Administrador general.
   - Administrador municipal.
   - Actor social con usuario creado, pero sin pantallas operativas todavía.

3. Configuración base
   - Municipalidad.
   - Entidades.
   - Tipo actor social.
   - Cargo miembro grupo.

4. Grupo de trabajo
   - Mantenimiento completo.
   - Estados: `BORRADOR`, `REGISTRADO`, `OBSERVADO`, `VALIDADO`.
   - Establecimientos funcionales.
   - Miembros administrativos funcionales.

5. Sectores
   - Mantenimiento completo.
   - Sector padre.
   - Sector urbano.
   - Sector rural.
   - Regla: un sector es urbano o rural, nunca ambos.

6. Actor social
   - Mantenimiento esencial completo.
   - Usuario y contraseña.
   - Estados previstos.
   - Sin asignación de sectores.

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
