import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // `next dev` e `next build` escrevem na mesma pasta e um sobrescreve os
  // arquivos do outro — o site local fica sem CSS até limpar tudo. Com isto,
  // um build de conferência roda em pasta própria (npm run conferir) e não
  // atrapalha o servidor que estiver de pé. Na Vercel a variável não existe,
  // então o build de produção continua usando .next normalmente.
  distDir: process.env.NEXT_DIST_DIR || '.next',
  images: {
    qualities: [75, 90, 100],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;
