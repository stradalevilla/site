import { after, NextResponse } from 'next/server';
import { isAuthRetryableFetchError } from '@supabase/supabase-js';
import { SEM_RESPOSTA } from '@/lib/acesso';
import { doProprioSite } from '@/lib/pedido';
import { criarSupabaseServidor } from '@/lib/supabase/server';
import { devolverTentativa, esquecerTentativas, reservarTentativa } from '@/lib/tentativas';

export const dynamic = 'force-dynamic';

const MUITAS_TENTATIVAS = 'Muitas tentativas. Aguarde alguns minutos e tente de novo.';

/**
 * O login do app passa pelo servidor para a sessão chegar num cookie de resposta: cookie
 * criado pela página cai em 7 dias no Safari, e o cliente teria de entrar toda semana.
 */
export async function POST(req: Request) {
  if (!doProprioSite(req)) {
    return NextResponse.json({ ok: false, error: 'origem invalida' }, { status: 403 });
  }

  const corpo = await req.json().catch(() => null);
  const email = typeof corpo?.email === 'string' ? corpo.email.trim().toLowerCase() : '';
  const senha = typeof corpo?.senha === 'string' ? corpo.senha : '';
  if (!email || !senha) {
    return NextResponse.json({ ok: false, error: 'Digite o e-mail e a senha.' }, { status: 400 });
  }

  const tentativa = await reservarTentativa(req, email);
  if (!tentativa.liberada) {
    return NextResponse.json({ ok: false, error: MUITAS_TENTATIVAS }, { status: 429 });
  }

  const supabase = await criarSupabaseServidor();
  const { error } = await supabase.auth.signInWithPassword({ email, password: senha });
  if (!error) {
    // a limpeza das tentativas vai depois da resposta: quem acertou a senha não espera por ela
    after(() => esquecerTentativas(tentativa));
    return NextResponse.json({ ok: true });
  }

  if (isAuthRetryableFetchError(error)) {
    await devolverTentativa(tentativa);
    return NextResponse.json({ ok: false, error: SEM_RESPOSTA }, { status: 503 });
  }
  if (error.code === 'over_request_rate_limit') {
    await devolverTentativa(tentativa);
    return NextResponse.json({ ok: false, error: MUITAS_TENTATIVAS }, { status: 429 });
  }
  return NextResponse.json(
    { ok: false, error: error.code === 'user_banned' ? 'Não foi possível entrar. Fale com quem administra o painel.' : 'E-mail ou senha incorretos.' },
    { status: 400 }
  );
}
