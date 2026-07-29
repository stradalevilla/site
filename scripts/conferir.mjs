// Build de conferência: compila numa pasta própria (.next-conferencia) em vez
// da .next que o `npm run dev` usa. Sem isso, rodar um build com o servidor
// local de pé faz os dois brigarem pelos mesmos arquivos e o site fica sem CSS.
//
//   npm run conferir     -> confere se o projeto compila, sem derrubar o dev
//   npm run build        -> build de produção (é o que a Vercel roda)
import { execSync } from 'node:child_process';

execSync('npx next build', {
  stdio: 'inherit',
  env: { ...process.env, NEXT_DIST_DIR: '.next-conferencia' },
});
