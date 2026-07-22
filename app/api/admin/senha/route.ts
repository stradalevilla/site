import { NextResponse } from 'next/server';
import { criarSupabaseServidor } from '@/lib/supabase/server';
import { criarSupabaseAdmin } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';

/** Troca a senha do usuário logado. */
export async function POST(req: Request) {
  const supabase = await criarSupabaseServidor();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ ok: false, error: 'nao autenticado' }, { status: 401 });
  }

  let body: { atual?: string; nova?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'json invalido' }, { status: 400 });
  }
  const atual = body.atual ?? '';
  const nova = body.nova ?? '';
  if (nova.length < 8) {
    return NextResponse.json({ ok: false, error: 'a nova senha precisa ter ao menos 8 caracteres' }, { status: 400 });
  }

  // Confirma a senha atual antes de trocar.
  const { error: erroLogin } = await supabase.auth.signInWithPassword({
    email: user.email!,
    password: atual,
  });
  if (erroLogin) {
    return NextResponse.json({ ok: false, error: 'senha atual incorreta' }, { status: 400 });
  }

  const admin = criarSupabaseAdmin();
  const { error } = await admin.auth.admin.updateUserById(user.id, { password: nova });
  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
