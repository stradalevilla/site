/**
 * As imagens do empreendimento, em um lugar só: é esta lista que a faixa
 * parallax da home percorre.
 *
 * Renders de JUN 2026 (Perspectivas AO), das pastas Beach _Club e
 * Portaria_Marina. A piscina abre a faixa, por ser a imagem mais forte do
 * conjunto; dali em diante vale o percurso de quem chega: a portaria, a casa
 * clube e a água, depois o que se come e se bebe, depois o conviver, o
 * cuidar, e por fim as amenities abertas da península.
 *
 * Os arquivos em public/images/galeria/ são reduções para web (2400px de
 * largura) dos originais de 3840px, que ficam no servidor.
 */
export interface ImagemDoEmpreendimento {
  src: string;
  /** o lugar, em caixa alta espaçada sob o contador */
  legenda: string;
  /** descrição para quem não vê a imagem */
  alt: string;
}

export const imagensDoEmpreendimento: ImagemDoEmpreendimento[] = [
  {
    src: '/images/galeria/piscina.jpg',
    legenda: 'Casa Clube · Piscina',
    alt: 'A piscina de borda infinita com espreguiçadeiras e guarda-sóis, voltada para a represa',
  },
  {
    src: '/images/galeria/portaria.jpg',
    legenda: 'Portaria',
    alt: 'A portaria do Villa Stradale, em pedra e madeira, com a via de acesso em piso intertravado',
  },
  {
    src: '/images/galeria/casa-clube-chegada.jpg',
    legenda: 'Casa Clube',
    alt: 'A casa clube vista do gramado, com o volume baixo apoiado no muro de pedra',
  },
  {
    src: '/images/galeria/vao-para-a-agua.jpg',
    legenda: 'Casa Clube · O vão para a água',
    alt: 'O grande vão da casa clube enquadrando a represa e a serra ao fundo',
  },
  {
    src: '/images/galeria/patio-das-palmeiras.jpg',
    legenda: 'Casa Clube · Pátio das palmeiras',
    alt: 'Pátio interno da casa clube, com palmeiras, pedras e lâmina de água',
  },
  {
    src: '/images/galeria/espelho-dagua.jpg',
    legenda: 'Casa Clube · Espelho d’água',
    alt: 'A escada da casa clube junto ao espelho d’água, com vegetação tropical',
  },
  {
    src: '/images/galeria/deck-do-alto.jpg',
    legenda: 'Casa Clube · O deck do alto',
    alt: 'A piscina e o deck de espreguiçadeiras vistos de cima, cercados pelo gramado',
  },
  {
    src: '/images/galeria/bar.jpg',
    legenda: 'Casa Clube · Bar',
    alt: 'O bar da casa clube sob a cobertura de madeira, aberto para a represa',
  },
  {
    src: '/images/galeria/restaurante.jpg',
    legenda: 'Casa Clube · Restaurante',
    alt: 'O restaurante da casa clube, com mesas de madeira voltadas para a água',
  },
  {
    src: '/images/galeria/lounge.jpg',
    legenda: 'Casa Clube · Lounge',
    alt: 'O lounge de convivência, com lareira, sofá e a represa pelo vão de vidro',
  },
  {
    src: '/images/galeria/sala-de-jogos.jpg',
    legenda: 'Casa Clube · Sala de jogos',
    alt: 'A sala de jogos e convivência, com mesa de sinuca e estantes de madeira',
  },
  {
    src: '/images/galeria/academia.jpg',
    legenda: 'Casa Clube · Academia',
    alt: 'A academia com equipamentos Technogym alinhados ao vidro, de frente para a represa',
  },
  {
    src: '/images/galeria/spa.jpg',
    legenda: 'Casa Clube · Spa',
    alt: 'A área de descanso do spa, com espreguiçadeiras e a piscina coberta ao lado',
  },
  {
    src: '/images/galeria/casa-clube-entardecer.jpg',
    legenda: 'Casa Clube · Ao entardecer',
    alt: 'A fachada da casa clube acesa no fim da tarde, vista do gramado',
  },
  {
    src: '/images/galeria/racket-club.jpg',
    legenda: 'Racket Club',
    alt: 'As quadras do Racket Club vistas do alto, com a península e a represa ao fundo',
  },
  {
    src: '/images/galeria/horta.jpg',
    legenda: 'Horta orgânica',
    alt: 'A horta orgânica em canteiros curvos de tijolo, sob pergolado',
  },
];
