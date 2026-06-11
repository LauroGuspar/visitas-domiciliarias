# Arquitectura técnica

## Stack recomendado

| Capa | Tecnología recomendada | Motivo |
| --- | --- | --- |
| Backend | Node.js + Express + TypeScript | API REST clara, modular y suficiente para un sistema administrativo. |
| ORM | Prisma | Modelado declarativo, migraciones y acceso tipado a PostgreSQL. |
| Base de datos | PostgreSQL | Integridad relacional, restricciones, enums, transacciones y buen soporte para reportes. |
| Frontend | React.js + Vite + TypeScript | App administrativa interna sin necesidad de SEO/SSR desde V1. |
| Infraestructura local | Docker + docker-compose | Entorno reproducible para API, web y BD. |
| Autenticación | JWT | Login stateless con roles y alcance por municipalidad. |
| Correo | Gmail SMTP/API vía variables de entorno | Restablecimiento de contraseña por enlace. |

## Decisión React Vite vs Next.js

Se recomienda **React + Vite** para la V1 porque el sistema es principalmente administrativo e interno. No requiere posicionamiento SEO ni renderizado del lado servidor para páginas públicas.

Next.js queda como alternativa válida si en el futuro se requiere:

- portal público,
- SSR,
- SEO,
- integración fullstack en un solo framework.

Para este proyecto, separar frontend y backend mantiene responsabilidades claras.

## Estructura propuesta del repositorio

```txt
visitas-domiciliarias/
  apps/
    api/                     # Node.js + Express + TypeScript
      src/
        modules/
          auth/
          municipalidades/
          entidades/
          tipos-actor-social/
          grupos-trabajo/
          sectores/
          actores-sociales/
        shared/
        prisma/
      prisma/
        schema.prisma
        migrations/
    web/                     # React + Vite + TypeScript
      src/
        pages/
        components/
        features/
        services/
        routes/
  packages/
    shared/                  # Opcional: tipos/esquemas compartidos
  docs/
  docker-compose.yml
  .env.example
```

## Backend

El backend se organizará por módulos de dominio. Cada módulo debe agrupar:

- rutas,
- controladores,
- servicios,
- validaciones,
- acceso a datos mediante Prisma,
- pruebas específicas cuando se implemente código.

Módulos V1 sugeridos:

- `auth`
- `usuarios`
- `municipalidades`
- `entidades`
- `tipos-actor-social`
- `cargos-miembro-grupo`
- `grupos-trabajo`
- `establecimientos`
- `miembros-grupo`
- `sectores`
- `actores-sociales`

## Frontend

El frontend será una SPA administrativa con React + Vite.

En V1 debe cubrir:

- login,
- restablecer contraseña,
- layout administrativo,
- mantenimiento de catálogos base,
- grupo de trabajo,
- establecimientos,
- miembros,
- sectores,
- actores sociales.

Los paneles de actor social, programación de visita y visitas programadas quedan para fases posteriores.

## Docker

`docker-compose` debe contemplar al menos:

- `postgres`: base de datos PostgreSQL,
- `api`: backend Express,
- `web`: frontend Vite,
- volumen persistente para PostgreSQL.

## Variables de entorno

Las credenciales y secretos deben ir en `.env`, nunca hardcodeados ni escritos en documentación sensible.

Variables previstas:

```env
DATABASE_URL=
JWT_ACCESS_SECRET=
JWT_REFRESH_SECRET=
JWT_ACCESS_EXPIRES_IN=
JWT_REFRESH_EXPIRES_IN=
APP_WEB_URL=
GMAIL_USER=
GMAIL_CLIENT_ID=
GMAIL_CLIENT_SECRET=
GMAIL_REFRESH_TOKEN=
```

Se debe versionar solo `.env.example`.
