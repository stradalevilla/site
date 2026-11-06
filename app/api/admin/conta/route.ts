import { NextResponse } from 'next/server';
import { semSessao } from '@/lib/acesso';
import { criarSupabaseAdmin } from '@/lib/supabase/admin';
import { criarSupabaseServidor } from '@/lib/supabase/server';
import { limparNome } from '@/lib/usuarios';

export const dynamic = 'force-dynamic';

/** Troca o nome do usuário logado. Papel e situação só um administrador muda. */
export async function PATCH(req: Request) {
  const supabase = await criarSupabaseServidor();
  const {
    data: { user },
    error: erroDaSessao,
  } = await supabase.auth.getUser();
  if (!user) return semSessao(erroDaSessao);

  const corpo = await req.json().catch(() => null);
  const nome = limparNome(corpo?.nome);
  if (!nome) {
    return NextResponse.json({ ok: false, error: 'Digite o seu nome.' }, { status: 400 });
  }

  const { error } = await criarSupabaseAdmin().auth.admin.updateUserById(user.id, { user_metadata: { nome } });
  if (error) {
    return NextResponse.json({ ok: false, error: 'Não foi possível salvar agora.' }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
