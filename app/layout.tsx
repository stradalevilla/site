import type { Metadata } from 'next';
import './globals.css';
import { Providers } from '@/components/providers';
import { PrepararMapa } from '@/components/preparar-mapa';

export const metadata: Metadata = {
  metadataBase: new URL('https://villastradale.com'),
  title: {
    default: 'Villa Stradale',
    template: '%s | Villa Stradale',
  },
  description: 'Descrição do site para SEO',
  keywords: ['keyword1', 'keyword2', 'keyword3'],
  authors: [{ name: 'Villa Stradale' }],
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: 'https://villastradale.com',
    siteName: 'Villa Stradale',
    title: 'Villa Stradale',
    description: 'Descrição do site para SEO',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Villa Stradale',
    description: 'Descrição do site para SEO',
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
        {/* Grafismo de fundo - repetido em todo o site */}
        <div
          aria-hidden
          className="fixed inset-0 -z-10 opacity-30"
          style={{
            backgroundImage: "url('/images/grafismos/Grafismo linhas.svg')",
            backgroundRepeat: 'repeat',
            backgroundSize: '950px',
          }}
        />
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
