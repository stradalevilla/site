import type { Metadata } from 'next';

/**
 * Nada do painel entra na busca. O robô chega aqui pelo cadeado do rodapé, e sem
 * isto a tela de login herdaria o título e o texto da home.
 */
export const metadata: Metadata = {
  title: { default: 'Painel', template: '%s | Villa Stradale' },
  description: null,
  alternates: null,
  openGraph: null,
  twitter: null,
  robots: { index: false, follow: false },
};

export default function LayoutDoPainel({ children }: { children: React.ReactNode }) {
  return children;
}
