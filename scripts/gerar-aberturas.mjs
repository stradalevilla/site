// Gera as telas de abertura do app para iPhone e iPad, a partir da lista em lib/telas-de-abertura.ts.
// O playwright-core não é dependência do projeto: rode com ele disponível no NODE_PATH.
//
//   node scripts/gerar-aberturas.mjs
import fs from 'node:fs';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const require = createRequire(process.env.PLAYWRIGHT_DE ?? import.meta.url);
const { chromium } = require('playwright-core');
const { TELAS_DE_ABERTURA } = await import('../lib/telas-de-abertura.ts');

const destino = new URL('../public/aplicativo/abertura/', import.meta.url);
fs.mkdirSync(destino, { recursive: true });
const logotipo = fs.readFileSync(new URL('../public/logos/Logotipo-VillaStradale branco.svg', import.meta.url), 'utf8').replace(/<\?xml[^>]*>/, '');

const navegador = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
for (const { url } of TELAS_DE_ABERTURA) {
  const nome = url.split('/').pop();
  const [largura, altura] = nome.replace('.png', '').split('x').map(Number);
  const pagina = await navegador.newPage({ viewport: { width: largura, height: altura } });
  await pagina.setContent(
    `<!doctype html><body style="margin:0;width:${largura}px;height:${altura}px;background:#0a1929;display:flex;align-items:center;justify-content:center"><div style="width:${Math.round(Math.min(largura, altura) * 0.42)}px">${logotipo.replace('<svg', '<svg style="width:100%;height:auto;display:block"')}</div></body>`
  );
  await pagina.screenshot({ path: fileURLToPath(new URL(nome, destino)) });
  await pagina.close();
  console.log(nome);
}
await navegador.close();
