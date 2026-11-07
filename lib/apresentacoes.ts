export type TipoDeApresentacao = 'pdf' | 'video' | 'link';

export type Apresentacao = {
  id: string;
  criado_em: string;
  titulo: string;
  tipo: TipoDeApresentacao;
  caminho: string | null;
  endereco: string | null;
  tamanho: number | null;
};

export const BALDE = 'apresentacoes';
/** Só caminhos que o próprio servidor gerou: uuid com extensão conhecida, sem pasta */
export const CAMINHO_VALIDO = /^[0-9a-f-]{36}\.(pdf|mp4|mov)$/;
/** O mesmo limite do balde no Storage */
export const TAMANHO_MAXIMO = 400 * 1024 * 1024;

/** O que pode subir, com a extensão que o arquivo ganha no balde */
export const ARQUIVOS: Record<string, { tipo: TipoDeApresentacao; extensao: string }> = {
  'application/pdf': { tipo: 'pdf', extensao: 'pdf' },
  'video/mp4': { tipo: 'video', extensao: 'mp4' },
  'video/quicktime': { tipo: 'video', extensao: 'mov' },
};

export const ROTULO_DO_TIPO: Record<TipoDeApresentacao, string> = { pdf: 'PDF', video: 'Vídeo', link: 'Link' };

export function tamanhoLegivel(bytes: number | null) {
  if (!bytes) return '';
  const mb = bytes / 1024 / 1024;
  return mb >= 1 ? `${mb.toFixed(mb >= 10 ? 0 : 1).replace('.', ',')} MB` : `${Math.ceil(bytes / 1024)} KB`;
}

export const dataDaApresentacao = (iso: string) =>
  new Intl.DateTimeFormat('pt-BR', { timeZone: 'America/Sao_Paulo', dateStyle: 'short' }).format(new Date(iso));
