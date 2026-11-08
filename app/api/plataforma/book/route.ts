import { NextResponse } from 'next/server';
import { semSessao } from '@/lib/acesso';
import { erroDaSenhaDoBook, linkDoUsuario, senhaConfere } from '@/lib/book-compartilhado';
import { doProprioSite } from '@/lib/pedido';
import { criarSupabaseAdmin } from '@/lib/supabase/admin';
import { criarSupabaseServidor } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

/**
 * O usuário cuida só do próprio link: troca a senha, desliga ou religa. As duas primeiras
 * derrubam quem já tinha entrado, porque sobem a versão que o cookie do cliente carrega.
 */
export async function PATCH(req: Request) {
  if (!doProprioSite(req)) {
    return NextResponse.json({ ok: false, error: 'origem invalida' }, { status: 403 });
  }
  const supabase = await criarSupabaseServidor();
  const {
    data: { user },
    error: erroDaSessao,
  } = await supabase.auth.getUser();
  if (!user) return semSessao(erroDaSessao);

  const corpo = await req.json().catch(() => null);
  const acao = corpo?.acao;
  let link;
  try {
    link = await linkDoUsuario(user.id);
  } catch {
    return NextResponse.json({ ok: false, error: 'Não foi possível falar com o banco. Tente de novo em instantes.' }, { status: 503 });
  }

  let mudanca: Record<string, unknown>;
  if (acao === 'senha') {
    const senha = typeof corpo?.senha === 'string' ? corpo.senha.trim() : '';
    const erro = erroDaSenhaDoBook(senha);
    if (erro) return NextResponse.json({ ok: false, error: erro }, { status: 400 });
    // a mesma senha, escrita de outro jeito, não derruba ninguém
    if (senhaConfere(senha, link.senha)) return NextResponse.json({ ok: true, senha: link.senha, ativo: link.ativo });
    mudanca = { senha, versao: link.versao + 1 };
  } else if (acao === 'desligar') {
    mudanca = { ativo: false, versao: link.versao + 1 };
  } else if (acao === 'ligar') {
    mudanca = { ativo: true };
  } else {
    return NextResponse.json({ ok: false, error: 'Pedido inválido.' }, { status: 400 });
  }

  const { data, error } = await criarSupabaseAdmin()
    .from('links_do_book')
    .update({ ...mudanca, atualizado_em: new Date().toISOString() })
    .eq('id', link.id)
    .select('senha, ativo')
    .single();
  if (error) return NextResponse.json({ ok: false, error: 'Não foi possível salvar. Tente de novo em instantes.' }, { status: 503 });
  return NextResponse.json({ ok: true, senha: data.senha, ativo: data.ativo });
}
