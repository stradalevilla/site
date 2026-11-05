'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

/** o tempo da cortina fechar, igual ao da transition em app/globals.css */
const FECHAR_MS = 320;
/** se a página nova não chegar, a cortina abre mesmo assim */
const DESISTE_MS = 5000;

/**
 * A cortina que cobre a troca de página. Na primeira carga ela só sai, em CSS
 * puro. Ao clicar num link interno ela fecha, a navegação acontece por baixo, e
 * ela abre quando a página nova chega.
 *
 * Fica de fora do painel e de âncoras na mesma página, onde a pessoa não está
 * indo a lugar nenhum.
 */
export function TransicaoDePagina() {
  const router = useRouter();
  const caminho = usePathname();
  const [estado, setEstado] = useState<'inicio' | 'aberta' | 'fechando'>('inicio');
  const desiste = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const indo = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const primeira = useRef(true);

  useEffect(() => {
    if (primeira.current) {
      primeira.current = false;
      return;
    }
    // inclui o botão de voltar: ele vence o clique que ainda estava fechando
    clearTimeout(indo.current);
    clearTimeout(desiste.current);
    setEstado('aberta');
  }, [caminho]);

  useEffect(() => {
    const aoClicar = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      const link = (e.target as Element | null)?.closest?.('a[href]');
      if (!link || link.getAttribute('target') || link.hasAttribute('download')) return;
      const destino = new URL(link.getAttribute('href') ?? '', window.location.href);
      if (destino.origin !== window.location.origin) return;
      if (destino.pathname === window.location.pathname) return;
      if (destino.pathname.startsWith('/admin') || window.location.pathname.startsWith('/admin')) return;

      e.preventDefault();
      setEstado('fechando');
      clearTimeout(indo.current);
      indo.current = setTimeout(() => router.push(destino.pathname + destino.search + destino.hash), FECHAR_MS);
      clearTimeout(desiste.current);
      desiste.current = setTimeout(() => setEstado('aberta'), DESISTE_MS);
    };
    document.addEventListener('click', aoClicar, true);
    return () => document.removeEventListener('click', aoClicar, true);
  }, [router]);

  if (caminho?.startsWith('/admin')) return null;
  return (
    <div
      aria-hidden
      className="cortina-de-pagina"
      data-estado={estado}
      // presa à animação de saída, a transition do primeiro clique não dispararia
      onAnimationEnd={() => setEstado((e) => (e === 'inicio' ? 'aberta' : e))}
    />
  );
}
