import { createHash, createHmac, randomInt, timingSafeEqual } from 'node:crypto';
import { SITE } from '@/lib/seo';
import { criarSupabaseAdmin } from '@/lib/supabase/admin';
import { nomeDe, situacaoDe } from '@/lib/usuarios';

/**
 * O Book Digital fora do app. Cada usuário tem um link, villastradale.com.br/book/<codigo>, e
 * uma senha que ele repassa ao cliente. O cliente não tem conta: com a senha certa ganha um
 * cookie assinado, que vale para aquele link enquanto a senha não mudar.
 */

export type LinkDoBook = {
  id: string;
  /** nulo quando a conta de quem mandou foi apagada: o link deixa de abrir, e o histórico fica */
  usuario: string | null;
  codigo: string;
  senha: string;
  versao: number;
  ativo: boolean;
  criado_em: string;
  atualizado_em: string;
};

export type VisitaDoBook = {
  id: string;
  link: string;
  criado_em: string;
  visto_em: string;
  aparelho: Aparelho;
  telas: number[];
  segundos: number;
};

export type Aparelho = 'celular' | 'tablet' | 'computador' | 'tv';

/** Sem 0/O, 1/l/I: o cliente digita a senha olhando a mensagem, às vezes num celular pequeno */
const LETRAS_DO_CODIGO = 'abcdefghjkmnpqrstuvwxyz23456789';
const LETRAS_DA_SENHA = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';

const sortear = (letras: string, tamanho: number) => Array.from({ length: tamanho }, () => letras[randomInt(letras.length)]).join('');

export const gerarCodigo = () => sortear(LETRAS_DO_CODIGO, 8);
export const gerarSenha = () => sortear(LETRAS_DA_SENHA, 6);

export const CODIGO_VALIDO = /^[a-z0-9]{8}$/;
export const SENHA_MINIMA_DO_BOOK = 6;
export const SENHA_MAXIMA_DO_BOOK = 40;

/** A senha vale sem diferença de maiúscula e sem os espaços que o teclado do celular põe sozinho */
const normalizar = (senha: string) => senha.normalize('NFC').replace(/\s+/g, '').toLowerCase();

export function erroDaSenhaDoBook(senha: string) {
  const limpa = normalizar(senha);
  if (limpa.length < SENHA_MINIMA_DO_BOOK) return `A senha precisa ter ao menos ${SENHA_MINIMA_DO_BOOK} caracteres.`;
  if (limpa.length > SENHA_MAXIMA_DO_BOOK) return 'A senha é longa demais.';
  return null;
}

/**
 * Quem recebe pelo WhatsApp costuma copiar a mensagem inteira, porque o celular não deixa
 * selecionar só um pedaço do balão. Colada no campo, ela vira "Olá! ... Senha: ABC234": fica
 * valendo o que vem depois do último "Senha:".
 */
export function extrairSenha(digitada: string) {
  return digitada.match(/senha\s*:\s*(.+?)\s*$/i)?.[1] ?? digitada;
}

/** Compara pelo resumo, em tempo constante: o tempo da resposta não diz quantas letras acertou */
export function senhaConfere(digitada: string, certa: string) {
  const resumo = (s: string) => createHash('sha256').update(normalizar(s)).digest();
  const a = resumo(certa);
  // a senha pura e a colada com a mensagem: as duas comparações rodam sempre
  const direta = timingSafeEqual(resumo(digitada), a);
  const extraida = timingSafeEqual(resumo(extrairSenha(digitada)), a);
  return direta || extraida;
}

// ----- o cookie de quem já digitou a senha -----

export const DIAS_DE_ACESSO = 30;
export const nomeDoCookie = (codigo: string) => `book_${codigo}`;

/** A chave da assinatura sai da chave de serviço: nada novo para guardar na Vercel, e quem não tem a chave não forja o cookie */
function assinar(texto: string) {
  const segredo = createHash('sha256').update(`book-digital|${process.env.SUPABASE_SERVICE_ROLE_KEY ?? ''}`).digest();
  return createHmac('sha256', segredo).update(texto).digest('base64url');
}

/** link.versao.validade.assinatura: trocar a senha ou desligar o link sobe a versão, e o cookie antigo deixa de valer */
export function cookieDeAcesso(link: LinkDoBook) {
  const validade = Math.floor(Date.now() / 1000) + DIAS_DE_ACESSO * 24 * 60 * 60;
  const corpo = `${link.id}.${link.versao}.${validade}`;
  return `${corpo}.${assinar(corpo)}`;
}

/**
 * 'valido' abre o book. 'antigo' é um cookie verdadeiro deste link que deixou de valer (a senha
 * mudou, o link foi desligado e religado, ou passaram os 30 dias): a tela da senha explica.
 */
export function estadoDoAcesso(valor: string | undefined, link: LinkDoBook): 'valido' | 'antigo' | 'nenhum' {
  if (!valor) return 'nenhum';
  const partes = valor.split('.');
  if (partes.length !== 4) return 'nenhum';
  const [id, versao, validade, assinatura] = partes;
  const esperada = Buffer.from(assinar(`${id}.${versao}.${validade}`));
  const recebida = Buffer.from(assinatura);
  if (esperada.length !== recebida.length || !timingSafeEqual(esperada, recebida) || id !== link.id) return 'nenhum';
  return Number(versao) === link.versao && Number(validade) > Date.now() / 1000 ? 'valido' : 'antigo';
}

export const acessoValido = (valor: string | undefined, link: LinkDoBook) => estadoDoAcesso(valor, link) === 'valido';

// ----- banco -----

/** O link pelo endereço, com o nome de quem mandou. Usuário desativado leva o link junto. */
export async function linkPeloCodigo(codigo: string) {
  if (!CODIGO_VALIDO.test(codigo)) return null;
  const banco = criarSupabaseAdmin();
  // banco fora do ar não pode virar "link desativado" na tela do cliente
  const { data, error } = await banco.from('links_do_book').select('*').eq('codigo', codigo).maybeSingle<LinkDoBook>();
  if (error) throw new Error(error.message);
  if (!data) return null;
  if (!data.usuario) return { link: data, disponivel: false, enviadoPor: '' };
  const { data: dono, error: erroDoDono } = await banco.auth.admin.getUserById(data.usuario);
  if (erroDoDono && erroDoDono.status !== 404) throw new Error(erroDoDono.message);
  const disponivel = data.ativo && Boolean(dono.user) && situacaoDe(dono.user!) !== 'desativado';
  return { link: data, disponivel, enviadoPor: dono.user ? nomeDe(dono.user) : '' };
}

/** O link do usuário; quem abre a tela de compartilhar pela primeira vez ganha um na hora */
export async function linkDoUsuario(usuario: string) {
  const banco = criarSupabaseAdmin();
  const { data, error: erroDaBusca } = await banco.from('links_do_book').select('*').eq('usuario', usuario).maybeSingle<LinkDoBook>();
  if (erroDaBusca) throw new Error(erroDaBusca.message);
  if (data) return data;

  // código repetido é raríssimo, mas o banco recusa: sorteia outro
  for (let tentativa = 0; tentativa < 5; tentativa++) {
    const { data: novo, error } = await banco
      .from('links_do_book')
      .insert({ usuario, codigo: gerarCodigo(), senha: gerarSenha() })
      .select('*')
      .single<LinkDoBook>();
    if (novo) return novo;
    // duas telas abertas ao mesmo tempo: a outra criou primeiro
    if (error?.code === '23505' && error.message.includes('usuario')) {
      const { data: existente } = await banco.from('links_do_book').select('*').eq('usuario', usuario).single<LinkDoBook>();
      if (existente) return existente;
    }
    if (error && error.code !== '23505') throw new Error(error.message);
  }
  throw new Error('não foi possível criar o link');
}

/** O endereço que vai para o cliente: o do site, que ele reconhece, e não o do app */
export function enderecoDoLink(codigo: string, host: string) {
  const base = process.env.NODE_ENV === 'production' ? SITE : `http://${host.replace(/^app\./, '')}`;
  return `${base}/book/${codigo}`;
}

/** Pelo navegador, só o tipo de aparelho: é o que o usuário precisa saber, e não identifica ninguém */
export function aparelhoDe(agente: string, toques = 0): Aparelho {
  // o iPad se apresenta como Mac: o que entrega é a tela de toque
  if (/macintosh/i.test(agente) && toques > 1) return 'tablet';
  if (/smart-?tv|hbbtv|netcast|tizen|web0s|webos|bravia|crkey|googletv|android tv|aft[a-z]|roku|appletv/i.test(agente)) return 'tv';
  if (/ipad|tablet|kindle|silk|playbook/i.test(agente) || (/android/i.test(agente) && !/mobile/i.test(agente))) return 'tablet';
  if (/mobi|iphone|ipod|android|windows phone/i.test(agente)) return 'celular';
  return 'computador';
}
