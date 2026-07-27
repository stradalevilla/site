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

/**
 * Medida de uma face do lote, alinhada à aresta do contorno da implantação.
 * Quando `ate` está presente, a medida cobre o trecho de arestas
 * consecutivas [aresta..ate] — uma curva desenhada com vários pontos
 * recebe uma única medida no meio dela.
 */
export interface MedidaFace {
  aresta: number;
  ate?: number;
  texto: string;
}

/** Volume sugerido de construção (casa, piscina, etc.) desenhado no lote */
export interface VolumeConstrutivo {
  pontos: string;
  cor: string;
}

/**
 * Modo "Área construtiva": o limite dos recuos (linha tracejada) e os volumes
 * sugeridos de implantação, desenhados sobre o lote.
 */
export interface AreaConstrutivaLote {
  /** Polígono do limite dos recuos (tracejado). Vazio = não desenha */
  recuo?: string;
  volumes?: VolumeConstrutivo[];
}

/** Estilo da marcação do lote no close (cores do preenchimento, contorno) */
export interface EstiloLote {
  /** Cor do topo do degradê de preenchimento (hex) */
  fillTopo?: string;
  /** Cor da base do degradê de preenchimento (hex) */
  fillBase?: string;
  /** Opacidade do preenchimento (0 a 1) */
  fillOpacidade?: number;
  /** Cor do traço do contorno (hex); vazio = sem traço */
  contornoCor?: string;
  /** Largura do traço do contorno */
  contornoLargura?: number;
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
  /** Descritivo dos parâmetros urbanísticos (prosa; herança do .md) */
  parametros?: string;
  /** Parâmetros estruturados (fonte da verdade: tabela lotes no Supabase) */
  parametrosItens?: ParametroItem[];
  /** Medidas das faces do terreno (fonte da verdade: tabela lotes no Supabase) */
  medidas?: MedidaFace[];
  /** Estilo da marcação no close (fonte da verdade: tabela lotes no Supabase) */
  estilo?: EstiloLote;
  /** Recuos e volumes do modo "Área construtiva" (fonte: tabela lotes) */
  areaConstrutivaDesenho?: AreaConstrutivaLote;
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

/** Descritivo dos parâmetros urbanísticos por lote (fonte: _TEXTOS_LOTES_SITE.md). */
const parametrosPorLote: Record<number, string> = {
  1: 'Parâmetros do lote 01 (2.500,52 m²): recuo frontal de 10 m, recuos laterais de 4 m e recuo de fundos de 18 m; taxa de ocupação de 60%; coeficiente de aproveitamento de 0,6; até 2 pavimentos; altura máxima de 9 m nos primeiros 40 m de profundidade do lote e de 3,5 m na faixa seguinte, até 50 m da testada; cota de implantação de no máximo 1,00 m acima da cota média do terreno natural, cotada a partir da primeira alvenaria de construção.',
  2: 'Parâmetros do lote 02 (2.500,70 m²): recuo frontal de 10 m, recuos laterais de 5 m e recuo de fundos de 18 m; taxa de ocupação de 60%; coeficiente de aproveitamento de 0,6; até 2 pavimentos; altura máxima de 9 m nos primeiros 40 m de profundidade do lote e de 3,5 m na faixa seguinte, até 50 m da testada; cota de implantação de no máximo 1,00 m acima da cota média do terreno natural, cotada a partir da primeira alvenaria de construção.',
  3: 'Parâmetros do lote 03 (2.500,02 m²): recuo frontal de 10 m, recuos laterais de 5 m e recuo de fundos de 18 m; taxa de ocupação de 60%; coeficiente de aproveitamento de 0,6; até 2 pavimentos; altura máxima de 9 m nos primeiros 40 m de profundidade do lote e de 3,5 m na faixa seguinte, até 50 m da testada; cota de implantação de no máximo 1,00 m acima da cota média do terreno natural, cotada a partir da primeira alvenaria de construção.',
  4: 'Parâmetros do lote 04 (2.500,01 m²): recuo frontal de 10 m, recuos laterais de 5 m e recuo de fundos de 18 m; taxa de ocupação de 60%; coeficiente de aproveitamento de 0,6; até 2 pavimentos; altura máxima de 9 m nos primeiros 40 m de profundidade do lote e de 3,5 m na faixa seguinte, até 50 m da testada; cota de implantação de no máximo 1,00 m acima da cota média do terreno natural, cotada a partir da primeira alvenaria de construção.',
  5: 'Parâmetros do lote 05 (2.262,07 m²): recuo frontal de 10 m, recuos laterais de 4 m e recuo de fundos de 18 m; taxa de ocupação de 60%; coeficiente de aproveitamento de 0,6; até 2 pavimentos; altura máxima de 9 m nos primeiros 40 m de profundidade do lote e de 3,5 m na faixa seguinte, até 50 m da testada; cota de implantação de no máximo 1,00 m acima da cota média do terreno natural, cotada a partir da primeira alvenaria de construção.',
  6: 'Parâmetros do lote 06 (2.597,55 m²): recuo frontal de 10 m, recuos laterais de 4 m e recuo de fundos de 18 m; taxa de ocupação de 60%; coeficiente de aproveitamento de 0,6; até 2 pavimentos; altura máxima de 9 m nos primeiros 40 m de profundidade do lote e de 3,5 m na faixa seguinte, até 50 m da testada; cota de implantação de no máximo 1,00 m acima da cota média do terreno natural, cotada a partir da primeira alvenaria de construção.',
  7: 'Parâmetros do lote 07 (3.276,81 m²): recuo frontal de 10 m, recuos laterais de 5 m e recuo de fundos de 18 m; taxa de ocupação de 60%; coeficiente de aproveitamento de 0,6; até 2 pavimentos; altura máxima de 9 m nos primeiros 40 m de profundidade do lote e de 3,5 m na faixa seguinte, até 50 m da testada; cota de implantação de no máximo 1,00 m acima da cota média do terreno natural, cotada a partir da primeira alvenaria de construção.',
  8: 'Parâmetros do lote 08 (2.000,93 m²): recuo frontal de 10 m, recuos laterais de 4 m e recuo de fundos de 18 m; taxa de ocupação de 60%; coeficiente de aproveitamento de 0,6; até 2 pavimentos; altura máxima de 9 m nos primeiros 40 m de profundidade do lote e de 3,5 m na faixa seguinte, até 50 m da testada; cota de implantação de no máximo 1,00 m acima da cota média do terreno natural, cotada a partir da primeira alvenaria de construção.',
  9: 'Parâmetros do lote 09 (2.196,18 m²): recuo frontal de 10 m, recuos laterais de 5 m e recuo de fundos de 18 m; taxa de ocupação de 60%; coeficiente de aproveitamento de 0,6; até 2 pavimentos; altura máxima de 9 m nos primeiros 40 m de profundidade do lote e de 3,5 m na faixa seguinte, até 50 m da testada; cota de implantação de no máximo 1,00 m acima da cota média do terreno natural, cotada a partir da primeira alvenaria de construção.',
  10: 'Parâmetros do lote 10 (2.000,00 m²): recuo frontal de 10 m, recuos laterais de 5 m e recuo de fundos de 18 m; taxa de ocupação de 60%; coeficiente de aproveitamento de 0,6; até 2 pavimentos; altura máxima de 9 m nos primeiros 40 m de profundidade do lote e de 3,5 m na faixa seguinte, até 50 m da testada; cota de implantação de no máximo 1,00 m acima da cota média do terreno natural, cotada a partir da primeira alvenaria de construção.',
  11: 'Parâmetros do lote 11 (2.694,38 m²): recuo frontal de 10 m, recuos laterais de 5 m e recuo de fundos de 18 m; taxa de ocupação de 60%; coeficiente de aproveitamento de 0,6; até 2 pavimentos; altura máxima de 9 m nos primeiros 40 m de profundidade do lote e de 3,5 m na faixa seguinte, até 50 m da testada; cota de implantação de no máximo 1,00 m acima da cota média do terreno natural, cotada a partir da primeira alvenaria de construção.',
  12: 'Parâmetros do lote 12 (2.709,12 m²): recuo frontal de 10 m, recuos laterais de 5 m e recuo de fundos de 10 m; taxa de ocupação de 60%; coeficiente de aproveitamento de 0,6; até 2 pavimentos; altura máxima de 9 m acima do terreno natural, acompanhando o perfil do terreno (offset de 9 m); cota de implantação de no máximo 1,20 m acima da cota média do terreno natural, cotada a partir da primeira alvenaria de construção.',
  13: 'Parâmetros do lote 13 (2.029,38 m²): recuo frontal de 10 m, recuos laterais de 5 m e recuo de fundos de 10 m; taxa de ocupação de 60%; coeficiente de aproveitamento de 0,6; até 2 pavimentos; altura máxima de 9 m acima do terreno natural, acompanhando o perfil do terreno (offset de 9 m); cota de implantação de no máximo 1,20 m acima da cota média do terreno natural, cotada a partir da primeira alvenaria de construção.',
  14: 'Parâmetros do lote 14 (2.039,51 m²): recuo frontal de 10 m, recuos laterais de 5 m e recuo de fundos de 10 m; taxa de ocupação de 60%; coeficiente de aproveitamento de 0,6; até 2 pavimentos; altura máxima de 9 m acima do terreno natural, acompanhando o perfil do terreno (offset de 9 m); cota de implantação de no máximo 1,20 m acima da cota média do terreno natural, cotada a partir da primeira alvenaria de construção.',
  15: 'Parâmetros do lote 15 (2.029,68 m²): recuo frontal de 10 m, recuos laterais de 5 m e recuo de fundos de 10 m; taxa de ocupação de 60%; coeficiente de aproveitamento de 0,6; até 2 pavimentos; altura máxima de 9 m acima do terreno natural, acompanhando o perfil do terreno (offset de 9 m); cota de implantação de no máximo 1,20 m acima da cota média do terreno natural, cotada a partir da primeira alvenaria de construção.',
  16: 'Parâmetros do lote 16 (2.230,19 m²): recuo frontal de 10 m, recuos laterais de 5 m e recuo de fundos de 10 m; taxa de ocupação de 60%; coeficiente de aproveitamento de 0,6; até 2 pavimentos; altura máxima de 9 m acima do terreno natural, acompanhando o perfil do terreno (offset de 9 m); cota de implantação de no máximo 1,20 m acima da cota média do terreno natural, cotada a partir da primeira alvenaria de construção.',
  17: 'Parâmetros do lote 17 (2.250,56 m²): recuo frontal de 10 m, recuos laterais de 5 m e recuo de fundos de 10 m; taxa de ocupação de 60%; coeficiente de aproveitamento de 0,6; até 2 pavimentos; altura máxima de 9 m acima do terreno natural, acompanhando o perfil do terreno (offset de 9 m); cota de implantação de no máximo 1,20 m acima da cota média do terreno natural, cotada a partir da primeira alvenaria de construção.',
  18: 'Parâmetros do lote 18 (2.136,04 m²): recuo frontal de 10 m, recuos laterais de 5 m e recuo de fundos de 10 m; taxa de ocupação de 60%; coeficiente de aproveitamento de 0,6; até 2 pavimentos; altura máxima de 9 m acima do terreno natural, acompanhando o perfil do terreno (offset de 9 m); cota de implantação de no máximo 1,20 m acima da cota média do terreno natural, cotada a partir da primeira alvenaria de construção.',
  19: 'Parâmetros do lote 19 (2.170,87 m²): recuo frontal de 10 m, recuos laterais de 5 m e recuo de fundos de 10 m; taxa de ocupação de 60%; coeficiente de aproveitamento de 0,6; até 2 pavimentos; altura máxima de 9 m acima do terreno natural, acompanhando o perfil do terreno (offset de 9 m); cota de implantação de no máximo 1,20 m acima da cota média do terreno natural, cotada a partir da primeira alvenaria de construção.',
  20: 'Parâmetros do lote 20 (2.198,53 m²): recuo frontal de 8 m, recuos laterais de 8 m e recuo de fundos de 5 m; taxa de ocupação de 60%; coeficiente de aproveitamento de 0,6; até 2 pavimentos; altura máxima de 9 m acima do terreno natural, acompanhando o perfil do terreno (offset de 9 m); cota de implantação de no máximo 1,20 m acima da cota média do terreno natural, cotada a partir da primeira alvenaria de construção.',
  21: 'Parâmetros do lote 21 (2.172,17 m²): recuo frontal de 10 m, recuos laterais de 5 m e recuo de fundos de 10 m; taxa de ocupação de 60%; coeficiente de aproveitamento de 0,6; até 2 pavimentos; altura máxima de 9 m acima do terreno natural, acompanhando o perfil do terreno (offset de 9 m); cota de implantação de no máximo 1,20 m acima da cota média do terreno natural, cotada a partir da primeira alvenaria de construção.',
  22: 'Parâmetros do lote 22 (2.099,88 m²): recuo frontal de 10 m, recuos laterais de 5 m e recuo de fundos de 10 m; taxa de ocupação de 60%; coeficiente de aproveitamento de 0,6; até 2 pavimentos; altura máxima de 9 m acima do terreno natural, acompanhando o perfil do terreno (offset de 9 m); cota de implantação de no máximo 1,20 m acima da cota média do terreno natural, cotada a partir da primeira alvenaria de construção.',
  23: 'Parâmetros do lote 23 (2.101,10 m²): recuo frontal de 10 m, recuos laterais de 5 m e recuo de fundos de 10 m; taxa de ocupação de 60%; coeficiente de aproveitamento de 0,6; até 2 pavimentos; altura máxima de 9 m acima do terreno natural, acompanhando o perfil do terreno (offset de 9 m); cota de implantação de no máximo 1,20 m acima da cota média do terreno natural, cotada a partir da primeira alvenaria de construção.',
  24: 'Parâmetros do lote 24 (2.132,38 m²): recuo frontal de 10 m, recuos laterais de 5 m e recuo de fundos de 10 m; taxa de ocupação de 60%; coeficiente de aproveitamento de 0,6; até 2 pavimentos; altura máxima de 9 m acima do terreno natural, acompanhando o perfil do terreno (offset de 9 m); cota de implantação de no máximo 1,20 m acima da cota média do terreno natural, cotada a partir da primeira alvenaria de construção.',
  25: 'Parâmetros do lote 25 (2.054,70 m²): recuo frontal de 10 m, recuos laterais de 5 m e recuo de fundos de 10 m; taxa de ocupação de 60%; coeficiente de aproveitamento de 0,6; até 2 pavimentos; altura máxima de 9 m acima do terreno natural, acompanhando o perfil do terreno (offset de 9 m); cota de implantação de no máximo 1,20 m acima da cota média do terreno natural, cotada a partir da primeira alvenaria de construção.',
  26: 'Parâmetros do lote 26 (2.073,33 m²): recuo frontal de 10 m, recuos laterais de 5 m e recuo de fundos de 10 m; taxa de ocupação de 60%; coeficiente de aproveitamento de 0,6; até 2 pavimentos; altura máxima de 9 m acima do terreno natural, acompanhando o perfil do terreno (offset de 9 m); cota de implantação de no máximo 1,20 m acima da cota média do terreno natural, cotada a partir da primeira alvenaria de construção.',
  27: 'Parâmetros do lote 27 (2.113,29 m²): recuo frontal de 10 m, recuos laterais de 5 m e recuo de fundos de 10 m; taxa de ocupação de 60%; coeficiente de aproveitamento de 0,6; até 2 pavimentos; altura máxima de 9 m acima do terreno natural, acompanhando o perfil do terreno (offset de 9 m); cota de implantação de no máximo 1,20 m acima da cota média do terreno natural, cotada a partir da primeira alvenaria de construção.',
  28: 'Parâmetros do lote 28 (2.554,94 m²): recuo frontal de 10 m, recuos laterais de 5 m e recuo de fundos de 10 m; taxa de ocupação de 60%; coeficiente de aproveitamento de 0,6; até 2 pavimentos; altura máxima de 9 m acima do terreno natural, acompanhando o perfil do terreno (offset de 9 m); cota de implantação de no máximo 1,20 m acima da cota média do terreno natural, cotada a partir da primeira alvenaria de construção.',
  31: 'Parâmetros do lote 31 (2.001,34 m²): recuo frontal de 12 m, recuos laterais de 5 m e recuo de fundos de 12 m; taxa de ocupação de 60%; coeficiente de aproveitamento de 0,6; até 2 pavimentos; altura máxima de 9 m nos primeiros 32 m de profundidade do lote; cota de implantação de no máximo 1,00 m acima da cota média do terreno natural, cotada a partir da primeira alvenaria de construção.',
  32: 'Parâmetros do lote 32 (2.002,83 m²): recuo frontal de 12 m, recuos laterais de 5 m e recuo de fundos de 12 m; taxa de ocupação de 60%; coeficiente de aproveitamento de 0,6; até 2 pavimentos; altura máxima de 9 m nos primeiros 32 m de profundidade do lote; cota de implantação de no máximo 1,00 m acima da cota média do terreno natural, cotada a partir da primeira alvenaria de construção.',
  33: 'Parâmetros do lote 33 (2.002,02 m²): recuo frontal de 12 m, recuos laterais de 5 m e recuo de fundos de 12 m; taxa de ocupação de 60%; coeficiente de aproveitamento de 0,6; até 2 pavimentos; altura máxima de 9 m nos primeiros 32 m de profundidade do lote; cota de implantação de no máximo 1,00 m acima da cota média do terreno natural, cotada a partir da primeira alvenaria de construção.',
  34: 'Parâmetros do lote 34 (2.001,12 m²): recuo frontal de 12 m, recuos laterais de 5 m e recuo de fundos de 12 m; taxa de ocupação de 60%; coeficiente de aproveitamento de 0,6; até 2 pavimentos; altura máxima de 9 m nos primeiros 32 m de profundidade do lote e de 3,5 m na faixa seguinte, até 42 m da testada; cota de implantação de no máximo 1,00 m acima da cota média do terreno natural, cotada a partir da primeira alvenaria de construção.',
  35: 'Parâmetros do lote 35 (2.003,69 m²): recuo frontal de 12 m, recuos laterais de 4 m e recuo de fundos de 18 m; taxa de ocupação de 60%; coeficiente de aproveitamento de 0,6; até 2 pavimentos; altura máxima de 9 m nos primeiros 35 m de profundidade do lote e de 3,5 m na faixa seguinte, até 45 m da testada; cota de implantação de no máximo 1,00 m acima da cota média do terreno natural, cotada a partir da primeira alvenaria de construção.',
  36: 'Parâmetros do lote 36 (2.747,58 m²): recuo frontal de 12 m, recuos laterais de 5 m e recuo de fundos de 18 m; taxa de ocupação de 60%; coeficiente de aproveitamento de 0,6; até 2 pavimentos; altura máxima de 9 m nos primeiros 42 m de profundidade do lote e de 3,5 m na faixa seguinte, até 52 m da testada; cota de implantação de no máximo 1,00 m acima da cota média do terreno natural, cotada a partir da primeira alvenaria de construção.',
  37: 'Parâmetros do lote 37 (3.000,00 m²): recuo frontal de 12 m, recuos laterais de 4 m e recuo de fundos de 18 m; taxa de ocupação de 60%; coeficiente de aproveitamento de 0,6; até 2 pavimentos; altura máxima de 9 m nos primeiros 42 m de profundidade do lote e de 3,5 m na faixa seguinte, até 57 m da testada; cota de implantação de no máximo 1,00 m acima da cota média do terreno natural, cotada a partir da primeira alvenaria de construção.',
  38: 'Parâmetros do lote 38 (3.390,41 m²): recuo frontal de 12 m, recuos laterais de 4 m e recuo de fundos de 18 m; taxa de ocupação de 60%; coeficiente de aproveitamento de 0,6; até 2 pavimentos; altura máxima de 9 m nos primeiros 42 m de profundidade do lote e de 3,5 m na faixa seguinte, até 64 m da testada; cota de implantação de no máximo 1,00 m acima da cota média do terreno natural, cotada a partir da primeira alvenaria de construção.',
  39: 'Parâmetros do lote 39 (3.302,76 m²): recuo frontal de 12 m, recuos laterais de 4 m e recuo de fundos de 18 m; taxa de ocupação de 60%; coeficiente de aproveitamento de 0,6; até 2 pavimentos; altura máxima de 9 m nos primeiros 42 m de profundidade do lote e de 3,5 m na faixa seguinte, até 64 m da testada; cota de implantação de no máximo 1,00 m acima da cota média do terreno natural, cotada a partir da primeira alvenaria de construção.',
  40: 'Parâmetros do lote 40 (3.124,40 m²): recuo frontal de 12 m, recuos laterais de 4 m e recuo de fundos de 18 m; taxa de ocupação de 60%; coeficiente de aproveitamento de 0,6; até 2 pavimentos; altura máxima de 9 m nos primeiros 42 m de profundidade do lote e de 3,5 m na faixa seguinte, até 64 m da testada; cota de implantação de no máximo 1,00 m acima da cota média do terreno natural, cotada a partir da primeira alvenaria de construção.',
  41: 'Parâmetros do lote 41 (2.800,00 m²): recuo frontal de 12 m, recuos laterais de 4 m e recuo de fundos de 18 m; taxa de ocupação de 60%; coeficiente de aproveitamento de 0,6; até 2 pavimentos; altura máxima de 9 m nos primeiros 42 m de profundidade do lote e de 3,5 m na faixa seguinte, até 64 m da testada; cota de implantação de no máximo 1,00 m acima da cota média do terreno natural, cotada a partir da primeira alvenaria de construção.',
  42: 'Parâmetros do lote 42 (2.503,30 m²): recuo frontal de 12 m, recuos laterais de 4 m e recuo de fundos de 18 m; taxa de ocupação de 60%; coeficiente de aproveitamento de 0,6; até 2 pavimentos; altura máxima de 9 m nos primeiros 42 m de profundidade do lote e de 3,5 m na faixa seguinte, até 64 m da testada; cota de implantação de no máximo 1,00 m acima da cota média do terreno natural, cotada a partir da primeira alvenaria de construção.',
  43: 'Parâmetros do lote 43 (2.728,14 m²): recuo frontal de 12 m, recuos laterais de 4 m e recuo de fundos de 18 m; taxa de ocupação de 60%; coeficiente de aproveitamento de 0,6; até 2 pavimentos; altura máxima de 9 m nos primeiros 42 m de profundidade do lote e de 3,5 m na faixa seguinte, até 64 m da testada; cota de implantação de no máximo 1,00 m acima da cota média do terreno natural, cotada a partir da primeira alvenaria de construção.',
  44: 'Parâmetros do lote 44 (2.340,23 m²): recuo frontal de 12 m, recuos laterais de 4 m e recuo de fundos de 18 m; taxa de ocupação de 60%; coeficiente de aproveitamento de 0,6; até 2 pavimentos; altura máxima de 9 m nos primeiros 42 m de profundidade do lote e de 3,5 m na faixa seguinte, até 64 m da testada; cota de implantação de no máximo 1,00 m acima da cota média do terreno natural, cotada a partir da primeira alvenaria de construção.',
  45: 'Parâmetros do lote 45 (2.340,23 m²): recuo frontal de 12 m, recuos laterais de 4 m e recuo de fundos de 18 m; taxa de ocupação de 60%; coeficiente de aproveitamento de 0,6; até 2 pavimentos; altura máxima de 9 m nos primeiros 42 m de profundidade do lote e de 3,5 m na faixa seguinte, até 64 m da testada; cota de implantação de no máximo 1,00 m acima da cota média do terreno natural, cotada a partir da primeira alvenaria de construção.',
  46: 'Parâmetros do lote 46 (2.534,12 m²): recuo frontal de 12 m, recuos laterais de 4 m e recuo de fundos de 18 m; taxa de ocupação de 60%; coeficiente de aproveitamento de 0,6; até 2 pavimentos; altura máxima de 9 m nos primeiros 42 m de profundidade do lote e de 3,5 m na faixa seguinte, até 64 m da testada; cota de implantação de no máximo 1,00 m acima da cota média do terreno natural, cotada a partir da primeira alvenaria de construção.',
  47: 'Parâmetros do lote 47 (3.000,00 m²): recuo frontal de 12 m, recuos laterais de 5 m e recuo de fundos de 18 m; taxa de ocupação de 60%; coeficiente de aproveitamento de 0,6; até 2 pavimentos; altura máxima de 9 m nos primeiros 42 m de profundidade do lote e de 3,5 m na faixa seguinte, até 64 m da testada; cota de implantação de no máximo 1,00 m acima da cota média do terreno natural, cotada a partir da primeira alvenaria de construção.',
  48: 'Parâmetros do lote 48 (4.554,54 m²): recuo frontal de 7 m, recuos laterais de 4 m e recuo de fundos de 18 m; taxa de ocupação de 60%; coeficiente de aproveitamento de 0,6; até 2 pavimentos; altura máxima de 12 m nos primeiros 43 m de profundidade do lote e de 5 m na faixa seguinte, até 53 m da testada; cota de implantação de no máximo 2,20 m acima da cota média do terreno natural, cotada a partir da primeira alvenaria de construção.',
  49: 'Parâmetros do lote 49 (3.324,97 m²): recuo frontal de 7 m, recuos laterais de 5 m e recuo de fundos de 20 m; taxa de ocupação de 60%; coeficiente de aproveitamento de 0,6; até 2 pavimentos; altura máxima de 10 m nos primeiros 40 m de profundidade do lote e de 4 m na faixa seguinte, até 50 m da testada; cota de implantação de no máximo 1,00 m acima da cota média do terreno natural, cotada a partir da primeira alvenaria de construção.',
  50: 'Parâmetros do lote 50 (3.575,27 m²): recuo frontal de 10 m, recuos laterais de 5 m e recuo de fundos de 18 m; taxa de ocupação de 60%; coeficiente de aproveitamento de 0,6; até 2 pavimentos; altura máxima de 10 m nos primeiros 42 m de profundidade do lote e de 4 m na faixa seguinte, até 52 m da testada; cota de implantação de no máximo 1,00 m acima da cota média do terreno natural, cotada a partir da primeira alvenaria de construção.',
  51: 'Parâmetros do lote 51 (3.519,61 m²): recuo frontal de 10 m, recuos laterais de 5 m e recuo de fundos de 18 m; taxa de ocupação de 60%; coeficiente de aproveitamento de 0,6; até 2 pavimentos; altura máxima de 10 m nos primeiros 42 m de profundidade do lote e de 4 m na faixa seguinte, até 52 m da testada; cota de implantação de no máximo 1,00 m acima da cota média do terreno natural, cotada a partir da primeira alvenaria de construção.',
  52: 'Parâmetros do lote 52 (3.524,00 m²): recuo frontal de 10 m, recuos laterais de 5 m e recuo de fundos de 18 m; taxa de ocupação de 60%; coeficiente de aproveitamento de 0,6; até 2 pavimentos; altura máxima de 10 m nos primeiros 42 m de profundidade do lote e de 4 m na faixa seguinte, até 52 m da testada; cota de implantação de no máximo 1,00 m acima da cota média do terreno natural, cotada a partir da primeira alvenaria de construção.',
};

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
        parametros: parametrosPorLote[n],
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

export interface ParametroItem {
  label: string;
  valor: string;
}

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/**
 * Converte o descritivo em prosa dos parâmetros (formato fixo do
 * _TEXTOS_LOTES_SITE.md) em itens de lista para exibição em bullets.
 */
export function parseParametros(texto: string): ParametroItem[] {
  const itens: ParametroItem[] = [];

  const corpo = texto.slice(texto.indexOf('): ') + 3).replace(/\.$/, '');

  for (const seg of corpo.split(';').map((s) => s.trim())) {
    if (seg.startsWith('recuo frontal')) {
      // "recuo frontal de 10 m, recuos laterais de 5 m e recuo de fundos de 18 m"
      for (const parte of seg.split(/, | e (?=recuo)/)) {
        const m = parte.match(/^(recuos? (?:frontal|laterais|de fundos)) de (.+)$/);
        if (m) itens.push({ label: cap(m[1]), valor: m[2] });
      }
    } else if (seg.startsWith('taxa de ocupação de ')) {
      itens.push({ label: 'Taxa de ocupação', valor: seg.slice(20) });
    } else if (seg.startsWith('coeficiente de aproveitamento de ')) {
      itens.push({ label: 'Coeficiente de aproveitamento', valor: seg.slice(33) });
    } else if (/^até \d+ pavimentos$/.test(seg)) {
      itens.push({ label: 'Pavimentos', valor: cap(seg.replace(' pavimentos', '')) });
    } else if (seg.startsWith('altura máxima de ')) {
      itens.push({ label: 'Altura máxima', valor: seg.slice(17) });
    } else if (seg.startsWith('cota de implantação de ')) {
      itens.push({ label: 'Cota de implantação', valor: cap(seg.slice(23)) });
    } else if (seg) {
      // Segmento fora do padrão: exibe como veio, para nada se perder
      itens.push({ label: '', valor: cap(seg) });
    }
  }

  return itens;
}
