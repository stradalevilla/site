import type { Metadata } from 'next';
import './globals.css';
import { Providers } from '@/components/providers';
import { FundoDoSite } from '@/components/fundo-curvas';
import { getConfigDoFundo } from '@/lib/config-fundo';
import { PrepararMapa } from '@/components/preparar-mapa';
import { AnimacoesDeEntrada } from '@/components/animacoes-de-entrada';
import { TransicaoDePagina } from '@/components/transicao-de-pagina';

const TAG_MANAGER = 'GTM-MBN9W4ZF';

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
    'Uma península na represa de Piracaia, entre a Serra da Mantiqueira e as águas do Sistema Cantareira: 275.951 m² com lotes voltados à água, casa-clube, marina e heliponto.',
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
      'Entre a Serra da Mantiqueira e as águas do Sistema Cantareira, 275.951 m² de península com lotes voltados à água, casa-clube, marina e heliponto.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Villa Stradale — uma península irreplicável',
    description:
      'Entre a Serra da Mantiqueira e as águas do Sistema Cantareira, 275.951 m² de península com lotes voltados à água, casa-clube, marina e heliponto.',
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
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        {/* Antes da primeira pintura: sem isto, o que entra com a rolagem
            piscaria visível antes de se esconder. Quem pede menos movimento, o
            painel e navegador sem IntersectionObserver ficam sem a classe, e a
            página simplesmente aparece inteira. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){try{if('IntersectionObserver'in window&&!matchMedia('(prefers-reduced-motion: reduce)').matches&&location.pathname.indexOf('/admin')!==0)document.documentElement.classList.add('surgir')}catch(e){}})()",
          }}
        />
        {/* O código é o que o Google entrega, no alto do head como ele pede, só
            que fora do painel: script de terceiro não roda nas páginas de senha
            e de gestão. */}
        {/* eslint-disable-next-line @next/next/next-script-for-ga */}
        <script
          dangerouslySetInnerHTML={{
            __html: `if(location.pathname.indexOf('/admin')!==0){(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${TAG_MANAGER}');}`,
          }}
        />
        <link rel="stylesheet" href="https://use.typekit.net/hap2dqc.css" />
        {/* O mapa da região sai destes dois: abrir a conexão desde já poupa o
            aperto de mão quando o visitante chega em Localização. */}
        <link rel="preconnect" href="https://api.maptiler.com" crossOrigin="" />
        <link rel="preconnect" href="https://tiles.maps.eox.at" crossOrigin="" />
      </head>
      <body className="antialiased font-body">
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${TAG_MANAGER}`}
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
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
        <AnimacoesDeEntrada />
        <TransicaoDePagina />
      </body>
    </html>
  );
}
