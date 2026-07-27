import {
  lotesData,
  parseParametros,
  type EstiloLote,
  type LoteData,
  type MedidaFace,
  type ParametroItem,
} from './lotes';

export interface LoteDb {
  numero: number;
  area: string | null;
  parametros: string | null;
  parametros_itens: ParametroItem[] | null;
  medidas: unknown[];
  estilo: unknown | null;
}

/**
 * Busca os dados dos lotes no Supabase (fonte da verdade, editável na tela
 * "Lotes" do admin). Se o banco falhar, devolve vazio — quem consome faz
 * merge sobre os dados estáticos, então o site nunca quebra.
 *
 * revalidate: 60s → edições no admin aparecem no site em até 1 min.
 */
export async function getLotesDb(): Promise<Map<number, LoteDb>> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const vazio = new Map<number, LoteDb>();
  if (!url || !anon) return vazio;

  try {
    const res = await fetch(`${url}/rest/v1/lotes?select=*&order=numero`, {
      headers: { apikey: anon, Authorization: `Bearer ${anon}` },
      next: { revalidate: 60 },
    });
    if (!res.ok) return vazio;
    const linhas = (await res.json()) as LoteDb[];
    return new Map(linhas.map((l) => [l.numero, l]));
  } catch {
    return vazio;
  }
}

/**
 * Dados completos de um lote: imagens do arquivo estático + dados do banco
 * (quando existirem — o banco tem prioridade). Os parâmetros estruturados
 * vêm de parametros_itens; se não houver, a prosa é convertida em itens.
 */
export async function getLoteCompleto(numero: number): Promise<LoteData | null> {
  const estatico = lotesData[numero];
  if (!estatico) return null;

  const db = (await getLotesDb()).get(numero);
  const prosa = db?.parametros ?? estatico.parametros;
  const itens =
    db?.parametros_itens && db.parametros_itens.length
      ? db.parametros_itens
      : prosa
        ? parseParametros(prosa)
        : undefined;

  const medidas = Array.isArray(db?.medidas)
    ? (db.medidas.filter(
        (m) =>
          m &&
          typeof m === 'object' &&
          typeof (m as MedidaFace).aresta === 'number' &&
          typeof (m as MedidaFace).texto === 'string'
      ) as MedidaFace[])
    : [];

  const estilo =
    db?.estilo && typeof db.estilo === 'object' && !Array.isArray(db.estilo)
      ? (db.estilo as EstiloLote)
      : undefined;

  return {
    ...estatico,
    area: db?.area ?? estatico.area,
    parametros: prosa,
    parametrosItens: itens,
    medidas,
    estilo,
  };
}
