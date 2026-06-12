-- Align base V1 schema with approved functional scope.
ALTER TABLE "entidad" ADD COLUMN "archivado" BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE "grupo_establecimiento"
ADD CONSTRAINT "grupo_establecimiento_grupo_trabajo_id_codigo_key" UNIQUE ("grupo_trabajo_id", "codigo");

ALTER TABLE "miembro_grupo" ADD COLUMN "grupo_establecimiento_id" UUID;

CREATE INDEX "miembro_grupo_grupo_establecimiento_id_idx" ON "miembro_grupo"("grupo_establecimiento_id");

ALTER TABLE "miembro_grupo"
ADD CONSTRAINT "miembro_grupo_grupo_establecimiento_id_fkey"
FOREIGN KEY ("grupo_establecimiento_id") REFERENCES "grupo_establecimiento"("id")
ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "actor_social" ADD COLUMN "centro_poblado" VARCHAR(100);
