/**
 * Áreas de interesse marcadas sobre a implantação, além dos lotes: casa clube,
 * marina, quadras. Ao passar o mouse, em vez do número que os lotes mostram,
 * aparece um card com a foto do lugar.
 *
 * Coordenadas no mesmo espaço dos lotes (canvas 1822x1015 da Implantação.png),
 * então as duas camadas convivem no mesmo SVG.
 */

export interface PontoInteresse {
  id: string;
  nome: string;
  /** Uma linha, aparece abaixo do nome no card */
  chamada?: string;
  /** Pares "x,y" no espaço do canvas, prontos para <polygon points> */
  pontos: string;
  /**
   * Foto do card. Usar as versões em /images/implantacao/cards: são recortes
   * leves (~80 KB) das fotos originais, que passam de 6 MB — pesado demais
   * para algo que aparece e some com o mouse.
   */
  imagem: string;
  /** Âncora da página para onde o clique leva; sem isso, a área não é clicável */
  destino?: string;
}

export const pontosInteresse: PontoInteresse[] = [
  {
    id: 'casa-clube',
    nome: 'Casa Clube',
    chamada: 'Piscina, spa, restaurante e bar com vista para a água',
    pontos: '632,542 672,564 768,596 798,618 805,653 778,653 717,607 640,572',
    imagem: '/images/implantacao/cards/casa-clube.jpg',
    destino: '#casa-clube',
  },
];
