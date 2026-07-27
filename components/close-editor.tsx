'use client';

import { useRef, useState } from 'react';
import { LoteClose, type JanelaClose } from '@/components/lote-close';
import type { EstiloLote, MedidaFace } from '@/lib/lotes';

export type OpContorno = { tipo: 'inserir' | 'remover'; idx: number } | undefined;

/**
 * Canvas de edição do close: renderiza o close real (o mesmo componente do
 * site) e, por cima, as alças de edição do contorno — arrastar cantos,
 * clicar numa face para inserir ponto, clique-direito num canto para remover.
 *
 * O contorno editado aqui é o MESMO da seção Implantação da home (uma fonte
 * da verdade só).
 */
export function CloseEditor({
  numero,
  area,
  janela,
  estilo,
  medidas,
  pontos,
  onChange,
  onInicioArrasto,
  arestasDestacadas,
}: {
  numero: number;
  area?: string;
  janela: JanelaClose;
  estilo?: EstiloLote;
  medidas: MedidaFace[];
  pontos: [number, number][];
  onChange: (pts: [number, number][], op?: OpContorno) => void;
  /** chamado no início de um arrasto de canto (para o histórico do desfazer) */
  onInicioArrasto?: () => void;
  arestasDestacadas?: number[];
}) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [arrasto, setArrasto] = useState<number | null>(null);

  const u = janela.w / 400; // mesma escala visual do LoteClose

  const paraCanvas = (e: React.PointerEvent): [number, number] => {
    const svg = svgRef.current!;
    const ctm = svg.getScreenCTM()!;
    const p = new DOMPoint(e.clientX, e.clientY).matrixTransform(ctm.inverse());
    return [Math.round(p.x), Math.round(p.y)];
  };

  const mover = (e: React.PointerEvent) => {
    if (arrasto === null) return;
    const [x, y] = paraCanvas(e);
    const copia = pontos.map((p) => [...p] as [number, number]);
    copia[arrasto] = [x, y];
    onChange(copia);
  };

  const inserir = (e: React.PointerEvent) => {
    if (arrasto !== null) return;
    const [x, y] = paraCanvas(e);
    let melhor = 0;
    let melhorD = Infinity;
    for (let i = 0; i < pontos.length; i++) {
      const a = pontos[i];
      const b = pontos[(i + 1) % pontos.length];
      const t = Math.max(
        0,
        Math.min(
          1,
          ((x - a[0]) * (b[0] - a[0]) + (y - a[1]) * (b[1] - a[1])) /
            ((b[0] - a[0]) ** 2 + (b[1] - a[1]) ** 2 || 1)
        )
      );
      const px = a[0] + t * (b[0] - a[0]);
      const py = a[1] + t * (b[1] - a[1]);
      const d = Math.hypot(x - px, y - py);
      if (d < melhorD) {
        melhorD = d;
        melhor = i;
      }
    }
    const copia = pontos.map((p) => [...p] as [number, number]);
    copia.splice(melhor + 1, 0, [x, y]);
    onChange(copia, { tipo: 'inserir', idx: melhor });
  };

  const remover = (idx: number) => {
    if (pontos.length <= 3) return;
    const copia = pontos.map((p) => [...p] as [number, number]);
    copia.splice(idx, 1);
    onChange(copia, { tipo: 'remover', idx });
  };

  return (
    <div className="relative select-none">
      <LoteClose
        numero={numero}
        area={area}
        pontos={pontos.map((p) => p.join(',')).join(' ')}
        medidas={medidas}
        janela={janela}
        estilo={estilo}
        arestasDestacadas={arestasDestacadas}
      />

      {/* Overlay de edição (mesmo viewBox: coordenadas idênticas) */}
      <svg
        ref={svgRef}
        viewBox={`${janela.x} ${janela.y} ${janela.w} ${janela.h}`}
        className="absolute inset-0 h-full w-full"
        onPointerMove={mover}
        onPointerUp={() => setArrasto(null)}
        onPointerLeave={() => setArrasto(null)}
      >
        {/* área clicável para inserir ponto numa face */}
        <polygon
          points={pontos.map((p) => p.join(',')).join(' ')}
          fill="transparent"
          stroke="transparent"
          strokeWidth={8 * u}
          className="cursor-copy"
          onPointerDown={inserir}
        />

        {/* alças dos cantos */}
        {pontos.map((p, idx) => (
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
              if (e.button !== 0) return; // só o botão esquerdo arrasta
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
    </div>
  );
}
