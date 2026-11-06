/**
 * Os e-mails automáticos do painel. O HTML é o que todo programa de e-mail entende: tabelas,
 * estilo na própria tag e fonte do sistema. Imagens vêm bloqueadas em muitas caixas, então
 * o nome da marca e o botão são texto, e o endereço do botão aparece escrito logo abaixo.
 */
import { comoChamar } from '@/lib/usuarios';

export type Mensagem = { assunto: string; html: string; texto: string };

type Conteudo = {
  assunto: string;
  /** Aparece na lista da caixa de entrada, depois do assunto */
  resumo: string;
  titulo: string;
  paragrafos: string[];
  botao?: { rotulo: string; endereco: string };
  observacao?: string;
};

const SITE = 'https://www.villastradale.com.br';
const AZUL = '#0a1929';
const COBRE = '#B8623A';
const SERIFA = "Georgia, 'Times New Roman', serif";
const TEXTO = "Helvetica, Arial, sans-serif";

/** Tudo o que vem de fora passa por aqui: um nome com tag não pode virar HTML no e-mail */
const seguro = (valor: string) =>
  valor.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');

const saudacao = (nome: string) => (comoChamar(nome) ? `Olá, ${comoChamar(nome)}.` : 'Olá.');

function montar({ assunto, resumo, titulo, paragrafos, botao, observacao }: Conteudo): Mensagem {
  const blocos = paragrafos
    .map((p) => `<p style="margin:0 0 16px;font-family:${TEXTO};font-size:16px;line-height:24px;color:#3b4654;">${seguro(p)}</p>`)
    .join('');

  const chamada = botao
    ? `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:8px 0 24px;"><tr>
        <td bgcolor="${COBRE}" style="background-color:${COBRE};mso-padding-alt:15px 30px;">
          <a href="${seguro(botao.endereco)}" style="display:inline-block;padding:15px 30px;font-family:${TEXTO};font-size:15px;font-weight:bold;color:#ffffff;text-decoration:none;">${seguro(botao.rotulo)}</a>
        </td>
      </tr></table>
      <p style="margin:0 0 16px;font-family:${TEXTO};font-size:13px;line-height:20px;color:#6b7480;">Se o botão não abrir, copie este endereço no navegador:<br><a href="${seguro(botao.endereco)}" style="color:${COBRE};word-break:break-all;">${seguro(botao.endereco)}</a></p>`
    : '';

  const nota = observacao
    ? `<p style="margin:0;font-family:${TEXTO};font-size:13px;line-height:20px;color:#6b7480;">${seguro(observacao)}</p>`
    : '';

  const html = `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${seguro(assunto)}</title>
</head>
<body style="margin:0;padding:0;background-color:#EFEBE3;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${seguro(resumo)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#EFEBE3" style="background-color:#EFEBE3;">
<tr><td align="center" style="padding:32px 16px;">
  <!--[if mso]><table role="presentation" width="560" align="center" cellpadding="0" cellspacing="0" border="0"><tr><td><![endif]-->
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;">
    <tr><td align="center" bgcolor="${AZUL}" style="background-color:${AZUL};padding:28px 24px;">
      <img src="${SITE}/images/email/emblema.png" width="88" height="18" alt="" style="display:block;margin:0 auto 12px;border:0;">
      <p style="margin:0;font-family:${SERIFA};font-size:20px;letter-spacing:4px;color:#ffffff;">VILLA STRADALE</p>
    </td></tr>
    <tr><td bgcolor="#ffffff" style="background-color:#ffffff;padding:36px 32px 32px;">
      <h1 style="margin:0 0 20px;font-family:${SERIFA};font-size:24px;line-height:30px;font-weight:normal;color:${AZUL};">${seguro(titulo)}</h1>
      ${blocos}
      ${chamada}
      ${nota}
    </td></tr>
    <tr><td align="center" style="padding:20px 24px;">
      <p style="margin:0;font-family:${TEXTO};font-size:12px;line-height:18px;color:#6b7480;">Mensagem automática do painel de gestão do site Villa Stradale.</p>
    </td></tr>
  </table>
  <!--[if mso]></td></tr></table><![endif]-->
</td></tr>
</table>
</body>
</html>`;

  const texto = [
    titulo,
    '',
    ...paragrafos.flatMap((p) => [p, '']),
    ...(botao ? [`${botao.rotulo}: ${botao.endereco}`, ''] : []),
    ...(observacao ? [observacao, ''] : []),
    'Mensagem automática do painel de gestão do site Villa Stradale.',
  ].join('\n');

  return { assunto, html, texto };
}

const VALIDADE = 'O link vale por 24 horas e só funciona uma vez.';

export const emailDeConvite = (p: { nome: string; quemConvidou: string; endereco: string }) =>
  montar({
    assunto: 'Seu acesso ao painel Villa Stradale',
    resumo: 'Crie a sua senha para entrar no painel de gestão do site.',
    titulo: 'Seu acesso ao painel',
    paragrafos: [
      saudacao(p.nome),
      `${p.quemConvidou} convidou você para o painel de gestão do site Villa Stradale. Para entrar, crie a sua senha.`,
      VALIDADE,
    ],
    botao: { rotulo: 'Criar minha senha', endereco: p.endereco },
    observacao: 'Se você não esperava este convite, pode ignorar esta mensagem.',
  });

export const emailDeBoasVindas = (p: { nome: string; enderecoDeEntrada: string }) =>
  montar({
    assunto: 'Sua conta no painel Villa Stradale está pronta',
    resumo: 'Você já pode entrar com o seu e-mail e a senha que criou.',
    titulo: 'Sua conta está pronta',
    paragrafos: [
      saudacao(p.nome),
      'Sua senha foi criada. A partir de agora, você entra no painel de gestão do site Villa Stradale com o seu e-mail e essa senha.',
      'Se um dia esquecer a senha, use o link "esqueci minha senha" na tela de entrada e você recebe um novo acesso por e-mail.',
    ],
    botao: { rotulo: 'Entrar no painel', endereco: p.enderecoDeEntrada },
  });

export const emailDeConviteAceito = (p: { nome: string; pessoa: string; enderecoDeUsuarios: string }) =>
  montar({
    assunto: `${p.pessoa} entrou no painel Villa Stradale`,
    resumo: 'O convite que você enviou foi aceito.',
    titulo: 'Convite aceito',
    paragrafos: [saudacao(p.nome), `${p.pessoa} criou a senha e já tem acesso ao painel de gestão do site Villa Stradale.`],
    botao: { rotulo: 'Ver usuários', endereco: p.enderecoDeUsuarios },
  });

export const emailDePapelAlterado = (p: { nome: string; papel: string; descricao: string; enderecoDeEntrada: string }) =>
  montar({
    assunto: 'Seu papel no painel Villa Stradale mudou',
    resumo: `Agora o seu papel é ${p.papel}.`,
    titulo: 'Papel alterado',
    paragrafos: [saudacao(p.nome), `O seu papel no painel de gestão do site Villa Stradale agora é ${p.papel}.`, p.descricao],
    botao: { rotulo: 'Entrar no painel', endereco: p.enderecoDeEntrada },
  });

export const emailDeRecuperacao = (p: { nome: string; endereco: string; quemPediu?: string }) =>
  montar({
    assunto: 'Crie uma nova senha para o painel Villa Stradale',
    resumo: 'Use o link desta mensagem para criar uma nova senha.',
    titulo: 'Nova senha',
    paragrafos: [
      saudacao(p.nome),
      p.quemPediu
        ? `${p.quemPediu} enviou a você um link para criar uma nova senha no painel Villa Stradale.`
        : 'Recebemos um pedido para criar uma nova senha na sua conta do painel Villa Stradale.',
      VALIDADE,
    ],
    botao: { rotulo: 'Criar nova senha', endereco: p.endereco },
    observacao: 'Se você não pediu, ignore esta mensagem. Sua senha continua a mesma.',
  });

export const emailDeSenhaAlterada = (p: { nome: string; quando: string; enderecoDeRecuperacao: string }) =>
  montar({
    assunto: 'Sua senha do painel Villa Stradale foi alterada',
    resumo: 'Se foi você, não precisa fazer nada.',
    titulo: 'Senha alterada',
    paragrafos: [
      saudacao(p.nome),
      `A senha da sua conta no painel Villa Stradale foi alterada em ${p.quando}.`,
      'Se foi você, não precisa fazer nada. Se não foi, crie uma nova senha agora.',
    ],
    botao: { rotulo: 'Criar nova senha', endereco: p.enderecoDeRecuperacao },
  });

export const emailDeAcessoDesativado = (p: { nome: string }) =>
  montar({
    assunto: 'Seu acesso ao painel Villa Stradale foi desativado',
    resumo: 'Sua conta não entra mais no painel de gestão.',
    titulo: 'Acesso desativado',
    paragrafos: [
      saudacao(p.nome),
      'Um administrador desativou o seu acesso ao painel de gestão do site Villa Stradale.',
      'Se isso for um engano, fale com quem administra o painel.',
    ],
  });

export const emailDeAcessoReativado = (p: { nome: string; enderecoDeEntrada: string }) =>
  montar({
    assunto: 'Seu acesso ao painel Villa Stradale foi reativado',
    resumo: 'Você já pode entrar de novo com a sua senha.',
    titulo: 'Acesso reativado',
    paragrafos: [saudacao(p.nome), 'O seu acesso ao painel de gestão do site Villa Stradale foi reativado. Você entra com a mesma senha.'],
    botao: { rotulo: 'Entrar no painel', endereco: p.enderecoDeEntrada },
  });

export const emailDeAcessoRemovido = (p: { nome: string }) =>
  montar({
    assunto: 'Seu acesso ao painel Villa Stradale foi removido',
    resumo: 'Sua conta foi retirada do painel de gestão.',
    titulo: 'Acesso removido',
    paragrafos: [
      saudacao(p.nome),
      'A sua conta foi removida do painel de gestão do site Villa Stradale.',
      'Se isso for um engano, fale com quem administra o painel.',
    ],
  });
