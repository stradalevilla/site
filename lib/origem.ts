/**
 * A origem do acesso: como chegou quem preencheu o formulário. É o que vai para o CRM
 * da Sotheby's e fica guardado em contatos.origem.
 *
 * Trabalha só com os dados da visita, sem nada do navegador: roda no servidor, para gravar
 * e reenviar, e na página, para decidir o que guardar. A tabela de casos está em
 * scripts/testar-origem.mjs.
 *
 * "direto" é um teto, não um retrato: WhatsApp, TikTok e os aplicativos de IA costumam
 * abrir o site sem dizer de onde vieram. Só a UTM no link resolve esses casos.
 */
export type Origem = 'organico' | 'direto' | 'social' | 'IA' | 'referencia' | 'pago';

export const ROTULO_DA_ORIGEM: Record<Origem, string> = {
  organico: 'Orgânico',
  direto: 'Direto',
  social: 'Social',
  IA: 'IA',
  referencia: 'Referência',
  pago: 'Pago',
};

/** Os campos de um contato que dizem de onde ele veio */
export type DadosDaVisita = {
  entrada?: string | null;
  referencia?: string | null;
  utm_source?: string | null;
  utm_medium?: string | null;
  utm_campaign?: string | null;
  utm_term?: string | null;
  utm_content?: string | null;
  gclid?: string | null;
  fbclid?: string | null;
  navegador?: string | null;
};

/**
 * Só existem em clique de anúncio, e o anúncio do Google com marcação automática chega sem
 * UTM nenhuma. Ficam de fora os que também saem em link comum: fbclid, igshid, igsh e epik.
 */
const CLIQUES_PAGOS = new Map([
  ['gclid', 'google'],
  ['gbraid', 'google'],
  ['wbraid', 'google'],
  ['dclid', 'google'],
  ['gad_source', 'google'],
  ['gad_campaignid', 'google'],
  ['msclkid', 'bing'],
  ['ttclid', 'tiktok'],
  ['ttcid', 'tiktok'],
  ['li_fat_id', 'linkedin'],
  ['twclid', 'x'],
  ['sccid', 'snapchat'],
  ['rdt_cid', 'reddit'],
  ['yclid', 'yandex'],
  ['ob_click_id', 'outbrain'],
  ['oppref', 'chatgpt'],
  ['olref', 'chatgpt'],
]);
const LINK_DE_REDE_SOCIAL = /[?&](fbclid|igshid|igsh|epik)=/i;

/**
 * Palavras que marcam mídia paga no utm_medium e no utm_source, e o Analytics não reconhece
 * as em português. "sem" fica de fora: em inglês é busca paga, mas aqui é preposição.
 */
const TERMOS_PAGOS = new Set([
  'ad', 'ads', 'adwords', 'anuncio', 'anunciopago', 'anuncios', 'banner', 'banners', 'cpa', 'cpc', 'cpi', 'cpl', 'cpm', 'cpp',
  'cpv', 'crossnetwork', 'display', 'expandable', 'impulsionada', 'impulsionadas', 'impulsionado', 'impulsionados',
  'impulsionamento', 'impulsionamentos', 'interstitial', 'midiapaga', 'paga', 'pagas', 'pago', 'pagos', 'paid', 'patrocinada',
  'patrocinadas', 'patrocinado', 'patrocinados', 'patrocinio', 'payperclick', 'pmax', 'ppc', 'programatica', 'programatico',
  'programmatic', 'publicidade', 'remarketing', 'retargeting', 'socialads', 'sponsored', 'trafegopago',
]);
/** O mesmo, quando vem grudado ou com separador no meio: paidsocial, ecpm, googleads, pay-per-click */
const TERMO_PAGO =
  /paid|cp[acmv](?![a-z0-9])|cross[-_ ]network|content[-_ ]text|pay[-_ ]?per[-_ ]?click|(google|meta|facebook|fb|instagram|insta|ig|linkedin|tiktok|bing|youtube|yt)ads?(?![a-z0-9])/;
const NAO_PAGO = /(nao|not|non|un|pre)[-_ ]?(pag[ao]s?|paid)/;
/** Nome|id do modelo da Utmify e macro que o anúncio não substituiu */
const MARCA_DE_ANUNCIO = /\|\d{6,}$|\{\{.+\}\}/;
/** Só existem em mídia paga, mesmo quando o medium diz referral, como o padrão da Taboola */
const FONTE_PAGA = /^(taboola|outbrain|criteo|msads|bing_?video)$/;
/** Instagram_Stories: é o que a Meta escreve sozinha com o posicionamento do anúncio */
const POSICIONAMENTO_DA_META =
  /^(facebook|instagram|messenger|audience_network|threads)_(classic|desktop|explore|feed|inbox|instream|marketplace|mobile|native|profile|reels|rewarded|right|search|sponsored|stories|stream|video)/;

const MEIOS_ORGANICOS = new Set(['organic', 'organico', 'seo']);
const MEIOS_SOCIAIS = new Set(['redes', 'sm', 'social', 'sociais', 'socialmedia', 'socialnetwork']);
const MEIOS_DE_REFERENCIA = new Set([
  'affiliate', 'afiliado', 'afiliados', 'email', 'emailmarketing', 'link', 'mail', 'newsletter', 'offline', 'qr', 'qrcode',
  'referencia', 'referral', 'sms',
]);

const FONTES_SOCIAIS = new Set([
  'bluesky', 'bsky', 'discord', 'facebook', 'fb', 'ig', 'igshopping', 'insta', 'instagram', 'kwai', 'linkedin', 'linktree',
  'lnkd', 'messenger', 'meta', 'pinterest', 'reddit', 'snapchat', 'telegram', 'threads', 'tiktok', 'tumblr', 'twitter', 'vimeo',
  'whatsapp', 'wpp', 'youtube', 'yt',
]);
/** Só valem como a fonte inteira: zap-imoveis é o portal ZAP Imóveis, não o WhatsApp */
const FONTES_SOCIAIS_CURTAS = new Set(['wa', 'x', 'zap']);
const FONTES_DE_BUSCA = new Set(['baidu', 'bing', 'brave', 'duckduckgo', 'ecosia', 'google', 'yahoo', 'yandex']);
const FONTES_DE_IA = new Set([
  'anthropic', 'chatgpt', 'claude', 'copilot', 'deepseek', 'gemini', 'geminiforbusiness', 'grok', 'mistral', 'openai', 'perplexity',
]);

/** Testados antes de busca e de rede social: gemini.google.com é do Google e l.meta.ai parece da Meta */
const DOMINIOS_DE_IA = [
  'aistudio.google.com', 'assistant.kagi.com', 'bard.google.com', 'character.ai', 'chat.com', 'chat.mistral.ai',
  'chat.openai.com', 'chatgpt.com', 'cici.com', 'claude.ai', 'copilot.cloud.microsoft', 'copilot.com',
  'copilot.microsoft.com', 'deepseek.com', 'dola.com', 'doubao.com', 'duck.ai', 'edgeservices.bing.com',
  'gemini.google.com', 'grok.com', 'kimi.ai', 'kimi.com', 'kimi.moonshot.cn', 'luzia.com', 'm365.cloud.microsoft',
  'm365copilotapp.svc.cloud.microsoft', 'manus.im', 'meta.ai', 'muse.ai', 'notebook.google', 'notebook.google.com',
  'notebooklm.google', 'notebooklm.google.com', 'perplexity.ai', 'perplexity.com', 'poe.com', 'pplx.ai', 'qwen.ai',
  'you.com', 'zapia.com',
  // aplicativos no Android, que aparecem como android-app://
  'ai.character.app', 'ai.mistral.chat', 'ai.perplexity.app.android', 'ai.perplexity.comet', 'ai.qwenlm.chat.android',
  'ai.x.grok', 'co.thewordlab.luzia', 'com.anthropic.claude', 'com.brainlogic.zapia', 'com.deepseek.chat',
  'com.facebook.stella', 'com.google.android.apps.bard', 'com.google.android.apps.labs.language.tailwind', 'com.larus.wolf',
  'com.microsoft.copilot', 'com.microsoft.office.officehubrow', 'com.moonshot.kimichat', 'com.openai.chatgpt',
  'com.poe.android', 'tech.butterfly.app',
];

/** De onde um anúncio de display traz a pessoa, mesmo sem UTM */
const REDES_DE_ANUNCIOS = [
  '2mdn.net', 'adform.net', 'adnxs.com', 'adroll.com', 'adsensecustomsearchads.com', 'amazon-adsystem.com',
  'casalemedia.com', 'criteo.com', 'doubleclick.net', 'flashtalking.com', 'googleadservices.com', 'googlesyndication.com',
  'imasdk.googleapis.com', 'openx.net', 'paid.outbrain.com', 'pubmatic.com', 'rubiconproject.com', 'serving-sys.com',
  'syndicatedsearch.goog', 'taboola.com',
];

const DOMINIOS_SOCIAIS = [
  'beacons.ai', 'bio.link', 'bio.site', 'bsky.app', 'discord.com', 'facebook.com', 'fb.com', 'fb.me', 'instagram.com',
  'kwai.com', 'l.wl.co', 'linkedin.com', 'linktr.ee', 'lnk.bio', 'lnkd.in', 'messenger.com', 'pin.it', 'quora.com',
  'reddit.com', 'snapchat.com', 'solo.to', 'stan.store', 't.co', 't.me', 'taplink.cc', 'telegram.org', 'threads.com',
  'threads.net', 'tiktok.com', 'tumblr.com', 'twitter.com', 'vimeo.com', 'wa.me', 'whatsapp.com', 'x.com', 'youtu.be',
  'youtube.com',
  // aplicativos no Android, que aparecem como android-app://
  'com.facebook.katana', 'com.facebook.lite', 'com.facebook.orca', 'com.google.android.youtube', 'com.instagram.android',
  'com.instagram.barcelona', 'com.instagram.lite', 'com.kwai.video', 'com.linkedin.android', 'com.pinterest',
  'com.reddit.frontpage', 'com.snapchat.android', 'com.ss.android.ugc.trill', 'com.twitter.android', 'com.whatsapp',
  'com.whatsapp.w4b', 'com.zhiliaoapp.musically', 'org.telegram.messenger', 'org.telegram.messenger.web', 'org.telegram.plus',
];
const PINTEREST = /(^|\.)pinterest\.(com?\.)?[a-z]{2,4}$/;
/** O navegador dentro destes aplicativos muitas vezes não informa a referência, mas se identifica */
const NAVEGADOR_DE_APP_SOCIAL = /Instagram|FBAN|FBAV|FB_IAB|musical_ly|LinkedInApp| Barcelona \d|Snapchat/;

const DOMINIOS_DE_BUSCA = [
  'ask.com', 'baidu.com', 'bing.com', 'busca.uol.com.br', 'buscador.terra.com.br', 'duckduckgo.com', 'ecosia.org', 'kagi.com',
  'mojeek.com', 'pesquisa.sapo.pt', 'qwant.com', 'search.aol.com', 'search.brave.com', 'search.naver.com',
  'search.yahoo.com', 'seznam.cz', 'sogou.com', 'startpage.com', 'ya.ru', 'yandex.com', 'yandex.ru',
  'com.google.android.googlequicksearchbox',
];
/** Só a busca e seus verticais: mail, docs, translate e o resto do Google caem em referência */
const BUSCA_DO_GOOGLE = /^((images|news|lens|maps|scholar)\.)?google\.(com?\.)?[a-z]{2,3}$/;

const PROPRIO_SITE = /(^|\.)villastradale\.(com\.br|vercel\.app)$|^site-three-fawn-41\.vercel\.app$|^localhost$/;

const limpar = (valor?: string | null) =>
  (valor ?? '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .trim()
    .toLowerCase();

const temPalavra = (texto: string, palavras: Set<string>) => texto.split(/[^a-z0-9]+/).some((p) => palavras.has(p));
const bate = (host: string, dominios: string[]) => dominios.some((d) => host === d || host.endsWith(`.${d}`));

/** Vazio quando não há referência, ela não é um endereço ou é o próprio site */
function hostDaReferencia(referencia?: string | null) {
  try {
    const host = referencia ? new URL(referencia).hostname.toLowerCase().replace(/^www\./, '') : '';
    return PROPRIO_SITE.test(host) ? '' : host;
  } catch {
    return '';
  }
}

/** A plataforma do clique de anúncio, se houver um. Os nomes variam em maiúsculas: ScCid, ScCID. */
function cliquePago(v: DadosDaVisita) {
  if (v.gclid) return 'google';
  for (const [nome, valor] of new URLSearchParams(v.entrada?.split('?').slice(1).join('?') ?? '')) {
    const plataforma = CLIQUES_PAGOS.get(nome.toLowerCase());
    if (plataforma && valor) return plataforma;
  }
  return null;
}

function ehMidiaPaga(v: DadosDaVisita, fonte: string, meio: string) {
  if (NAO_PAGO.test(meio)) return false;
  if (meio === 'sem' || FONTE_PAGA.test(fonte)) return true;
  if ([fonte, meio].some((valor) => temPalavra(valor, TERMOS_PAGOS) || TERMO_PAGO.test(valor))) return true;
  if ([fonte, meio, limpar(v.utm_campaign)].some((valor) => MARCA_DE_ANUNCIO.test(valor))) return true;
  // num link orgânico alguém pode digitar instagram_stories à mão: o medium decide
  if (temPalavra(meio, MEIOS_SOCIAIS) || temPalavra(meio, MEIOS_ORGANICOS)) return false;
  return [meio, limpar(v.utm_term), limpar(v.utm_content)].some((valor) => POSICIONAMENTO_DA_META.test(valor));
}

/**
 * A ordem importa. Anúncio vem primeiro, porque o clique pago também traz referência de
 * rede social ou de busca. IA vem logo depois, porque o ChatGPT marca os próprios links com
 * utm_source; mas a marca dele sobrevive em link copiado e na busca do Google, então com
 * outra referência quem manda é a referência. Fonte social vem antes do medium porque o
 * Pinterest marca os próprios Pins com utm_medium=Organic.
 */
export function classificarOrigem(v: DadosDaVisita): Origem {
  const fonte = limpar(v.utm_source);
  const meio = limpar(v.utm_medium);
  const host = hostDaReferencia(v.referencia);

  if (cliquePago(v) || ehMidiaPaga(v, fonte, meio) || bate(host, REDES_DE_ANUNCIOS)) return 'pago';

  const fonteDeIa = temPalavra(fonte, FONTES_DE_IA) || bate(fonte.split('?')[0], DOMINIOS_DE_IA);
  if (bate(host, DOMINIOS_DE_IA) || (fonteDeIa && !host)) return 'IA';

  if (temPalavra(fonte, FONTES_SOCIAIS) || FONTES_SOCIAIS_CURTAS.has(fonte) || bate(fonte, DOMINIOS_SOCIAIS)) return 'social';
  if (temPalavra(meio, MEIOS_ORGANICOS)) return 'organico';
  if (temPalavra(meio, MEIOS_SOCIAIS) || temPalavra(meio, FONTES_SOCIAIS)) return 'social';
  if (temPalavra(meio, MEIOS_DE_REFERENCIA)) return 'referencia';
  if (temPalavra(fonte, FONTES_DE_BUSCA)) return 'organico';

  if (bate(host, DOMINIOS_SOCIAIS) || PINTEREST.test(host)) return 'social';
  if (bate(host, DOMINIOS_DE_BUSCA) || BUSCA_DO_GOOGLE.test(host)) return 'organico';
  if (host) return 'referencia';

  if (v.fbclid || LINK_DE_REDE_SOCIAL.test(v.entrada ?? '') || NAVEGADOR_DE_APP_SOCIAL.test(v.navegador ?? '')) return 'social';
  return fonte || meio || limpar(v.utm_campaign) ? 'referencia' : 'direto';
}

/** As UTMs do tráfego pago. O que a visita não trouxe e o clique garante é deduzido, como faz o Analytics. */
export function utmDoTrafegoPago(v: DadosDaVisita) {
  const clique = cliquePago(v);
  const semUtm = !v.utm_source && !v.utm_medium;
  return {
    utm_source: v.utm_source ?? clique ?? (semUtm ? hostDaReferencia(v.referencia) : ''),
    utm_medium: v.utm_medium ?? (clique ? 'cpc' : semUtm ? 'display' : ''),
    utm_campaign: v.utm_campaign ?? '',
  };
}
