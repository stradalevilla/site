import type { Metadata, Viewport } from 'next';
import '../globals.css';
import { RegistrarApp } from '@/components/plataforma/registrar-app';
import { TELAS_DE_ABERTURA } from '@/lib/telas-de-abertura';

const AZUL = '#0a1929';

export const metadata: Metadata = {
  metadataBase: new URL('https://app.villastradale.com.br'),
  title: { default: 'Villa Stradale', template: '%s | Villa Stradale' },
  description: 'A plataforma do Villa Stradale.',
  manifest: '/app.webmanifest',
  robots: { index: false, follow: false },
  icons: {
    icon: [{ url: '/aplicativo/icone-192.png', sizes: '192x192', type: 'image/png' }],
    apple: [{ url: '/aplicativo/icone-apple-180.png', sizes: '180x180' }],
  },
  appleWebApp: {
    capable: true,
    title: 'Villa Stradale',
    statusBarStyle: 'default',
    startupImage: TELAS_DE_ABERTURA,
  },
  // o Next só escreve a versão sem "apple" da tag, e sem esta o iPhone não mostra a tela de abertura
  other: { 'apple-mobile-web-app-capable': 'yes' },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: AZUL,
  interactiveWidget: 'resizes-content',
};

/**
 * O app tem o próprio documento: nada do site entra aqui. Sem Tag Manager, porque esta área
 * mostra dados de clientes, e sem o grafismo e as animações de página. Só a fonte da marca.
 */
export default function LayoutDoApp({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" style={{ backgroundColor: AZUL }}>
      <head>
        <link rel="stylesheet" href="https://use.typekit.net/hap2dqc.css" />
        {/* o Android avisa uma vez só que o app pode ser instalado, às vezes antes de a página acordar */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "window.addEventListener('beforeinstallprompt',function(e){e.preventDefault();window.__pedidoDeInstalacao=e;window.dispatchEvent(new Event('app-instalavel'))})",
          }}
        />
      </head>
      <body className="min-h-dvh overscroll-none bg-transparent font-body text-white antialiased [-webkit-tap-highlight-color:transparent]">
        {children}
        <RegistrarApp />
      </body>
    </html>
  );
}
