import { after, NextResponse } from 'next/server';
import type { User } from '@supabase/supabase-js';
import { exigirAdministrador, SEM_RESPOSTA } from '@/lib/acesso';
import { enviarEmail } from '@/lib/email';
import {
  emailDeAcessoDesativado,
  emailDeAcessoReativado,
  emailDeAcessoRemovido,
  emailDeConvite,
  emailDePapelAlterado,
  emailDeRecuperacao,
} from '@/lib/modelos-de-email';
import { destinoDosLinks, doProprioSite } from '@/lib/pedido';
import { criarSupabaseAdmin } from '@/lib/supabase/admin';
import { emailValido, limparNome, nomeDe, papelDe, resumoDoUsuario, ROTULO_DO_PAPEL, situacaoDe, type Papel } from '@/lib/usuarios';

export const dynamic = 'force-dynamic';
export const maxDuration = 30;

/** Banimento sem data de volta: cem anos. Reativar tira na hora. */
const PARA_SEMPRE = '876000h';

const O_QUE_O_PAPEL_FAZ: Record<Papel, string> = {
  administrador: 'Além de usar a plataforma, agora você também convida e gerencia os usuários.',
  equipe: 'Você continua usando a plataforma, e a gestão de usuários fica com os administradores.',
};

const papelValido = (valor: unknown): valor is Papel => valor === 'administrador' || valor === 'equipe';
const recusa = (error: string, status = 400) => NextResponse.json({ ok: false, error }, { status });

/** Como a pessoa aparece nos e-mails que vão em nome de quem está no painel */
const assinatura = (quem: User) => nomeDe(quem) || quem.email || 'Um administrador';

/** Lista os usuários com acesso ao painel. */
export async function GET() {
  const { resposta } = await exigirAdministrador();
  if (resposta) return resposta;

  const { data, error } = await criarSupabaseAdmin().auth.admin.listUsers({ page: 1, perPage: 200 });
  if (error) return recusa('Não foi possível carregar a lista.', 500);

  const usuarios = data.users
    .map(resumoDoUsuario)
    .sort((a, b) => (a.nome || a.email).localeCompare(b.nome || b.email, 'pt-BR'));
  return NextResponse.json({ ok: true, usuarios });
}

/** Manda o convite. Se o e-mail não sair, devolve o link para ir por outro canal. */
async function enviarConvite(req: Request, usuario: User, quem: User, codigo: string) {
  const endereco = destinoDosLinks(req).senha(codigo, 'invite');
  const envio = await enviarEmail({
    tipo: 'convite',
    para: usuario.email!,
    mensagem: emailDeConvite({ nome: nomeDe(usuario), quemConvidou: assinatura(quem), endereco }),
    responderPara: quem.email,
  });
  return NextResponse.json({ ok: true, emailEnviado: envio.ok, ...(envio.ok ? {} : { link: endereco }) });
}

/** Convida uma pessoa. Ela cria a própria senha: nenhuma senha passa por aqui. */
export async function POST(req: Request) {
  if (!doProprioSite(req)) return recusa('origem invalida', 403);
  const { user: quem, resposta } = await exigirAdministrador();
  if (resposta) return resposta;

  const corpo = await req.json().catch(() => null);
  const nome = limparNome(corpo?.nome);
  const email = typeof corpo?.email === 'string' ? corpo.email.trim().toLowerCase() : '';
  if (!nome) return recusa('Digite o nome da pessoa.');
  if (!emailValido(email)) return recusa('Confira o e-mail.');
  if (!papelValido(corpo?.papel)) return recusa('Escolha o papel da pessoa.');

  const admin = criarSupabaseAdmin();
  const { data, error } = await admin.auth.admin.generateLink({ type: 'invite', email, options: { data: { nome } } });
  if (error?.code === 'email_exists') return recusa('Este e-mail já está na lista de usuários.', 409);
  if (error || !data.user) return recusa('Não foi possível criar o convite.', 500);

  // o nome vai aqui também: convidar de novo quem ainda não entrou corrige o nome digitado errado
  const { data: convidado, error: erroDoPapel } = await admin.auth.admin.updateUserById(data.user.id, {
    app_metadata: { papel: corpo.papel, convidado_por: quem.id },
    user_metadata: { nome },
  });
  if (erroDoPapel) return recusa('Não foi possível criar o convite.', 500);

  return enviarConvite(req, convidado.user, quem, data.properties.hashed_token);
}

/** Tudo o que se faz com um usuário que já existe. */
export async function PATCH(req: Request) {
  if (!doProprioSite(req)) return recusa('origem invalida', 403);
  const { user: quem, resposta } = await exigirAdministrador();
  if (resposta) return resposta;

  const corpo = await req.json().catch(() => null);
  const id = typeof corpo?.id === 'string' ? corpo.id : '';
  const acao = corpo?.acao;
  if (!id) return recusa('id ausente');

  const admin = criarSupabaseAdmin();
  const { data, error } = await admin.auth.admin.getUserById(id);
  if (error && error.status !== 404) return recusa(SEM_RESPOSTA, 503);
  if (!data.user?.email) return recusa('Usuário não encontrado.', 404);
  const alvo = data.user;
  const email = alvo.email!;
  const destino = destinoDosLinks(req);

  if (acao === 'reenviar_convite') {
    if (situacaoDe(alvo) !== 'convite') return recusa('Esta pessoa já criou a senha.');
    const link = await admin.auth.admin.generateLink({ type: 'invite', email });
    if (link.error) return recusa('Não foi possível gerar o convite.', 500);
    // quem reenvia passa a ser quem recebe o aviso de que a pessoa entrou
    await admin.auth.admin.updateUserById(id, { app_metadata: { convidado_por: quem.id } });
    return enviarConvite(req, alvo, quem, link.data.properties.hashed_token);
  }

  if (acao === 'nova_senha') {
    if (situacaoDe(alvo) === 'desativado') return recusa('Reative a conta antes de enviar uma nova senha.');
    const link = await admin.auth.admin.generateLink({ type: 'recovery', email });
    if (link.error) return recusa('Não foi possível gerar o link.', 500);
    const endereco = destino.senha(link.data.properties.hashed_token, 'recovery');
    const envio = await enviarEmail({
      tipo: 'recuperacao',
      para: email,
      mensagem: emailDeRecuperacao({ nome: nomeDe(alvo), endereco, quemPediu: assinatura(quem) }),
      responderPara: quem.email,
    });
    return NextResponse.json({ ok: true, emailEnviado: envio.ok, ...(envio.ok ? {} : { link: endereco }) });
  }

  // daqui para baixo a pessoa perde ou ganha poder: ninguém faz isso consigo mesmo, e assim
  // o painel nunca fica sem administrador
  if (id === quem.id) return recusa('Você não pode fazer isso com a sua própria conta.');

  if (acao === 'papel') {
    const papel = corpo?.papel;
    if (!papelValido(papel)) return recusa('Papel inválido.');
    if (papel === papelDe(alvo)) return NextResponse.json({ ok: true });

    const { error: erro } = await admin.auth.admin.updateUserById(id, { app_metadata: { papel } });
    if (erro) return recusa('Não foi possível mudar o papel.', 500);

    // quem ainda não aceitou o convite não precisa de aviso: o papel vale quando a pessoa entrar
    if (situacaoDe(alvo) === 'ativo') {
      after(() =>
        enviarEmail({
          tipo: 'papel_alterado',
          para: email,
          mensagem: emailDePapelAlterado({
            nome: nomeDe(alvo),
            papel: ROTULO_DO_PAPEL[papel],
            descricao: O_QUE_O_PAPEL_FAZ[papel],
            enderecoDeEntrada: destino.entrada,
          }),
        })
      );
    }
    return NextResponse.json({ ok: true });
  }

  if (acao === 'desativar' || acao === 'reativar') {
    const desativar = acao === 'desativar';

    // antes de reativar, confere que nenhuma sessão antiga ficou: ela voltaria sozinha, e pode
    // ser a de um aparelho perdido. Aqui a falha para tudo, porque a conta ainda está bloqueada.
    if (!desativar) {
      const { error: erroDasSessoes } = await admin.rpc('encerrar_sessoes', { usuario: id });
      if (erroDasSessoes) return recusa('Não foi possível reativar agora. Tente de novo em instantes.', 503);
    }

    const { error: erro } = await admin.auth.admin.updateUserById(id, { ban_duration: desativar ? PARA_SEMPRE : 'none' });
    if (erro) return recusa('Não foi possível mudar a conta.', 500);

    if (desativar) {
      const { error: erroDasSessoes } = await admin.rpc('encerrar_sessoes', { usuario: id });
      if (erroDasSessoes) console.error('sessoes nao encerradas:', erroDasSessoes.message);
    }

    after(() =>
      enviarEmail(
        desativar
          ? { tipo: 'acesso_desativado', para: email, mensagem: emailDeAcessoDesativado({ nome: nomeDe(alvo) }) }
          : {
              tipo: 'acesso_reativado',
              para: email,
              mensagem: emailDeAcessoReativado({ nome: nomeDe(alvo), enderecoDeEntrada: destino.entrada }),
            }
      )
    );
    return NextResponse.json({ ok: true });
  }

  return recusa('Ação desconhecida.');
}

/** Remove um usuário pelo id. */
export async function DELETE(req: Request) {
  if (!doProprioSite(req)) return recusa('origem invalida', 403);
  const { user: quem, resposta } = await exigirAdministrador();
  if (resposta) return resposta;

  const id = new URL(req.url).searchParams.get('id');
  if (!id) return recusa('id ausente');
  if (id === quem.id) return recusa('Você não pode remover a si mesmo.');

  const admin = criarSupabaseAdmin();
  const { data, error: erroAoLer } = await admin.auth.admin.getUserById(id);
  if (erroAoLer && erroAoLer.status !== 404) return recusa(SEM_RESPOSTA, 503);
  const alvo = data.user;

  const { error } = await admin.auth.admin.deleteUser(id);
  if (error) return recusa('Não foi possível remover.', 500);

  // quem nunca entrou não precisa saber que o convite foi retirado
  if (alvo?.email && situacaoDe(alvo) !== 'convite') {
    const para = alvo.email;
    after(() => enviarEmail({ tipo: 'acesso_removido', para, mensagem: emailDeAcessoRemovido({ nome: nomeDe(alvo) }) }));
  }
  return NextResponse.json({ ok: true });
}
