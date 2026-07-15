import { contornosLotes, type LoteContorno } from './implantacao';

/**
 * Busca as marcações dos lotes no Supabase (fonte da verdade, editável na
 * página admin). Se o banco estiver indisponível ou vazio, cai para as
 * marcações estáticas em lib/implantacao.ts — o site nunca fica sem conteúdo.
 *
 * revalidate: 60s → depois de salvar no admin, a home reflete em até 1 min.
 */
export async function getContornos(): Promise<LoteContorno[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) return contornosLotes;

  try {
    const res = await fetch(
      `${url}/rest/v1/implantacao_marcacoes?select=contornos&id=eq.1`,
      {
        headers: { apikey: anon, Authorization: `Bearer ${anon}` },
        next: { revalidate: 60 },
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
