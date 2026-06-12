export const DEFAULT_TIPOS_ACTOR = [
  { tipoActor: "Agentes Comunitarios", tarifaRural: 5.0, tarifaUrbana: 4.0, orden: 1, codigo: "1" },
  { tipoActor: "Facilitadores de Cuna Más SAF", tarifaRural: 0.0, tarifaUrbana: 4.0, orden: 2, codigo: "2" },
  { tipoActor: "Agentes Voluntarios", tarifaRural: 0.0, tarifaUrbana: 4.0, orden: 3, codigo: "3" },
  { tipoActor: "Lideres Comunales", tarifaRural: 5.0, tarifaUrbana: 4.0, orden: 4, codigo: "4" },
  { tipoActor: "Estudiantes de Educacion Superior", tarifaRural: 5.0, tarifaUrbana: 4.0, orden: 5, codigo: "5" },
  { tipoActor: "Madres lideres de Vaso de Leche", tarifaRural: 5.0, tarifaUrbana: 4.0, orden: 6, codigo: "6" },
  { tipoActor: "Ejercito", tarifaRural: 5.0, tarifaUrbana: 4.0, orden: 7, codigo: "7" },
  { tipoActor: "Ronderos", tarifaRural: 5.0, tarifaUrbana: 4.0, orden: 8, codigo: "8" },
  { tipoActor: "Otros", tarifaRural: 5.0, tarifaUrbana: 4.0, orden: 9, codigo: "9" }
];

type TipoActorSocialDelegate = {
  findUnique(args: { where: { codigo: string } }): Promise<unknown | null>;
  create(args: {
    data: {
      tipoActor: string;
      tarifaRural: number;
      tarifaUrbana: number;
      orden: number;
      codigo: string;
      activo: boolean;
      archivado: boolean;
    };
  }): Promise<unknown>;
};

export async function seedTiposActorSocial(db: TipoActorSocialDelegate): Promise<number> {
  let createdCount = 0;

  for (const item of DEFAULT_TIPOS_ACTOR) {
    const existing = await db.findUnique({ where: { codigo: item.codigo } });
    if (!existing) {
      await db.create({
        data: {
          ...item,
          activo: true,
          archivado: false,
        },
      });
      createdCount++;
    }
  }

  return createdCount;
}
