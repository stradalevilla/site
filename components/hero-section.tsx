'use client';

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import { DecorativeGraphic } from './decorative-graphic';
import { MobileHeroLogo } from './mobile-hero-logo';

/**
 * Os dois estados da península, nesta ordem: primeiro o terreno como ele é
 * hoje, a foto aérea sem marcação de lote nenhuma, e depois o render do
 * empreendimento. Cada um tem as três variantes responsivas, recortadas com a
 * mesma linha de horizonte, para a troca ler como dissolução e não como corte.
 */
const SLIDES = [
  {
    chave: 'terreno',
    base: '/images/hero/hero-terreno',
    alt: 'A península do Villa Stradale vista do alto, o terreno como ele é hoje',
    rotulo: 'A península hoje',
  },
  {
    chave: 'render',
    base: '/images/hero/hero-peninsula',
    alt: 'Villa Stradale - Uma península irreplicável',
    rotulo: 'O empreendimento',
  },
];

/** quanto cada imagem fica parada antes de passar sozinha */
const PAUSA = 6000;

export function HeroSection() {
  const [atual, setAtual] = useState(0);

  const ir = useCallback((indice: number) => {
    setAtual((indice + SLIDES.length) % SLIDES.length);
  }, []);

  // passa sozinho; o relógio reinicia a cada troca, inclusive nas manuais
  useEffect(() => {
    const t = setTimeout(() => setAtual((i) => (i + 1) % SLIDES.length), PAUSA);
    return () => clearTimeout(t);
  }, [atual]);

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Logo branco no hero - Mobile/Tablet */}
      <MobileHeroLogo />

      {/* As camadas: todas montadas, só a atual visível. A troca é na
          opacidade, então uma dissolve na outra em vez de pular. */}
      {SLIDES.map((slide, i) => (
        <div
          key={slide.chave}
          aria-hidden={i !== atual}
          className={`absolute inset-0 transition-opacity duration-[1800ms] ease-in-out ${
            i === atual ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {/* Desktop */}
          <Image
            src={`${slide.base}-desk.jpg`}
            alt={i === atual ? slide.alt : ''}
            fill
            priority
            quality={90}
            className="object-cover hidden lg:block"
            sizes="100vw"
          />

          {/* Tablet */}
          <Image
            src={`${slide.base}-tablet.jpg`}
            alt=""
            fill
            priority
            quality={90}
            className="object-cover hidden md:block lg:hidden"
            sizes="100vw"
          />

          {/* Mobile */}
          <Image
            src={`${slide.base}-mobile.jpg`}
            alt=""
            fill
            priority
            quality={90}
            className="object-cover block md:hidden"
            sizes="100vw"
          />
        </div>
      ))}

      {/* Overlay Gradient — a lente de baixo, somada à vinheta assentada na
          própria imagem, segura o texto sobre o brilho do sol na água:
          medido 7:1 no título e 4,1:1 na assinatura dourada */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/45" />

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
        <div className="max-w-5xl mx-auto space-y-6 md:space-y-8">
          {/* Qual das duas penínsulas está na tela */}
          <p
            aria-live="polite"
            className="font-body text-[11px] uppercase tracking-[0.3em] text-white/70 md:text-xs"
          >
            {SLIDES[atual].rotulo}
          </p>

          {/* Main Title */}
          <h1 className="font-heading font-light text-4xl md:text-4xl lg:text-5xl text-white tracking-wider italic">
            UMA PENÍNSULA<br className="md:hidden" /> IRREPLICÁVEL
          </h1>

          {/* Description */}
          <p className="font-body font-light text-base md:text-lg lg:text-xl text-white/90 max-w-3xl mx-auto leading-relaxed px-4">
            Cercado pela Serra da Mantiqueira, o Villa Stradale ocupa um dos pontos mais singulares da represa, onde a geografia desenhou, por acaso, o cenário perfeito.
          </p>

          {/* Subtitle */}
          <p className="font-heading font-light text-xl md:text-2xl lg:text-3xl text-gold tracking-[0.3em] mt-8">
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
