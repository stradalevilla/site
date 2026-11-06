import type { Metadata } from 'next';
import { INSTAGRAM } from '@/lib/menu';

/** O endereço oficial. O villastradale.vercel.app redireciona para cá. */
export const SITE = 'https://www.villastradale.com.br';
export const NOME_DO_SITE = 'Villa Stradale';

/** O ponto central da península, o mesmo do mapa de Localização */
export const PENINSULA = { lat: -22.975994, lng: -46.380169 };

/* Este é o texto que o Google mostra abaixo do título e que aparece quando
   alguém manda o link no WhatsApp. Está montado a partir da copy que já está
   no ar nas páginas internas, para não inventar número nem promessa. */
export const DESCRICAO_DO_SITE =
  'Uma península na represa de Piracaia, entre a Serra da Mantiqueira e as águas do Sistema Cantareira: 275.951 m² com lotes voltados à água, casa-clube, marina e heliponto.';

const IMAGEM_DO_LINK = {
  url: '/images/compartilhar-villa-stradale.jpg',
  width: 1200,
  height: 630,
  alt: 'A península do Villa Stradale vista do alto ao pôr do sol, com a represa e a serra ao fundo',
};

/**
 * O cartão do link no WhatsApp e nas redes. O Next não leva o title da página
 * para cá e troca o openGraph inteiro em vez de juntar com o do layout: sem o
 * cartão completo em cada página, um lote compartilhado mostraria a home.
 *
 * './' vira o endereço da própria página.
 */
export function cartaoDoLink(titulo: string, descricao: string, url = './'): Pick<Metadata, 'openGraph' | 'twitter'> {
  return {
    openGraph: {
      type: 'website',
      locale: 'pt_BR',
      siteName: NOME_DO_SITE,
      url,
      title: titulo,
      description: descricao,
      images: [IMAGEM_DO_LINK],
    },
    twitter: {
      card: 'summary_large_image',
      title: titulo,
      description: descricao,
      images: [IMAGEM_DO_LINK.url],
    },
  };
}

/*
 * Dados estruturados: dizem a buscadores e IAs quem é a marca, onde fica e quem
 * comercializa, sem deixar que deduzam do texto. Só entram fatos que já estão no
 * site. Nada de preço nem de Offer, porque não há tabela pública, e nada da área
 * total, que não tem respaldo no book.
 */
const ORGANIZACAO = `${SITE}/#organizacao`;
const EMPREENDIMENTO = `${SITE}/#empreendimento`;

const LUGAR = {
  '@type': 'Place',
  '@id': EMPREENDIMENTO,
  name: 'Villa Stradale Península',
  description:
    'Uma península na represa de Piracaia, entre a Serra da Mantiqueira e as águas do Sistema Cantareira, com lotes voltados à água, casa-clube, marina e heliponto.',
  url: SITE,
  image: `${SITE}${IMAGEM_DO_LINK.url}`,
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Piracaia',
    addressRegion: 'SP',
    addressCountry: 'BR',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: PENINSULA.lat,
    longitude: PENINSULA.lng,
  },
};

export const DADOS_DA_HOME = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': `${SITE}/#site`,
      url: SITE,
      name: NOME_DO_SITE,
      inLanguage: 'pt-BR',
      publisher: { '@id': ORGANIZACAO },
    },
    {
      '@type': 'Organization',
      '@id': ORGANIZACAO,
      name: NOME_DO_SITE,
      legalName: 'Stradale Empreendimentos Imobiliários SPE Ltda.',
      taxID: '41.344.921/0001-59',
      url: SITE,
      logo: `${SITE}/logos/villa-stradale-emblema.png`,
      sameAs: [INSTAGRAM],
    },
    {
      '@type': 'Organization',
      '@id': `${SITE}/#comercializacao`,
      name: "Bossa Nova Sotheby's International Realty",
      legalName: 'X3 Real Estate Imobiliária e Participação Ltda.',
      taxID: '19.834.438/0001-01',
      identifier: 'CRECI/SP 027212-J',
      description: 'Intermediação do Villa Stradale Península. Comercialização não exclusiva.',
      areaServed: { '@id': EMPREENDIMENTO },
    },
    LUGAR,
  ],
};

export const DADOS_DA_LOCALIZACAO = { '@context': 'https://schema.org', ...LUGAR };

export function trilhaDoLote(numero: string) {
  const passos = [
    { nome: 'Home', url: SITE },
    { nome: 'Masterplan', url: `${SITE}/lotes` },
    { nome: `Lote ${numero}`, url: `${SITE}/lotes/${numero}` },
  ];
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: passos.map(({ nome, url }, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: nome,
      item: url,
    })),
  };
}
