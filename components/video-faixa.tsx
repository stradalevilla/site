'use client';

import { useEffect, useRef } from 'react';

/**
 * Um filme mudo em laço por cima da imagem de uma faixa. Fica transparente até
 * ter quadro, então a imagem de baixo (o primeiro quadro do filme) segura o
 * lugar enquanto ele baixa, e é ela que fica para quem pede menos movimento ou
 * economia de dados, ou se o aparelho não deixar tocar sozinho.
 *
 * Só baixa quando a faixa chega perto da tela e só roda enquanto está nela. O
 * arquivo sai da largura real do quadro em pixels físicos: até 1400 vai o de
 * 720p, que ainda sobra, e acima disso o de 1080p.
 */
export function VideoFaixa({ base }: { base: string }) {
  const filme = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = filme.current;
    if (!v) return;
    const calmo = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const economia = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    if (calmo || economia) return;

    // numa faixa com a camada presa à janela, quem entra e sai da tela é a seção
    const vigiado = v.closest('[data-faixa-fixa]') ?? v;

    const perto = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      v.preload = 'auto';
      v.src = `${base}-${v.clientWidth * window.devicePixelRatio > 1400 ? 1080 : 720}.mp4`;
      perto.disconnect();
    }, { rootMargin: '600px 0px' });
    const tela = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) v.play().catch(() => {});
      else v.pause();
    }, { threshold: 0.15 });
    perto.observe(vigiado);
    tela.observe(vigiado);
    return () => { perto.disconnect(); tela.disconnect(); };
  }, [base]);

  return (
    <video
      ref={filme}
      className="absolute inset-0 h-full w-full object-cover"
      muted
      loop
      playsInline
      preload="none"
      aria-hidden="true"
      tabIndex={-1}
      disablePictureInPicture
    />
  );
}
