import { classificarOrigem, type Origem } from '@/lib/origem';

/**
 * O texto que a pessoa aceita ao enviar. Vai junto de cada contato para o
 * registro mostrar o que foi aceito naquele dia, mesmo se ele mudar depois.
 */
export const TEXTO_DO_ACEITE =
  'Declaro que li e concordo com a Política de Privacidade e os Termos de Uso.';

const CHAVE = 'villa-stradale-origem';
const VALIDADE_MS = 30 * 24 * 60 * 60 * 1000;
const PARAMETROS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'fbclid'] as const;

export type OrigemDaVisita = {
  entrada: string;
  referencia: string | null;
  em: number;
} & Partial<Record<(typeof PARAMETROS)[number], string>>;

/** Como esta carga da página chegou. Trocar de página pelo menu não é chegada nova. */
let chegada: OrigemDaVisita | null = null;

function visitaAtual() {
  const { pathname, search, searchParams } = new URL(window.location.href);
  const veioDeFora = document.referrer && new URL(document.referrer).host !== window.location.host;
  const visita: OrigemDaVisita = {
    entrada: pathname + search,
    referencia: veioDeFora ? document.referrer : null,
    em: Date.now(),
  };
  PARAMETROS.forEach((p) => {
    const valor = searchParams.get(p);
    if (valor) visita[p] = valor;
  });
  return visita;
}

function lerOrigem(): OrigemDaVisita | null {
  try {
    const origem: OrigemDaVisita | null = JSON.parse(localStorage.getItem(CHAVE) ?? 'null');
    return origem && Date.now() - origem.em < VALIDADE_MS ? origem : null;
  } catch {
    return null;
  }
}

/**
 * Guarda de onde a pessoa chegou. O anúncio traz a pessoa à home e ela envia o
 * formulário dois cliques depois, às vezes num lote aberto em outra aba, ou dias
 * depois: por isso fica no navegador por 30 dias. Não guarda nada da pessoa, só a
 * campanha. Um clique de anúncio novo vence sempre, e nada que não seja anúncio apaga
 * um anúncio guardado. Fora isso vale a última chegada de fora: voltar direto ao site
 * nunca apaga nada.
 */
export function guardarOrigem() {
  if (chegada) return;
  try {
    chegada = visitaAtual();
    const guardada = lerOrigem();
    const agora = classificarOrigem(chegada);
    if (!guardada || agora === 'pago' || (agora !== 'direto' && classificarOrigem(guardada) !== 'pago')) {
      localStorage.setItem(CHAVE, JSON.stringify(chegada));
    }
  } catch {
    // aba privada ou armazenamento bloqueado: vale a chegada guardada na memória
  }
}

/** A origem que vai no envio. Com o armazenamento bloqueado, vale o que esta carga da página trouxe. */
export function origemDoEnvio() {
  try {
    return lerOrigem() ?? chegada ?? visitaAtual();
  } catch {
    return null;
  }
}

export type Contato = {
  id: string;
  criado_em: string;
  nome: string;
  email: string;
  telefone: string;
  origem: Origem | null;
  crm_pendente: boolean;
  crm_enviado_em: string | null;
  crm_erro: string | null;
  pagina: string | null;
  entrada: string | null;
  referencia: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_term: string | null;
  utm_content: string | null;
  gclid: string | null;
  fbclid: string | null;
  dispositivo: string | null;
  navegador: string | null;
  cidade: string | null;
  estado: string | null;
  pais: string | null;
};

/** A origem em uma linha, para a tabela do painel */
export function resumoDaOrigem(c: Contato) {
  const campanha = [c.utm_source, c.utm_medium, c.utm_campaign].filter(Boolean).join(' / ');
  if (campanha) return campanha;
  if (c.gclid) return 'Anúncio do Google';
  if (c.fbclid) return 'Meta (Instagram ou Facebook)';
  if (c.referencia) {
    try {
      return new URL(c.referencia).hostname.replace(/^www\./, '');
    } catch {
      return c.referencia;
    }
  }
  return c.origem === 'pago' ? 'Anúncio sem UTM' : 'Acesso direto';
}

export function dataDoContato(iso: string) {
  return new Intl.DateTimeFormat('pt-BR', {
    timeZone: 'America/Sao_Paulo',
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date(iso));
}

/** Se o contato já chegou ao CRM da Sotheby's */
export function situacaoNoCrm(c: Contato) {
  if (c.crm_enviado_em) return `Enviado em ${dataDoContato(c.crm_enviado_em)}`;
  if (c.crm_erro) return `Falhou: ${c.crm_erro}`;
  return c.crm_pendente ? 'Aguardando' : 'Não enviado';
}
