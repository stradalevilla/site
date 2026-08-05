'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { contornosLotes, IMPLANTACAO_CANVAS, type LoteContorno } from '@/lib/implantacao';
import { pontosInteresse, type PontoInteresse } from '@/lib/pontos-interesse';

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
  pontos = pontosInteresse,
}: {
  contornos?: LoteContorno[];
  pontos?: PontoInteresse[];
}) {
  const router = useRouter();
  const secaoRef = useRef<HTMLElement>(null);
  const quadroRef = useRef<HTMLDivElement>(null);
  const [varrer, setVarrer] = useState(false);
  const [interagiu, setInteragiu] = useState(false);
  /** área sob o mouse e onde desenhar o card, em % do quadro */
  const [card, setCard] = useState<{ ponto: PontoInteresse; x: number; y: number } | null>(null);

  const varrendo = varrer && !interagiu;

  // o card segue o cursor dentro do quadro da imagem
  const moverCard = (ponto: PontoInteresse) => (e: React.PointerEvent) => {
    const r = quadroRef.current?.getBoundingClientRect();
    if (!r) return;
    setCard({ ponto, x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
  };

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

        <div className="relative" ref={quadroRef}>
          <Image
            src="/images/implantacao/masterplan-implantacao.jpg"
            alt="Implantação dos lotes no masterplan"
            width={1822}
            height={1015}
            className="h-auto w-full"
            sizes="(max-width: 1024px) 100vw, 1200px"
          />

          {/* Overlay interativo: cada lote é um link para a sua página */}
          <svg
            viewBox={`0 0 ${IMPLANTACAO_CANVAS.width} ${IMPLANTACAO_CANVAS.height}`}
            className="absolute inset-0 h-full w-full"
            role="group"
            aria-label="Lotes no masterplan"
          >
            {contornos.map(({ numero, pontos, centroide }, i) => {
              const destino = `/lotes/${pad(numero)}`;
              return (
                // <a> de verdade (permite abrir em nova aba), mas o clique é
                // interceptado para navegar sem recarregar a página.
                <a
                  key={numero}
                  href={destino}
                  aria-label={`Ver o lote ${pad(numero)}`}
                  className="group"
                  onClick={(e) => {
                    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
                    e.preventDefault();
                    router.push(destino);
                  }}
                >
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
                </a>
              );
            })}

            {/* Áreas de interesse: mesmo destaque dos lotes, mas em vez do
                número aparece um card com a foto do lugar. */}
            {pontos.map((p) => (
              <polygon
                key={p.id}
                points={p.pontos}
                role={p.destino ? 'link' : undefined}
                aria-label={p.nome}
                onPointerEnter={(e) => {
                  setInteragiu(true);
                  moverCard(p)(e);
                }}
                onPointerMove={moverCard(p)}
                onPointerLeave={() => setCard(null)}
                onClick={() => p.destino && router.push(p.destino)}
                className={`fill-transparent transition-[fill] duration-300 ease-out hover:fill-[rgba(6,82,138,0.82)] ${
                  p.destino ? 'cursor-pointer' : ''
                }`}
              />
            ))}
          </svg>

          {/* Um card por lugar, sempre no DOM e só escondido — assim a foto já
              vem carregada e o card aparece cheio no primeiro hover, em vez de
              piscar vazio enquanto a imagem chega. */}
          {pontos.map((p) => {
            const ativo = card?.ponto.id === p.id;
            return (
              <div
                key={p.id}
                aria-hidden
                className="pointer-events-none absolute z-10 w-56 overflow-hidden rounded-sm bg-navy shadow-xl transition-opacity duration-200 md:w-72"
                style={{
                  opacity: ativo ? 1 : 0,
                  left: `${card?.x ?? 50}%`,
                  top: `${card?.y ?? 50}%`,
                  // afasta do cursor, e vira de lado quando o mouse está na
                  // metade direita para o card não sair da imagem
                  transform: `translate(${(card?.x ?? 0) > 55 ? 'calc(-100% - 18px)' : '18px'}, -50%)`,
                }}
              >
                <Image
                  src={p.imagem}
                  alt=""
                  width={720}
                  height={405}
                  // sem isto o carregamento fica esperando o card ficar
                  // visível, e a foto só chegaria depois do primeiro hover
                  loading="eager"
                  className="h-auto w-full"
                  sizes="288px"
                />
                <div className="px-4 py-3">
                  <p className="font-heading text-sm uppercase tracking-[0.14em] text-gold md:text-base">
                    {p.nome}
                  </p>
                  {p.chamada && (
                    <p className="mt-1 font-body text-[11px] leading-snug text-white/80 md:text-xs">
                      {p.chamada}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
