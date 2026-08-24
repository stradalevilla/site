/**
 * As imagens do empreendimento, em um lugar só.
 *
 * Todas de FINAIS MAIO, a começar pela piscina — é ela que abre tanto a faixa
 * parallax da página Villa Stradale quanto a galeria da home.
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
    src: '/images/casaclube/piscina-parallax.jpg',
    legenda: 'Casa Clube · Piscina',
    alt: 'A piscina da casa clube com deck de madeira e a represa ao fundo',
  },
  {
    src: '/images/arquitetura/clube-poente.jpg',
    legenda: 'Casa Clube · Wellness ao poente',
    alt: 'A área wellness da casa clube voltada para o poente',
  },
  {
    src: '/images/arquitetura/galeria-volume.jpg',
    legenda: 'Casa Clube · A cobertura',
    alt: 'A cobertura baixa da casa clube, em pedra e madeira',
  },
  {
    src: '/images/arquitetura/galeria-vista.jpg',
    legenda: 'Casa Clube · Restaurante',
    alt: 'O restaurante da casa clube, com vãos abertos para a água',
  },
  {
    src: '/images/arquitetura/galeria-lounge.jpg',
    legenda: 'Casa Clube · Lounge',
    alt: 'O lounge de convivência da casa clube, com lareira',
  },
  {
    src: '/images/arquitetura/galeria-wellness.jpg',
    legenda: 'Casa Clube · Spa',
    alt: 'O spa da casa clube, com hot spa e área de descanso',
  },
  {
    src: '/images/arquitetura/galeria-academia.jpg',
    legenda: 'Casa Clube · Academia',
    alt: 'A academia da casa clube, com equipamentos Technogym e vista da represa',
  },
  {
    src: '/images/arquitetura/galeria-capela.jpg',
    legenda: 'Casa Clube · Capela ecumênica',
    alt: 'A capela ecumênica, em volume baixo entre a mata',
  },
  {
    src: '/images/amenities/quadras.jpg',
    legenda: 'Racket Club',
    alt: 'As quadras do Racket Club vistas do alto, com a represa ao fundo',
  },
  {
    src: '/images/amenities/marina.jpg',
    legenda: 'Garagem Náutica',
    alt: 'A enseada da marina, com píeres de madeira e um veleiro',
  },
  {
    src: '/images/amenities/heliponto.jpg',
    legenda: 'Heliponto',
    alt: 'O heliponto da península, com helicóptero pousado e a represa ao fundo',
  },
  {
    src: '/images/amenities/horta.jpg',
    legenda: 'Horta orgânica',
    alt: 'A horta orgânica do condomínio, em canteiros abertos',
  },
  {
    src: '/images/portaria/portaria-panoramica.jpg',
    legenda: 'Portaria',
    alt: 'A portaria do Villa Stradale, em pedra, madeira e espelho de água',
  },
  {
    src: '/images/aereas/peninsula-aerea.jpg',
    legenda: 'A península',
    alt: 'A península do Villa Stradale vista do alto, cercada pela represa',
  },
];
