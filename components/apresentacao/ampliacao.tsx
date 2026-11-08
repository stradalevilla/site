'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';

const MAXIMO = 5;

/**
 * A imagem em tela cheia, para ver de perto: pinça ou rodinha aproxima, arrastar passeia,
 * dois toques alternam entre o todo e o detalhe. Esc ou o X fecham.
 */
export function Ampliacao({ src, alt, fechar }: { src: string; alt: string; fechar: () => void }) {
  const [vista, setVista] = useState({ escala: 1, x: 0, y: 0 });
  const toques = useRef(new Map<number, { x: number; y: number }>());
  const pinca = useRef<{ distancia: number; escala: number } | null>(null);
  const ultimoToque = useRef(0);

  useEffect(() => {
    const tecla = (e: KeyboardEvent) => {
      if (e.key === 'Escape') fechar();
      if (e.key === '+' || e.key === '=') setVista((v) => ({ ...v, escala: Math.min(MAXIMO, v.escala * 1.4) }));
      if (e.key === '-') setVista((v) => (v.escala / 1.4 <= 1 ? { escala: 1, x: 0, y: 0 } : { ...v, escala: v.escala / 1.4 }));
      e.stopPropagation();
    };
    window.addEventListener('keydown', tecla, true);
    return () => window.removeEventListener('keydown', tecla, true);
  }, [fechar]);

  const limitar = (v: { escala: number; x: number; y: number }) => {
    if (v.escala <= 1) return { escala: 1, x: 0, y: 0 };
    const folgaX = ((v.escala - 1) * window.innerWidth) / 2;
    const folgaY = ((v.escala - 1) * window.innerHeight) / 2;
    return { escala: v.escala, x: Math.max(-folgaX, Math.min(folgaX, v.x)), y: Math.max(-folgaY, Math.min(folgaY, v.y)) };
  };

  const aoApertar = (e: React.PointerEvent) => {
    e.stopPropagation();
    (e.target as Element).setPointerCapture?.(e.pointerId);
    toques.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (toques.current.size === 2) {
      const [a, b] = [...toques.current.values()];
      pinca.current = { distancia: Math.hypot(a.x - b.x, a.y - b.y), escala: vista.escala };
    }
    const agora = Date.now();
    if (toques.current.size === 1 && agora - ultimoToque.current < 300) {
      setVista((v) => (v.escala > 1 ? { escala: 1, x: 0, y: 0 } : limitar({ escala: 2.5, x: (window.innerWidth / 2 - e.clientX) * 1.5, y: (window.innerHeight / 2 - e.clientY) * 1.5 })));
    }
    ultimoToque.current = agora;
  };

  const aoMover = (e: React.PointerEvent) => {
    const antes = toques.current.get(e.pointerId);
    if (!antes) return;
    toques.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (toques.current.size === 2 && pinca.current) {
      const [a, b] = [...toques.current.values()];
      const escala = Math.max(1, Math.min(MAXIMO, (pinca.current.escala * Math.hypot(a.x - b.x, a.y - b.y)) / pinca.current.distancia));
      setVista((v) => limitar({ ...v, escala }));
    } else if (toques.current.size === 1) {
      setVista((v) => limitar({ ...v, x: v.x + e.clientX - antes.x, y: v.y + e.clientY - antes.y }));
    }
  };

  const aoSoltar = (e: React.PointerEvent) => {
    e.stopPropagation();
    toques.current.delete(e.pointerId);
    if (toques.current.size < 2) pinca.current = null;
  };

  return (
    <div
      className="absolute inset-0 z-40 touch-none select-none overflow-hidden bg-black"
      role="dialog"
      aria-modal="true"
      aria-label="Imagem ampliada"
      onPointerDown={aoApertar}
      onPointerMove={aoMover}
      onPointerUp={aoSoltar}
      onPointerCancel={aoSoltar}
      onWheel={(e) => {
        const fator = e.deltaY < 0 ? 1.15 : 1 / 1.15;
        setVista((v) => limitar({ ...v, escala: Math.max(1, Math.min(MAXIMO, v.escala * fator)) }));
      }}
    >
      <div className="absolute inset-0 transition-transform duration-75 ease-out" style={{ transform: `translate(${vista.x}px, ${vista.y}px) scale(${vista.escala})` }}>
        <Image src={src} alt={alt} fill sizes="100vw" quality={90} priority draggable={false} className="object-contain" />
      </div>
      <button
        type="button"
        aria-label="Fechar a imagem ampliada"
        onPointerDown={(e) => e.stopPropagation()}
        onPointerUp={(e) => e.stopPropagation()}
        onClick={fechar}
        className="absolute right-3 top-[max(0.75rem,env(safe-area-inset-top))] flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm md:right-6"
        autoFocus
      >
        <X size={20} aria-hidden />
      </button>
      {vista.escala === 1 && <p className="pointer-events-none absolute inset-x-0 bottom-[max(1.25rem,env(safe-area-inset-bottom))] text-center text-xs text-white/60">Pinça, rodinha ou dois toques para aproximar</p>}
    </div>
  );
}
