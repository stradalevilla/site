import type { Metadata, Viewport } from 'next';
import '../globals.css';
import { SITE } from '@/lib/seo';

const AZUL = '#0a1929';

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: 'Book Digital | Villa Stradale',
  description: 'O Book Digital do Villa Stradale, às margens da represa em Piracaia.',
  robots: { index: false, follow: false },
  icons: { icon: [{ url: '/aplicativo/icone-192.png', sizes: '192x192', type: 'image/png' }] },
  // a prévia que aparece no WhatsApp quando o link é enviado
  openGraph: {
    type: 'website',
    siteName: 'Villa Stradale',
    title: 'Book Digital · Villa Stradale',
    description: 'Uma apresentação do Villa Stradale, às margens da represa em Piracaia.',
    images: [{ url: '/images/compartilhar-villa-stradale.jpg', width: 1200, height: 630 }],
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: AZUL,
};

/**
 * O book que o cliente abre pelo link. Documento próprio: nada do site (Tag Manager, grafismo)
 * e nada do app (instalação, service worker). Só a fonte da marca.
 */
export default function LayoutDoBookCompartilhado({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" style={{ backgroundColor: AZUL }}>
      <head>
        <link rel="stylesheet" href="https://use.typekit.net/hap2dqc.css" />
      </head>
      <body className="min-h-dvh overscroll-none bg-transparent font-body text-white antialiased [-webkit-tap-highlight-color:transparent]">{children}</body>
    </html>
  );
}
