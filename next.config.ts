import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // `next dev` e `next build` escrevem na mesma pasta e um sobrescreve os
  // arquivos do outro — o site local fica sem CSS até limpar tudo. Com isto,
  // um build de conferência roda em pasta própria (npm run conferir) e não
  // atrapalha o servidor que estiver de pé. Na Vercel a variável não existe,
  // então o build de produção continua usando .next normalmente.
  distDir: process.env.NEXT_DIST_DIR || '.next',
  // o app roda em app.localhost no computador, e o servidor local só atende quem está aqui
  allowedDevOrigins: ['app.localhost'],
  async redirects() {
    return [
      {
        // /plataforma é o endereço interno do app: ele só existe em app.villastradale.com.br
        source: '/plataforma/:caminho*',
        missing: [{ type: 'host', value: 'app\\.(villastradale\\.com\\.br|localhost)' }],
        destination: 'https://app.villastradale.com.br/:caminho*',
        permanent: false,
      },
      {
        // Os endereços da Vercel eram cópias inteiras do site para o Google. /api
        // fica de fora porque o cron diário do keepalive não segue redirecionamento.
        source: '/:caminho((?!api/).*)',
        has: [{ type: 'host', value: '(villastradale|site-three-fawn-41)\\.vercel\\.app' }],
        destination: 'https://www.villastradale.com.br/:caminho',
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        // o app é fechado: nada dele entra no Google
        source: '/:caminho*',
        has: [{ type: 'host', value: 'app\\.(villastradale\\.com\\.br|localhost)' }],
        headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }],
      },
      {
        // o book pelo link de um usuário: fora do Google, e o endereço com o código não vaza para outros sites
        source: '/book/:caminho*',
        headers: [
          { key: 'X-Robots-Tag', value: 'noindex, nofollow' },
          { key: 'Referrer-Policy', value: 'same-origin' },
        ],
      },
      {
        // o navegador precisa reler o service worker para o app receber atualização
        source: '/sw.js',
        headers: [
          { key: 'Content-Type', value: 'application/javascript; charset=utf-8' },
          { key: 'Cache-Control', value: 'no-cache, no-store, must-revalidate' },
        ],
      },
    ];
  },
  // todas as imagens são do próprio site: liberar outros domínios deixaria o otimizador,
  // que não pede login, buscar o que qualquer pessoa mandar
  images: {
    qualities: [75, 90, 100],
  },
};

export default nextConfig;
