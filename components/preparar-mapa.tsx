'use client';

import { useEffect } from 'react';

/**
 * Adianta o mapa da região enquanto o visitante está em outra página.
 *
 * Só a biblioteca — que sai do nosso próprio servidor e não custa cota — é
 * baixada aqui, quando o navegador está ocioso e apenas no desktop. Os tiles
 * NÃO são adiantados de propósito: eles vêm da MapTiler e são cobrados por
 * requisição, então baixá-los para quem talvez nunca abra Localização seria
 * queimar cota à toa.
 */
export function PrepararMapa() {
  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_MAPTILER_KEY) return;
    if (window.innerWidth < 1024) return;
    // respeita quem pediu economia de dados
    const rede = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    if (rede?.saveData) return;

    const ocioso =
      window.requestIdleCallback ?? ((fn: IdleRequestCallback) => window.setTimeout(fn, 2500));
    const id = ocioso(() => {
      import('maplibre-gl').catch(() => {
        /* sem drama: a página de Localização baixa de novo quando precisar */
      });
    });

    return () => window.cancelIdleCallback?.(id as number);
  }, []);

  return null;
}
