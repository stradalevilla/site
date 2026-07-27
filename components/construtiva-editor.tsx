'use client';

import { useRef, useState } from 'react';
import { COR_VOLUME_PADRAO } from '@/components/lote-construtiva';
import type { JanelaClose } from '@/components/lote-close';
import type { Ponto } from '@/lib/poligono';

/** Qual forma está selecionada: o recuo ou um volume (pelo índice) */
export type FormaSel = { tipo: 'recuo' } | { tipo: 'volume'; idx: number } | null;

export interface DesenhoConstrutiva {
  recuo: Ponto[] | null;
  volumes: { pontos: Ponto[]; cor: string }[];
}

/**
 * Canvas de edição da área construtiva: divisa do lote (fixa, só referência),
 * limite dos recuos (tracejado) e volumes sugeridos — todos editáveis por
 * arrasto de vértices, com inserir/remover ponto.
 */
export function ConstrutivaEditor({
  numero,
  pontosLote,
  janela,
  desenho,
  sel,
  onSel,
  onChange,
  onInicioArrasto,
}: {
  numero: number;
  pontosLote: Ponto[];
  janela: JanelaClose;
  desenho: DesenhoConstrutiva;
  sel: FormaSel;
  onSel: (s: FormaSel) => void;
  onChange: (d: DesenhoConstrutiva) => void;
  onInicioArrasto?: () => void;
}) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [arrasto, setArrasto] = useState<number | null>(null);
  const u = janela.w / 400;

  const paraCanvas = (e: React.PointerEvent): Ponto => {
    const svg = svgRef.current!;
    const ctm = svg.getScreenCTM()!;
    const p = new DOMPoint(e.clientX, e.clientY).matrixTransform(ctm.inverse());
    return [Math.round(p.x), Math.round(p.y)];
  };

  /** pontos da forma selecionada */
  const ptsSel = (): Ponto[] | null => {
    if (!sel) return null;
    return sel.tipo === 'recuo' ? desenho.recuo : desenho.volumes[sel.idx]?.pontos ?? null;
  };

  const setPtsSel = (pts: Ponto[]) => {
    if (!sel) return;
    if (sel.tipo === 'recuo') onChange({ ...desenho, recuo: pts });
    else
      onChange({
        ...desenho,
        volumes: desenho.volumes.map((v, i) => (i === sel.idx ? { ...v, pontos: pts } : v)),
      });
  };

  const mover = (e: React.PointerEvent) => {
    if (arrasto === null) return;
    const pts = ptsSel();
    if (!pts) return;
    const copia = pts.map((p) => [...p] as Ponto);
    copia[arrasto] = paraCanvas(e);
    setPtsSel(copia);
  };

  /** clique na forma selecionada insere um vértice na aresta mais próxima */
  const inserir = (e: React.PointerEvent) => {
    if (arrasto !== null) return;
    const pts = ptsSel();
    if (!pts) return;
    onInicioArrasto?.();
    const [x, y] = paraCanvas(e);
    let melhor = 0;
    let melhorD = Infinity;
    for (let i = 0; i < pts.length; i++) {
      const a = pts[i];
      const b = pts[(i + 1) % pts.length];
      const t = Math.max(
        0,
        Math.min(
          1,
          ((x - a[0]) * (b[0] - a[0]) + (y - a[1]) * (b[1] - a[1])) /
            ((b[0] - a[0]) ** 2 + (b[1] - a[1]) ** 2 || 1)
        )
      );
      const d = Math.hypot(x - (a[0] + t * (b[0] - a[0])), y - (a[1] + t * (b[1] - a[1])));
      if (d < melhorD) {
        melhorD = d;
        melhor = i;
      }
    }
    const copia = pts.map((p) => [...p] as Ponto);
    copia.splice(melhor + 1, 0, [x, y]);
    setPtsSel(copia);
  };

  const remover = (idx: number) => {
    const pts = ptsSel();
    if (!pts || pts.length <= 3) return;
    onInicioArrasto?.();
    const copia = pts.map((p) => [...p] as Ponto);
    copia.splice(idx, 1);
    setPtsSel(copia);
  };

  const str = (pts: Ponto[]) => pts.map((p) => p.join(',')).join(' ');
  const selecionada = ptsSel();

  return (
    <div className="relative select-none">
      <svg
        ref={svgRef}
        viewBox={`${janela.x} ${janela.y} ${janela.w} ${janela.h}`}
        className="h-auto w-full"
        onPointerMove={mover}
        onPointerUp={() => setArrasto(null)}
        onPointerLeave={() => setArrasto(null)}
      >
        <image
          href={janela.imagem}
          x={janela.x}
          y={janela.y}
          width={janela.w}
          height={janela.h}
          preserveAspectRatio="none"
        />

        {/* Divisa do lote (referência, não editável aqui) */}
        <polygon
          points={str(pontosLote)}
          fill="none"
          stroke="#023764"
          strokeWidth={1.6 * u}
          strokeLinejoin="round"
        />

        {/* Limite dos recuos */}
        {desenho.recuo && (
          <polygon
            points={str(desenho.recuo)}
            fill="none"
            stroke="#ffffff"
            strokeWidth={(sel?.tipo === 'recuo' ? 2 : 1.4) * u}
            strokeDasharray={`${3.2 * u} ${2.4 * u}`}
            strokeLinejoin="round"
            className="cursor-pointer"
            onPointerDown={(e) => {
              if (sel?.tipo === 'recuo') inserir(e);
              else onSel({ tipo: 'recuo' });
            }}
          />
        )}

        {/* Volumes */}
        {desenho.volumes.map((v, i) => (
          <polygon
            key={i}
            points={str(v.pontos)}
            fill={v.cor || COR_VOLUME_PADRAO}
            fillOpacity={0.85}
            stroke={sel?.tipo === 'volume' && sel.idx === i ? '#f2a06a' : '#ffffff'}
            strokeWidth={(sel?.tipo === 'volume' && sel.idx === i ? 1.6 : 0.8) * u}
            strokeLinejoin="round"
            className="cursor-pointer"
            onPointerDown={(e) => {
              if (sel?.tipo === 'volume' && sel.idx === i) inserir(e);
              else onSel({ tipo: 'volume', idx: i });
            }}
          />
        ))}

        {/* Alças da forma selecionada */}
        {selecionada?.map((p, idx) => (
          <circle
            key={idx}
            cx={p[0]}
            cy={p[1]}
            r={4.5 * u}
            fill="#f2a06a"
            stroke="#fff"
            strokeWidth={1.2 * u}
            className="cursor-grab"
            onPointerDown={(e) => {
              e.stopPropagation();
              onInicioArrasto?.();
              setArrasto(idx);
            }}
            onContextMenu={(e) => {
              e.preventDefault();
              remover(idx);
            }}
          />
        ))}
      </svg>
      <span className="sr-only">Editor da área construtiva do lote {numero}</span>
    </div>
  );
}
