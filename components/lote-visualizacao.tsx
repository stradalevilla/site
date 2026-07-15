'use client';

import { useState } from 'react';
import Image from 'next/image';
import * as Dialog from '@radix-ui/react-dialog';
import { AnimatePresence, motion } from 'framer-motion';
import type { LoteImage } from '@/lib/lotes';

type Vista = 'metragem' | 'construtiva';

const opcoes: { id: Vista; label: string }[] = [
  { id: 'metragem', label: 'Metragem do terreno' },
  { id: 'construtiva', label: 'Área construtiva' },
];

/** Textos iguais em todos os lotes (fonte: _TEXTOS_LOTES_SITE.md) */
const NOTA =
  'A área construtiva indicada no masterplan é apenas uma sugestão de implantação, para ilustrar o potencial de construção do lote.';
const MODAL_TITULO =
  'O projeto pode ser implantado livremente, desde que respeitados os parâmetros urbanísticos do empreendimento.';

const emblemaStyle = {
  WebkitMaskImage: "url('/logos/Icone-VillaStradale escuro.svg')",
  maskImage: "url('/logos/Icone-VillaStradale escuro.svg')",
  WebkitMaskRepeat: 'no-repeat',
  maskRepeat: 'no-repeat',
  WebkitMaskPosition: 'left center',
  maskPosition: 'left center',
  WebkitMaskSize: 'contain',
  maskSize: 'contain',
} as const;

export function LoteVisualizacao({
  numero,
  area,
  detalhe,
  areaConstrutiva,
  parametros,
}: {
  numero: string;
  area?: string;
  detalhe: LoteImage;
  areaConstrutiva?: LoteImage;
  parametros?: string;
}) {
  const [vista, setVista] = useState<Vista>('metragem');
  const [modalAberto, setModalAberto] = useState(false);

  const camadas: { id: Vista; img: LoteImage; alt: string }[] = [
    { id: 'metragem', img: detalhe, alt: `Medidas do terreno do lote ${numero}` },
    ...(areaConstrutiva
      ? [
          {
            id: 'construtiva' as const,
            img: areaConstrutiva,
            alt: `Área construtiva permitida no lote ${numero}`,
          },
        ]
      : []),
  ];

  const mostrarNota = vista === 'construtiva' && !!parametros;

  return (
    <>
      {/* Rótulo da seção + alternador de visualização, na mesma linha */}
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-heading text-2xl uppercase tracking-wide text-navy md:text-4xl">
            Lote {numero}
          </p>
          <p className="font-body text-[11px] uppercase tracking-wide text-gray-500">
            {area ? `${area}M²` : 'Detalhe do lote'}
          </p>
        </div>

        {areaConstrutiva && (
          <div className="flex flex-wrap gap-x-8 gap-y-2" role="tablist">
            {opcoes.map(({ id, label }) => {
              const ativo = id === vista;
              return (
                <button
                  key={id}
                  type="button"
                  role="tab"
                  aria-selected={ativo}
                  onClick={() => setVista(id)}
                  className="group relative pb-2 font-body text-[11px] uppercase tracking-[0.2em] transition-colors duration-300"
                >
                  <span className="text-navy">{label}</span>
                  <span
                    aria-hidden
                    className={`absolute inset-x-0 bottom-0 h-px origin-left bg-gold-dark transition-transform duration-300 ease-out ${
                      ativo ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100 group-hover:opacity-40'
                    }`}
                  />
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* As duas imagens ficam empilhadas; só a opacidade muda, então o
          crossfade acontece entre elas, sem passar pelo fundo branco. */}
      <div className="relative">
        {camadas.map(({ id, img, alt }) => {
          const ativo = id === vista;
          return (
            <Image
              key={id}
              src={img.src}
              width={img.width}
              height={img.height}
              alt={ativo ? alt : ''}
              aria-hidden={!ativo}
              priority={id === 'metragem'}
              className={`h-auto w-full transition-opacity duration-500 ease-out ${
                ativo ? 'relative opacity-100' : 'absolute inset-0 opacity-0'
              }`}
              sizes="(max-width: 1024px) 100vw, 900px"
            />
          );
        })}

        {/* Nota + botão sobre a imagem, no canto inferior esquerdo,
            apenas na visualização de área construtiva. */}
        <div
          className={`pointer-events-none absolute inset-x-0 bottom-0 transition-opacity duration-500 ${
            mostrarNota ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="bg-gradient-to-t from-black/70 via-black/30 to-transparent px-4 pb-5 pt-24 md:px-8 md:pb-8 md:pt-32">
            <div className={`w-3/5 md:w-1/5 ${mostrarNota ? 'pointer-events-auto' : ''}`}>
              {/* Título (a frase) */}
              <p className="font-body text-xs font-medium leading-snug text-white md:text-sm">
                {NOTA}
              </p>

              {/* Botão discreto */}
              <button
                type="button"
                onClick={() => setModalAberto(true)}
                tabIndex={mostrarNota ? 0 : -1}
                aria-hidden={!mostrarNota}
                className="group mt-4 inline-flex items-center gap-1.5 font-body text-[10px] uppercase tracking-[0.15em] text-white/70 transition-colors duration-300 hover:text-white"
              >
                <span className="relative pb-0.5">
                  ver parâmetros
                  <span className="absolute inset-x-0 bottom-0 h-px bg-white/30 transition-colors duration-300 group-hover:bg-gold" />
                </span>
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="transition-transform duration-300 ease-out group-hover:translate-x-0.5"
                >
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal com os parâmetros urbanísticos */}
      <Dialog.Root open={modalAberto} onOpenChange={setModalAberto}>
        <AnimatePresence>
          {modalAberto && (
            <Dialog.Portal forceMount>
              <Dialog.Overlay asChild forceMount>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="fixed inset-0 z-[100] bg-navy/85"
                />
              </Dialog.Overlay>

              {/* Container flex centraliza; o framer-motion cuida só do
                  fade/slide (o transform dele sobrescreveria um translate
                  de centralização feito via classe). */}
              <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                <Dialog.Content asChild forceMount>
                  <motion.div
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 14 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                    className="relative w-full max-w-lg bg-white p-8 shadow-2xl md:p-10"
                  >
                    <div
                      aria-hidden
                      className="pointer-events-none absolute inset-0 border-2 border-[#D07748]/50"
                    />

                    <Dialog.Close
                      aria-label="Fechar"
                      className="absolute right-4 top-4 text-navy/50 transition-colors duration-200 hover:text-navy"
                    >
                      <svg
                        width="22"
                        height="22"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      >
                        <line x1="6" y1="6" x2="18" y2="18" />
                        <line x1="18" y1="6" x2="6" y2="18" />
                      </svg>
                    </Dialog.Close>

                    <span
                      aria-hidden
                      className="mb-3 block h-8 w-20 bg-navy md:h-10 md:w-24"
                      style={emblemaStyle}
                    />
                    <p className="font-body text-[11px] uppercase tracking-[0.22em] text-gold-dark">
                      Lote {numero}
                    </p>
                    <Dialog.Title className="mt-3 font-heading text-lg leading-snug text-navy md:text-2xl">
                      {MODAL_TITULO}
                    </Dialog.Title>
                    <Dialog.Description className="mt-5 font-body text-sm leading-relaxed text-gray-600">
                      {parametros}
                    </Dialog.Description>
                  </motion.div>
                </Dialog.Content>
              </div>
            </Dialog.Portal>
          )}
        </AnimatePresence>
      </Dialog.Root>
    </>
  );
}
