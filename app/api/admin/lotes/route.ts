import { NextResponse } from 'next/server';
import { criarSupabaseServidor } from '@/lib/supabase/server';
import { criarSupabaseAdmin } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';

async function exigirLogin() {
  const supabase = await criarSupabaseServidor();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

/** Lista todos os lotes (tela Lotes do admin). */
export async function GET() {
  if (!(await exigirLogin())) {
    return NextResponse.json({ ok: false, error: 'nao autenticado' }, { status: 401 });
  }
  const admin = criarSupabaseAdmin();
  const { data, error } = await admin.from('lotes').select('*').order('numero');
  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true, lotes: data });
}

/** Atualiza um lote (area e/ou parametros). */
export async function PATCH(req: Request) {
  if (!(await exigirLogin())) {
    return NextResponse.json({ ok: false, error: 'nao autenticado' }, { status: 401 });
  }

  let body: {
    numero?: number;
    area?: string | null;
    parametros?: string | null;
    parametros_itens?: unknown;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'json invalido' }, { status: 400 });
  }

  const numero = body.numero;
  if (
    typeof numero !== 'number' ||
    numero < 1 ||
    numero > 54 ||
    numero === 29 ||
    numero === 30
  ) {
    return NextResponse.json({ ok: false, error: 'numero de lote invalido' }, { status: 400 });
  }

  const mudancas: Record<string, unknown> = { atualizado_em: new Date().toISOString() };
  if ('area' in body) {
    if (body.area !== null && typeof body.area !== 'string') {
      return NextResponse.json({ ok: false, error: 'area invalida' }, { status: 400 });
    }
    mudancas.area = body.area === '' ? null : body.area;
  }
  if ('parametros' in body) {
    if (body.parametros !== null && typeof body.parametros !== 'string') {
      return NextResponse.json({ ok: false, error: 'parametros invalidos' }, { status: 400 });
    }
    mudancas.parametros = body.parametros === '' ? null : body.parametros;
  }
  if ('parametros_itens' in body) {
    const itens = body.parametros_itens;
    const valido =
      itens === null ||
      (Array.isArray(itens) &&
        itens.every(
          (i) =>
            i &&
            typeof i === 'object' &&
            typeof (i as { label?: unknown }).label === 'string' &&
            typeof (i as { valor?: unknown }).valor === 'string'
        ));
    if (!valido) {
      return NextResponse.json({ ok: false, error: 'parametros_itens invalidos' }, { status: 400 });
    }
    mudancas.parametros_itens = itens;
  }

  const admin = criarSupabaseAdmin();
  const { error } = await admin.from('lotes').update(mudancas).eq('numero', numero);
  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
