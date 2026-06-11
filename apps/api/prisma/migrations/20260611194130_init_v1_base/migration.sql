-- CreateEnum
CREATE TYPE "RolUsuario" AS ENUM ('ADMIN_GENERAL', 'ADMIN_MUNICIPAL', 'ACTOR_SOCIAL');

-- CreateEnum
CREATE TYPE "TipoMunicipalidad" AS ENUM ('PROVINCIAL', 'DISTRITAL');

-- CreateEnum
CREATE TYPE "EstadoGrupoTrabajo" AS ENUM ('BORRADOR', 'REGISTRADO', 'OBSERVADO', 'VALIDADO');

-- CreateEnum
CREATE TYPE "TipoSector" AS ENUM ('URBANO', 'RURAL');

-- CreateEnum
CREATE TYPE "EstadoActorSocial" AS ENUM ('BORRADOR', 'REGISTRADO', 'VALIDO', 'CAPACITADO', 'APROBADO');

-- CreateTable
CREATE TABLE "usuario" (
    "id" UUID NOT NULL,
    "municipalidad_id" UUID,
    "username" VARCHAR(80) NOT NULL,
    "password_hash" TEXT NOT NULL,
    "rol" "RolUsuario" NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "ultimo_login_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "password_reset_token" (
    "id" UUID NOT NULL,
    "usuario_id" UUID NOT NULL,
    "token_hash" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "used_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "password_reset_token_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "municipalidad" (
    "id" UUID NOT NULL,
    "ubigeo" VARCHAR(6) NOT NULL,
    "departamento" VARCHAR(100) NOT NULL,
    "provincia" VARCHAR(100) NOT NULL,
    "distrito" VARCHAR(100) NOT NULL,
    "codigo" VARCHAR(3) NOT NULL,
    "nombre" VARCHAR(150) NOT NULL,
    "tipo" "TipoMunicipalidad" NOT NULL,
    "prioridad" SMALLINT NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "archivado" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "municipalidad_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "entidad" (
    "id" UUID NOT NULL,
    "tipo_entidad" VARCHAR(100) NOT NULL,
    "codigo" VARCHAR(100) NOT NULL,
    "nombre" VARCHAR(150) NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "entidad_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tipo_actor_social" (
    "id" UUID NOT NULL,
    "tipo_actor" VARCHAR(150) NOT NULL,
    "tarifa_rural" DECIMAL(10,2) NOT NULL,
    "tarifa_urbana" DECIMAL(10,2) NOT NULL,
    "orden" SMALLINT NOT NULL,
    "codigo" VARCHAR(3) NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "archivado" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tipo_actor_social_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cargo_miembro_grupo" (
    "id" UUID NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "descripcion" TEXT,
    "orden" SMALLINT NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cargo_miembro_grupo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "grupo_trabajo" (
    "id" UUID NOT NULL,
    "municipalidad_id" UUID NOT NULL,
    "fecha_limite" DATE NOT NULL,
    "nombre_grupo" VARCHAR(150) NOT NULL,
    "periodo_year" SMALLINT NOT NULL,
    "dni_representante" VARCHAR(8) NOT NULL,
    "nombre_representante" VARCHAR(150) NOT NULL,
    "apellidos_representante" VARCHAR(200) NOT NULL,
    "estado" "EstadoGrupoTrabajo" NOT NULL DEFAULT 'BORRADOR',
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "archivado" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "grupo_trabajo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "grupo_establecimiento" (
    "id" UUID NOT NULL,
    "grupo_trabajo_id" UUID NOT NULL,
    "nombre" VARCHAR(150) NOT NULL,
    "codigo" VARCHAR(50),
    "direccion" VARCHAR(200),
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "grupo_establecimiento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "miembro_grupo" (
    "id" UUID NOT NULL,
    "grupo_trabajo_id" UUID NOT NULL,
    "cargo_miembro_grupo_id" UUID NOT NULL,
    "dni" VARCHAR(8) NOT NULL,
    "nombres" VARCHAR(150) NOT NULL,
    "apellidos" VARCHAR(200) NOT NULL,
    "celular" VARCHAR(9),
    "email" VARCHAR(150),
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "archivado" BOOLEAN NOT NULL DEFAULT false,
    "deleted_at" TIMESTAMP(3),
    "motivo_eliminacion" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "miembro_grupo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sector" (
    "id" UUID NOT NULL,
    "municipalidad_id" UUID NOT NULL,
    "codigo" VARCHAR(100) NOT NULL,
    "departamento" VARCHAR(100) NOT NULL,
    "provincia" VARCHAR(100) NOT NULL,
    "distrito" VARCHAR(100) NOT NULL,
    "centro_poblado" VARCHAR(100) NOT NULL,
    "nombre_sector" VARCHAR(100) NOT NULL,
    "tipo_sector" "TipoSector" NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "archivado" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sector_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sector_rural" (
    "sector_id" UUID NOT NULL,
    "latitud" DOUBLE PRECISION,
    "longitud" DOUBLE PRECISION,
    "poblacion" INTEGER,

    CONSTRAINT "sector_rural_pkey" PRIMARY KEY ("sector_id")
);

-- CreateTable
CREATE TABLE "sector_urbano" (
    "sector_id" UUID NOT NULL,
    "zona" VARCHAR(3) NOT NULL,
    "manzana" VARCHAR(10) NOT NULL,

    CONSTRAINT "sector_urbano_pkey" PRIMARY KEY ("sector_id")
);

-- CreateTable
CREATE TABLE "actor_social" (
    "id" UUID NOT NULL,
    "usuario_id" UUID,
    "municipalidad_id" UUID NOT NULL,
    "tipo_actor_social_id" UUID NOT NULL,
    "grupo_trabajo_id" UUID NOT NULL,
    "entidad_id" UUID,
    "dni" VARCHAR(8) NOT NULL,
    "nombres" VARCHAR(150) NOT NULL,
    "apellidos" VARCHAR(150) NOT NULL,
    "direccion" VARCHAR(200) NOT NULL,
    "fecha_nac" DATE NOT NULL,
    "email" VARCHAR(150) NOT NULL,
    "celular" VARCHAR(9) NOT NULL,
    "idioma_origen" VARCHAR(100) NOT NULL,
    "grado_instruccion" VARCHAR(100) NOT NULL,
    "estado" "EstadoActorSocial" NOT NULL DEFAULT 'BORRADOR',
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "archivado" BOOLEAN NOT NULL DEFAULT false,
    "deleted_at" TIMESTAMP(3),
    "motivo_eliminacion" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "actor_social_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuario_username_key" ON "usuario"("username");

-- CreateIndex
CREATE UNIQUE INDEX "municipalidad_ubigeo_codigo_key" ON "municipalidad"("ubigeo", "codigo");

-- CreateIndex
CREATE UNIQUE INDEX "entidad_tipo_entidad_codigo_key" ON "entidad"("tipo_entidad", "codigo");

-- CreateIndex
CREATE UNIQUE INDEX "tipo_actor_social_codigo_key" ON "tipo_actor_social"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "cargo_miembro_grupo_nombre_key" ON "cargo_miembro_grupo"("nombre");

-- CreateIndex
CREATE INDEX "grupo_trabajo_municipalidad_id_idx" ON "grupo_trabajo"("municipalidad_id");

-- CreateIndex
CREATE INDEX "grupo_establecimiento_grupo_trabajo_id_idx" ON "grupo_establecimiento"("grupo_trabajo_id");

-- CreateIndex
CREATE INDEX "miembro_grupo_grupo_trabajo_id_idx" ON "miembro_grupo"("grupo_trabajo_id");

-- CreateIndex
CREATE UNIQUE INDEX "sector_municipalidad_id_codigo_key" ON "sector"("municipalidad_id", "codigo");

-- CreateIndex
CREATE UNIQUE INDEX "actor_social_usuario_id_key" ON "actor_social"("usuario_id");

-- CreateIndex
CREATE UNIQUE INDEX "actor_social_municipalidad_id_dni_key" ON "actor_social"("municipalidad_id", "dni");

-- AddForeignKey
ALTER TABLE "usuario" ADD CONSTRAINT "usuario_municipalidad_id_fkey" FOREIGN KEY ("municipalidad_id") REFERENCES "municipalidad"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "password_reset_token" ADD CONSTRAINT "password_reset_token_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grupo_trabajo" ADD CONSTRAINT "grupo_trabajo_municipalidad_id_fkey" FOREIGN KEY ("municipalidad_id") REFERENCES "municipalidad"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grupo_establecimiento" ADD CONSTRAINT "grupo_establecimiento_grupo_trabajo_id_fkey" FOREIGN KEY ("grupo_trabajo_id") REFERENCES "grupo_trabajo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "miembro_grupo" ADD CONSTRAINT "miembro_grupo_grupo_trabajo_id_fkey" FOREIGN KEY ("grupo_trabajo_id") REFERENCES "grupo_trabajo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "miembro_grupo" ADD CONSTRAINT "miembro_grupo_cargo_miembro_grupo_id_fkey" FOREIGN KEY ("cargo_miembro_grupo_id") REFERENCES "cargo_miembro_grupo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sector" ADD CONSTRAINT "sector_municipalidad_id_fkey" FOREIGN KEY ("municipalidad_id") REFERENCES "municipalidad"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sector_rural" ADD CONSTRAINT "sector_rural_sector_id_fkey" FOREIGN KEY ("sector_id") REFERENCES "sector"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sector_urbano" ADD CONSTRAINT "sector_urbano_sector_id_fkey" FOREIGN KEY ("sector_id") REFERENCES "sector"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "actor_social" ADD CONSTRAINT "actor_social_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "actor_social" ADD CONSTRAINT "actor_social_municipalidad_id_fkey" FOREIGN KEY ("municipalidad_id") REFERENCES "municipalidad"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "actor_social" ADD CONSTRAINT "actor_social_tipo_actor_social_id_fkey" FOREIGN KEY ("tipo_actor_social_id") REFERENCES "tipo_actor_social"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "actor_social" ADD CONSTRAINT "actor_social_grupo_trabajo_id_fkey" FOREIGN KEY ("grupo_trabajo_id") REFERENCES "grupo_trabajo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "actor_social" ADD CONSTRAINT "actor_social_entidad_id_fkey" FOREIGN KEY ("entidad_id") REFERENCES "entidad"("id") ON DELETE SET NULL ON UPDATE CASCADE;
