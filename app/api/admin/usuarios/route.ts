import { NextResponse } from 'next/server';
import { criarSupabaseServidor } from '@/lib/supabase/server';
import { criarSupabaseAdmin } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';

/** Confirma que quem chama está logado no painel. */
async function exigirLogin() {
  const supabase = await criarSupabaseServidor();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

/** Lista os usuários com acesso ao painel. */
export async function GET() {
  if (!(await exigirLogin())) {
    return NextResponse.json({ ok: false, error: 'nao autenticado' }, { status: 401 });
  }
  const admin = criarSupabaseAdmin();
  const { data, error } = await admin.auth.admin.listUsers({ page: 1, perPage: 200 });
  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
  const usuarios = data.users.map((u) => ({
    id: u.id,
    email: u.email,
    criado_em: u.created_at,
    ultimo_login: u.last_sign_in_at,
  }));
  return NextResponse.json({ ok: true, usuarios });
}

/** Cria um novo usuário (e-mail + senha), já confirmado. */
export async function POST(req: Request) {
  if (!(await exigirLogin())) {
    return NextResponse.json({ ok: false, error: 'nao autenticado' }, { status: 401 });
  }
  let body: { email?: string; senha?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'json invalido' }, { status: 400 });
  }
  const email = body.email?.trim().toLowerCase();
  const senha = body.senha ?? '';
  if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return NextResponse.json({ ok: false, error: 'e-mail invalido' }, { status: 400 });
  }
  if (senha.length < 8) {
    return NextResponse.json({ ok: false, error: 'a senha precisa ter ao menos 8 caracteres' }, { status: 400 });
  }

  const admin = criarSupabaseAdmin();
  const { error } = await admin.auth.admin.createUser({
    email,
    password: senha,
    email_confirm: true,
  });
  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 400 });
  }
  return NextResponse.json({ ok: true });
}

/** Remove um usuário pelo id. */
export async function DELETE(req: Request) {
  const usuarioAtual = await exigirLogin();
  if (!usuarioAtual) {
    return NextResponse.json({ ok: false, error: 'nao autenticado' }, { status: 401 });
  }
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) {
    return NextResponse.json({ ok: false, error: 'id ausente' }, { status: 400 });
  }
  if (id === usuarioAtual.id) {
    return NextResponse.json({ ok: false, error: 'você não pode remover a si mesmo' }, { status: 400 });
  }
  const admin = criarSupabaseAdmin();
  const { error } = await admin.auth.admin.deleteUser(id);
  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
