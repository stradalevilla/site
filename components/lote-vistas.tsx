'use client';

import Image from 'next/image';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { LoteImage } from '@/lib/lotes';

const variants = {
  enter: (dir: number) => ({ x: dir > 0 ? 40 : -40, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -40 : 40, opacity: 0 }),
};

const Arrow = ({ flip = false }: { flip?: boolean }) => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={flip ? 'rotate-180' : ''}
  >
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

export function LoteVistas({ vistas, numero }: { vistas: LoteImage[]; numero: string }) {
  const [[index, dir], setState] = useState<[number, number]>([0, 0]);
  const total = vistas.length;

  const go = (d: number) => {
    setState(([i]) => [(i + d + total) % total, d]);
  };

  const goTo = (target: number) => {
    setState(([i]) => [target, target >= i ? 1 : -1]);
  };

  if (total === 0) return null;

  return (
    <div className="relative w-full overflow-hidden">
      <div className="relative aspect-[16/9] w-full bg-navy/5">
        <AnimatePresence initial={false} custom={dir} mode="popLayout">
          <motion.div
            key={index}
            custom={dir}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.45, ease: 'easeOut' }}
            className="absolute inset-0"
          >
            <Image
              src={vistas[index].src}
              alt={`Vista ${index + 1} do lote ${numero}`}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 900px"
              priority={index === 0}
            />
          </motion.div>
        </AnimatePresence>

        {total > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Imagem anterior"
              className="absolute left-4 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/70 bg-black/20 text-white backdrop-blur-sm transition-all duration-300 ease-out hover:bg-white hover:text-navy md:left-6"
            >
              <Arrow flip />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Próxima imagem"
              className="absolute right-4 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/70 bg-black/20 text-white backdrop-blur-sm transition-all duration-300 ease-out hover:bg-white hover:text-navy md:right-6"
            >
              <Arrow />
            </button>
          </>
        )}
      </div>

      {/* Bullets de navegação */}
      {total > 1 && (
        <div className="mt-5 flex items-center justify-center gap-2.5">
          {vistas.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Ir para imagem ${i + 1}`}
              aria-current={i === index}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === index ? 'w-6 bg-gold-dark' : 'w-2 bg-navy/25 hover:bg-navy/40'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
