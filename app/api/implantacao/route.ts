import { NextResponse } from 'next/server';
import type { LoteContorno } from '@/lib/implantacao';
import { criarSupabaseServidor } from '@/lib/supabase/server';
import { criarSupabaseAdmin } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';

/** Lê as marcações atuais (usado pelo editor admin para carregar o estado). */
export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) {
    return NextResponse.json({ ok: false, error: 'supabase nao configurado' }, { status: 500 });
  }
  const res = await fetch(
    `${url}/rest/v1/implantacao_marcacoes?select=contornos,atualizado_em&id=eq.1`,
    { headers: { apikey: anon, Authorization: `Bearer ${anon}` }, cache: 'no-store' }
  );
  if (!res.ok) {
    return NextResponse.json({ ok: false, error: 'falha ao ler' }, { status: 500 });
  }
  const linhas = await res.json();
  return NextResponse.json({ ok: true, contornos: linhas[0]?.contornos ?? [] });
}

function valido(c: unknown): c is LoteContorno[] {
  return (
    Array.isArray(c) &&
    c.length > 0 &&
    c.every(
      (l) =>
        l &&
        typeof l === 'object' &&
        typeof (l as LoteContorno).numero === 'number' &&
        typeof (l as LoteContorno).pontos === 'string' &&
        Array.isArray((l as LoteContorno).centroide) &&
        (l as LoteContorno).centroide.length === 2
    )
  );
}

/** Salva as marcações. Exige usuário logado; escreve com a chave de serviço. */
export async function POST(req: Request) {
  const supabase = await criarSupabaseServidor();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ ok: false, error: 'nao autenticado' }, { status: 401 });
  }

  let body: { contornos?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'json invalido' }, { status: 400 });
  }
  if (!valido(body.contornos)) {
    return NextResponse.json({ ok: false, error: 'formato de contornos invalido' }, { status: 400 });
  }

  const admin = criarSupabaseAdmin();
  const { error } = await admin
    .from('implantacao_marcacoes')
    .upsert({ id: 1, contornos: body.contornos, atualizado_em: new Date().toISOString() });

  if (error) {
    return NextResponse.json({ ok: false, error: 'falha ao salvar', detalhe: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true, total: body.contornos.length });
}
