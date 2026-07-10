import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

/**
 * Mantém o projeto Supabase ativo.
 *
 * O plano gratuito pausa projetos sem atividade por alguns dias. Esta rota é
 * chamada pelo cron da Vercel (ver vercel.json) e executa a função ping(),
 * que grava um timestamp — uma escrita real no banco, não só uma leitura.
 *
 * O cliente é criado aqui dentro (e não importado de lib/supabase) para que a
 * ausência das variáveis de ambiente derrube só esta rota, nunca o build.
 */
export const dynamic = 'force-dynamic';

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    console.error('[keepalive] variaveis do Supabase ausentes no ambiente');
    return NextResponse.json({ ok: false, error: 'supabase nao configurado' }, { status: 500 });
  }

  const { data, error } = await createClient(url, anonKey).rpc('ping');

  if (error) {
    console.error('[keepalive] falha ao pingar o Supabase:', error.message);
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, lastPing: data });
}
