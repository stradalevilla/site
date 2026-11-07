import { after, NextResponse } from 'next/server';
import { avisarSenhaAlterada, semSessao, SENHA_VAZADA, senhaVazada } from '@/lib/acesso';
import { destinoDosLinks, doProprioSite } from '@/lib/pedido';
import { criarSupabaseServidor } from '@/lib/supabase/server';
import { erroDaSenha } from '@/lib/usuarios';

export const dynamic = 'force-dynamic';

/** Troca a senha do usuário logado. */
export async function POST(req: Request) {
  if (!doProprioSite(req)) return NextResponse.json({ ok: false, error: 'origem invalida' }, { status: 403 });
  const supabase = await criarSupabaseServidor();
  const {
    data: { user },
    error: erroDaSessao,
  } = await supabase.auth.getUser();
  if (!user) return semSessao(erroDaSessao);

  let body: { atual?: string; nova?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'json invalido' }, { status: 400 });
  }
  const atual = body.atual ?? '';
  const nova = body.nova ?? '';
  const problema = erroDaSenha(nova);
  if (problema) {
    return NextResponse.json({ ok: false, error: problema }, { status: 400 });
  }

  // Confirma a senha atual antes de trocar.
  const { error: erroLogin } = await supabase.auth.signInWithPassword({
    email: user.email!,
    password: atual,
  });
  if (erroLogin?.code === 'invalid_credentials') {
    return NextResponse.json({ ok: false, error: 'Senha atual incorreta.' }, { status: 400 });
  }
  if (erroLogin) {
    return NextResponse.json({ ok: false, error: 'Não foi possível trocar a senha agora.' }, { status: 503 });
  }

  if (await senhaVazada(nova)) {
    return NextResponse.json({ ok: false, error: SENHA_VAZADA }, { status: 400 });
  }

  // pela sessão da própria pessoa o Supabase derruba as outras sessões e mantém esta
  const { error } = await supabase.auth.updateUser({ password: nova });
  if (error?.code === 'same_password') {
    return NextResponse.json({ ok: false, error: 'A nova senha precisa ser diferente da atual.' }, { status: 400 });
  }
  if (error) {
    console.error('senha nao trocada:', error.message);
    return NextResponse.json({ ok: false, error: 'Não foi possível trocar a senha agora.' }, { status: 500 });
  }

  const destino = destinoDosLinks(req);
  after(() => avisarSenhaAlterada(user, destino));
  return NextResponse.json({ ok: true });
}
