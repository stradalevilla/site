import { CONFIG_PADRAO, type ConfigDoFundo } from './curvas-de-nivel';

/**
 * A calibragem do grafismo de fundo, salva no banco pelo painel do admin.
 *
 * Mesmo arranjo das marcações dos lotes: o banco é a fonte da verdade, e se
 * ele não responder o site cai na calibragem do código. O fundo nunca fica
 * sem desenho por causa de uma falha de rede.
 *
 * No site público vale o cache de 60s. O painel passa `fresco` porque quem
 * acabou de salvar precisa ver o próprio valor, não o de um minuto atrás.
 */

const LIMITES: Record<keyof ConfigDoFundo, [number, number]> = {
  velocidade: [0, 100],
  escala: [10, 100],
  linhas: [6, 40],
  espessura: [4, 26],
  contraste: [20, 220],
  detalhe: [4, 16],
};

/**
 * Um valor fora de faixa vindo do banco quebraria o desenho (detalhe 0 trava a
 * malha, linhas 10.000 derruba o navegador). Então tudo que entra é limitado.
 */
export function normalizarConfig(bruto: unknown): ConfigDoFundo {
  if (!bruto || typeof bruto !== 'object') return CONFIG_PADRAO;
  const entrada = bruto as Record<string, unknown>;
  const saida = { ...CONFIG_PADRAO };
  for (const chave of Object.keys(LIMITES) as (keyof ConfigDoFundo)[]) {
    const valor = Number(entrada[chave]);
    if (!Number.isFinite(valor)) continue;
    const [min, max] = LIMITES[chave];
    saida[chave] = Math.min(max, Math.max(min, Math.round(valor)));
  }
  return saida;
}

export async function getConfigDoFundo(fresco = false): Promise<ConfigDoFundo> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) return CONFIG_PADRAO;

  try {
    const res = await fetch(`${url}/rest/v1/config_site?select=valor&chave=eq.grafismo`, {
      headers: { apikey: anon, Authorization: `Bearer ${anon}` },
      ...(fresco ? { cache: 'no-store' as const } : { next: { revalidate: 60 } }),
    });
    if (!res.ok) return CONFIG_PADRAO;
    const linhas = (await res.json()) as { valor: unknown }[];
    if (!linhas.length) return CONFIG_PADRAO;
    return normalizarConfig(linhas[0].valor);
  } catch {
    return CONFIG_PADRAO;
  }
}
