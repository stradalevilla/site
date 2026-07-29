import { contornosLotes, type LoteContorno } from './implantacao';

/**
 * Busca as marcações dos lotes no Supabase (fonte da verdade, editável na
 * página admin). Se o banco estiver indisponível ou vazio, cai para as
 * marcações estáticas em lib/implantacao.ts — o site nunca fica sem conteúdo.
 *
 * No site público vale o cache de 60s: depois de salvar no admin, a home
 * reflete em até 1 min. Já as telas de edição passam `fresco` — quem acabou de
 * desenhar precisa reabrir e ver o próprio traço, não a versão de um minuto atrás.
 */
export async function getContornos(fresco = false): Promise<LoteContorno[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) return contornosLotes;

  try {
    const res = await fetch(
      `${url}/rest/v1/implantacao_marcacoes?select=contornos&id=eq.1`,
      {
        headers: { apikey: anon, Authorization: `Bearer ${anon}` },
        ...(fresco ? { cache: 'no-store' as const } : { next: { revalidate: 60 } }),
      }
    );
    if (!res.ok) return contornosLotes;
    const linhas = (await res.json()) as { contornos: LoteContorno[] }[];
    const contornos = linhas[0]?.contornos;
    return Array.isArray(contornos) && contornos.length ? contornos : contornosLotes;
  } catch {
    return contornosLotes;
  }
}
