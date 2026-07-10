export const TOTAL_LOTES = 54;

/** Lotes que não existem no empreendimento */
export const LOTES_INDISPONIVEIS = [29, 30];

/** Números de todos os lotes existentes (01–28 e 31–54) */
export const lotesDisponiveis = Array.from(
  { length: TOTAL_LOTES },
  (_, i) => i + 1
).filter((n) => !LOTES_INDISPONIVEIS.includes(n));

export interface LoteImage {
  src: string;
  width: number;
  height: number;
}

export interface LoteData {
  numero: number;
  /** Área do lote, ex.: "3276.81" (sem o sufixo m²) */
  area?: string;
  masterplan: LoteImage;
  /** Vista do lote com as medidas de cada face */
  detalhe?: LoteImage;
  /** Vista do lote com o recuo e a área construtiva permitida */
  areaConstrutiva?: LoteImage;
  vistas?: LoteImage[];
}

const BASE = '/images/masterplan lotes';
const MARCACOES = `${BASE}/marcacoes`;
const DETALHES = `${BASE}/detalhes`;
const AREA_CONSTRUTIVA = `${BASE}/area-construtiva`;

/**
 * Área de cada lote em m², como impresso na imagem de detalhe.
 * Lotes 53 e 54 ainda não têm arte de detalhe exportada.
 */
const areas: Record<number, string> = {
  1: '2.500,53',
  2: '2.500,70',
  3: '2.500,03',
  4: '2.500,01',
  5: '2.262,08',
  6: '2.597,56',
  7: '3.276,81',
  8: '2.262,08',
  9: '2.196,18',
  10: '2.000,00',
  11: '2.694,37',
  12: '2.709,13',
  13: '2.029,39',
  14: '2.039,51',
  15: '2.029,69',
  16: '2.230,20',
  17: '2.196,18',
  18: '2.136,05',
  19: '2.170,87',
  20: '2.198,54',
  21: '2.172,18',
  22: '2.099,89',
  23: '2.101,11',
  24: '2.132,38',
  25: '2.054,71',
  26: '2.073,33',
  27: '2.113,30',
  28: '2.554,95',
  31: '2.001,35',
  32: '2.002,84',
  33: '2.002,02',
  34: '2.001,12',
  35: '2.003,69',
  36: '2.747,58',
  37: '3.000,00',
  38: '3.390,42',
  39: '3.302,77',
  40: '3.124,41',
  41: '2.800,00',
  42: '2.503,31',
  43: '2.728,15',
  44: '2.340,67',
  45: '2.340,23',
  46: '2.534,13',
  47: '3.000,00',
  48: '4.554,54',
  49: '3.324,97',
  50: '3.575,28',
  51: '3.519,62',
  52: '3.524,00',
};

/**
 * Lotes cujas artes de detalhe e área construtiva o arquiteto ainda não
 * exportou. Não usar a arte de outro lote como placeholder: elas trazem o
 * número e a metragem impressos, o que passaria informação errada.
 */
export const LOTES_SEM_ARTE = [53, 54];

/** Vistas padrão (fotos do lote 07) exibidas enquanto o lote não tem fotos próprias */
const vistasPadrao: LoteImage[] = [
  { src: `${BASE}/lote 07/foto_vista_01.png`, width: 2790, height: 1568 },
  { src: `${BASE}/lote 07/foto_vista_02.png`, width: 2796, height: 1572 },
  { src: `${BASE}/lote 07/foto_vista_03.png`, width: 2788, height: 1572 },
];

export const lotesData: Record<number, LoteData> = Object.fromEntries(
  lotesDisponiveis.map((n) => {
    const pad = String(n).padStart(2, '0');
    const temArte = !LOTES_SEM_ARTE.includes(n);
    return [
      n,
      {
        numero: n,
        area: areas[n],
        masterplan: {
          src: `${MARCACOES}/masterplan-lote-${pad}.jpg`,
          width: 2200,
          height: 1228,
        },
        ...(temArte && {
          detalhe: {
            src: `${DETALHES}/lote-${pad}.jpg`,
            width: 2200,
            height: 1238,
          },
          areaConstrutiva: {
            src: `${AREA_CONSTRUTIVA}/lote-${pad}.jpg`,
            width: 2200,
            height: 1238,
          },
        }),
        vistas: vistasPadrao,
      },
    ];
  })
);

export function getLote(numero: number): LoteData | null {
  return lotesData[numero] ?? null;
}
