/**
 * O Book Digital como apresentação: as telas do PDF 04_79, com o texto do book e as imagens do
 * site sempre que ele já tem a mesma cena. O que só existe no book vem do PDF digital
 * (scripts/book-digital-imagens.mjs). O book diz 54 lotes: aqui são 52, como no site e na planta.
 *
 * As medidas estão em pontos da página dupla do book, 1361 x 964, tiradas do próprio PDF: com
 * a tela deitada, a apresentação monta cada tela como o book. Com o celular em pé, cada tela é
 * recomposta pelo `retrato`.
 */

export const LARGURA = 1361;
export const ALTURA = 964;

/** x0, y0, x1, y1 em pontos */
export type Caixa = [number, number, number, number];
export type Lado = 'esquerda' | 'direita' | 'topo' | 'base';

export type ImagemDaTela = {
  src: string;
  alt: string;
  caixa: Caixa;
  /** encosta na borda da tela quando ela é mais larga ou mais alta que o book */
  sangra?: Lado[];
  /** ponto que não pode sair do quadro quando a imagem é recortada */
  foco?: string;
  /** versão vertical da mesma foto, quando o site tem uma, para o celular em pé */
  emPe?: string;
  /** o ponto que não pode sair do quadro no celular em pé, quando é outro */
  focoEmPe?: string;
  /** tomada do filme do site com a mesma cena: entra por cima da foto */
  filme?: string;
  /** papel, cartão e desenho: não aproximam na entrada e não entram no índice */
  fixa?: boolean;
  /** mostra a parte da imagem que cai dentro desta caixa, como uma máscara do book */
  recorte?: Caixa;
  /** as beiras do desenho que se desfazem no papel quando a tela passa da página, em vez de acabar num corte */
  esfuma?: Lado[];
  /** pode abrir em tela cheia, com zoom */
  ampliavel?: boolean;
};

export type Fonte = 'ivy' | 'ivy-reto' | 'swiss' | 'swiss-leve';

/** Um bloco de texto do book. Com `centro`, x é o meio da linha; sem, é a margem esquerda. */
export type Texto = {
  x: number;
  y: number;
  centro?: boolean;
  /** largura da coluna, para o texto corrido quebrar como no book */
  largura?: number;
  justificar?: boolean;
  fonte?: Fonte;
  tamanho?: number;
  entrelinha?: number;
  cor?: string;
  /** espaço entre letras, em em */
  espaco?: number;
  caixaAlta?: boolean;
  /** linhas com quebra fixa, como os títulos */
  linhas?: string[];
  /** texto corrido, com uma linha em branco entre os parágrafos */
  paragrafos?: string[];
  /** o emblema em cobre acima do bloco */
  emblema?: boolean;
  /** distância do alto do emblema até o bloco, em pontos (27 na maioria das telas) */
  emblemaAcima?: number;
  /** no celular em pé: título, rótulo, corpo, legenda ou fora */
  papel?: 'titulo' | 'rotulo' | 'corpo' | 'destaque' | 'legenda' | 'fora';
  /**
   * Os lados de onde a posição é medida a partir da beira da tela, e não da página: a legenda
   * no canto de uma foto que sangra fica no canto da tela, por mais larga que ela seja.
   */
  beira?: Lado[];
};

export type Titulo = { linhas: string[]; cx: number; y: number; claro?: boolean; emblema?: boolean; tamanho?: number };
export type Rotulo = { texto: string | string[]; cx: number; y: number; claro?: boolean };

/**
 * Linhas em cobre, sempre com o comprimento do book. `de` e `ate` por linha ou para todas;
 * 'borda' prende a ponta na beira da tela, por mais larga que ela seja.
 */
export type Linhas = { y: number; passo?: number; quantas?: number; de: number | number[] | 'borda'; ate: number | number[] | 'borda' };

/** `beira`: os lados que acompanham a beira da tela, como o fio de margem que contorna a página */
export type Retangulo = { caixa: Caixa; cor: string; contorno?: boolean; beira?: Lado[] };

export type Tela = {
  id: string;
  capitulo: string;
  fundo: 'creme' | 'claro' | 'foto' | 'azul' | 'branco' | 'neutro' | 'pedro' | 'desenho';
  imagens: ImagemDaTela[];
  titulo?: Titulo;
  rotulo?: Rotulo;
  textos?: Texto[];
  linhas?: Linhas[];
  retangulos?: Retangulo[];
  /** o logotipo, centrado nesse ponto */
  marca?: { cx: number; cy: number; largura: number };
  /** o emblema solto, grande */
  emblemaSolto?: Caixa;
  especial?: 'masterplan' | 'implantacao' | 'diferenciais' | 'mapa' | 'capa' | 'contracapa';
  retrato: 'capa' | 'marca' | 'foto' | 'moldura' | 'mosaico' | 'texto' | 'perspectiva' | 'capitulo' | 'especial';
  /** a página do book: dela saem as formas do papel */
  pagina?: number;
};

/** Os capítulos na ordem em que aparecem, com a primeira tela de cada um */
export function capitulos(telas: Tela[]) {
  const lista: { nome: string; inicio: number; fim: number }[] = [];
  telas.forEach((t, i) => {
    const ultimo = lista[lista.length - 1];
    if (ultimo?.nome === t.capitulo) ultimo.fim = i;
    else lista.push({ nome: t.capitulo, inicio: i, fim: i });
  });
  return lista;
}

/** Masterplan: onde fica cada número na imagem, e o que ele é */
export const EQUIPAMENTOS: { n: number; nome: string; cx: number; cy: number }[] = [
  { n: 1, nome: 'Portaria', cx: 967.3, cy: 582.4 },
  { n: 2, nome: 'Sede administrativa', cx: 980.6, cy: 516.3 },
  { n: 3, nome: 'Área de funcionários e refeitório', cx: 991.1, cy: 533.8 },
  { n: 4, nome: 'Área de administração do condomínio', cx: 972.1, cy: 544.4 },
  { n: 5, nome: 'Espaço para coleta', cx: 958.8, cy: 514.1 },
  { n: 6, nome: 'Heliponto', cx: 942.7, cy: 473.9 },
  { n: 7, nome: 'Apoio Náutico', cx: 877.8, cy: 617 },
  { n: 8, nome: 'Píer', cx: 802.8, cy: 728.9 },
  { n: 9, nome: '2 quadras de tênis rápidas', cx: 929.5, cy: 529.6 },
  { n: 10, nome: '1 quadra de padel', cx: 912.1, cy: 489.6 },
  { n: 11, nome: 'Campo de futebol society', cx: 864.1, cy: 480.6 },
  { n: 12, nome: 'Trilha de 3 km para corrida, caminhada ou bicicleta', cx: 800.9, cy: 496.3 },
  { n: 13, nome: 'Horta orgânica', cx: 824.8, cy: 480.6 },
  { n: 14, nome: 'Empório', cx: 875.6, cy: 504.8 },
  { n: 15, nome: 'Casa-Clube', cx: 434.7, cy: 522 },
];

export const CASA_CLUBE = [
  'Bar e restaurante',
  'Sala de jogos e convivência com lareira',
  'Piscina adulto e infantil',
  'Brinquedoteca',
  'Playground',
  'Academia',
  'Espaço ao ar livre para prática de yoga ou funcional',
  'Saunas seca e a vapor',
  'Sala de massagem',
  'Hot spa com vista e acesso à área externa',
  'Cold spa',
  'Área de descanso',
];

export const DIFERENCIAIS = [
  'Portaria com controle de acesso 24 horas',
  'Monitoramento por câmeras em todo o perímetro',
  'Ronda terrestre e aquática permanente',
  'Sistema de vigilância integrado por sensores e câmeras',
  'Acesso independente para moradores, visitantes e serviços',
  'Cabeamento subterrâneo para maior proteção e estética',
  'Iluminação perimetral e de vias com fotocélulas',
  'Equipe treinada para atendimento emergencial',
  'Monitoramento remoto do sistema de segurança',
  'Administração e protocolo operacional pela BBZ',
  'Shuttle de helicóptero',
];

export const INFRAESTRUTURA = [
  'Tubulação de drenagem em PEAD Kanaflex, com maior resistência e durabilidade',
  'Utilização da linha Black Caterpillar para execução do serviço de terraplenagem e drenagem, mais preciso e eficiente',
  'Cabeamento subterrâneo, incluindo luz e internet',
  'Iluminação perimetral e de vias com fotocélulas',
  'Guias no formato americano',
  'Piso intertravado permeável nas vias',
  'Poço artesiano de 250 metros',
  'Caixa d’água de 200 mil litros para abastecimento',
  'Infraestrutura elétrica nível T3, 125 ampères e 47\u00a0kVA (acima do que é entregue na maioria dos condomínios)',
];

/** Croqui: o nome de cada cidade, e onde o fio dela encosta no desenho */
export const CIDADES: { nome: string; cx: number; y: number; ponta: number }[] = [
  { nome: 'Extrema', cx: 1168.4, y: 242.1, ponta: 320.3 },
  { nome: 'Bragança Paulista', cx: 466.2, y: 264.1, ponta: 342.3 },
  { nome: 'Atibaia', cx: 250.5, y: 535.9, ponta: 614.2 },
  { nome: 'Piracaia', cx: 539.9, y: 786.3, ponta: 864.5 },
  { nome: 'Joanópolis', cx: 1059.3, y: 810.1, ponta: 888.3 },
  { nome: 'Monte Verde', cx: 1230.8, y: 668.2, ponta: 746.4 },
];

export const AVISO_LEGAL =
  'VILLA STRADALE PENÍNSULA. Loteamento registrado sob o R.07 da matrícula nº 24.816 do Registro de Imóveis da Comarca de Piracaia – SP. Loteadora: Stradale Empreendimentos Imobiliários SPE Ltda. – CNPJ nº 41.344.921/0001-59. Intermediação: Bossa Nova Sotheby’s International Realty, nome fantasia de X3 Real Estate Imobiliária e Participação Ltda. – CNPJ nº 19.834.438/0001-01 – CRECI/SP nº 027212-J. Comercialização não exclusiva. Imagens meramente ilustrativas.';
