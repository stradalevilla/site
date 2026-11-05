/**
 * As imagens do empreendimento, em um lugar só: é esta lista que a galeria da
 * home percorre.
 *
 * Renders finais de nov/2026, da pasta Renders_finais_4k. A piscina abre a
 * galeria, por ser a imagem mais forte do conjunto; dali em diante vale o
 * percurso de quem chega: a portaria, a casa-clube e a água, depois o que se
 * come e se bebe, depois o conviver, o cuidar, e por fim as amenities abertas
 * da península.
 *
 * Os arquivos em public/images/renders/ são reduções para web (2752px no lado
 * maior, metade dos 5504px do original), que fica no servidor. As aéreas de
 * 01 a 04 da mesma pasta ainda não entraram.
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
    src: '/images/renders/piscina.jpg',
    legenda: 'Casa-Clube · Piscina',
    alt: 'A piscina de borda infinita com espreguiçadeiras e guarda-sóis, voltada para a represa',
  },
  {
    src: '/images/renders/portaria.jpg',
    legenda: 'Portaria',
    alt: 'A portaria do Villa Stradale, em pedra e madeira, com a via de acesso em piso intertravado',
  },
  {
    src: '/images/renders/portaria-entrada.jpg',
    legenda: 'Portaria · A chegada',
    alt: 'O muro de pedra com o nome Villa Stradale na entrada da portaria, com a represa ao lado',
  },
  {
    src: '/images/renders/casa-clube-serra.jpg',
    legenda: 'Casa-Clube · Diante da serra',
    alt: 'A casa-clube ao fim do gramado arborizado, com a represa e a serra ao fundo',
  },
  {
    src: '/images/renders/casa-clube-chegada.jpg',
    legenda: 'Casa-Clube',
    alt: 'A casa-clube vista do gramado, com o volume baixo apoiado no muro de pedra',
  },
  {
    src: '/images/renders/vao-para-a-agua.jpg',
    legenda: 'Casa-Clube · O vão para a água',
    alt: 'O grande vão da casa-clube enquadrando a represa e a margem oposta',
  },
  {
    src: '/images/renders/varanda.jpg',
    legenda: 'Casa-Clube · A varanda',
    alt: 'A varanda da casa-clube sob o beiral de madeira, com o gramado e a represa ao lado',
  },
  {
    src: '/images/renders/patio-das-palmeiras.jpg',
    legenda: 'Casa-Clube · Pátio das palmeiras',
    alt: 'Pátio interno da casa-clube, com palmeiras, pedras e lâmina de água',
  },
  {
    src: '/images/renders/espelho-dagua.jpg',
    legenda: 'Casa-Clube · Espelho d’água',
    alt: 'A escada da casa-clube junto ao espelho d’água, com vegetação tropical',
  },
  {
    src: '/images/renders/deck-do-alto.jpg',
    legenda: 'Casa-Clube · O deck do alto',
    alt: 'A piscina e o deck de espreguiçadeiras vistos de cima, cercados pelo gramado',
  },
  {
    src: '/images/renders/deck-da-piscina.jpg',
    legenda: 'Casa-Clube · O deck da piscina',
    alt: 'O deck de espreguiçadeiras entre a piscina e o bar, com a represa ao fundo',
  },
  {
    src: '/images/renders/bar.jpg',
    legenda: 'Casa-Clube · Bar',
    alt: 'O bar da casa-clube sob a cobertura de madeira, aberto para a represa',
  },
  {
    src: '/images/renders/restaurante-por-do-sol.jpg',
    legenda: 'Casa-Clube · Restaurante ao pôr do sol',
    alt: 'As mesas do restaurante com a represa e o céu do fim de tarde pelo vão aberto',
  },
  {
    src: '/images/renders/restaurante-salao.jpg',
    legenda: 'Casa-Clube · O salão do restaurante',
    alt: 'O salão do restaurante visto de fora, com as mesas, a parede de madeira e as estantes iluminadas',
  },
  {
    src: '/images/renders/lounge.jpg',
    legenda: 'Casa-Clube · Lounge',
    alt: 'O lounge de convivência, com lareira, sofá e a represa pelo vão de vidro',
  },
  {
    src: '/images/renders/sala-de-jogos-noite.jpg',
    legenda: 'Casa-Clube · Sala de jogos à noite',
    alt: 'A sala de jogos acesa à noite, com a mesa de sinuca, o sofá e as estantes iluminadas',
  },
  {
    src: '/images/renders/academia.jpg',
    legenda: 'Casa-Clube · Academia',
    alt: 'A academia com equipamentos Technogym alinhados ao vidro, de frente para a represa',
  },
  {
    src: '/images/renders/spa.jpg',
    legenda: 'Casa-Clube · Spa',
    alt: 'A área de descanso do spa, com espreguiçadeiras e a piscina coberta ao lado',
  },
  {
    src: '/images/renders/sauna.jpg',
    legenda: 'Casa-Clube · Sauna',
    alt: 'A sauna em pedra escura, com o banco e o vidro aberto para a represa',
  },
  {
    src: '/images/renders/casa-clube-noite.jpg',
    legenda: 'Casa-Clube · À noite',
    alt: 'A fachada da casa-clube acesa à noite, com o espelho d’água à frente',
  },
  {
    src: '/images/renders/praca.jpg',
    legenda: 'Praça',
    alt: 'A praça com bancos de madeira à sombra de uma árvore, com o gramado e a represa ao fundo',
  },
  {
    src: '/images/renders/playground.jpg',
    legenda: 'Playground',
    alt: 'O playground em madeira, com a torre de escalada, a rede e o escorregador entre as árvores',
  },
  {
    src: '/images/renders/racket-club.jpg',
    legenda: 'Racket Club',
    alt: 'As quadras do Racket Club vistas do alto, com a península e a represa ao fundo',
  },
  {
    src: '/images/renders/nautica.jpg',
    legenda: 'Náutica',
    alt: 'Lancha na represa, diante da encosta arborizada da península',
  },
  {
    src: '/images/renders/horta.jpg',
    legenda: 'Horta orgânica',
    alt: 'A horta orgânica em canteiros curvos de tijolo, com um toldo de sombra e bancos',
  },
];
