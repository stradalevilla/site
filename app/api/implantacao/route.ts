import { NextResponse } from 'next/server';
import type { LoteContorno } from '@/lib/implantacao';

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

/** Salva as marcações. Exige a senha de admin; escreve com a chave de serviço. */
export async function POST(req: Request) {
  const senha = req.headers.get('x-admin-password');
  if (!process.env.ADMIN_PASSWORD || senha !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ ok: false, error: 'senha incorreta' }, { status: 401 });
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const service = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !service) {
    return NextResponse.json({ ok: false, error: 'supabase nao configurado' }, { status: 500 });
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

  const res = await fetch(`${url}/rest/v1/implantacao_marcacoes?on_conflict=id`, {
    method: 'POST',
    headers: {
      apikey: service,
      Authorization: `Bearer ${service}`,
      'Content-Type': 'application/json',
      Prefer: 'resolution=merge-duplicates,return=minimal',
    },
    body: JSON.stringify({ id: 1, contornos: body.contornos, atualizado_em: new Date().toISOString() }),
  });

  if (!res.ok) {
    return NextResponse.json({ ok: false, error: 'falha ao salvar', detalhe: await res.text() }, { status: 500 });
  }
  return NextResponse.json({ ok: true, total: body.contornos.length });
}
