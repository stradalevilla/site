/**
 * As categorias da barra do topo, conforme o mapa do menu do documento de
 * estrutura do cliente: "Seis categorias na barra. O logo leva à Home."
 *
 * Villa Stradale saiu da barra: o conteúdo dela mudou para a home, que é
 * onde o logo leva.
 *
 * Cada categoria é UMA página; os itens listados no documento embaixo de cada
 * uma são as seções dessa página, alcançadas por âncora (ex.: /localizacao#piracaia).
 *
 * `href` ausente = página ainda não construída. O item aparece na barra, em tom
 * mais baixo e sem clique, em vez de virar link quebrado.
 */
export interface ItemMenu {
  label: string;
  href?: string;
  /** As seções da página, para quando a navegação por âncora for ligada */
  secoes?: { label: string; hash: string }[];
}

export const menu: ItemMenu[] = [
  {
    label: 'Quem somos',
    href: '/quem-somos',
    secoes: [{ label: 'Fundador e stakeholders', hash: '#stakeholders' }],
  },
  {
    label: 'Masterplan',
    href: '/lotes',
    secoes: [{ label: 'Explorar lotes', hash: '' }],
  },
  {
    label: 'Lifestyle',
    secoes: [
      { label: 'Esportes', hash: '#esportes' },
      { label: 'Comunidade', hash: '#comunidade' },
      { label: 'Vídeos', hash: '#videos' },
    ],
  },
  {
    label: 'Localização',
    href: '/localizacao',
    // na ordem em que a página conta a história
    secoes: [
      { label: 'A Região', hash: '#a-regiao' },
      { label: 'Piracaia', hash: '#piracaia' },
      { label: 'Como chegar', hash: '#como-chegar' },
    ],
  },
  {
    label: 'Obras',
    secoes: [
      { label: 'Acompanhe a obra', hash: '#obra' },
      { label: 'Mini docs', hash: '#mini-docs' },
    ],
  },
  {
    label: 'Mídia',
    secoes: [
      { label: 'Imprensa', hash: '#imprensa' },
      { label: 'Newsletter', hash: '#newsletter' },
    ],
  },
];

/** A barra divide as seis em dois grupos, com o logo no meio */
/**
 * A barra se divide nos dois lados do logo. O corte é a metade arredondada
 * para baixo: com um número ímpar de itens, a sobra vai para a direita, onde
 * os rótulos são mais curtos.
 */
const meioDaBarra = Math.floor(menu.length / 2);
export const menuEsquerda = menu.slice(0, meioDaBarra);
export const menuDireita = menu.slice(meioDaBarra);
