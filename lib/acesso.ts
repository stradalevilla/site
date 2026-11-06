import { createHash } from 'node:crypto';
import { NextResponse } from 'next/server';
import { isAuthRetryableFetchError, type User } from '@supabase/supabase-js';
import { cancelarReserva, enviarEmail, reservarEmail } from '@/lib/email';
import { emailDeBoasVindas, emailDeConviteAceito, emailDeRecuperacao, emailDeSenhaAlterada } from '@/lib/modelos-de-email';
import { criarSupabaseAdmin } from '@/lib/supabase/admin';
import { criarSupabaseServidor } from '@/lib/supabase/server';
import { nomeDe, papelDe, situacaoDe } from '@/lib/usuarios';

const LIMITE_DE_RECUPERACAO_POR_HORA = 3;

export const SEM_RESPOSTA = 'O serviço de login não respondeu. Tente de novo em instantes.';

/** Sem usuário pode ser sessão vencida ou o Supabase fora do ar, e só no primeiro caso a pessoa precisa entrar de novo */
export const semSessao = (erro: unknown) =>
  isAuthRetryableFetchError(erro)
    ? NextResponse.json({ ok: false, error: SEM_RESPOSTA }, { status: 503 })
    : NextResponse.json({ ok: false, error: 'Sua sessão terminou. Recarregue a página e entre de novo.' }, { status: 401 });

/** Lê o usuário no servidor do Supabase, e não no cookie: pega papel novo e conta desativada na hora */
export async function usuarioLogado() {
  const supabase = await criarSupabaseServidor();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

/** Para as rotas de gestão: devolve o administrador, ou a resposta de recusa */
export async function exigirAdministrador() {
  const supabase = await criarSupabaseServidor();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (!user) return { resposta: semSessao(error) };
  if (papelDe(user) !== 'administrador') {
    return { resposta: NextResponse.json({ ok: false, error: 'Você não tem permissão para isso.' }, { status: 403 }) };
  }
  return { user };
}

/**
 * O código fica depois do #, que não sai do navegador: não passa pelos registros do servidor.
 * Quem usa o código é o botão da página, e não a abertura do link, porque os filtros de
 * e-mail das empresas abrem os links sozinhos e queimariam o uso único.
 */
export const enderecoDeSenha = (base: string, codigo: string, tipo: 'invite' | 'recovery') =>
  `${base}/admin/nova-senha#t=${codigo}&tipo=${tipo}`;

/**
 * "Esqueci minha senha". Roda depois da resposta e não diz nada a quem pediu: a resposta
 * igual e no mesmo tempo não entrega quem tem conta no painel. A vaga vem antes do link,
 * porque cada link novo mata o anterior: repetir o pedido não pode derrubar o que já saiu.
 */
export async function enviarRecuperacao(email: string, base: string) {
  const reserva = await reservarEmail(email, 'recuperacao', LIMITE_DE_RECUPERACAO_POR_HORA);
  if (!reserva) return;

  const admin = criarSupabaseAdmin().auth.admin;
  const { data, error } = await admin.generateLink({ type: 'recovery', email });
  if (error || !data.user || situacaoDe(data.user) === 'desativado') {
    await cancelarReserva(reserva);
    return;
  }

  // quem nunca entrou está no primeiro acesso: pelo link de convite recebe as boas-vindas
  const pendente = situacaoDe(data.user) === 'convite';
  const convite = pendente ? await admin.generateLink({ type: 'invite', email }) : null;
  if (convite?.error) {
    await cancelarReserva(reserva);
    return;
  }

  await enviarEmail({
    tipo: 'recuperacao',
    para: email,
    reserva,
    mensagem: emailDeRecuperacao({
      nome: nomeDe(data.user),
      endereco: enderecoDeSenha(
        base,
        (convite?.data ?? data).properties.hashed_token,
        pendente ? 'invite' : 'recovery'
      ),
    }),
  });
}

/**
 * Confere se a senha já apareceu em vazamentos de outros sites, o primeiro lugar onde um
 * invasor tenta. A senha não sai daqui: a consulta leva só o começo do hash dela, e a
 * comparação é feita neste servidor. Se o serviço não responder, a senha passa: uma consulta
 * fora do ar não pode impedir ninguém de entrar.
 */
export async function senhaVazada(senha: string) {
  const hash = createHash('sha1').update(senha).digest('hex').toUpperCase();
  try {
    const resposta = await fetch(`https://api.pwnedpasswords.com/range/${hash.slice(0, 5)}`, {
      headers: { 'add-padding': 'true', 'user-agent': 'villastradale-site/1.0' },
      signal: AbortSignal.timeout(2500),
      cache: 'no-store',
    });
    if (!resposta.ok) return false;
    return (await resposta.text()).split('\n').some((linha) => {
      const [final, vezes] = linha.trim().split(':');
      return final === hash.slice(5) && Number(vezes) > 0;
    });
  } catch {
    return false;
  }
}

export const SENHA_VAZADA = 'Esta senha já apareceu em vazamentos de outros sites. Escolha outra.';

/** Depois do primeiro acesso: a pessoa recebe as boas-vindas, e quem convidou fica sabendo */
export async function avisarConviteAceito(user: User, base: string) {
  if (!user.email) return;
  await enviarEmail({
    tipo: 'boas_vindas',
    para: user.email,
    mensagem: emailDeBoasVindas({ nome: nomeDe(user), enderecoDeEntrada: `${base}/admin/login` }),
  });

  // só avisa quem ainda administra o painel: quem convidou pode ter saído nesse meio tempo
  const idDeQuemConvidou = user.app_metadata?.convidado_por;
  if (typeof idDeQuemConvidou !== 'string') return;
  const { data } = await criarSupabaseAdmin().auth.admin.getUserById(idDeQuemConvidou);
  const quem = data.user;
  if (!quem?.email || papelDe(quem) !== 'administrador' || situacaoDe(quem) !== 'ativo') return;

  await enviarEmail({
    tipo: 'convite_aceito',
    para: quem.email,
    mensagem: emailDeConviteAceito({
      nome: nomeDe(quem),
      pessoa: nomeDe(user) || user.email,
      enderecoDeUsuarios: `${base}/admin/usuarios`,
    }),
  });
}

/** O aviso que protege a conta: se a troca não foi da pessoa, ela fica sabendo na hora */
export async function avisarSenhaAlterada(user: User, base: string) {
  if (!user.email) return;
  await enviarEmail({
    tipo: 'senha_alterada',
    para: user.email,
    mensagem: emailDeSenhaAlterada({
      nome: nomeDe(user),
      quando: new Intl.DateTimeFormat('pt-BR', {
        timeZone: 'America/Sao_Paulo',
        dateStyle: 'short',
        timeStyle: 'short',
      }).format(new Date()),
      enderecoDeRecuperacao: `${base}/admin/recuperar`,
    }),
  });
}
