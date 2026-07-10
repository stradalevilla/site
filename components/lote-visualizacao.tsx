'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { LoteImage } from '@/lib/lotes';

type Vista = 'metragem' | 'construtiva';

const opcoes: { id: Vista; label: string }[] = [
  { id: 'metragem', label: 'Metragem do terreno' },
  { id: 'construtiva', label: 'Área construtiva' },
];

export function LoteVisualizacao({
  numero,
  area,
  detalhe,
  areaConstrutiva,
}: {
  numero: string;
  area?: string;
  detalhe: LoteImage;
  areaConstrutiva?: LoteImage;
}) {
  const [vista, setVista] = useState<Vista>('metragem');

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
      </div>
    </>
  );
}
