/**
 * As seis categorias da barra do topo, conforme o mapa do menu do documento
 * de estrutura do cliente: "Seis categorias na barra. O logo leva à Home."
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
    label: 'Villa Stradale',
    href: '/villa-stradale',
    secoes: [
      { label: 'O Projeto', hash: '#o-projeto' },
      { label: 'Arquitetura + Paisagismo', hash: '#arquitetura-paisagismo' },
      { label: 'Stakeholders', hash: '#stakeholders' },
    ],
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
export const menuEsquerda = menu.slice(0, 3);
export const menuDireita = menu.slice(3);
