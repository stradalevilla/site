import type { Mensagem } from '@/lib/modelos-de-email';
import { criarSupabaseAdmin } from '@/lib/supabase/admin';

const API = process.env.RESEND_API_URL ?? 'https://api.resend.com/emails';
const REMETENTE = 'Villa Stradale <acesso@villastradale.com.br>';
const ESPERA_MS = 8000;

export type TipoDeEmail =
  | 'convite'
  | 'boas_vindas'
  | 'convite_aceito'
  | 'papel_alterado'
  | 'recuperacao'
  | 'senha_alterada'
  | 'acesso_desativado'
  | 'acesso_reativado'
  | 'acesso_removido';

/** Devolve o id do Resend ou o erro. O texto nunca leva a chave nem o conteúdo da mensagem. */
async function postar(tipo: TipoDeEmail, para: string, mensagem: Mensagem, responderPara?: string) {
  const chave = process.env.RESEND_API_KEY;
  if (!chave) return { erro: 'envio de e-mail nao configurado' };

  try {
    const resposta = await fetch(API, {
      method: 'POST',
      headers: {
        authorization: `Bearer ${chave}`,
        'content-type': 'application/json',
        // sem este cabeçalho a API do Resend recusa o pedido mesmo com a chave certa
        'user-agent': 'villastradale-site/1.0',
      },
      body: JSON.stringify({
        from: REMETENTE,
        to: [para],
        subject: mensagem.assunto,
        html: mensagem.html,
        text: mensagem.texto,
        tags: [{ name: 'tipo', value: tipo }],
        // sem isto o Gmail junta os pedidos na mesma conversa, e a pessoa abre o link antigo
        headers: { 'X-Entity-Ref-ID': crypto.randomUUID() },
        ...(responderPara ? { reply_to: responderPara } : {}),
      }),
      signal: AbortSignal.timeout(ESPERA_MS),
      cache: 'no-store',
    });
    const corpo = await resposta.json().catch(() => null);
    if (resposta.ok) return { id: typeof corpo?.id === 'string' ? corpo.id : null };
    return { erro: `resposta ${resposta.status}: ${String(corpo?.message ?? '').slice(0, 160)}` };
  } catch (e) {
    return { erro: e instanceof Error && e.name === 'TimeoutError' ? 'sem resposta' : 'falha de rede' };
  }
}

/**
 * Manda um e-mail e anota o resultado em emails_enviados, na vaga reservada ou numa linha
 * nova. Não lança erro: quem chama decide o que fazer com a falha, e a anotação não pode
 * derrubar um envio que já saiu.
 */
export async function enviarEmail(p: {
  tipo: TipoDeEmail;
  para: string;
  mensagem: Mensagem;
  responderPara?: string;
  reserva?: string;
}) {
  const { id, erro } = await postar(p.tipo, p.para, p.mensagem, p.responderPara);
  if (erro) console.error('e-mail nao enviado:', p.tipo, erro);

  const resultado = { resend_id: id ?? null, erro: erro ?? null };
  const tabela = criarSupabaseAdmin().from('emails_enviados');
  const { error } = await (p.reserva
    ? tabela.update(resultado).eq('id', p.reserva)
    : tabela.insert({ tipo: p.tipo, para: p.para, ...resultado }));
  if (error) console.error('e-mail nao registrado:', p.tipo, error.message);

  return { ok: !erro, erro: erro ?? null };
}

/** Pega uma vaga no limite por hora, ou null se ele já foi atingido */
export async function reservarEmail(para: string, tipo: TipoDeEmail, limite: number) {
  const { data, error } = await criarSupabaseAdmin().rpc('reservar_email', {
    destinatario: para,
    categoria: tipo,
    limite,
  });
  if (error) console.error('vaga de e-mail nao reservada:', error.message);
  return typeof data === 'string' ? data : null;
}

export const cancelarReserva = (reserva: string) => criarSupabaseAdmin().from('emails_enviados').delete().eq('id', reserva);
