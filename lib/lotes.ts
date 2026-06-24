export const TOTAL_LOTES = 54;

export interface LoteImage {
  src: string;
  width: number;
  height: number;
}

export interface LoteData {
  numero: number;
  /** Área do lote, ex.: "3276.81" (sem o sufixo m²) */
  area: string;
  masterplan: LoteImage;
  detalhe: LoteImage;
  vistas: LoteImage[];
}

const BASE = '/images/masterplan lotes';

export const lotesData: Record<number, LoteData> = {
  7: {
    numero: 7,
    area: '3276.81',
    masterplan: {
      src: `${BASE}/lote 07/Masterplan lote 07.png`,
      width: 1199,
      height: 793,
    },
    detalhe: {
      src: `${BASE}/lote 07/Lote 07.png`,
      width: 1920,
      height: 1080,
    },
    vistas: [
      { src: `${BASE}/lote 07/foto_vista_01.png`, width: 2790, height: 1568 },
      { src: `${BASE}/lote 07/foto_vista_02.png`, width: 2796, height: 1572 },
      { src: `${BASE}/lote 07/foto_vista_03.png`, width: 2788, height: 1572 },
    ],
  },
};

export function getLote(numero: number): LoteData | null {
  return lotesData[numero] ?? null;
}
