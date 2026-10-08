'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';

export interface ItemGaleria {
  src: string;
  alt: string;
  legenda?: string;
  /** Só na variante 'card': o parágrafo embaixo do título */
  texto?: string;
}

/** A seta da linguagem do site, na pílula vazada */
function Seta({ sentido }: { sentido: 'anterior' | 'proximo' }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={`transition-transform duration-300 ease-out ${
        sentido === 'proximo'
          ? 'group-hover:translate-x-1'
          : '-scale-x-100 group-hover:-translate-x-1'
      }`}
    >
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

/**
 * Grade de imagens que abre em tela cheia ao clique, com navegação por setas,
 * teclado (← → Esc) e arrasto lateral no celular.
 *
 * `colunas` controla a grade fechada; o resto segue a moldura fina terracota
 * do restante do site.
 */
export function GaleriaLightbox({
  itens,
  colunas = 3,
  proporcao = 'aspect-[4/3]',
  variante = 'legenda',
  gatilho,
  inicio,
  rotuloDoGatilho,
}: {
  itens: ItemGaleria[];
  colunas?: 2 | 3;
  proporcao?: string;
  /** 'legenda' = rótulo miúdo sob a foto; 'card' = título e parágrafo */
  variante?: 'legenda' | 'card';
  /**
   * Quando vem preenchido, a grade não é desenhada: este conteúdo vira o botão
   * que abre a galeria na primeira imagem. É como a home usa — um link "abrir
   * galeria" no meio do texto, sem repetir as fotos que já estão na página.
   */
  gatilho?: React.ReactNode;
  /**
   * Por qual imagem a galeria abre, pelo src. Serve para uma foto na página
   * abrir a galeria nela mesma, e não sempre na primeira. Procura pelo src e
   * não por índice, então reordenar a lista não quebra nada.
   */
  inicio?: string;
  /** o nome acessível do gatilho, quando ele não é o botão de texto */
  rotuloDoGatilho?: string;
}) {
  const [aberto, setAberto] = useState<number | null>(null);
  const gatilhos = useRef<(HTMLButtonElement | null)[]>([]);
  const painel = useRef<HTMLDivElement>(null);
  const toqueX = useRef<number | null>(null);

  /** no modo gatilho existe um botão só, e é para ele que o foco volta */
  const modoGatilho = !!gatilho;

  /** a imagem por onde a galeria abre neste gatilho */
  const indiceInicial = inicio
    ? Math.max(
        0,
        itens.findIndex((it) => it.src === inicio)
      )
    : 0;

  const fechar = useCallback(() => {
    const indice = aberto;
    setAberto(null);
    // devolve o foco ao card que abriu (setTimeout em vez de rAF: rAF congela
    // em aba de segundo plano e o foco ficaria perdido)
    if (indice !== null) {
      const alvo = modoGatilho ? 0 : indice;
      setTimeout(() => gatilhos.current[alvo]?.focus(), 0);
    }
  }, [aberto, modoGatilho]);

  const irPara = useCallback(
    (passo: number) => {
      setAberto((atual) => {
        if (atual === null) return atual;
        return (atual + passo + itens.length) % itens.length;
      });
    },
    [itens.length]
  );

  // Teclado: Esc fecha, setas navegam, Tab fica preso no painel
  useEffect(() => {
    if (aberto === null) return;

    const noTeclado = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        fechar();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        irPara(1);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        irPara(-1);
      } else if (e.key === 'Tab' && painel.current) {
        const focaveis = painel.current.querySelectorAll<HTMLElement>('button');
        if (!focaveis.length) return;
        const primeiro = focaveis[0];
        const ultimo = focaveis[focaveis.length - 1];
        if (e.shiftKey && document.activeElement === primeiro) {
          e.preventDefault();
          ultimo.focus();
        } else if (!e.shiftKey && document.activeElement === ultimo) {
          e.preventDefault();
          primeiro.focus();
        }
      }
    };

    document.addEventListener('keydown', noTeclado);
    return () => document.removeEventListener('keydown', noTeclado);
  }, [aberto, fechar, irPara]);

  // Trava a rolagem do fundo enquanto está aberto
  useEffect(() => {
    if (aberto === null) return;
    const anterior = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = anterior;
    };
  }, [aberto]);

  // Ao abrir, leva o foco para dentro do painel
  useEffect(() => {
    if (aberto === null) return;
    const alvo = painel.current?.querySelector<HTMLElement>('button');
    alvo?.focus();
  }, [aberto]);

  const item = aberto !== null ? itens[aberto] : null;

  const grade = (
      <ul
        className={`grid grid-cols-1 gap-4 md:gap-6 ${
          colunas === 3 ? 'md:grid-cols-2 lg:grid-cols-3' : 'md:grid-cols-2'
        }`}
      >
        {itens.map((it, i) => (
          <li key={it.src}>
            <button
              type="button"
              ref={(el) => {
                gatilhos.current[i] = el;
              }}
              onClick={() => setAberto(i)}
              aria-label={`Ampliar: ${it.legenda ?? it.alt}`}
              className="group block w-full cursor-zoom-in text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D07748] focus-visible:ring-offset-2"
            >
              <div
                className={`relative ${proporcao} overflow-hidden border border-[#D07748]/40`}
              >
                <Image
                  src={it.src}
                  alt={it.alt}
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                  sizes={
                    colunas === 3
                      ? '(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw'
                      : '(max-width: 768px) 100vw, 50vw'
                  }
                />
                {/* Sinal de que amplia, discreto, só no hover */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute bottom-3 right-3 flex h-8 w-8 items-center justify-center rounded-full border border-white/70 bg-navy/40 text-white opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  >
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                </span>
              </div>
              {it.legenda && variante === 'legenda' && (
                <span className="mt-3 block font-body text-[11px] uppercase tracking-[0.18em] text-navy/60">
                  {it.legenda}
                </span>
              )}

              {variante === 'card' && (
                <>
                  {it.legenda && (
                    <span className="mt-5 block font-heading text-xl font-light uppercase italic text-navy md:text-2xl">
                      {it.legenda}
                    </span>
                  )}
                  {it.texto && (
                    <span className="mt-3 block font-body text-sm leading-relaxed text-gray-700">
                      {it.texto}
                    </span>
                  )}
                </>
              )}
            </button>
          </li>
        ))}
      </ul>
  );

  return (
    <>
      {gatilho ? (
        <button
          type="button"
          ref={(el) => {
            gatilhos.current[0] = el;
          }}
          onClick={() => setAberto(indiceInicial)}
          aria-label={
            rotuloDoGatilho ?? `Abrir a galeria de imagens (${itens.length} fotos)`
          }
          className="block w-full text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D07748] focus-visible:ring-offset-2"
        >
          {gatilho}
        </button>
      ) : (
        grade
      )}

      <AnimatePresence>
        {item && aberto !== null && (
          <motion.div
            key="lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, pointerEvents: 'auto' }}
            /* pointerEvents na saída: se a animação não puder concluir (aba em
               segundo plano congela o requestAnimationFrame), o painel invisível
               não fica bloqueando cliques da página */
            exit={{ opacity: 0, pointerEvents: 'none' }}
            transition={{ duration: 0.3 }}
            role="dialog"
            aria-modal="true"
            aria-label={`Imagem ${aberto + 1} de ${itens.length}: ${item.legenda ?? item.alt}`}
            ref={painel}
            onClick={fechar}
            onTouchStart={(e) => {
              toqueX.current = e.touches[0].clientX;
            }}
            onTouchEnd={(e) => {
              if (toqueX.current === null) return;
              const dx = e.changedTouches[0].clientX - toqueX.current;
              if (Math.abs(dx) > 50) irPara(dx < 0 ? 1 : -1);
              toqueX.current = null;
            }}
            className="fixed inset-0 z-[100] flex flex-col bg-[#050c14]/75 backdrop-blur-2xl"
          >
            {/* Topo: contador e fechar */}
            <div className="flex shrink-0 items-center justify-between px-5 pt-5 md:px-10 md:pt-8">
              <span className="font-heading text-base italic tracking-[0.2em] text-gold md:text-lg">
                {String(aberto + 1).padStart(2, '0')} / {String(itens.length).padStart(2, '0')}
              </span>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  fechar();
                }}
                aria-label="Fechar"
                className="group flex h-11 w-11 items-center justify-center rounded-full border border-white/60 bg-white/5 text-white transition-all duration-300 hover:border-white hover:bg-white hover:text-navy focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  aria-hidden
                >
                  <line x1="6" y1="6" x2="18" y2="18" />
                  <line x1="18" y1="6" x2="6" y2="18" />
                </svg>
              </button>
            </div>

            {/* A imagem */}
            <div className="flex min-h-0 flex-1 items-center justify-center px-16 py-4 md:px-24 md:py-6">
              <motion.div
                key={item.src}
                initial={{ opacity: 0, scale: 0.99 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                onClick={(e) => e.stopPropagation()}
                className="relative h-full w-full max-w-[1600px]"
              >
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  priority
                  quality={90}
                  sizes="100vw"
                  className="object-contain"
                />
              </motion.div>
            </div>

            {/* Base: a legenda e os tracinhos */}
            <div
              onClick={(e) => e.stopPropagation()}
              className="flex shrink-0 flex-col items-center gap-4 px-5 pb-6 md:gap-5 md:px-10 md:pb-7"
            >
              <p className="max-w-xl text-center font-body text-xs uppercase tracking-[0.22em] text-white/85 md:text-sm">
                {item.legenda ?? item.alt}
              </p>

              {/* Quantas são e em qual estamos; cada tracinho leva direto */}
              <div className="flex flex-wrap items-center justify-center gap-1.5 md:gap-2">
                {itens.map((it, i) => (
                  <button
                    key={it.src}
                    type="button"
                    onClick={() => setAberto(i)}
                    aria-label={`Imagem ${i + 1}: ${it.legenda ?? it.alt}`}
                    aria-current={i === aberto}
                    className="group flex h-6 items-center justify-center px-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                  >
                    <span
                      className={`block h-[2px] rounded-full transition-all duration-300 ${
                        i === aberto
                          ? 'w-7 bg-gold md:w-9'
                          : 'w-3.5 bg-white/40 group-hover:bg-white/80 md:w-5'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* As setas nas laterais, na altura do meio */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                irPara(-1);
              }}
              aria-label="Imagem anterior"
              className="group absolute left-3 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/60 bg-white/10 text-white backdrop-blur-sm transition-all duration-300 ease-out hover:border-white hover:bg-white hover:text-navy focus:outline-none focus-visible:ring-2 focus-visible:ring-gold md:left-6 md:h-14 md:w-14"
            >
              <Seta sentido="anterior" />
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                irPara(1);
              }}
              aria-label="Próxima imagem"
              className="group absolute right-3 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/60 bg-white/10 text-white backdrop-blur-sm transition-all duration-300 ease-out hover:border-white hover:bg-white hover:text-navy focus:outline-none focus-visible:ring-2 focus-visible:ring-gold md:right-6 md:h-14 md:w-14"
            >
              <Seta sentido="proximo" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
