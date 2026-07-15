'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { contornosLotes, IMPLANTACAO_CANVAS, type LoteContorno } from '@/lib/implantacao';

const pad = (n: number) => String(n).padStart(2, '0');

/** Intervalo entre um lote acender e o seguinte começar (ms) */
const INTERVALO_VARREDURA = 180;

/**
 * Seção Implantação: masterplan aéreo com os lotes interativos.
 * Ao entrar na tela, os lotes acendem em sequência (uma única vez);
 * depois, passar o mouse sobre um lote o destaca em azul com o número.
 */
export function ImplantacaoSection({
  contornos = contornosLotes,
}: {
  contornos?: LoteContorno[];
}) {
  const secaoRef = useRef<HTMLElement>(null);
  const [varrer, setVarrer] = useState(false);
  const [interagiu, setInteragiu] = useState(false);

  const varrendo = varrer && !interagiu;

  useEffect(() => {
    const el = secaoRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVarrer(true);
          observer.disconnect();
        }
      },
      { threshold: 0.35 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={secaoRef}
      aria-label="Implantação"
      className="relative bg-white py-16 md:py-24"
    >
      <div className="container mx-auto px-4 md:px-8">
        {/* Cabeçalho no padrão das seções internas */}
        <div className="mb-8 text-center md:mb-12">
          <p className="font-body text-sm uppercase tracking-wider text-gray-600 md:text-base">
            Masterplan
          </p>
          <h2 className="mt-2 font-heading text-2xl font-light uppercase italic text-navy md:text-4xl">
            Implantação
          </h2>
        </div>

        <div className="relative">
          <Image
            src="/images/implantacao/masterplan-implantacao.jpg"
            alt="Implantação dos lotes no masterplan"
            width={1822}
            height={1015}
            className="h-auto w-full"
            sizes="(max-width: 1024px) 100vw, 1200px"
          />

          {/* Overlay interativo: um polígono por lote */}
          <svg
            viewBox={`0 0 ${IMPLANTACAO_CANVAS.width} ${IMPLANTACAO_CANVAS.height}`}
            className="absolute inset-0 h-full w-full"
            role="list"
            aria-label="Lotes no masterplan"
          >
            {contornos.map(({ numero, pontos, centroide }, i) => (
              <g key={numero} role="listitem" aria-label={`Lote ${pad(numero)}`} className="group">
                {/* Polígono decorativo da varredura de entrada — separado do
                    interativo para a animação nunca interferir no hover.
                    Some assim que o usuário passa o mouse por um lote. */}
                {varrendo && (
                  <polygon
                    aria-hidden
                    points={pontos}
                    className="lote-acende pointer-events-none fill-transparent"
                    style={{ animationDelay: `${i * INTERVALO_VARREDURA}ms` }}
                  />
                )}
                <polygon
                  points={pontos}
                  onPointerEnter={() => setInteragiu(true)}
                  className="cursor-pointer fill-transparent transition-[fill] duration-300 ease-out group-hover:fill-[rgba(6,82,138,0.82)]"
                />
                <text
                  x={centroide[0]}
                  y={centroide[1]}
                  textAnchor="middle"
                  dominantBaseline="central"
                  className="pointer-events-none select-none fill-white font-body opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  style={{ fontSize: 22, letterSpacing: 1.5 }}
                >
                  {pad(numero)}
                </text>
              </g>
            ))}
          </svg>
        </div>
      </div>
    </section>
  );
}
