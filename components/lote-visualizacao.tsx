'use client';

import { useState } from 'react';
import Image from 'next/image';
import { parseParametros, type LoteImage } from '@/lib/lotes';

type Vista = 'metragem' | 'construtiva';

const opcoes: { id: Vista; label: string }[] = [
  { id: 'metragem', label: 'Metragem do terreno' },
  { id: 'construtiva', label: 'Área construtiva' },
];

/**
 * Rodapé do box: condensa em uma frase a nota e o título do material
 * original (_TEXTOS_LOTES_SITE.md), igual em todos os lotes.
 */
const NOTA =
  'A área construtiva indicada é apenas uma sugestão de implantação: o projeto pode ser implantado livremente, desde que respeitados os parâmetros urbanísticos do empreendimento.';

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

  const mostrarBox = vista === 'construtiva' && !!parametros;

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

      <div className="relative">
        {/* Foto sempre em largura total; o box azul se sobrepõe a ela */}
        <div className="relative w-full">
          {/* As duas imagens ficam empilhadas; só a opacidade muda, então o
              crossfade acontece entre elas, sem passar pelo fundo branco. */}
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

        {/* Box com os parâmetros urbanísticos — sobreposto à foto, encostado
            à direita e com a altura dela (desktop); abaixo da foto no mobile */}
        {parametros && (
          <aside
            aria-hidden={!mostrarBox}
            className={`z-10 mt-6 flex-col bg-navy p-6 transition-opacity duration-500 md:absolute md:inset-y-0 md:right-0 md:mt-0 md:w-[25.5%] md:p-7 ${
              mostrarBox ? 'flex opacity-100' : 'hidden opacity-0'
            }`}
          >
            <span
              aria-hidden
              className="block h-7 w-16 shrink-0 bg-gold"
              style={emblemaStyle}
            />
            {/* O número do lote é o título do box */}
            <p className="mt-2 shrink-0 font-heading text-lg uppercase tracking-[0.14em] text-gold md:text-xl">
              Lote {numero}
            </p>

            <div className="mt-3 min-h-0 flex-1 overflow-y-auto pr-1">
              <ul className="space-y-1">
                {parseParametros(parametros).map(({ label, valor }) => (
                  <li
                    key={`${label}-${valor}`}
                    className="flex gap-2 font-body text-[11px] leading-snug text-white/75"
                  >
                    <span aria-hidden className="text-gold">
                      •
                    </span>
                    <span>
                      {label && <span className="font-semibold text-white">{label}: </span>}
                      {valor}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <p className="mt-3 shrink-0 border-t border-white/15 pt-2.5 font-body text-[9px] leading-snug text-white/50">
              {NOTA}
            </p>
          </aside>
        )}
      </div>
    </>
  );
}
