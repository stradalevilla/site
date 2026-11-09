/**
 * As 70 telas do Book Digital, com todo o texto e as imagens. Só o servidor importa este arquivo:
 * as telas chegam ao navegador como dados da página, depois do login no app ou da senha do link.
 * Importado por um componente de cliente, o book inteiro iria no JavaScript público, inclusive
 * para quem só tem o link e não a senha.
 */
import { ALTURA, LARGURA, type Caixa, type ImagemDaTela, type Lado, type Linhas, type Tela } from '@/lib/book-digital';

const PASTA = '/midia/book-digital';
const R = '/images/renders';
const TODA: Caixa = [0, 0, LARGURA, ALTURA];
const SANGRA_TUDO: Lado[] = ['esquerda', 'direita', 'topo', 'base'];
const MOLDURA: Caixa = [38.6, 39.7, 1322.1, 772.3];
// o cartão branco ocupa a tela toda, sempre com a margem do book até a beira, como o quadro da tela 37
const CARTAO: ImagemDaTela = { src: `${PASTA}/cartao.jpg`, alt: '', caixa: [38.5, 35.9, 1322.1, 925.3], fixa: true, sangra: SANGRA_TUDO };
const COBRE = '#d28455';
const NAVY = '#152f4e';
const CREME = '#f9f2e2';

/** as cinco linhas em cobre no pé esquerdo, como na maioria das telas */
const PE: Linhas = { y: 857.9, de: 'borda', ate: [57.2, 96.7, 112.3, 83.6, 61.4] };
/** as cinco linhas que saem da beira de uma foto, no alto da página da direita */
const DA_FOTO = (y: number, de: number, ate = [733.3, 772.7, 788.3, 759.7, 737.4]): Linhas => ({ y, de, ate });
/** a dobra do meio do book */
const DOBRA = 680.3;
/** as quinze linhas curtas na margem esquerda das páginas azuis */
const MARGEM: Linhas = { y: 450.4, passo: 7.31, quantas: 15, de: 'borda', ate: 40.9 };
/** as mesmas quinze quando terminam encostadas numa foto: presas à página, para não se soltarem dela */
const DA_MARGEM: Linhas = { ...MARGEM, de: 0 };
/** as cinco linhas que saem pela direita, no pé das perspectivas */
const SAIDA_DIREITA: Linhas = { y: 840, passo: 7.17, de: [1303.4, 1264, 1248.4, 1277, 1299.2], ate: 'borda' };
/** as cinco linhas por cima do retrato, nas páginas de arquitetos e incorporador */
const SOBRE_RETRATO: Linhas = { y: 480.5, de: 124.5, ate: [158.2, 197.6, 213.2, 184.6, 162.3] };

const respiro = (id: string, capitulo: string, src: string, alt: string, foco: string, extra: Partial<ImagemDaTela> = {}): Tela => ({
  id,
  capitulo,
  fundo: 'foto',
  retrato: 'foto',
  imagens: [{ src, alt, caixa: TODA, sangra: SANGRA_TUDO, foco, ...extra }],
  linhas: [PE],
});

const perspectiva = (n: number, src: string, nome: string, alt: string, caixa: Caixa = [38.6, 39.7, 1322, 924.1], filme?: string): Tela => ({
  id: `perspectiva-${n}`,
  capitulo: 'Perspectivas',
  fundo: 'azul',
  retrato: 'perspectiva',
  // a foto ocupa a tela, com a margem do book até a beira (decisão do Gustavo, 09/11): nas telas
  // largas perde um pouco em cima e embaixo, no lugar de sobrar papel azul dos lados
  // as faixas panorâmicas (43, 51, 53) crescem também na altura, para o render não perder o alto e o pé
  imagens: [{ src, alt, caixa, foco: '50% 50%', ampliavel: true, filme, sangra: SANGRA_TUDO, faixa: caixa[1] > 100 }],
  textos: [
    {
      x: 65.8,
      y: caixa[3] - 32.5,
      fonte: 'swiss',
      tamanho: 6,
      cor: '#fff',
      linhas: [`Perspectiva ilustrada ${nome}`],
      papel: 'legenda',
      // no canto de baixo da foto, que agora vai até a margem da tela
      ...(caixa[1] > 100 ? { beira: ['esquerda'] as Lado[], naFaixa: caixa } : { beira: ['esquerda', 'base'] as Lado[] }),
      sombra: true,
    },
  ],
  // a foto vai até a margem da tela, então as linhas saem da beira da tela com o comprimento do book e encostam nela
  linhas: [MARGEM, SAIDA_DIREITA],
});

export const TELAS: Tela[] = [
  // ——— Abertura
  {
    id: 'capa',
    capitulo: 'Abertura',
    fundo: 'foto',
    retrato: 'capa',
    especial: 'capa',
    imagens: [{ src: `${PASTA}/capa.jpg`, alt: 'Capa do book: o desenho da península em relevo sobre o azul', caixa: TODA, sangra: SANGRA_TUDO, foco: '50% 50%' }],
  },
  {
    id: 'marca',
    capitulo: 'Abertura',
    fundo: 'creme',
    retrato: 'marca',
    marca: { cx: 1020.5, cy: 474, largura: 190 },
    imagens: [],
    linhas: [PE],
  },
  {
    id: 'descobertos',
    capitulo: 'Abertura',
    fundo: 'creme',
    retrato: 'mosaico',
    imagens: [
      { src: `${PASTA}/estrada-aerea.jpg`, alt: 'Vista aérea de um carro numa estrada de terra entre as árvores', caixa: [0, 0, 681.4, ALTURA], sangra: ['esquerda', 'topo', 'base'], foco: '50% 55%' },
      { src: `${PASTA}/casal-no-carro.jpg`, alt: 'Casal no carro, entre eucaliptos ao entardecer', caixa: [744.6, 307, 1296.4, 673.9], foco: '70% 50%' },
    ],
    titulo: { linhas: ['Há lugares que precisam', 'ser descobertos'], cx: 1021.6, y: 795.7, emblema: true },
    linhas: [DA_FOTO(104.1, 681.4)],
  },
  {
    id: 'guardados',
    capitulo: 'Abertura',
    fundo: 'claro',
    retrato: 'moldura',
    imagens: [{ src: `${PASTA}/portaria-chegada.jpg`, alt: 'Chegada à portaria, com a represa ao fundo', caixa: [38.5, 39.5, 1322.2, 772.5], foco: '62% 50%' }],
    titulo: { linhas: ['E há os que precisam ser guardados'], cx: 1020.5, y: 855.2, emblema: true },
    rotulo: { texto: 'Piracaia • a 96 km de São Paulo', cx: 1020.5, y: 894.7 },
    linhas: [PE],
  },
  {
    id: 'peninsula',
    capitulo: 'Abertura',
    fundo: 'foto',
    retrato: 'foto',
    imagens: [{ src: `${R}/hero-por-do-sol.jpg`, emPe: `${R}/hero-por-do-sol-retrato.jpg`, alt: 'A península ao pôr do sol, vista do alto', caixa: TODA, sangra: SANGRA_TUDO, foco: '50% 55%', filme: 'hero-por-do-sol' }],
    titulo: { linhas: ['Uma península irreplicável'], cx: 1020.7, y: 835.9, claro: true, emblema: true },
    linhas: [PE],
  },
  {
    id: 'peninsula-aerea',
    capitulo: 'Abertura',
    fundo: 'foto',
    retrato: 'foto',
    imagens: [{ src: `${R}/hero-peninsula-v2.jpg`, emPe: `${R}/hero-peninsula-v2-retrato.jpg`, alt: 'A península e a represa, vistas do alto', caixa: TODA, sangra: SANGRA_TUDO, foco: '55% 60%', filme: 'hero-peninsula-v2' }],
    linhas: [PE],
  },

  // ——— A represa
  {
    id: 'vida-na-represa',
    capitulo: 'A represa',
    fundo: 'creme',
    retrato: 'mosaico',
    imagens: [
      { src: `${PASTA}/leme-pai-e-filha.jpg`, alt: 'Pai e filha ao leme do veleiro', caixa: [679.2, 0, LARGURA, ALTURA], sangra: ['direita', 'topo', 'base'], foco: '50% 45%', filme: 'nautica-veleiro' },
      { src: `${PASTA}/leme-veleiro.jpg`, alt: 'Homem ao leme, com a vela aberta', caixa: [157.3, 245.6, 523.1, 718.2], foco: '50% 50%', focoEmPe: '50% 18%' },
    ],
    titulo: { linhas: ['A vida na represa', 'em sua versão mais rara'], cx: 341.9, y: 163, emblema: true },
    linhas: [PE],
  },
  {
    id: 'refugio',
    capitulo: 'A represa',
    fundo: 'claro',
    retrato: 'moldura',
    imagens: [{ src: `${PASTA}/veleiro-entardecer.jpg`, alt: 'Veleiro ancorado no fim da tarde, com a família no convés', caixa: MOLDURA, foco: '58% 50%' }],
    titulo: { linhas: ['Um refúgio reservado a poucos'], cx: 1020.5, y: 855.2, emblema: true },
    linhas: [PE],
  },
  {
    id: 'liberdade',
    capitulo: 'A represa',
    fundo: 'creme',
    retrato: 'mosaico',
    imagens: [
      { src: `${PASTA}/wakeboard-pier.jpg`, alt: 'Homem com a prancha de wakeboard no píer, ao lado da lancha', caixa: [38.6, 38.5, 641.7, 925.4], foco: '40% 50%', filme: 'nautica-pier' },
      { src: `${PASTA}/lancha-wake.jpg`, alt: 'Lancha navegando na represa', caixa: [733.1, 146.4, 1292.4, 465.4], foco: '70% 50%' },
      { src: `${PASTA}/wake-represa.jpg`, alt: 'Wakeboard atrás da lancha, com as montanhas ao fundo', caixa: [733.1, 486.4, 1292.4, 807.6], foco: '50% 60%', filme: 'nautica-wake' },
    ],
    titulo: { linhas: ['Onde a liberdade ganha movimento'], cx: 1020.5, y: 872.3, emblema: true },
    rotulo: { texto: 'Estrutura de apoio náutico', cx: 1020.5, y: 914.5 },
    linhas: [DA_FOTO(75.8, DOBRA)],
  },
  respiro('raro-kite', 'A represa', `${PASTA}/kitesurf-margem.jpg`, 'Kitesurfista na margem, preparando a vela', '72% 12%', { focoEmPe: '84% 50%' }),
  {
    id: 'intensidade',
    capitulo: 'A represa',
    fundo: 'creme',
    retrato: 'mosaico',
    imagens: [
      { src: `${PASTA}/kitesurf.jpg`, alt: 'Kitesurf na represa ao pôr do sol', caixa: [156.3, 211.7, 524, 751], foco: '50% 50%' },
      { src: `${PASTA}/jet-ski-casal.jpg`, alt: 'Casal num jet ski', caixa: [740.8, 146.4, 1300.1, 465.4], foco: '50% 45%', focoEmPe: '32% 40%' },
      { src: `${PASTA}/jet-ski.jpg`, alt: 'Jet ski em curva, levantando água', caixa: [741.9, 486.4, 1299.1, 791.9], foco: '60% 50%', filme: 'nautica-jet-ski' },
    ],
    titulo: { linhas: ['O prazer de viver a água', 'em toda a sua intensidade'], cx: 342.4, y: 124.3, emblema: true },
    linhas: [PE],
  },
  {
    id: 'piscina-descanso',
    capitulo: 'A represa',
    fundo: 'foto',
    retrato: 'foto',
    imagens: [{ src: `${PASTA}/piscina-descanso.jpg`, alt: 'Mulher descansando à beira da piscina, de óculos escuros', caixa: TODA, sangra: SANGRA_TUDO, foco: '58% 50%', focoEmPe: '74% 50%' }],
    linhas: [PE],
  },
  {
    id: 'mesma-paisagem',
    capitulo: 'A represa',
    fundo: 'creme',
    retrato: 'moldura',
    imagens: [{ src: `${R}/deck-da-piscina.jpg`, alt: 'Deck da piscina da casa-clube, com a represa ao fundo', caixa: MOLDURA, foco: '40% 60%' }],
    titulo: { linhas: ['E encontrar, na mesma paisagem'], cx: 1020.5, y: 855.2, emblema: true },
    rotulo: { texto: 'Piscina com vista para a represa', cx: 1020.5, y: 894.7 },
    linhas: [PE],
  },
  {
    id: 'raro-agua',
    capitulo: 'A represa',
    fundo: 'foto',
    retrato: 'foto',
    imagens: [{ src: `${PASTA}/mao-na-agua.jpg`, alt: 'Mão tocando a água da piscina aquecida', caixa: TODA, sangra: SANGRA_TUDO, foco: '55% 50%', focoEmPe: '38% 50%' }],
    linhas: [PE],
  },

  // ——— Bem-estar
  {
    id: 'tempo-do-corpo',
    capitulo: 'Bem-estar',
    fundo: 'claro',
    retrato: 'moldura',
    imagens: [{ src: `${PASTA}/spa-vapor.jpg`, alt: 'Mulher descansando no spa, com o vapor da piscina aquecida', caixa: MOLDURA, foco: '45% 50%' }],
    titulo: { linhas: ['O tempo de que o corpo precisa'], cx: 1020.7, y: 855.2, emblema: true },
    rotulo: { texto: 'Wellness • Spa • Saunas • Área de descanso', cx: 1020.5, y: 894.7 },
    linhas: [PE],
  },
  {
    id: 'bem-estar',
    capitulo: 'Bem-estar',
    fundo: 'creme',
    retrato: 'mosaico',
    imagens: [
      { src: `${PASTA}/academia-corredor.jpg`, alt: 'Academia envidraçada, com vista para a represa', caixa: [38.5, 38.5, 641.9, 925.4], foco: '50% 50%' },
      { src: `${PASTA}/academia-alongamento.jpg`, alt: 'Mulher se alongando na academia', caixa: [733.1, 146.4, 1292.4, 465.4], foco: '55% 40%' },
      { src: `${PASTA}/academia-bike.jpg`, alt: 'Treino na bicicleta da academia', caixa: [733.1, 487.5, 1292.4, 806.5], foco: '50% 50%' },
    ],
    titulo: { linhas: ['Para cultivar o bem-estar'], cx: 1020.7, y: 876.5, emblema: true },
    rotulo: { texto: 'Wellness • Academia', cx: 1020.5, y: 915.9 },
    linhas: [DA_FOTO(66.1, DOBRA, [737.5, 777, 792.6, 763.9, 741.7])],
  },
  {
    id: 'todos-os-dias',
    capitulo: 'Bem-estar',
    fundo: 'claro',
    retrato: 'moldura',
    imagens: [{ src: `${PASTA}/corrida-margem.jpg`, alt: 'Casal correndo na pista à beira da represa', caixa: MOLDURA, foco: '50% 55%' }],
    titulo: { linhas: ['Todos os dias'], cx: 1020.5, y: 855.2, emblema: true },
    rotulo: { texto: 'Vida ao ar livre', cx: 1020.5, y: 894.7 },
    linhas: [PE],
  },

  // ——— Esporte
  respiro('quadras', 'Esporte', `${PASTA}/quadras-aerea.jpg`, 'As quadras de tênis vistas do alto, com a represa ao fundo', '55% 55%', { filme: 'racket-club-quadra' }),
  {
    id: 'esporte',
    capitulo: 'Esporte',
    fundo: 'creme',
    retrato: 'mosaico',
    imagens: [
      { src: `${PASTA}/tenis-casal.jpg`, alt: 'Casal caminhando na quadra de saibro', caixa: [116.1, 153.8, 564.3, 809.7], foco: '50% 45%', filme: 'racket-club-casal' },
      { src: `${PASTA}/raquete.jpg`, alt: 'Raquete e bola de tênis', caixa: [739.4, 153.8, 1301.5, 474.4], foco: '50% 50%', focoEmPe: '70% 50%' },
      { src: `${PASTA}/saque.jpg`, alt: 'Saque na quadra, com a represa ao fundo', caixa: [739.4, 490, 1301.5, 810.6], foco: '45% 50%' },
    ],
    titulo: { linhas: ['E fazer do esporte um ponto de encontro'], cx: 1020.5, y: 855.2, emblema: true },
    rotulo: { texto: 'Racket club • Tênis, padel e beach tennis', cx: 1020.5, y: 894.7 },
    linhas: [PE],
  },

  // ——— Convívio
  respiro('horta-aerea', 'Convívio', `${PASTA}/horta-aerea.jpg`, 'A horta orgânica vista do alto, com a represa ao fundo', '50% 55%'),
  {
    id: 'geracoes',
    capitulo: 'Convívio',
    fundo: 'claro',
    retrato: 'moldura',
    imagens: [{ src: `${PASTA}/horta-mae-e-filha.jpg`, alt: 'Mãe e filha colhendo na horta', caixa: MOLDURA, foco: '45% 50%' }],
    titulo: { linhas: ['A natureza aproxima gerações'], cx: 1020.5, y: 855.2, emblema: true },
    rotulo: { texto: 'Horta orgânica', cx: 1020.5, y: 894.7 },
    linhas: [PE],
  },
  {
    id: 'casa',
    capitulo: 'Convívio',
    fundo: 'claro',
    retrato: 'moldura',
    imagens: [{ src: `${R}/lounge.jpg`, alt: 'O lounge da casa-clube, com a represa ao fundo', caixa: MOLDURA, foco: '50% 55%' }],
    titulo: { linhas: ['E o convívio ganha', 'o acolhimento de uma casa'], cx: 1021.7, y: 849.8, emblema: true },
    rotulo: { texto: 'Casa-clube', cx: 1020.5, y: 914.5 },
    linhas: [PE],
  },
  {
    id: 'receber',
    capitulo: 'Convívio',
    fundo: 'creme',
    retrato: 'mosaico',
    imagens: [
      { src: `${PASTA}/whisky.jpg`, alt: 'Whisky servido no bar', caixa: [38.5, 38.5, 641.8, 925.3], foco: '50% 50%' },
      { src: `${PASTA}/bar-restaurante.jpg`, alt: 'O bar e restaurante da casa-clube ao entardecer', caixa: [730.7, 297.7, 1310.3, 683.2], foco: '50% 50%' },
    ],
    titulo: { linhas: ['Onde o prazer de receber se prolonga sem pressa'], cx: 1018.4, y: 797, emblema: true },
    rotulo: { texto: 'Bar e restaurante', cx: 1020.5, y: 841.2 },
    linhas: [DA_FOTO(148.8, DOBRA, [737.5, 777, 792.6, 763.9, 741.7])],
  },
  respiro('pes-na-grama', 'Convívio', `${PASTA}/pes-na-grama.jpg`, 'Crianças correndo descalças na grama', '50% 60%', { focoEmPe: '24% 60%' }),
  {
    id: 'infancia',
    capitulo: 'Convívio',
    fundo: 'claro',
    retrato: 'mosaico',
    imagens: [
      // a foto original é mais larga que o recorte do book: a sobra à esquerda aparece quando a
      // tela passa da página, sem cortar o menino; numa tela do tamanho da página fica igual ao book
      { src: `${PASTA}/menino-bola-largo.jpg`, emPe: `${PASTA}/menino-bola.jpg`, alt: 'Menino com a bola na margem da represa', caixa: [-395.4, -1, 681.4, 964.9], sangra: ['topo', 'base'], foco: '100% 50%', focoEmPe: '40% 50%' },
      { src: `${PASTA}/playground-familia.jpg`, alt: 'Família no playground de madeira', caixa: [729.6, 323.3, 1311.4, 655.1], foco: '50% 50%' },
    ],
    titulo: { linhas: ['E a infância encontra espaço', 'para crescer livre'], cx: 1021.6, y: 766.8, emblema: true },
    rotulo: { texto: 'Praça e playground', cx: 1020.5, y: 837.4 },
    linhas: [DA_FOTO(125.6, 681.4, [736.7, 776.2, 791.8, 763.1, 740.9])],
  },
  respiro('praca', 'Convívio', `${R}/praca.jpg`, 'A praça, com bancos à sombra da árvore', '50% 55%', { focoEmPe: '66% 55%' }),

  // ——— Lazer e natureza
  {
    id: 'heliponto',
    capitulo: 'Lazer e natureza',
    fundo: 'claro',
    retrato: 'moldura',
    imagens: [{ src: `${PASTA}/heliponto.jpg`, alt: 'Helicóptero pousado no heliponto, à beira da represa', caixa: MOLDURA, foco: '45% 55%', filme: 'heliponto-helicoptero' }],
    titulo: { linhas: ['Heliponto homologado pela ANAC'], cx: 1020.5, y: 855.2, emblema: true },
    linhas: [PE],
  },
  respiro('lancha-cachoeira', 'Lazer e natureza', `${PASTA}/lancha-cachoeira.jpg`, 'Lancha ao pé da cachoeira', '55% 50%', { focoEmPe: '42% 50%' }),
  {
    id: 'convite',
    capitulo: 'Lazer e natureza',
    fundo: 'creme',
    retrato: 'moldura',
    imagens: [{ src: `${PASTA}/cachoeira-aerea.jpg`, alt: 'Lancha no lago da cachoeira, vista do alto', caixa: MOLDURA, foco: '55% 50%' }],
    titulo: { linhas: ['Um convite para descobrir', 'o que a paisagem guarda'], cx: 1021.7, y: 855.2, emblema: true },
    linhas: [PE],
  },
  respiro('bike', 'Lazer e natureza', `${PASTA}/bike-trilha.jpg`, 'Ciclista na trilha, com a represa ao fundo', '60% 50%', { focoEmPe: '78% 50%' }),
  {
    id: 'novos-caminhos',
    capitulo: 'Lazer e natureza',
    fundo: 'claro',
    retrato: 'mosaico',
    imagens: [
      { src: `${PASTA}/cavalgada.jpg`, alt: 'Menina galopando à beira da represa', caixa: [362.5, 193.3, 997.4, 769.7], foco: '50% 50%' },
      { src: `${PASTA}/botas.jpg`, alt: 'Botas de montaria no estribo', caixa: [38.5, 38.6, 349.8, 466.5], foco: '50% 50%' },
      { src: `${PASTA}/casal-a-cavalo.jpg`, alt: 'Casal a cavalo', caixa: [1010.9, 497.1, 1322, 925.1], foco: '50% 50%' },
    ],
    titulo: { linhas: ['E percorrer', 'novos caminhos'], cx: 1167.7, y: 324.1, emblema: true },
    rotulo: { texto: ['Trilha de 3 km para corrida,', 'caminhada e bicicleta'], cx: 1167.1, y: 388.6 },
    linhas: [PE],
  },
  {
    id: 'reserva',
    capitulo: 'Lazer e natureza',
    fundo: 'creme',
    retrato: 'mosaico',
    imagens: [
      { src: `${PASTA}/utv-casal.jpg`, alt: 'Pai e filho num utilitário pela reserva', caixa: [38.6, 307.7, 641.7, 656], foco: '50% 50%', focoEmPe: '76% 50%' },
      { src: `${PASTA}/reserva-campo.jpg`, alt: 'O campo da reserva, com a represa ao fundo', caixa: [718.9, 39.7, 1322, 560.3], foco: '50% 50%' },
      { src: `${PASTA}/utv-por-do-sol.jpg`, alt: 'Utilitário na trilha ao pôr do sol', caixa: [719, 581.2, 1322, 925.1], foco: '60% 50%' },
    ],
    titulo: { linhas: ['No ritmo da natureza'], cx: 340.5, y: 766.4, emblema: true, tamanho: 23.9 },
    rotulo: { texto: 'Reserva', cx: 340.2, y: 809.8 },
    linhas: [PE],
  },
  {
    id: 'raizes',
    capitulo: 'Lazer e natureza',
    fundo: 'claro',
    retrato: 'moldura',
    imagens: [{ src: `${PASTA}/fogueira.jpg`, alt: 'Casal ao redor da fogueira, à beira da represa', caixa: MOLDURA, foco: '50% 55%' }],
    titulo: { linhas: ['Um lugar para criar raízes'], cx: 1020.5, y: 855.2, emblema: true },
    linhas: [PE],
  },
  respiro('crepusculo', 'Lazer e natureza', `${PASTA}/veleiro-crepusculo.jpg`, 'Veleiro ancorado no crepúsculo', '55% 55%', { focoEmPe: '67% 55%' }),

  // ——— Projeto
  {
    id: 'projeto',
    capitulo: 'Projeto',
    fundo: 'azul',
    retrato: 'capitulo',
    imagens: [
      // o cartão vai até a margem da tela; o desenho e o título ficam no meio dele (decisão do Gustavo, 09/11)
      // o desenho cobre o cartão, preso no pé: no cartão estreito mostra a parte da direita, como
      // o book; no largo aparece inteiro, no meio do cartão
      {
        src: `${PASTA}/desenho-projeto.jpg`,
        alt: 'Desenho a lápis da casa-clube entre as árvores',
        caixa: [720, 39.7, 1320.9, 924.1],
        sangra: ['direita', 'topo', 'base'],
        fixa: true,
        foco: '100% 100%',
      },
    ],
    textos: [{ x: 1020.5, y: 402.6, centro: true, fonte: 'ivy-reto', tamanho: 21, cor: COBRE, espaco: 0.64, caixaAlta: true, linhas: ['Projeto'], emblema: true, emblemaAcima: 46, papel: 'titulo', meioDaSobra: true }],
    linhas: [{ y: 114.3, de: 720, ate: [791.4, 830.8, 846.4, 817.8, 795.6] }],
  },
  {
    id: 'lotes',
    capitulo: 'Projeto',
    fundo: 'foto',
    retrato: 'foto',
    imagens: [{ src: `${PASTA}/aerea-lotes.jpg`, alt: 'Perspectiva aérea da península com os lotes', caixa: TODA, sangra: SANGRA_TUDO, foco: '50% 55%' }],
    titulo: { linhas: ['52 lotes de 2.000 a 4.554 m²'], cx: 1020.5, y: 855.2, claro: true, emblema: true },
    rotulo: { texto: 'Náutica, casa-clube e reserva', cx: 1020.5, y: 894.7, claro: true },
    textos: [{ x: 39.7, y: 918.3, tamanho: 6, cor: '#fff', linhas: ['Perspectiva aérea ilustrada'], papel: 'legenda', beira: ['esquerda', 'base'] }],
  },
  {
    id: 'edicao-limitada',
    capitulo: 'Projeto',
    fundo: 'branco',
    retrato: 'texto',
    imagens: [{ src: `${PASTA}/peninsula-vertical.jpg`, alt: 'Perspectiva aérea da península, com a casa-clube e as quadras', caixa: [0, 0, 681.4, ALTURA], sangra: ['esquerda', 'topo', 'base'], foco: '50% 60%' }],
    retangulos: [{ caixa: [40.7, 40.5, 1320, 922.1], cor: '#f4f0ea', contorno: true, beira: SANGRA_TUDO }],
    textos: [
      { x: 859.2, y: 387.7, fonte: 'ivy', tamanho: 21, entrelinha: 25.2, cor: NAVY, caixaAlta: true, linhas: ['Um condomínio pé na água', 'de edição limitada'], emblema: true, papel: 'titulo' },
      { x: 859.2, y: 452.3, largura: 337.6, tamanho: 10, entrelinha: 12, cor: COBRE, paragrafos: ['O Villa Stradale foi criado sobre uma península irreplicável em Piracaia, a 96 km de São Paulo.'], papel: 'destaque' },
      {
        x: 859.2,
        y: 501.4,
        largura: 337.6,
        justificar: true,
        tamanho: 10,
        entrelinha: 17,
        cor: NAVY,
        paragrafos: [
          'Assinado pelo arquiteto francês Greg Bousquet (AO) e pelo paisagista mineiro Luiz Carlos Orsini, o projeto reúne arquitetura em estado de pouso, paisagismo nativo e uma infraestrutura desenhada para o silêncio e o bem-estar.',
          'São 52 lotes residenciais voltados à água, com casa-clube, marina, heliponto, quadras esportivas e infraestrutura subterrânea, em um território protegido por segurança 24h por terra e por água.',
        ],
        papel: 'corpo',
      },
      { x: 65.8, y: 891.6, tamanho: 6, cor: '#fff', linhas: ['Perspectiva aérea ilustrada'], papel: 'legenda', beira: ['esquerda', 'base'] },
    ],
    linhas: [{ y: 106.1, de: 681.4, ate: [751.7, 791.2, 806.8, 778.1, 755.9] }, MARGEM, { ...MARGEM, de: 1320.5, ate: 'borda' }],
  },
  {
    id: 'masterplan',
    capitulo: 'Projeto',
    fundo: 'azul',
    retrato: 'especial',
    especial: 'masterplan',
    imagens: [CARTAO, { src: `${PASTA}/masterplan.jpg`, alt: 'Perspectiva ilustrada da implantação, com os equipamentos numerados', caixa: [75.1, 78, 1025.7, 883.2], ampliavel: true }],
    textos: [
      { x: 1163.6, y: 304.9, centro: true, fonte: 'ivy', tamanho: 21, cor: NAVY, caixaAlta: true, linhas: ['Masterplan'], emblema: true, papel: 'titulo' },
      { x: 102.3, y: 849.6, tamanho: 6, cor: '#fff', linhas: ['Perspectiva ilustrada da Implantação'], papel: 'legenda' },
    ],
    linhas: [{ y: 114.3, de: 'borda', ate: [57.2, 96.7, 112.3, 83.6, 61.4] }],
  },
  {
    id: 'implantacao',
    capitulo: 'Projeto',
    fundo: 'azul',
    retrato: 'especial',
    especial: 'implantacao',
    imagens: [CARTAO],
    textos: [{ x: 680.3, y: 92, centro: true, fonte: 'ivy', tamanho: 21, cor: NAVY, caixaAlta: true, linhas: ['Implantação'], emblema: true, papel: 'titulo' }],
    linhas: [{ y: 114.3, de: 'borda', ate: [57.2, 96.7, 112.3, 83.6, 61.4] }],
  },
  {
    id: 'arquitetura',
    capitulo: 'Projeto',
    fundo: 'azul',
    retrato: 'texto',
    imagens: [CARTAO, { src: '/images/casaclube/arquitetos/greg-bousquet.jpg', alt: 'Greg Bousquet, arquiteto', caixa: [144.8, 223.1, 549.6, 739.1], foco: '50% 35%', focoEmPe: '50% 22%' }],
    textos: [
      { x: 863.7, y: 292.8, fonte: 'swiss-leve', tamanho: 21, entrelinha: 24, cor: NAVY, linhas: ['Arquitetura em', 'estado de pouso'], emblema: true, papel: 'titulo' },
      { x: 865.7, y: 353.7, fonte: 'swiss-leve', tamanho: 10, cor: COBRE, espaco: 0.55, caixaAlta: true, linhas: ['Arquitetura'], papel: 'rotulo' },
      { x: 865.4, y: 432, fonte: 'ivy', tamanho: 21, cor: COBRE, caixaAlta: true, linhas: ['AO / Greg Bousquet'], papel: 'destaque' },
      {
        x: 865.4,
        y: 478.1,
        largura: 324,
        justificar: true,
        tamanho: 10,
        entrelinha: 17,
        cor: NAVY,
        paragrafos: [
          'O francês Greg Bousquet é arquiteto formado na École de Paris, com mestrados pela ENSA Paris‑La Villette e pela Sorbonne. Cofundador da Triptyque, acumulou 23 anos de trajetória internacional antes de fundar, em 2021, a Architects Office (AO) — agência de arquitetura, urbanismo e interiores com sedes em São Paulo e Lisboa. A AO atua em 14 estados no Brasil e em países como Peru, Chile e Portugal, sempre com foco em urbanismo virtuoso e arquitetura ética.',
          'No Villa Stradale, Greg parte do princípio de que a natureza é protagonista; a resposta formal é arquitetura em estado de pouso: volumes baixos, pedra e madeira que assumem a pátina do tempo, vãos que enquadram a água e a casa-clube voltada ao poente. A “linha de silêncio” resguarda as quadras, e o heliponto recuado permanece junto à marina — quiet luxury percebido no conforto, na luz e na honestidade dos materiais.',
        ],
        papel: 'corpo',
      },
    ],
    linhas: [SOBRE_RETRATO],
  },
  {
    id: 'paisagismo',
    capitulo: 'Projeto',
    fundo: 'azul',
    retrato: 'texto',
    imagens: [CARTAO, { src: '/images/casaclube/arquitetos/luiz-carlos-orsini.jpg', alt: 'Luiz Carlos Orsini, paisagista', caixa: [144.8, 223.1, 549.4, 739.2], foco: '50% 35%', focoEmPe: '50% 18%' }],
    textos: [
      { x: 863.7, y: 291.2, fonte: 'swiss-leve', tamanho: 21, entrelinha: 24, cor: NAVY, linhas: ['Paisagismo como', 'moldura viva'], emblema: true, papel: 'titulo' },
      { x: 865.7, y: 352.1, fonte: 'swiss-leve', tamanho: 10, cor: COBRE, espaco: 0.55, caixaAlta: true, linhas: ['Paisagismo'], papel: 'rotulo' },
      { x: 865.4, y: 433, fonte: 'ivy', tamanho: 21, cor: COBRE, caixaAlta: true, linhas: ['Orsini'], papel: 'destaque' },
      {
        x: 865.4,
        y: 479.1,
        largura: 339,
        justificar: true,
        tamanho: 10,
        entrelinha: 17,
        cor: NAVY,
        paragrafos: [
          'O mineiro Luiz Carlos Orsini (BH) é paisagista formado em 1984 na Escuela de Jardinería y Paisajismo “Castillo de Batres” (Madri). Atua desde 1979 e se tornou um dos nomes centrais do paisagismo brasileiro contemporâneo. Entre 2000 e 2004, foi responsável por 25 ha do Instituto Inhotim, referência mundial em paisagismo tropical. Autor de Luiz Carlos Orsini — 30 Anos de Paisagismo (2008) e Orsini (2017), mantém escritórios em SP e BH, com reconhecida expertise em jardins de grande escala.',
          'No Villa Stradale, o escritório Orsini define o conceito de moldura viva: o verde não decora, prolonga o horizonte — bosque nativo nas encostas, faixa‑praia minimalista na orla e pista de cooper que costura decks, mirantes e nichos de pausa. Predominam espécies nativas (Mata Atlântica com inserções de Cerrado), drenagem/irrigação passivas e manutenção quase silenciosa — atmosfera que o autor descreveu como “270 graus de paz”.',
        ],
        papel: 'corpo',
      },
    ],
    linhas: [SOBRE_RETRATO],
  },

  // ——— Perspectivas
  perspectiva(41, `${R}/portaria.jpg`, 'da Portaria', 'A portaria, com o muro de pedra e o nome do condomínio'),
  perspectiva(42, `${R}/casa-clube-serra.jpg`, 'geral', 'A casa-clube vista do alto, com a serra ao fundo', undefined, 'casa-clube-aerea'),
  perspectiva(43, `${R}/casa-clube-chegada.jpg`, 'geral', 'A chegada à casa-clube', [38.6, 187.4, 1322.1, 776.4]),
  perspectiva(44, `${R}/deck-do-alto.jpg`, 'geral', 'O deck da piscina visto do alto'),
  perspectiva(45, `${R}/piscina.jpg`, 'da Piscina', 'A piscina da casa-clube'),
  perspectiva(46, `${R}/deck-da-piscina.jpg`, 'da Piscina', 'O deck da piscina, com a represa ao fundo'),
  perspectiva(47, `${R}/bar.jpg`, 'do Bar', 'O bar da casa-clube', undefined, 'casa-clube-perspectiva'),
  perspectiva(48, `${R}/restaurante-por-do-sol.jpg`, 'do Restaurante', 'O restaurante ao pôr do sol'),
  perspectiva(49, `${R}/sala-de-jogos-noite.jpg`, 'do Lounge', 'A sala de jogos à noite'),
  perspectiva(50, `${R}/lounge.jpg`, 'do Lounge', 'O lounge com lareira'),
  perspectiva(51, `${R}/restaurante-salao.jpg`, 'do Restaurante', 'O salão do restaurante', [38.5, 187.4, 1322, 776.4]),
  perspectiva(52, `${R}/academia.jpg`, 'da Academia', 'A academia envidraçada'),
  perspectiva(53, `${R}/casa-clube-noite.jpg`, 'do Wellness', 'A casa-clube iluminada à noite', [38.6, 187.4, 1322.1, 776.4]),
  perspectiva(54, `${R}/vao-para-a-agua.jpg`, 'geral', 'O vão da casa-clube aberto para a água'),
  perspectiva(55, `${R}/varanda.jpg`, 'geral', 'A varanda da casa-clube'),
  perspectiva(56, `${R}/patio-das-palmeiras.jpg`, 'geral', 'O pátio das palmeiras'),
  perspectiva(57, `${R}/espelho-dagua.jpg`, 'geral', 'O espelho d’água sob a casa-clube'),
  perspectiva(58, `${R}/spa.jpg`, 'do Wellness', 'O spa com piscina aquecida'),
  perspectiva(59, `${R}/sauna.jpg`, 'da Sauna', 'A sauna com vista para a represa'),
  perspectiva(60, `${R}/playground.jpg`, 'do Playground', 'O playground de madeira'),
  perspectiva(61, `${R}/praca.jpg`, 'da Praça', 'A praça sob a árvore'),
  perspectiva(62, `${R}/racket-club.jpg`, 'das Quadras', 'As quadras de tênis e padel'),
  perspectiva(63, `${R}/horta.jpg`, 'da Horta', 'A horta orgânica'),
  perspectiva(64, `${R}/nautica.jpg`, 'da Marina', 'A marina, com lancha na represa'),

  // ——— Diferenciais
  {
    id: 'diferenciais',
    capitulo: 'Diferenciais',
    fundo: 'desenho',
    retrato: 'especial',
    especial: 'diferenciais',
    imagens: [
      { src: `${PASTA}/desenho-diferenciais.jpg`, alt: 'Desenho a lápis da casa-clube entre as árvores', caixa: [0, 0, 1164.6, ALTURA], fixa: true, foco: '50% 50%', esfuma: ['esquerda', 'topo', 'base'] },
      { src: `${PASTA}/desenho-diferenciais-direita-2.jpg`, alt: '', caixa: [1152.6, 0, LARGURA, ALTURA], fixa: true, foco: '0% 50%', esfuma: ['direita', 'topo', 'base'] },
    ],
    // o painel azul vai até a margem da tela, e a lista fica onde está (decisão do Gustavo, 09/11)
    retangulos: [{ caixa: [855.9, 39.7, 1320.9, 924.1], cor: '#002c58', beira: ['direita', 'topo', 'base'] }],
    emblemaSolto: [252.7, 134.5, 454.5, 179],
    textos: [{ x: 983.9, y: 282.7, fonte: 'ivy', tamanho: 21, cor: CREME, caixaAlta: true, linhas: ['Diferenciais'], papel: 'titulo' }],
    linhas: [{ y: 128.3, de: 855.9, ate: [927.2, 982.1, 1012, 953.6, 931.4] }],
  },

  // ——— Incorporador
  {
    id: 'incorporador',
    capitulo: 'Incorporador',
    fundo: 'pedro',
    retrato: 'texto',
    imagens: [{ src: '/images/pessoas/pedro-costa.jpg', alt: 'Pedro Costa, incorporador do Villa Stradale', caixa: [166.7, 226.8, 513, 736.9], foco: '50% 40%', focoEmPe: '50% 18%' }],
    textos: [
      { x: 761.8, y: 298.9, fonte: 'ivy', tamanho: 21, entrelinha: 27, cor: COBRE, caixaAlta: true, linhas: ['“Primeiro foi um sonho;', 'por acaso, virou empreendimento”'], emblema: true, papel: 'titulo' },
      { x: 761.8, y: 364.1, fonte: 'swiss-leve', tamanho: 10, cor: COBRE, espaco: 0.55, caixaAlta: true, linhas: ['Pedro Costa/Fundador'], papel: 'rotulo' },
      {
        x: 761.8,
        y: 420.9,
        largura: 236.7,
        tamanho: 9.8,
        entrelinha: 16.4,
        cor: NAVY,
        paragrafos: [
          'Pedro Costa é o incorporador por trás do Villa Stradale Península. Através de um desejo incansável de construir um projeto único, ele escolheu uma península irreplicável às margens da represa de Piracaia (SP), com um objetivo: transformar um sonho entre amigos numa edição limitada de 52 lotes, curada por afinidade.',
          'Seu papel não é “ser dono”, é ser custódio de um território raro, garantindo que o tempo vire memória e legado para as próximas gerações. Por isso, assumiu a responsabilidade de preservar a cultura boutique, discreta e “pé na água” que define o projeto.',
          'Pedro iniciou a carreira aos 17 anos na empresa da família (Caçula de Pneus), formou-se em Administração (FAAP) com pós em Business Management (INSPER) e liderou a operação como COO, conduzindo a expansão e a posterior venda da companhia ao grupo italiano Pirelli. Logo em seguida,',
        ],
        papel: 'corpo',
      },
      {
        x: 1038.1,
        y: 418.9,
        largura: 234.5,
        tamanho: 9.8,
        entrelinha: 16.4,
        cor: NAVY,
        paragrafos: [
          'em uma empreitada “solo”, criou a Stradale Car Service em 2018, focada na manutenção e reparação de veículos premium, consagrando-se como a flagship store da Michelin no Brasil, hoje contando com três lojas em seu portfólio. E foi em 2020 que nasceu o braço imobiliário do grupo, a Stradale Empreendimentos Imobiliários, trazendo para o mercado projetos autorais no segmento de segunda residência “ultra high”.',
          'Com o sucesso no varejo e com a vertical imobiliária decolando, o jovem empresário recebeu o prêmio da Forbes Under 30 — uma prestigiada lista anual da revista Forbes que destaca jovens de até 30 anos que revolucionam negócios, transformam o mundo e se destacam em suas áreas de atuação. Como curiosidade, Pedro também é piloto profissional de automobilismo, contando com títulos como o de campeão sul-americano da Porsche GT3 Cup de 2017.',
        ],
        papel: 'corpo',
      },
    ],
    linhas: [SOBRE_RETRATO],
  },

  // ——— Localização
  {
    id: 'mapa',
    capitulo: 'Localização',
    fundo: 'neutro',
    retrato: 'especial',
    especial: 'mapa',
    imagens: [{ src: `${PASTA}/croqui-regiao.jpg`, alt: 'Croqui da região: a represa, a península e as cidades em volta', caixa: [38.5, 39.6, 1322, 926.3], ampliavel: true }],
    textos: [{ x: 53, y: 906.9, tamanho: 6, cor: '#fff', linhas: ['Croqui de localização sem escala'], papel: 'legenda' }],
    linhas: [DA_MARGEM],
  },
  {
    id: 'piracaia',
    capitulo: 'Localização',
    fundo: 'creme',
    retrato: 'texto',
    imagens: [
      { src: `${R}/regiao-peninsula.jpg`, alt: 'A represa e as montanhas de Piracaia, vistas do alto', caixa: [38.6, 38.6, 641.8, 925.2], foco: '55% 50%', filme: 'regiao-peninsula' },
      { src: `${PASTA}/piracaia-1.jpg`, alt: 'Cachoeira entre a mata', caixa: [718.9, 182, 921.2, 413.4], foco: '50% 50%' },
      { src: `${PASTA}/piracaia-2.jpg`, alt: 'A igreja matriz de Piracaia', caixa: [719, 435, 921.3, 665.6], foco: '50% 50%' },
      { src: `${PASTA}/piracaia-3.jpg`, alt: 'Mesa posta num restaurante com vista para as montanhas', caixa: [718.9, 687, 921.2, 918.6], foco: '50% 50%' },
    ],
    textos: [
      { x: 957.8, y: 486, fonte: 'ivy', tamanho: 21, cor: COBRE, caixaAlta: true, linhas: ['Piracaia - São Paulo'], emblema: true, papel: 'titulo' },
      {
        x: 957.8,
        y: 550.9,
        largura: 263.6,
        tamanho: 10,
        entrelinha: 17,
        cor: NAVY,
        paragrafos: [
          'Poucos lugares reúnem natureza, autenticidade e beleza em equilíbrio tão raro. Piracaia é um refúgio serrano do interior paulista, onde a Serra da Mantiqueira se encontra com as águas do Sistema Cantareira, criando uma paisagem viva que combina montanha, horizonte e serenidade.',
          'O antigo vilarejo de Santo Antônio da Cachoeira preserva o que o tempo consagrou: ruas tranquilas, comércio local, vida em torno da praça e uma fé que faz parte da rotina. Esse espírito de comunidade e permanência cria o pano de fundo ideal para um modo de vida mais essencial, em que o tempo corre de outro jeito e cada final de semana se prolonga. A represa se abre em penínsulas e enseadas perfeitas para esportes náuticos, passeios de barco e contemplação. No alto, o Santo Cruzeiro guarda a cidade; no centro, a Igreja Matriz revela o teto pintado com todos os papas, símbolos da história e da devoção que moldam o lugar.',
          'Piracaia reflete o que o Villa Stradale representa: um território que acolhe, preserva e convida a criar raízes.',
        ],
        papel: 'corpo',
      },
    ],
    linhas: [DA_MARGEM, DA_FOTO(87.9, DOBRA, [737.5, 777, 792.6, 763.9, 741.7])],
  },

  // ——— Encerramento
  {
    id: 'contracapa',
    capitulo: 'Encerramento',
    fundo: 'azul',
    retrato: 'especial',
    especial: 'contracapa',
    imagens: [],
  },
];

TELAS.forEach((t, i) => {
  if (t.id !== 'implantacao') t.pagina = i < 38 ? i + 1 : i;
});
