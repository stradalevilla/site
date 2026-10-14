import type { Metadata } from 'next';
import './globals.css';
import { Providers } from '@/components/providers';
import { FundoDoSite } from '@/components/fundo-curvas';
import { getConfigDoFundo } from '@/lib/config-fundo';
import { PrepararMapa } from '@/components/preparar-mapa';

export const metadata: Metadata = {
  metadataBase: new URL('https://villastradale.com'),
  title: {
    default: 'Villa Stradale',
    template: '%s | Villa Stradale',
  },
  /* Este é o texto que o Google mostra abaixo do título e que aparece quando
     alguém manda o link no WhatsApp. Está montado a partir da copy que já está
     no ar nas páginas internas, para não inventar número nem promessa. */
  description:
    'Uma península na represa de Piracaia, entre a Serra da Mantiqueira e as águas do Sistema Cantareira: 275.951 m² com lotes voltados à água, casa clube, marina e heliponto.',
  keywords: [
    'Villa Stradale',
    'lotes em Piracaia',
    'condomínio na represa',
    'loteamento alto padrão São Paulo',
    'Serra da Mantiqueira',
    'casa de campo na água',
  ],
  authors: [{ name: 'Villa Stradale' }],
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: 'https://villastradale.com',
    siteName: 'Villa Stradale',
    title: 'Villa Stradale — uma península irreplicável',
    description:
      'Entre a Serra da Mantiqueira e as águas do Sistema Cantareira, 275.951 m² de península com lotes voltados à água, casa clube, marina e heliponto.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Villa Stradale — uma península irreplicável',
    description:
      'Entre a Serra da Mantiqueira e as águas do Sistema Cantareira, 275.951 m² de península com lotes voltados à água, casa clube, marina e heliponto.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // a calibragem do grafismo vem do banco, com cache de 60s e queda para a
  // calibragem de fábrica se o banco não responder
  const configDoFundo = await getConfigDoFundo();

  return (
    <html lang="pt-BR">
      <head>
        <link rel="stylesheet" href="https://use.typekit.net/hap2dqc.css" />
        {/* O mapa da região sai destes dois: abrir a conexão desde já poupa o
            aperto de mão quando o visitante chega em Localização. */}
        <link rel="preconnect" href="https://api.maptiler.com" crossOrigin="" />
        <link rel="preconnect" href="https://tiles.maps.eox.at" crossOrigin="" />
      </head>
      <body className="antialiased font-body">
        <PrepararMapa />
        {/* Fundo global da página */}
        <div aria-hidden className="fixed inset-0 -z-10 bg-[#EFEBE3]" />
        {/* Grafismo de fundo: curvas de nível desenhadas em movimento, no
            lugar da imagem que se repetia. Fica atrás de tudo e nunca recebe
            clique. */}
        <FundoDoSite config={configDoFundo} />
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
