import { NextResponse } from 'next/server';
import { doProprioSite } from '@/lib/pedido';
import { criarSupabaseServidor } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  if (!doProprioSite(req)) {
    return NextResponse.json({ ok: false, error: 'origem invalida' }, { status: 403 });
  }
  const supabase = await criarSupabaseServidor();
  await supabase.auth.signOut({ scope: 'local' });
  return NextResponse.json({ ok: true });
}
