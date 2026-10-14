import { NextResponse } from 'next/server';
import { getConfigDoFundo, normalizarConfig } from '@/lib/config-fundo';
import { criarSupabaseServidor } from '@/lib/supabase/server';
import { criarSupabaseAdmin } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';

/** Lê a calibragem salva (o painel carrega o estado por aqui). */
export async function GET() {
  const config = await getConfigDoFundo(true);
  return NextResponse.json({ ok: true, config });
}

/** Salva a calibragem. Exige usuário logado; escreve com a chave de serviço. */
export async function POST(req: Request) {
  const supabase = await criarSupabaseServidor();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ ok: false, error: 'nao autenticado' }, { status: 401 });
  }

  let body: { config?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'json invalido' }, { status: 400 });
  }

  // normaliza antes de gravar: o que entra no banco já entra dentro das faixas
  const config = normalizarConfig(body.config);

  const { error } = await criarSupabaseAdmin()
    .from('config_site')
    .upsert({ chave: 'grafismo', valor: config, atualizado_em: new Date().toISOString() });

  if (error) {
    return NextResponse.json(
      { ok: false, error: 'falha ao salvar', detalhe: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true, config });
}
