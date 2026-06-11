# Resumen del proyecto: Visitas Domiciliarias

## Objetivo

El sistema de **Visitas Domiciliarias** permitirá administrar el seguimiento de madres con niños menores de 1 año, separados en periodos de atención de **0 a 5 meses** y **6 a 12 meses**.

El sistema debe servir a múltiples municipalidades y permitir que cada una gestione sus grupos de trabajo, actores sociales, sectores, niños asignados, visitas, seguimientos y reportes, respetando el alcance de acceso de cada usuario.

## Principios del sistema

1. **Multi-municipalidad real**
   - Un administrador general podrá ver y administrar todas las municipalidades.
   - Un administrador municipal solo podrá operar la información de su municipalidad.
   - Un actor social tendrá usuario desde la V1, pero sus pantallas operativas se habilitarán en fases posteriores.

2. **Construcción por fases**
   - La documentación contempla el sistema completo.
   - La implementación se divide por fases para entregar una primera versión funcional sin sobrediseñar.

3. **V1 funcional hasta Actor Social**
   - La primera versión llega hasta el mantenimiento esencial de Actor Social.
   - No incluye todavía asignación de sectores al actor social, niños, visitas ni reportes operativos.

4. **Datos trazables y preparados para historial**
   - Se diferencian los conceptos de `estado`, `activo`, `archivado` y `deleted_at`.
   - El historial avanzado se implementará en fases posteriores, pero el diseño de BD debe dejarlo previsto.

## Roles previstos

| Rol | Alcance |
| --- | --- |
| Administrador general | Administra todas las municipalidades, revisa solicitudes globales y configura parámetros generales. |
| Administrador municipal | Administra datos de su municipalidad: grupos, sectores, actores sociales y, en fases posteriores, niños/visitas/reportes. |
| Actor social | Tendrá credenciales desde V1, pero sus funcionalidades operativas se implementarán en fases posteriores. |

## Fases generales

| Fase | Alcance principal |
| --- | --- |
| V1 | Configuración base, usuarios/JWT, grupos de trabajo, establecimientos, miembros administrativos, sectores y actor social esencial. |
| V2 | Asignación territorial: sectores y manzanas a actores sociales. |
| V3 | Niños, responsables, direcciones, asignación/reasignación y visitas. |
| V4 | Reportes, importación/exportación, documentos, actas, adjuntos, auditoría avanzada y notificaciones reales. |
