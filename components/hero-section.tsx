'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { getImageProps } from 'next/image';
import { DecorativeGraphic } from './decorative-graphic';
import { MobileHeroLogo } from './mobile-hero-logo';
import { vez } from '@/lib/abertura';

/**
 * Os dois voos sobre a península, nesta ordem. O segundo foi cortado na
 * conversão para começar em 00:03 da take original.
 *
 * Cada slide é uma imagem com um filme por cima, e a imagem é o primeiro quadro
 * dele. É ela que abre o site, com prioridade, então o hero aparece tão rápido
 * quanto uma foto: o filme só baixa depois que a página terminou de carregar, e
 * o segundo só depois de o primeiro estar pronto. Quem pede menos movimento ou
 * economia de dados fica nas imagens, com a troca pelo relógio.
 *
 * No celular em pé, imagem e filme têm versão vertical, com o mesmo enquadramento
 * central, recortada do 4K: o arquivo horizontal ficaria ampliado 3,5 vezes ali.
 */
const SLIDES = [
  {
    chave: 'por-do-sol',
    imagem: '/images/renders/hero-por-do-sol.jpg',
    imagemEmPe: '/images/renders/hero-por-do-sol-retrato.jpg',
    filme: '/videos/hero-por-do-sol',
    alt: 'A península do Villa Stradale vista do alto ao pôr do sol, com a represa e a serra ao fundo',
  },
  {
    chave: 'peninsula',
    imagem: '/images/renders/hero-peninsula.jpg',
    imagemEmPe: '/images/renders/hero-peninsula-retrato.jpg',
    filme: '/videos/hero-peninsula',
    alt: 'Villa Stradale - Uma península irreplicável',
  },
];

/** a tela que recebe os arquivos verticais */
const CELULAR_EM_PE = '(max-width: 767px) and (orientation: portrait)';

/** sem filme, quanto cada imagem fica parada antes de passar sozinha */
const PAUSA = 6000;
/** o tempo da dissolução, que corre enquanto o filme ainda anda */
const DISSOLVE_MS = 1800;
/** filme parado por esse tempo não segura o slide */
const TRAVOU_MS = 6000;

/** next/image não troca de arquivo conforme a tela: quem faz isso é o <picture> */
function FotoDoSlide({ slide, alt, prioridade }: { slide: (typeof SLIDES)[number]; alt: string; prioridade: boolean }) {
  const comum = { alt, fill: true, sizes: '100vw', quality: 90, priority: prioridade, className: 'object-cover' };
  const emPe = getImageProps({ ...comum, src: slide.imagemEmPe }).props;
  const deitada = getImageProps({ ...comum, src: slide.imagem }).props;

  return (
    <picture>
      <source media={CELULAR_EM_PE} srcSet={emPe.srcSet} sizes={emPe.sizes} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img {...deitada} alt={alt} />
    </picture>
  );
}

export function HeroSection() {
  const caixa = useRef<HTMLElement>(null);
  const filmes = useRef<(HTMLVideoElement | null)[]>([]);
  const [atual, setAtual] = useState(0);
  const [tamanho, setTamanho] = useState<720 | 1080 | 'retrato' | null>(null);
  const [primeiroPronto, setPrimeiroPronto] = useState(false);
  const [naTela, setNaTela] = useState(true);

  const ir = useCallback((indice: number) => {
    setAtual((indice + SLIDES.length) % SLIDES.length);
  }, []);

  // os filmes esperam o site carregar: nada disputa a rede com a primeira tela
  useEffect(() => {
    const calmo = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const economia = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    if (calmo || economia) return;
    const emPe = window.matchMedia(CELULAR_EM_PE);
    const ligar = () => {
      const largura = (caixa.current?.clientWidth ?? 0) * window.devicePixelRatio;
      setTamanho(emPe.matches ? 'retrato' : largura > 1400 ? 1080 : 720);
    };
    // quem gira o celular troca de arquivo: o vertical deitado ficaria todo cortado
    const aoCarregar = () => {
      ligar();
      emPe.addEventListener('change', ligar);
    };
    if (document.readyState === 'complete') aoCarregar();
    else window.addEventListener('load', aoCarregar, { once: true });
    return () => {
      window.removeEventListener('load', aoCarregar);
      emPe.removeEventListener('change', ligar);
    };
  }, []);

  useEffect(() => {
    const el = caixa.current;
    if (!el) return;
    const tela = new IntersectionObserver(([e]) => setNaTela(e.isIntersecting), { threshold: 0.1 });
    tela.observe(el);
    return () => tela.disconnect();
  }, []);

  // passa sozinho: com filme, quando ele vai acabando; sem filme, pelo relógio.
  // O relógio reinicia a cada troca, inclusive nas manuais.
  useEffect(() => {
    const passar = () => setAtual((i) => (i + 1) % SLIDES.length);
    const v = tamanho ? filmes.current[atual] : null;
    if (!naTela) {
      v?.pause();
      return;
    }
    if (!v) {
      const t = setTimeout(passar, PAUSA);
      return () => clearTimeout(t);
    }
    // quem volta com a seta logo depois da troca pega o filme no fim
    if (v.duration - v.currentTime <= DISSOLVE_MS / 1000) v.currentTime = 0;
    v.play().catch(() => {});
    let vigia = setTimeout(passar, TRAVOU_MS);
    const anda = () => {
      clearTimeout(vigia);
      vigia = setTimeout(passar, TRAVOU_MS);
      if (v.duration - v.currentTime <= DISSOLVE_MS / 1000) passar();
    };
    v.addEventListener('timeupdate', anda);
    return () => {
      clearTimeout(vigia);
      v.removeEventListener('timeupdate', anda);
    };
  }, [atual, tamanho, naTela, primeiroPronto]);

  // o filme que saiu segue andando sob a dissolução; depois para e volta ao início
  useEffect(() => {
    const t = setTimeout(() => {
      filmes.current.forEach((v, i) => {
        if (v && i !== atual) {
          v.pause();
          v.currentTime = 0;
        }
      });
    }, DISSOLVE_MS + 100);
    return () => clearTimeout(t);
  }, [atual]);

  return (
    <section ref={caixa} className="relative h-screen w-full overflow-hidden bg-[#0a1929]">
      {/* Logo branco no hero - Mobile/Tablet */}
      <MobileHeroLogo />

      {/* As camadas: todas montadas, só a atual visível. A troca é na
          opacidade, então uma dissolve na outra em vez de pular. Os dois
          invólucros são da abertura: a cortina revela de cima para baixo, sobre
          o navy da seção, e o miolo encolhe dentro dela. */}
      <div className="absolute inset-0" data-abertura="cortina">
      <div className="absolute inset-0" data-miolo>
      {SLIDES.map((slide, i) => (
        <div
          key={slide.chave}
          aria-hidden={i !== atual}
          className={`absolute inset-0 transition-opacity duration-[1800ms] ease-in-out ${
            i === atual ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <FotoDoSlide slide={slide} alt={i === atual ? slide.alt : ''} prioridade={i === 0} />

          {/* Transparente até ter quadro: a imagem de baixo segura o lugar */}
          {tamanho && (i === 0 || primeiroPronto) && (
            <video
              ref={(el) => {
                filmes.current[i] = el;
              }}
              src={`${slide.filme}-${tamanho}.mp4`}
              onCanPlayThrough={i === 0 ? () => setPrimeiroPronto(true) : undefined}
              className="absolute inset-0 h-full w-full object-cover"
              muted
              playsInline
              preload="auto"
              aria-hidden="true"
              tabIndex={-1}
              disablePictureInPicture
            />
          )}
        </div>
      ))}
      </div>
      </div>

      {/* Overlay Gradient. A segunda camada só escurece a metade de baixo: o
          reflexo do sol na água passa bem atrás do texto, quase branco, e as
          fotos antigas traziam uma vinheta embutida que estes filmes não têm.
          O céu e a península ficam limpos. */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/45" />
      <div className="absolute inset-x-0 bottom-0 h-[65%] bg-gradient-to-t from-black/60 via-black/30 to-transparent" />

      {/* Decorative Graphics - FORA do container com padding */}
      <DecorativeGraphic
        position="left"
        className="absolute bottom-32 left-0 hidden lg:block z-10"
        animated
      />

      <DecorativeGraphic
        position="right"
        className="absolute bottom-32 right-0 hidden lg:block z-10"
        animated
      />

      {/* Content */}
      <div className="relative h-full flex flex-col items-center justify-end pb-24 px-4 text-center">

        {/* Main Content */}
        <div className="max-w-5xl mx-auto space-y-6 md:space-y-8 [text-shadow:0_1px_14px_rgba(0,0,0,0.5)]">
          {/* Main Title */}
          <h1
            data-abertura="subir"
            style={vez(4)}
            className="font-heading font-light text-4xl md:text-4xl lg:text-5xl text-white tracking-wider italic"
          >
            UMA PENÍNSULA<br className="md:hidden" /> IRREPLICÁVEL
          </h1>

          {/* Description */}
          <p
            data-abertura="subir"
            style={vez(5)}
            className="font-body font-light text-base md:text-lg lg:text-xl text-white/90 max-w-3xl mx-auto leading-relaxed px-4"
          >
            Cercado pela Serra da Mantiqueira, o Villa Stradale ocupa um dos pontos mais singulares da represa, onde a geografia desenhou, por acaso, o cenário perfeito.
          </p>

          {/* Subtitle */}
          <p
            data-abertura="subir"
            style={vez(6)}
            className="font-heading font-light text-xl md:text-2xl lg:text-3xl text-gold tracking-[0.3em] mt-8"
          >
            RARO POR NATUREZA
          </p>
        </div>

        {/* Scroll Indicator - Ajustado para ficar abaixo do conteúdo */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/40 rounded-full flex items-start justify-center p-2">
            <div className="w-1 h-2 bg-white/60 rounded-full" />
          </div>
        </div>
      </div>

      {/* Os controles do slide, nas laterais, na altura do meio */}
      <button
        type="button"
        onClick={() => ir(atual - 1)}
        aria-label="Imagem anterior"
        className="absolute left-3 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/45 text-white transition-all duration-300 ease-out hover:border-white hover:bg-white/15 md:left-6 md:h-12 md:w-12"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="19" y1="12" x2="5" y2="12" />
          <polyline points="12 19 5 12 12 5" />
        </svg>
      </button>

      <button
        type="button"
        onClick={() => ir(atual + 1)}
        aria-label="Próxima imagem"
        className="absolute right-3 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/45 text-white transition-all duration-300 ease-out hover:border-white hover:bg-white/15 md:right-6 md:h-12 md:w-12"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="5" y1="12" x2="19" y2="12" />
          <polyline points="12 5 19 12 12 19" />
        </svg>
      </button>

    </section>
  );
}
