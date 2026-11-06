// Os casos da origem do acesso. Rodar depois de mexer em lib/origem.ts:
//
//   node scripts/testar-origem.mjs
import { classificarOrigem, utmDoTrafegoPago } from '../lib/origem.ts';

const utm = (fonte, meio, campanha) => ({ utm_source: fonte, utm_medium: meio, utm_campaign: campanha });
const veio = (referencia) => ({ referencia });
const entrou = (consulta) => ({ entrada: `/?${consulta}` });

const CASOS = {
  pago: [
    utm('google', 'cpc', 'lancamento'),
    { ...entrou('gclid=abc'), gclid: 'abc', referencia: 'https://www.google.com/' },
    entrou('gbraid=abc'),
    entrou('wbraid=abc'),
    entrou('gad_source=1'),
    entrou('msclkid=abc'),
    entrou('ttclid=abc'),
    entrou('li_fat_id=abc'),
    { ...utm('facebook', 'paid_social', 'x'), fbclid: 'abc', referencia: 'https://l.facebook.com/' },
    utm('ig', 'Instagram_Stories', 'x'),
    utm('fb', 'Facebook_Mobile_Feed', 'x'),
    utm('instagram', 'paidsocial'),
    utm('meta', 'ads'),
    utm('instagram', 'tráfego-pago'),
    utm('instagram', 'mídia paga'),
    utm('google', 'anúncio'),
    utm('google', 'sem'),
    utm('googleads'),
    utm('google_ads'),
    utm('meta-ads'),
    utm('youtube', 'display'),
    utm('chatgpt.com', 'cpc'),
    veio('https://googleads.g.doubleclick.net/'),
    veio('https://tpc.googlesyndication.com/'),
    // anúncio do ChatGPT: o código de clique é a única prova segura
    { ...entrou('oppref=abc'), ...utm('chatgpt') },
    // o nome do parâmetro varia em maiúsculas
    entrou('ScCid=abc'),
    entrou('ScCID=abc'),
    // padrões das ferramentas: Taboola diz referral, Microsoft diz crossnetwork, Outbrain diz Discovery
    utm('taboola', 'referral'),
    utm('msads', 'crossnetwork'),
    utm('Outbrain', 'Discovery'),
    utm('bing_video', 'cpc'),
    // modelo da Utmify: nome|id do conjunto no medium e posicionamento no utm_term
    utm('FB', 'conjunto-frio|120212345678901', 'lancamento|120212345678902'),
    { ...utm('fb', 'conjunto-frio'), utm_term: 'instagram_stories' },
    // macro que a Meta não substituiu
    utm('{{site_source_name}}', '{{placement}}'),
    // variações em português e nomes grudados
    utm('instagram', 'trafegopago'),
    utm('instagram', 'impulsionados'),
    utm('instagram', 'postagem_impulsionada'),
    utm('site', 'publicidade'),
    utm('site', 'pay-per-click'),
    utm('dv360', 'programmatic'),
    // o termo pago vem no utm_source
    utm('meta_ads_lancamento', 'feed'),
    utm('google_ads_search', 'search'),
    utm('google-ads-search', 'search'),
    utm('pago'),
    utm('paid'),
    utm('meta_pago'),
    utm('google_cpc'),
    utm('x_ads'),
    utm('microsoft_ads'),
    // código de clique depois de um segundo ponto de interrogação
    { entrada: '/lotes?next=/x?y=1&gbraid=abc', referencia: 'https://www.google.com/' },
    { entrada: '/?u=https://x.com/p?q=1&msclkid=abc' },
  ],
  IA: [
    veio('https://chatgpt.com/'),
    veio('https://chat.openai.com/'),
    veio('https://www.perplexity.ai/'),
    veio('https://gemini.google.com/'),
    veio('https://notebook.google.com/'),
    veio('https://claude.ai/'),
    veio('https://copilot.microsoft.com/'),
    veio('https://copilot.com/'),
    veio('https://l.meta.ai/'),
    veio('https://assistant.kagi.com/'),
    veio('android-app://com.openai.chatgpt/'),
    utm('chatgpt.com'),
    utm('perplexity'),
    utm('copilot.com'),
    utm('copilot.com?form=MG0AUO'),
    utm('gemini'),
    // o ChatGPT troca o source de link de campanha citado na conversa
    utm('chatgpt.com', 'email'),
  ],
  organico: [
    veio('https://www.google.com/'),
    veio('https://www.google.com.br/'),
    veio('https://images.google.com/'),
    veio('https://www.bing.com/'),
    veio('https://duckduckgo.com/'),
    veio('https://kagi.com/'),
    veio('https://br.search.yahoo.com/'),
    veio('android-app://com.google.android.googlequicksearchbox/'),
    veio('android-app://com.google.android.googlequicksearchbox/https/www.google.com'),
    utm('google', 'organic'),
    utm('google'),
    // a marca do ChatGPT pode estar indexada no Google
    { ...utm('chatgpt.com'), referencia: 'https://www.google.com/' },
  ],
  social: [
    veio('https://l.instagram.com/'),
    veio('https://www.facebook.com/'),
    veio('https://lm.facebook.com/'),
    veio('android-app://m.facebook.com'),
    veio('android-app://com.instagram.android/'),
    veio('android-app://com.instagram.barcelona/'),
    veio('https://t.co/abc'),
    veio('https://www.linkedin.com/'),
    veio('https://br.pinterest.com/'),
    veio('https://pinterest.co.uk/'),
    veio('https://linktr.ee/villastradale'),
    { fbclid: 'abc' },
    entrou('igshid=abc'),
    entrou('igsh=abc'),
    { ...utm('ig', 'social'), utm_content: 'link_in_bio' },
    { ...utm('instagram', 'social'), utm_content: 'instagram_stories' },
    utm('instagram', 'bio'),
    utm('instagram', 'stories'),
    utm('whatsapp', 'mensagem'),
    utm('Linktree', 'social'),
    utm('linktr.ee'),
    utm('t.co'),
    utm('x'),
    utm('x.com'),
    utm('zap'),
    // a rede vem no utm_medium
    utm('villastradale', 'instagram'),
    utm('lista', 'whatsapp'),
    // link orgânico escrito à mão: não é posicionamento de anúncio
    utm('instagram', 'instagram_bio'),
    utm('instagram', 'instagram_post'),
    utm('facebook', 'facebook_grupo'),
    utm('site', 'instagram_bio'),
    // UTM sem sentido, mas o navegador do aplicativo diz de onde veio
    { ...utm('qualquer'), navegador: 'Mozilla/5.0 (iPhone) Mobile/15E148 Instagram 312.0.0.33.110 (iPhone14,5)' },
    // o Pinterest marca os próprios Pins assim
    utm('Pinterest', 'Organic'),
    // navegador do aplicativo sem referência
    { navegador: 'Mozilla/5.0 (iPhone) AppleWebKit/605.1.15 Mobile/15E148 Instagram 312.0.0.33.110 (iPhone14,5)' },
    { navegador: 'Mozilla/5.0 (Linux; Android 13; wv) Chrome/119.0 Mobile Safari/537.36 [FB_IAB/FB4A;FBAV/440.0.0.31.110;]' },
    { navegador: 'Mozilla/5.0 (iPhone) AppleWebKit/605.1.15 Mobile/15E148 [FBAN/FBIOS;FBAV/440.0;]' },
    { navegador: 'Mozilla/5.0 (Linux; Android 13) Chrome/119.0 Mobile Safari/537.36 musical_ly_2023 trill' },
    { navegador: 'Mozilla/5.0 (Linux; Android 13) Chrome/119.0 Barcelona 289.0.0.77.109 Android' },
  ],
  referencia: [
    veio('https://www.estadao.com.br/'),
    veio('https://mail.google.com/'),
    veio('https://docs.google.com/'),
    veio('https://translate.google.com/'),
    veio('https://mail.yahoo.com/'),
    veio('https://www.msn.com/'),
    veio('https://stradale.com.br/'),
    veio('android-app://com.google.android.gm/'),
    // imitações de domínio
    veio('https://notfacebook.com/'),
    veio('https://netflix.com/'),
    veio('https://microsoft.com/'),
    veio('https://google.evil.com/'),
    veio('https://chatgpt.com.evil.org/'),
    utm('newsletter', 'email'),
    utm('google', 'email'),
    utm('rdstation', 'email'),
    utm('imprensa'),
    utm('qr'),
    utm(null, null, 'lancamento'),
    { ...utm('chatgpt.com'), referencia: 'https://www.estadao.com.br/' },
    // terminar em "ads" não é anúncio
    utm('site', 'leads'),
    utm('site', 'uploads'),
    utm('site', 'semana'),
    utm('site', 'pagina'),
    // "sem" é preposição, e negar não é pagar
    utm('site', 'sem_custo'),
    utm('site', 'link_sem_utm'),
    utm('site', 'nao_pago'),
    utm('site', 'não pago'),
    utm('site', 'unpaid'),
    // ZAP Imóveis não é WhatsApp
    utm('zap-imoveis'),
    utm('zap_imoveis', 'portal'),
    utm('parceiro_x'),
    utm('stradale', 'rede-de-corretores'),
    // a palavra paid no nome de uma campanha não faz dela anúncio
    utm('newsletter', 'email', 'relatorio-paid-media'),
  ],
  direto: [
    {},
    veio(null),
    veio(''),
    veio('nao-e-endereco'),
    veio('https://www.villastradale.com.br/lotes'),
    veio('https://villastradale.vercel.app/'),
    veio('http://localhost:3010/'),
    { entrada: '/lotes', referencia: null },
    // nome de parâmetro que existe em todo objeto
    entrou('constructor=1'),
    entrou('gclid='),
    utm('', '', ''),
    utm('  ', '  ', '  '),
    { navegador: 'Mozilla/5.0 (iPhone) AppleWebKit/605.1.15 Version/17.0 Mobile/15E148 Safari/604.1' },
  ],
};

const UTMS_PAGAS = [
  [utm('google', 'cpc', 'lancamento'), { utm_source: 'google', utm_medium: 'cpc', utm_campaign: 'lancamento' }],
  [{ ...entrou('gclid=abc'), gclid: 'abc' }, { utm_source: 'google', utm_medium: 'cpc', utm_campaign: '' }],
  [entrou('msclkid=abc'), { utm_source: 'bing', utm_medium: 'cpc', utm_campaign: '' }],
  [veio('https://googleads.g.doubleclick.net/'), { utm_source: 'googleads.g.doubleclick.net', utm_medium: 'display', utm_campaign: '' }],
  [utm('googleads'), { utm_source: 'googleads', utm_medium: '', utm_campaign: '' }],
  [entrou('oppref=abc'), { utm_source: 'chatgpt', utm_medium: 'cpc', utm_campaign: '' }],
  [utm(null, 'cpc', 'x'), { utm_source: '', utm_medium: 'cpc', utm_campaign: 'x' }],
  [{ ...utm('google', null, 'x'), gclid: 'abc' }, { utm_source: 'google', utm_medium: 'cpc', utm_campaign: 'x' }],
];

let falhas = 0;
for (const [esperada, visitas] of Object.entries(CASOS)) {
  for (const visita of visitas) {
    const obtida = classificarOrigem(visita);
    if (obtida !== esperada) {
      falhas += 1;
      console.log(`FALHOU: esperava ${esperada}, deu ${obtida}:`, JSON.stringify(visita));
    }
  }
}

for (const [visita, esperado] of UTMS_PAGAS) {
  const obtido = JSON.stringify(utmDoTrafegoPago(visita));
  if (obtido !== JSON.stringify(esperado)) {
    falhas += 1;
    console.log(`FALHOU: esperava ${JSON.stringify(esperado)}, deu ${obtido}`);
  }
}

const total = Object.values(CASOS).flat().length + UTMS_PAGAS.length;
console.log(falhas ? `${falhas} de ${total} casos falharam` : `${total} casos certos`);
process.exit(falhas ? 1 : 0);
