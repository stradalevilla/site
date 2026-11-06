import type { User } from '@supabase/supabase-js';

/**
 * Quem pode o quê no painel. Administrador gerencia os usuários; equipe usa o resto do
 * painel. O papel fica em app_metadata porque esse campo só o servidor altera: em
 * user_metadata a própria pessoa poderia se promover.
 */
export type Papel = 'administrador' | 'equipe';
export type SituacaoDoUsuario = 'ativo' | 'convite' | 'desativado';

export const ROTULO_DO_PAPEL: Record<Papel, string> = {
  administrador: 'Administrador',
  equipe: 'Equipe',
};

export const ROTULO_DA_SITUACAO: Record<SituacaoDoUsuario, string> = {
  ativo: 'Ativo',
  convite: 'Convite pendente',
  desativado: 'Desativado',
};

/** O que a tela de usuários recebe de cada pessoa */
export type ResumoDoUsuario = {
  id: string;
  nome: string;
  email: string;
  papel: Papel;
  situacao: SituacaoDoUsuario;
  criado_em: string;
  ultimo_login: string | null;
};

export const SENHA_MINIMA = 8;
/** O Supabase só lê 72 bytes da senha: o que passa disso seria ignorado sem aviso */
const SENHA_MAXIMA_EM_BYTES = 72;

export function erroDaSenha(senha: string) {
  if (senha.length < SENHA_MINIMA) return `A senha precisa ter ao menos ${SENHA_MINIMA} caracteres.`;
  if (new TextEncoder().encode(senha).length > SENHA_MAXIMA_EM_BYTES) return 'A senha é longa demais.';
  return null;
}

/** Como chamar a pessoa: o primeiro nome, ou o nome inteiro depois de título ou inicial ("Dr. Ricardo", "J. R. Silva") */
export function comoChamar(nome: string) {
  const limpo = nome.trim().replace(/^[^\p{L}]+|[^\p{L}]+$/gu, '');
  const primeiro = limpo.split(/[\s,]+/)[0] ?? '';
  return /\.$/.test(primeiro) || /^(dr|dra|sr|sra|prof|profa)$/i.test(primeiro) ? limpo : primeiro;
}

/** O nome entra no assunto dos e-mails: quebra de linha e caractere de controle não passam */
export const limparNome = (valor: unknown) =>
  typeof valor === 'string' ? valor.replace(/[\u0000-\u001f\u007f]+/g, ' ').trim().slice(0, 120) : '';

export const emailValido = (email: string) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) && email.length <= 160;

export const papelDe = (u: User): Papel => (u.app_metadata?.papel === 'administrador' ? 'administrador' : 'equipe');

export const nomeDe = (u: User) => (typeof u.user_metadata?.nome === 'string' ? u.user_metadata.nome : '');

export function situacaoDe(u: User): SituacaoDoUsuario {
  if (u.banned_until && new Date(u.banned_until) > new Date()) return 'desativado';
  return u.invited_at && !u.email_confirmed_at ? 'convite' : 'ativo';
}

export const resumoDoUsuario = (u: User): ResumoDoUsuario => ({
  id: u.id,
  nome: nomeDe(u),
  email: u.email ?? '',
  papel: papelDe(u),
  situacao: situacaoDe(u),
  criado_em: u.created_at,
  ultimo_login: u.last_sign_in_at ?? null,
});
