import { SITE } from '@/lib/seo';

/** Pedido de outro site é recusado. Navegador sempre manda Origin em POST, script simples não. */
export function doProprioSite(req: Request) {
  const origem = req.headers.get('origin');
  if (!origem) return false;
  try {
    return new URL(origem).host === req.headers.get('host');
  } catch {
    return false;
  }
}

/**
 * O endereço que entra nos links de e-mail. Em produção nunca vem do pedido: um cabeçalho
 * forjado mandaria o link de senha para o site de outra pessoa.
 */
export const enderecoDoSite = (req: Request) => (process.env.NODE_ENV === 'production' ? SITE : new URL(req.url).origin);
