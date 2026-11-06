import { NextResponse } from 'next/server';
import { criarSupabaseAdmin } from '@/lib/supabase/admin';
import { TEXTO_DO_ACEITE } from '@/lib/contato';

export const dynamic = 'force-dynamic';

/** Formulário que passa disso em dez minutos é robô. Para um lançamento, é folga de sobra. */
const TETO_EM_10_MINUTOS = 30;

function texto(valor: unknown, limite: number) {
  // o Postgres recusa o caractere nulo, e o contato se perderia por causa de uma UTM
  return typeof valor === 'string' ? valor.replace(/\0/g, '').trim().slice(0, limite) || null : null;
}

/** O iPad moderno se apresenta como Mac: quem denuncia é a tela de toque */
function dispositivo(navegador: string, toques: unknown) {
  if (/iPad|Tablet|PlayBook|Silk/i.test(navegador)) return 'Tablet';
  if (/Macintosh/i.test(navegador) && Number(toques) > 1) return 'Tablet';
  if (/Mobi|iPhone/i.test(navegador)) return 'Celular';
  if (/Android/i.test(navegador)) return 'Tablet';
  return 'Computador';
}

/** A Vercel manda a cidade com acentos codificados, e nada disso existe no localhost */
function local(req: Request, cabecalho: string) {
  const valor = req.headers.get(cabecalho);
  if (!valor) return null;
  try {
    return decodeURIComponent(valor);
  } catch {
    return valor;
  }
}

/** Pedido de outro site é recusado. Navegador sempre manda Origin em POST, script simples não. */
function doProprioSite(req: Request) {
  const origem = req.headers.get('origin');
  if (!origem) return false;
  try {
    return new URL(origem).host === req.headers.get('host');
  } catch {
    return false;
  }
}

/**
 * Recebe o formulário de contato. O caminho normal é o JSON do navegador; o envio
 * direto do <form> só acontece sem JavaScript ou antes de a página terminar de
 * carregar, e por isso é POST: nome, e-mail e telefone nunca vão para a URL.
 */
export async function POST(req: Request) {
  if (!doProprioSite(req)) {
    return NextResponse.json({ ok: false, error: 'origem invalida' }, { status: 403 });
  }

  const json = (req.headers.get('content-type') ?? '').includes('application/json');
  let corpo: Record<string, unknown>;
  try {
    corpo = json ? await req.json() : Object.fromEntries(await req.formData());
  } catch {
    return NextResponse.json({ ok: false, error: 'pedido invalido' }, { status: 400 });
  }
  if (!corpo || typeof corpo !== 'object') {
    return NextResponse.json({ ok: false, error: 'pedido invalido' }, { status: 400 });
  }

  const paginaDoEnvio = new URL(req.headers.get('referer') ?? '/', req.url).pathname;
  const voltar = (resultado: string) =>
    NextResponse.redirect(new URL(`${paginaDoEnvio}?${resultado}=1#contato`, req.url), 303);
  const responder = () => (json ? NextResponse.json({ ok: true }) : voltar('enviado'));

  // campo invisível: só robô preenche. Ele recebe "ok" e nada é gravado.
  if (corpo.site) return responder();

  const nome = texto(corpo.nome, 120);
  const email = texto(corpo.email, 160)?.toLowerCase();
  const telefone = texto(corpo.telefone, 40);
  const digitos = telefone?.replace(/\D/g, '').length ?? 0;
  const aceite = corpo.aceite === true || corpo.aceite === 'on';

  if (!nome || !email || !/^[^@\s?&=%#]+@[^@\s?&=%#]+\.[^@\s?&=%#]+$/.test(email) || digitos < 8 || digitos > 15 || !aceite) {
    return json ? NextResponse.json({ ok: false, error: 'dados invalidos' }, { status: 400 }) : voltar('erro');
  }

  const banco = criarSupabaseAdmin();
  const { count } = await banco
    .from('contatos')
    .select('id', { count: 'exact', head: true })
    .gte('criado_em', new Date(Date.now() - 10 * 60 * 1000).toISOString());
  if ((count ?? 0) >= TETO_EM_10_MINUTOS) {
    return json ? NextResponse.json({ ok: false, error: 'muitos envios' }, { status: 429 }) : voltar('erro');
  }

  const origem = (typeof corpo.origem === 'object' && corpo.origem ? corpo.origem : {}) as Record<string, unknown>;
  const navegador = texto(req.headers.get('user-agent'), 300) ?? '';

  const { error } = await banco
    .from('contatos')
    .insert({
      nome,
      email,
      telefone,
      aceite_texto: TEXTO_DO_ACEITE,
      pagina: texto(corpo.pagina, 300) ?? paginaDoEnvio,
      entrada: texto(origem.entrada, 600),
      referencia: texto(origem.referencia, 600),
      utm_source: texto(origem.utm_source, 200),
      utm_medium: texto(origem.utm_medium, 200),
      utm_campaign: texto(origem.utm_campaign, 200),
      utm_term: texto(origem.utm_term, 200),
      utm_content: texto(origem.utm_content, 200),
      gclid: texto(origem.gclid, 300),
      fbclid: texto(origem.fbclid, 300),
      dispositivo: dispositivo(navegador, corpo.toques),
      navegador,
      cidade: local(req, 'x-vercel-ip-city'),
      estado: local(req, 'x-vercel-ip-country-region'),
      pais: local(req, 'x-vercel-ip-country'),
    });

  if (error) {
    console.error('contato nao gravado:', error.message);
    return json ? NextResponse.json({ ok: false, error: 'nao gravado' }, { status: 500 }) : voltar('erro');
  }

  return responder();
}
