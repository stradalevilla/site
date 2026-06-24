'use client';

import { useCallback, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

const TOTAL_LOTES = 54;
const ITEM_H = 60; // altura de cada número na roda vertical (px)
const WHEEL_H = ITEM_H * 5; // mostra 5 itens
const SPACER = (WHEEL_H - ITEM_H) / 2; // centraliza o primeiro/último

const pad = (n: number) => String(n).padStart(2, '0');
const lotes = Array.from({ length: TOTAL_LOTES }, (_, i) => i + 1);

export function LoteSelector() {
  const router = useRouter();
  const [selected, setSelected] = useState<number | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const isTapScrolling = useRef(false);

  const scrollToIndex = useCallback((index: number, smooth = true) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ top: index * ITEM_H, behavior: smooth ? 'smooth' : 'auto' });
  }, []);

  const handleScroll = useCallback(() => {
    if (isTapScrolling.current) return;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      const el = scrollRef.current;
      if (!el) return;
      const index = Math.round(el.scrollTop / ITEM_H);
      const clamped = Math.min(TOTAL_LOTES - 1, Math.max(0, index));
      setSelected(clamped + 1);
    });
  }, []);

  const handlePick = (n: number) => {
    setSelected(n);
    isTapScrolling.current = true;
    scrollToIndex(n - 1);
    window.setTimeout(() => {
      isTapScrolling.current = false;
    }, 450);
  };

  const handleConfirm = () => {
    if (selected === null) return;
    router.push(`/lotes/${pad(selected)}`);
  };

  // Estilo de cada número da roda conforme a distância do selecionado
  const wheelItemClass = (n: number) => {
    if (selected === null) return 'text-2xl text-navy/25';
    const d = Math.abs(n - selected);
    if (d === 0) return 'text-4xl text-gold-dark';
    if (d === 1) return 'text-2xl text-navy/45';
    if (d === 2) return 'text-xl text-navy/25';
    return 'text-lg text-navy/15';
  };

  return (
    <div className="flex flex-col items-center">
      {/* ---------- Roda vertical (mobile / tablet) ---------- */}
      <div className="relative mx-auto w-full max-w-[240px] lg:hidden">
        {/* Moldura central destacando o item selecionado */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 rounded-xl border-2 border-gold-dark"
          style={{ width: 110, height: ITEM_H }}
        />
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="scrollbar-hide snap-y snap-mandatory overflow-y-auto overscroll-y-contain"
          style={{ height: WHEEL_H }}
        >
          {/* Espaçador inicial */}
          <div style={{ height: SPACER }} aria-hidden />
          {lotes.map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => handlePick(n)}
              aria-label={`Lote ${pad(n)}`}
              className="flex w-full snap-center items-center justify-center"
              style={{ height: ITEM_H }}
            >
              <span
                className={`font-body tracking-wide transition-all duration-200 ${wheelItemClass(n)}`}
              >
                {pad(n)}
              </span>
            </button>
          ))}
          {/* Espaçador final */}
          <div style={{ height: SPACER }} aria-hidden />
        </div>
      </div>

      {/* ---------- Grade (desktop) ---------- */}
      <div className="hidden w-full max-w-4xl lg:block">
        <div className="grid grid-cols-9 gap-3">
          {lotes.map((n) => {
            const isActive = n === selected;
            return (
              <button
                key={n}
                type="button"
                onClick={() => setSelected(n)}
                aria-label={`Lote ${pad(n)}`}
                aria-pressed={isActive}
                className={`flex aspect-square items-center justify-center rounded-xl border p-4 font-body text-xl tracking-wide transition-all duration-200 ${
                  isActive
                    ? 'border-transparent bg-gold-dark text-white'
                    : 'border-navy/20 text-navy hover:border-gold-dark/60 hover:text-gold-dark'
                }`}
              >
                {pad(n)}
              </button>
            );
          })}
        </div>
      </div>

      {/* ---------- Botão OK ---------- */}
      <button
        type="button"
        onClick={handleConfirm}
        disabled={selected === null}
        className="group mt-12 flex h-12 w-40 items-center justify-center gap-3 rounded-sm bg-gold-dark text-white transition-all duration-300 ease-out hover:bg-navy disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-gold-dark"
      >
        <span className="font-body text-sm uppercase tracking-widest">ok</span>
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="transition-transform duration-300 ease-out delay-150 group-hover:translate-x-1"
        >
          <line x1="5" y1="12" x2="19" y2="12" />
          <polyline points="12 5 19 12 12 19" />
        </svg>
      </button>
    </div>
  );
}
