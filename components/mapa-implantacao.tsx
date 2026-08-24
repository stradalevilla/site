'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { contornosLotes, IMPLANTACAO_CANVAS, type LoteContorno } from '@/lib/implantacao';
import { pontosInteresse, type PontoInteresse } from '@/lib/pontos-interesse';

const pad = (n: number) => String(n).padStart(2, '0');

/** Intervalo entre um lote acender e o seguinte começar (ms) */
const INTERVALO_VARREDURA = 260;

/**
 * O mapa da implantação com os lotes interativos — só a imagem e o overlay,
 * sem seção nem cabeçalho, para poder ser usado dentro de outros blocos
 * (a seção Implantação da home e a moldura do Masterplan).
 *
 * Ao entrar na tela, os lotes acendem em sequência (uma única vez); depois,
 * passar o mouse sobre um lote o destaca em azul com o número.
 */
export function MapaImplantacao({
  contornos = contornosLotes,
  pontos = pontosInteresse,
  prioridade = false,
}: {
  contornos?: LoteContorno[];
  pontos?: PontoInteresse[];
  /** carrega a imagem com prioridade (quando o mapa abre a página) */
  prioridade?: boolean;
}) {
  const router = useRouter();
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
    setCard({
      ponto,
      x: ((e.clientX - r.left) / r.width) * 100,
      y: ((e.clientY - r.top) / r.height) * 100,
    });
  };

  useEffect(() => {
    const el = quadroRef.current;
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
    <div className="relative" ref={quadroRef}>
      <Image
        src="/images/implantacao/masterplan-implantacao.jpg"
        alt="Implantação dos lotes no masterplan"
        width={IMPLANTACAO_CANVAS.width}
        height={IMPLANTACAO_CANVAS.height}
        priority={prioridade}
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
        {contornos.map(({ numero, pontos: contorno, centroide }, i) => {
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
                  points={contorno}
                  className="lote-acende pointer-events-none fill-transparent"
                  style={{ animationDelay: `${i * INTERVALO_VARREDURA}ms` }}
                />
              )}
              <polygon
                points={contorno}
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

        {/* Áreas de interesse: mesmo destaque dos lotes, mas em vez do número
            aparece um card com a foto do lugar. */}
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

      {/* Um card por lugar, sempre no DOM e só escondido — assim a foto já vem
          carregada e o card aparece cheio no primeiro hover, em vez de piscar
          vazio enquanto a imagem chega. */}
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
              // afasta do cursor, e vira de lado quando o mouse está na metade
              // direita para o card não sair da imagem
              transform: `translate(${(card?.x ?? 0) > 55 ? 'calc(-100% - 18px)' : '18px'}, -50%)`,
            }}
          >
            <Image
              src={p.imagem}
              alt=""
              width={720}
              height={405}
              // sem isto o carregamento fica esperando o card ficar visível, e a
              // foto só chegaria depois do primeiro hover
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
  );
}
