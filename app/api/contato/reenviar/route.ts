import { NextResponse } from 'next/server';
import type { Contato } from '@/lib/contato';
import { enviarAoCrm } from '@/lib/crm';
import { criarSupabaseAdmin } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

const DIA_MS = 24 * 60 * 60 * 1000;

/**
 * Entrega ao CRM o que ficou para trás, como quando o Zap esteve desligado. Roda uma
 * vez por dia pelo cron da Vercel (ver vercel.json), que se identifica com CRON_SECRET.
 * Deixa de fora os últimos 15 minutos, que ainda podem estar saindo pelo formulário, e
 * o que passou de 30 dias, porque lead tão antigo chegaria ao corretor fora de hora.
 */
export async function GET(req: Request) {
  const segredo = process.env.CRON_SECRET;
  if (!segredo || req.headers.get('authorization') !== `Bearer ${segredo}`) {
    return NextResponse.json({ ok: false, error: 'nao autorizado' }, { status: 401 });
  }

  const agora = Date.now();
  const { data, error } = await criarSupabaseAdmin()
    .from('contatos')
    .select('*')
    .eq('crm_pendente', true)
    .gte('criado_em', new Date(agora - 30 * DIA_MS).toISOString())
    .lte('criado_em', new Date(agora - 15 * 60 * 1000).toISOString())
    .order('criado_em', { ascending: true })
    .limit(100);

  if (error) {
    console.error('reenvio ao CRM:', error.message);
    return NextResponse.json({ ok: false, error: 'falha ao ler' }, { status: 500 });
  }

  await Promise.all((data as Contato[]).map((c) => enviarAoCrm(c, 1)));
  return NextResponse.json({ ok: true, tentados: data.length });
}
