'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

const DISSOLVE_MS = 900;
const ESPERA_MS = 4000;
const TRAVOU_MS = 6000;
/** quanto do espaço precisa estar à vista para a rotação andar */
const NA_TELA = 0.5;

/**
 * Um espaço de mídias que roda sozinho: os filmes em sequência, depois a imagem
 * parada por um tempo, e tudo de novo. Cada filme se dissolve no seguinte um
 * pouco antes de acabar, ainda andando, para nada ficar congelado à vista.
 *
 * A imagem é a base: é ela que aparece antes de a rotação começar e é só ela
 * que fica para quem pede menos movimento ou economia de dados, ou se o
 * aparelho não deixar tocar sozinho. Se um filme travar, o seguinte entra.
 * Os filmes baixam quando o espaço chega perto da tela, e tudo para fora dela.
 *
 * Quem chega vê sempre o primeiro filme do começo: a rotação só anda com metade
 * do espaço à vista, e volta ao início quando ele sai. Com 15% bastando, ela
 * corria enquanto a pessoa ainda rolava, e num espaço de um filme só a pessoa
 * chegava já na imagem.
 *
 * Cada item de filmes é o começo do nome: "-720.mp4" ou "-1080.mp4" e
 * "-poster.webp", o primeiro quadro, que segura o lugar até o filme andar.
 */
export function MidiasRotativas({
  filmes,
  imagem,
  alt,
  sizes,
}: {
  filmes: string[];
  imagem: string;
  alt: string;
  sizes: string;
}) {
  const total = filmes.length;
  const caixa = useRef<HTMLDivElement>(null);
  const rebobina = useRef(0);
  // o passo à vista: um dos filmes, ou o último, que é a imagem
  const [passo, setPasso] = useState(total);
  const [tamanho, setTamanho] = useState<720 | 1080 | null>(null);
  const [naTela, setNaTela] = useState(false);
  const [desistiu, setDesistiu] = useState(false);

  useEffect(() => {
    const el = caixa.current;
    if (!el) return;
    const calmo = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const economia = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    if (calmo || economia) return;
    const perto = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      // pela largura real do quadro na tela, em pixels físicos: num cartão de
      // 660px, mesmo em tela retina, o 720p já entrega mais do que aparece
      setTamanho(el.clientWidth * window.devicePixelRatio > 1400 ? 1080 : 720);
      setPasso(0);
      perto.disconnect();
    }, { rootMargin: '600px 0px' });
    const tela = new IntersectionObserver(([e]) => setNaTela(e.intersectionRatio >= NA_TELA), { threshold: NA_TELA });
    perto.observe(el);
    tela.observe(el);
    return () => { perto.disconnect(); tela.disconnect(); window.clearTimeout(rebobina.current); };
  }, []);

  useEffect(() => {
    const filmesNaCaixa = caixa.current?.querySelectorAll('video');
    if (!filmesNaCaixa?.length) return;
    if (!naTela) {
      filmesNaCaixa.forEach((v) => { v.pause(); v.currentTime = 0; });
      if (!desistiu) setPasso(0);
      return;
    }
    if (desistiu) return;
    const seguir = () => setPasso((p) => (p + 1) % (total + 1));
    if (passo === total) {
      const espera = window.setTimeout(seguir, ESPERA_MS);
      return () => window.clearTimeout(espera);
    }
    const v = filmesNaCaixa[passo];
    v.play().catch((e: DOMException) => { if (e.name === 'NotAllowedError') { setDesistiu(true); setPasso(total); } });
    let vigia = window.setTimeout(seguir, TRAVOU_MS);
    const anda = () => {
      window.clearTimeout(vigia);
      vigia = window.setTimeout(seguir, TRAVOU_MS);
      if (v.duration - v.currentTime <= DISSOLVE_MS / 1000) seguir();
    };
    v.addEventListener('timeupdate', anda);
    v.addEventListener('ended', seguir);
    return () => {
      window.clearTimeout(vigia);
      v.removeEventListener('timeupdate', anda);
      v.removeEventListener('ended', seguir);
    };
  }, [tamanho, naTela, passo, desistiu, total]);

  // o filme que saiu segue andando por baixo da dissolução; depois para e volta ao primeiro quadro
  useEffect(() => {
    const filmesNaCaixa = caixa.current?.querySelectorAll('video');
    if (!filmesNaCaixa?.length) return;
    rebobina.current = window.setTimeout(() => {
      filmesNaCaixa.forEach((v, j) => { if (j !== passo) { v.pause(); v.currentTime = 0; } });
    }, DISSOLVE_MS + 100);
  }, [passo]);

  return (
    <div ref={caixa} data-surgir="imagem" className="relative h-full min-h-[260px] w-full md:min-h-[340px]">
      <Image src={imagem} alt={alt} fill className="object-cover" sizes={sizes} />
      {tamanho &&
        filmes.map((base, j) => (
          <video
            key={base}
            src={`${base}-${tamanho}.mp4`}
            poster={`${base}-poster.webp`}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[900ms] ease-in-out ${
              passo === j ? 'opacity-100' : 'opacity-0'
            }`}
            muted
            playsInline
            // só o da vez e o seguinte baixam: quatro filmes de uma vez eram
            // 13 MB disputando a rede com o resto da página
            preload={j === passo || j === (passo + 1) % (total + 1) ? 'auto' : 'none'}
            aria-hidden="true"
            tabIndex={-1}
            disablePictureInPicture
          />
        ))}
    </div>
  );
}
