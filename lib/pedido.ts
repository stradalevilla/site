import { ENDERECO_DO_APP, HOST_DO_APP } from '@/lib/aplicativo';
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

/** Para onde os links dos e-mails levam */
export type Destino = {
  senha: (codigo: string, tipo: 'invite' | 'recovery') => string;
  entrada: string;
  recuperar: string;
  usuarios: string;
};

/**
 * Quem pede pelo app volta ao app, e quem pede pelo painel volta ao painel. Em produção o
 * endereço nunca é copiado do pedido, só escolhido entre os dois nossos: um cabeçalho forjado
 * mandaria o link de senha para o site de outra pessoa.
 *
 * O código da senha fica depois do #, que não sai do navegador: não passa pelos registros do
 * servidor. Quem usa o código é o botão da página, e não a abertura do link, porque os filtros
 * de e-mail das empresas abrem os links sozinhos e queimariam o uso único.
 */
export function destinoDosLinks(req: Request): Destino {
  const host = req.headers.get('host') ?? '';
  const noApp = HOST_DO_APP.test(host);
  const base = process.env.NODE_ENV !== 'production' ? `http://${host}` : noApp ? ENDERECO_DO_APP : SITE;
  const painel = noApp ? '' : '/admin';

  return {
    senha: (codigo, tipo) => `${base}${painel}/nova-senha#t=${codigo}&tipo=${tipo}`,
    entrada: noApp ? `${base}/` : `${base}/admin/login`,
    recuperar: `${base}${painel}/recuperar`,
    usuarios: noApp ? `${base}/configuracoes/usuarios` : `${base}/admin/usuarios`,
  };
}
