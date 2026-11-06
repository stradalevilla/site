import { after, NextResponse } from 'next/server';
import { isAuthRetryableFetchError } from '@supabase/supabase-js';
import { avisarConviteAceito, avisarSenhaAlterada, SEM_RESPOSTA, SENHA_VAZADA, senhaVazada } from '@/lib/acesso';
import { doProprioSite, enderecoDoSite } from '@/lib/pedido';
import { criarSupabaseServidor } from '@/lib/supabase/server';
import { erroDaSenha } from '@/lib/usuarios';

export const dynamic = 'force-dynamic';
export const maxDuration = 30;

/**
 * Onde o link do e-mail se resolve. O código só é gasto aqui, quando a pessoa já digitou a
 * senha, e daqui ela sai com a sessão aberta. Funciona em qualquer navegador, e não só no
 * que pediu a recuperação.
 *
 * A senha é gravada pela sessão da própria pessoa: assim o Supabase derruba as outras
 * sessões e mantém esta. Pela chave de serviço ele derrubaria todas, inclusive esta.
 */
export async function POST(req: Request) {
  if (!doProprioSite(req)) {
    return NextResponse.json({ ok: false, error: 'origem invalida' }, { status: 403 });
  }

  const corpo = await req.json().catch(() => null);
  const codigo = typeof corpo?.codigo === 'string' ? corpo.codigo : '';
  const tipo = corpo?.tipo === 'invite' ? 'invite' : corpo?.tipo === 'recovery' ? 'recovery' : null;
  const senha = typeof corpo?.senha === 'string' ? corpo.senha : '';
  if (!codigo || !tipo) {
    return NextResponse.json({ ok: false, error: 'link' }, { status: 400 });
  }
  const problema = erroDaSenha(senha);
  if (problema) {
    return NextResponse.json({ ok: false, error: problema }, { status: 400 });
  }

  // antes de gastar o código: recusada aqui, a pessoa tenta outra senha com o mesmo link
  if (await senhaVazada(senha)) {
    return NextResponse.json({ ok: false, error: SENHA_VAZADA }, { status: 400 });
  }

  const supabase = await criarSupabaseServidor();
  const { data, error } = await supabase.auth.verifyOtp({ token_hash: codigo, type: tipo });
  if (error?.code === 'over_request_rate_limit') {
    return NextResponse.json({ ok: false, error: 'Muitas tentativas. Aguarde alguns minutos e tente de novo.' }, { status: 429 });
  }
  // com o serviço fora do ar o código ainda vale: a pessoa tenta de novo na mesma tela
  if (isAuthRetryableFetchError(error)) {
    return NextResponse.json({ ok: false, error: SEM_RESPOSTA }, { status: 503 });
  }
  if (error || !data.user) {
    return NextResponse.json({ ok: false, error: 'link' }, { status: 400 });
  }

  const { error: erroAoGravar } = await supabase.auth.updateUser({ password: senha });

  // repetir a senha antiga não é erro aqui: o link provou quem é, e o código já foi gasto.
  // Nada mudou, então não há aviso de troca, mas as outras sessões caem do mesmo jeito.
  if (erroAoGravar?.code === 'same_password') {
    await supabase.auth.signOut({ scope: 'others' });
    return NextResponse.json({ ok: true });
  }
  if (erroAoGravar) {
    console.error('senha nao gravada:', erroAoGravar.message);
    return NextResponse.json({ ok: false, error: 'link' }, { status: 500 });
  }

  const usuario = data.user;
  const base = enderecoDoSite(req);
  after(() => (tipo === 'invite' ? avisarConviteAceito(usuario, base) : avisarSenhaAlterada(usuario, base)));
  return NextResponse.json({ ok: true });
}
