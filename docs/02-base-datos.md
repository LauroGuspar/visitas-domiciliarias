# Base de datos PostgreSQL

## Criterios generales

1. Usar claves primarias `id` autoincrementales o UUID según se defina al implementar. Para V1 se recomienda UUID si se prevé integración/importación futura; si se prioriza simplicidad, `BIGSERIAL` también es válido.
2. Usar `created_at` y `updated_at` en tablas principales.
3. Diferenciar claramente:
   - `estado`: flujo funcional.
   - `activo`: habilitación operativa.
   - `archivado`: retiro del uso normal.
   - `deleted_at`: fecha de eliminación lógica o solicitud de eliminación.
4. El backend debe aplicar filtros por `municipalidad_id`; no confiar solo en el frontend.
5. Mantener integridad con foreign keys, índices únicos y checks.

## Seguridad y usuarios

### usuario

| Campo | Tipo | Notas |
| --- | --- | --- |
| id | UUID/BIGSERIAL | PK |
| municipalidad_id | FK nullable | Null permitido para administrador general si aplica. |
| username | VARCHAR(80) | Único. Identificador de login. |
| password_hash | TEXT | Nunca guardar contraseña plana. |
| rol | ENUM | `ADMIN_GENERAL`, `ADMIN_MUNICIPAL`, `ACTOR_SOCIAL`. |
| activo | BOOLEAN | Habilita/deshabilita acceso. |
| ultimo_login_at | TIMESTAMP | Opcional. |
| created_at | TIMESTAMP | Auditoría básica. |
| updated_at | TIMESTAMP | Auditoría básica. |

### password_reset_token

| Campo | Tipo | Notas |
| --- | --- | --- |
| id | UUID/BIGSERIAL | PK |
| usuario_id | FK | Usuario solicitante. |
| token_hash | TEXT | Guardar hash del token, no el token plano. |
| expires_at | TIMESTAMP | Expiración obligatoria. |
| used_at | TIMESTAMP nullable | Se marca al usar el enlace. |
| created_at | TIMESTAMP | Auditoría básica. |

## Configuración

### municipalidad

| Campo | Tipo | Notas |
| --- | --- | --- |
| id | UUID/BIGSERIAL | PK |
| ubigeo | VARCHAR(6) | Código ubigeo. |
| departamento | VARCHAR(100) | Puede completarse desde API de ubigeo. |
| provincia | VARCHAR(100) | Puede completarse desde API de ubigeo. |
| distrito | VARCHAR(100) | Puede completarse desde API de ubigeo. |
| codigo | VARCHAR(3) | Código interno. |
| nombre | VARCHAR(150) | Nombre de municipalidad. |
| tipo | ENUM | `PROVINCIAL`, `DISTRITAL`. |
| prioridad | SMALLINT | Orden/prioridad. |
| activo | BOOLEAN | Habilitación operativa. |
| archivado | BOOLEAN | Retiro lógico simple. |
| created_at | TIMESTAMP | Auditoría básica. |
| updated_at | TIMESTAMP | Auditoría básica. |

### entidad

Catálogo importable de entidades.

| Campo | Tipo | Notas |
| --- | --- | --- |
| id | UUID/BIGSERIAL | PK |
| tipo_entidad | ENUM/VARCHAR | Tipo controlado. |
| codigo | VARCHAR(100) | Código de entidad. |
| nombre | VARCHAR(150) | Nombre. |
| activo | BOOLEAN | Habilitación operativa. |
| created_at | TIMESTAMP | Auditoría básica. |
| updated_at | TIMESTAMP | Auditoría básica. |

### tipo_actor_social

| Campo | Tipo | Notas |
| --- | --- | --- |
| id | UUID/BIGSERIAL | PK |
| tipo_actor | VARCHAR(150) | Nombre del tipo. |
| tarifa_rural | NUMERIC(10,2) | Pago por visita rural. |
| tarifa_urbana | NUMERIC(10,2) | Pago por visita urbana. |
| orden | SMALLINT | Orden de visualización. |
| codigo | VARCHAR(3) | Código. |
| activo | BOOLEAN | Habilitación operativa. |
| archivado | BOOLEAN | Retiro lógico simple. |
| created_at | TIMESTAMP | Auditoría básica. |
| updated_at | TIMESTAMP | Auditoría básica. |

### cargo_miembro_grupo

Catálogo controlado para miembros administrativos del grupo.

| Campo | Tipo | Notas |
| --- | --- | --- |
| id | UUID/BIGSERIAL | PK |
| nombre | VARCHAR(100) | Presidente, secretario, coordinador, responsable de actividades, etc. |
| descripcion | TEXT | Opcional. |
| orden | SMALLINT | Orden de visualización. |
| activo | BOOLEAN | Habilitación operativa. |
| created_at | TIMESTAMP | Auditoría básica. |
| updated_at | TIMESTAMP | Auditoría básica. |

## Grupo de trabajo

### grupo_trabajo

| Campo | Tipo | Notas |
| --- | --- | --- |
| id | UUID/BIGSERIAL | PK |
| municipalidad_id | FK | Municipalidad propietaria. |
| fecha_limite | DATE | Fecha límite para inicio de actividades. |
| nombre_grupo | VARCHAR(150) | Nombre del grupo. |
| periodo_year | SMALLINT | Año de periodo. |
| dni_representante | VARCHAR(8) | DNI del representante. |
| nombre_representante | VARCHAR(150) | Nombres. |
| apellidos_representante | VARCHAR(200) | Apellidos. |
| estado | ENUM | `BORRADOR`, `REGISTRADO`, `OBSERVADO`, `VALIDADO`. |
| activo | BOOLEAN | Habilitación operativa. |
| archivado | BOOLEAN | Retiro lógico simple. |
| created_at | TIMESTAMP | Auditoría básica. |
| updated_at | TIMESTAMP | Auditoría básica. |

### grupo_establecimiento

Establecimientos asociados al grupo de trabajo. Funcional en V1.

| Campo | Tipo | Notas |
| --- | --- | --- |
| id | UUID/BIGSERIAL | PK |
| grupo_trabajo_id | FK | Grupo propietario. |
| nombre | VARCHAR(150) | Nombre del establecimiento. |
| codigo | VARCHAR(50) | Opcional. |
| direccion | VARCHAR(200) | Opcional. |
| activo | BOOLEAN | Habilitación operativa. |
| created_at | TIMESTAMP | Auditoría básica. |
| updated_at | TIMESTAMP | Auditoría básica. |

### miembro_grupo

Miembros administrativos del grupo. No son actores sociales y no tienen login en V1.

| Campo | Tipo | Notas |
| --- | --- | --- |
| id | UUID/BIGSERIAL | PK |
| grupo_trabajo_id | FK | Grupo propietario. |
| cargo_miembro_grupo_id | FK | Cargo controlado por catálogo. |
| dni | VARCHAR(8) | Documento. |
| nombres | VARCHAR(150) | Nombres. |
| apellidos | VARCHAR(200) | Apellidos. |
| celular | VARCHAR(9) | Opcional. |
| email | VARCHAR(150) | Opcional. |
| activo | BOOLEAN | Habilitación operativa. |
| archivado | BOOLEAN | Retiro lógico. |
| deleted_at | TIMESTAMP nullable | Eliminación lógica. |
| motivo_eliminacion | TEXT nullable | Obligatorio cuando se elimina. |
| created_at | TIMESTAMP | Auditoría básica. |
| updated_at | TIMESTAMP | Auditoría básica. |

Dependientes posteriores del grupo:

- `acta_grupo`
- `documento_grupo` / `otros_documentos`

No son funcionales en V1.

## Sectores

### Regla principal

Un sector puede ser **urbano o rural**, nunca ambos.

Se recomienda modelo padre + hijas 1:1:

- `sector`: datos comunes.
- `sector_urbano`: datos específicos de urbano.
- `sector_rural`: datos específicos de rural.

La exclusividad debe validarse en la aplicación y, si es posible, reforzarse con restricciones/triggers en PostgreSQL.

### sector

| Campo | Tipo | Notas |
| --- | --- | --- |
| id | UUID/BIGSERIAL | PK |
| municipalidad_id | FK | Municipalidad propietaria. |
| codigo | VARCHAR(100) | Código territorial. |
| departamento | VARCHAR(100) | Ubicación. |
| provincia | VARCHAR(100) | Ubicación. |
| distrito | VARCHAR(100) | Ubicación. |
| centro_poblado | VARCHAR(100) | Centro poblado. |
| nombre_sector | VARCHAR(100) | Nombre del sector. |
| tipo_sector | ENUM | `URBANO`, `RURAL`. |
| activo | BOOLEAN | Habilitación operativa. |
| archivado | BOOLEAN | Retiro lógico simple. |
| created_at | TIMESTAMP | Auditoría básica. |
| updated_at | TIMESTAMP | Auditoría básica. |

### sector_rural

| Campo | Tipo | Notas |
| --- | --- | --- |
| sector_id | FK/PK | Relación 1:1 con `sector`. |
| latitud | DOUBLE PRECISION | Opcional. |
| longitud | DOUBLE PRECISION | Opcional. |
| poblacion | INTEGER | Opcional. |

### sector_urbano

| Campo | Tipo | Notas |
| --- | --- | --- |
| sector_id | FK/PK | Relación 1:1 con `sector`. |
| zona | VARCHAR(3) | Zona censal. |
| manzana | VARCHAR(10) | Manzana censal. |

## Actor Social

### actor_social

En V1 tendrá mantenimiento esencial completo y usuario/contraseña, pero no asignación de sectores.

| Campo | Tipo | Notas |
| --- | --- | --- |
| id | UUID/BIGSERIAL | PK |
| usuario_id | FK nullable/unique | Usuario de sistema asociado. |
| municipalidad_id | FK | Alcance municipal. |
| tipo_actor_social_id | FK | Tipo de actor. |
| grupo_trabajo_id | FK | Grupo asociado. |
| entidad_id | FK nullable | Entidad asociada. |
| dni | VARCHAR(8) | Documento. |
| nombres | VARCHAR(150) | Nombres. |
| apellidos | VARCHAR(150) | Apellidos. |
| direccion | VARCHAR(200) | Dirección. |
| fecha_nac | DATE | Fecha de nacimiento. |
| email | VARCHAR(150) | Contacto. |
| celular | VARCHAR(9) | Contacto. |
| idioma_origen | ENUM/VARCHAR | Valor controlado. |
| grado_instruccion | ENUM/VARCHAR | Valor controlado. |
| estado | ENUM | `BORRADOR`, `REGISTRADO`, `VALIDO`, `CAPACITADO`, `APROBADO`. |
| activo | BOOLEAN | Habilitación operativa. |
| archivado | BOOLEAN | Retiro lógico. |
| deleted_at | TIMESTAMP nullable | Eliminación lógica. |
| motivo_eliminacion | TEXT nullable | Obligatorio cuando se elimina. |
| created_at | TIMESTAMP | Auditoría básica. |
| updated_at | TIMESTAMP | Auditoría básica. |

### Importante: `estado` vs `activo`

- `estado` representa el flujo funcional del actor social.
- `activo` representa si el registro está habilitado para operar.
- No deben confundirse.

## Tablas para fases posteriores

### Asignación territorial V2

- `actor_social_sector`
- `actor_social_manzana`
- reglas de sectores por corregir

### Niños y responsables V3

- `nino`
- `responsable_nino`
- `direccion_referencia`
- `historial_direccion`
- `asignacion_nino_actor`
- `historial_reasignacion`

### Visitas V3

- `programacion_visita`
- `intervencion_visita`
- `seguimiento_visita`

### Reportes y documentos V4

- `acta_grupo`
- `documento_grupo`
- adjuntos
- reportes materializados o vistas según necesidad
- auditoría avanzada
- notificaciones reales
