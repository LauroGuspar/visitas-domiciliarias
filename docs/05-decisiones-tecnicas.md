# Decisiones técnicas

## 1. Arquitectura base

Se aprueba una arquitectura tipo **modular monolith** con frontend y backend separados:

- `apps/api`: Node.js + Express + TypeScript + Prisma.
- `apps/web`: React + Vite + TypeScript.
- `packages/shared`: opcional para tipos o validaciones compartidas.

Motivo:

- Mantiene separación clara entre API y UI.
- Permite desarrollar por módulos.
- Evita la complejidad de microservicios.
- Permite crecer sin rehacer la estructura inicial.

## 2. PostgreSQL + Prisma

Se usará PostgreSQL por su fortaleza relacional y Prisma por:

- migraciones,
- esquema declarativo,
- cliente tipado,
- integración natural con Node.js/TypeScript.

## 3. React Vite en lugar de Next.js

Se recomienda React + Vite porque:

- el sistema es administrativo interno,
- no requiere SEO en V1,
- no requiere SSR,
- simplifica despliegue y desarrollo inicial,
- mantiene el backend Express como fuente única de API.

Next.js queda como alternativa futura si aparece un portal público o necesidad de SSR/SEO.

## 4. JWT

La autenticación usará JWT.

Recomendación:

- access token de corta duración,
- refresh token de mayor duración,
- almacenamiento seguro según se defina al implementar,
- invalidación/rotación de refresh token en fases posteriores si se requiere mayor seguridad.

El token puede contener:

- `user_id`,
- `rol`,
- `municipalidad_id`,
- `actor_social_id` si aplica.

El backend siempre debe validar permisos y alcance en servidor.

## 5. Restablecimiento de contraseña

Se hará por enlace enviado vía Gmail.

Reglas:

- Las credenciales de Gmail van en `.env`.
- El token de recuperación debe expirar.
- El token se guarda hasheado.
- El enlace se invalida al usarse.

## 6. Multi-municipalidad

El sistema es multi-municipalidad real.

Reglas:

- `ADMIN_GENERAL`: puede operar todas las municipalidades.
- `ADMIN_MUNICIPAL`: solo su municipalidad.
- `ACTOR_SOCIAL`: tendrá usuario desde V1, pero permisos operativos reales en fases posteriores.

Las consultas del backend deben filtrar por municipalidad.

## 7. Sector urbano/rural

Decisión:

- `sector` como tabla padre.
- `sector_urbano` y `sector_rural` como hijas 1:1.
- Un sector es urbano o rural, nunca ambos.

## 8. Estado vs activo

No se deben confundir:

- `estado`: flujo funcional o etapa del registro.
- `activo`: disponibilidad operativa.

Ejemplo en actor social:

- `estado = CAPACITADO` indica etapa funcional.
- `activo = false` indica que no puede operar temporalmente.

## 9. Archivado y deleted_at

Se usarán ambos conceptos cuando aplique:

- `archivado`: retiro del uso normal.
- `deleted_at`: fecha/hora de eliminación lógica.

En V1, el flujo con motivo aplica solo a:

- `actor_social`,
- `miembro_grupo`.

Flujo V1:

1. Usuario intenta eliminar.
2. Sistema solicita motivo obligatorio.
3. Guarda `archivado`, `deleted_at` y `motivo_eliminacion`.
4. Muestra mensaje de notificación al administrador general.
5. No envía notificación real todavía.

Fase posterior:

- solicitud pendiente,
- notificación real,
- aprobación/rechazo del administrador general,
- historial de decisión.

## 10. Miembro grupo vs Actor Social

`miembro_grupo` y `actor_social` son entidades distintas.

- `miembro_grupo`: personal administrativo del grupo, sin login en V1.
- `actor_social`: visitador/agente operativo, con usuario desde V1.

Los cargos de miembro se controlan con catálogo `cargo_miembro_grupo`.
