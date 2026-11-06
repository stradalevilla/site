import type { Contato } from '@/lib/contato';
import { classificarOrigem, utmDoTrafegoPago } from '@/lib/origem';
import { criarSupabaseAdmin } from '@/lib/supabase/admin';

const ESPERA_MS = 8000;

/**
 * O que vai para o CRM da Sotheby's. As UTMs só vão preenchidas no tráfego pago, como
 * eles pediram; as chaves vão sempre, porque o Zapier mapeia pelos campos da amostra.
 * O id deixa o outro lado reconhecer um reenvio.
 */
export function dadosParaOCrm(c: Contato) {
  const origem = classificarOrigem(c);
  return {
    id: c.id,
    criado_em: c.criado_em,
    nome: c.nome,
    email: c.email,
    telefone: c.telefone,
    origem,
    ...(origem === 'pago' ? utmDoTrafegoPago(c) : { utm_source: '', utm_medium: '', utm_campaign: '' }),
  };
}

/** Devolve o erro, ou null se chegou. O texto nunca leva o endereço do webhook, que é a senha dele. */
async function postar(url: string, corpo: string) {
  try {
    const resposta = await fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: corpo,
      signal: AbortSignal.timeout(ESPERA_MS),
      cache: 'no-store',
    });
    return resposta.ok ? null : `resposta ${resposta.status}`;
  } catch (e) {
    return e instanceof Error && e.name === 'TimeoutError' ? 'sem resposta' : 'falha de rede';
  }
}

/**
 * Manda o contato ao CRM e anota o resultado na linha dele. O contato já está gravado
 * antes disto, então uma falha aqui não perde nada: o cron diário tenta de novo. Sem o
 * endereço configurado não faz nada, e o localhost nunca cria lead de teste na Sotheby's.
 */
export async function enviarAoCrm(c: Contato, tentativas = 3) {
  const url = process.env.CRM_WEBHOOK_URL;
  if (!url) return;

  const corpo = JSON.stringify(dadosParaOCrm(c));
  let erro: string | null = null;
  for (let tentativa = 1; tentativa <= tentativas; tentativa += 1) {
    erro = await postar(url, corpo);
    // 404 é Zap desligado ou apagado: insistir na hora não adianta, e o cron volta a tentar
    if (!erro || erro === 'resposta 404') break;
    if (tentativa < tentativas) await new Promise((pronto) => setTimeout(pronto, tentativa * 2000));
  }

  if (erro) console.error('contato nao entregue ao CRM:', c.id, erro);
  const { error } = await criarSupabaseAdmin()
    .from('contatos')
    .update(erro ? { crm_erro: erro } : { crm_pendente: false, crm_enviado_em: new Date().toISOString(), crm_erro: null })
    .eq('id', c.id);
  if (error) console.error('situacao do CRM nao gravada:', c.id, error.message);
}
