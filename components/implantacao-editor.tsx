'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { IMPLANTACAO_CANVAS, type LoteContorno } from '@/lib/implantacao';

const pad = (n: number) => String(n).padStart(2, '0');

type Lote = {
  numero: number;
  pontos: [number, number][];
  centroide: [number, number];
};

const paraEstado = (cs: LoteContorno[]): Lote[] =>
  cs.map((l) => ({
    numero: l.numero,
    pontos: l.pontos.split(' ').map((p) => p.split(',').map(Number) as [number, number]),
    centroide: [...l.centroide] as [number, number],
  }));

const paraContornos = (ls: Lote[]): LoteContorno[] =>
  ls.map((l) => ({
    numero: l.numero,
    pontos: l.pontos.map((p) => p.join(',')).join(' '),
    centroide: l.centroide,
  }));

type Arrasto =
  | { tipo: 'vertice'; loteIdx: number; ptIdx: number }
  | { tipo: 'centroide'; loteIdx: number }
  | null;

export function ImplantacaoEditor({ iniciais }: { iniciais: LoteContorno[] }) {
  const base = useMemo(() => paraEstado(iniciais), [iniciais]);
  const [lotes, setLotes] = useState<Lote[]>(base);
  const [historico, setHistorico] = useState<Lote[][]>([]);
  const [sel, setSel] = useState(0);
  const [arrasto, setArrasto] = useState<Arrasto>(null);
  const [zoom, setZoom] = useState(1);
  const [status, setStatus] = useState<string>('');
  const [salvando, setSalvando] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);

  const { width: W, height: H } = IMPLANTACAO_CANVAS;

  // registra o estado atual no histórico antes de uma alteração
  const snapshot = useCallback(() => {
    setHistorico((h) => [...h.slice(-49), lotes.map((l) => ({ ...l, pontos: l.pontos.map((p) => [...p] as [number, number]), centroide: [...l.centroide] as [number, number] }))]);
  }, [lotes]);

  const desfazer = useCallback(() => {
    setHistorico((h) => {
      if (!h.length) return h;
      setLotes(h[h.length - 1]);
      return h.slice(0, -1);
    });
  }, []);

  // Ctrl+Z
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        desfazer();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [desfazer]);

  const paraCanvas = (e: React.PointerEvent): [number, number] => {
    const svg = svgRef.current!;
    const ctm = svg.getScreenCTM()!;
    const p = new DOMPoint(e.clientX, e.clientY).matrixTransform(ctm.inverse());
    return [Math.round(p.x), Math.round(p.y)];
  };

  const onMove = (e: React.PointerEvent) => {
    if (!arrasto) return;
    const [x, y] = paraCanvas(e);
    setLotes((prev) => {
      const copia = prev.map((l) => ({ ...l, pontos: l.pontos.map((p) => [...p] as [number, number]), centroide: [...l.centroide] as [number, number] }));
      if (arrasto.tipo === 'vertice') copia[arrasto.loteIdx].pontos[arrasto.ptIdx] = [x, y];
      else copia[arrasto.loteIdx].centroide = [x, y];
      return copia;
    });
  };

  const inserirVertice = (e: React.PointerEvent) => {
    if (arrasto) return;
    snapshot();
    const [x, y] = paraCanvas(e);
    setLotes((prev) => {
      const copia = prev.map((l) => ({ ...l, pontos: l.pontos.map((p) => [...p] as [number, number]) }));
      const pts = copia[sel].pontos;
      let melhor = 0, melhorD = Infinity;
      for (let i = 0; i < pts.length; i++) {
        const a = pts[i], b = pts[(i + 1) % pts.length];
        const t = Math.max(0, Math.min(1, ((x - a[0]) * (b[0] - a[0]) + (y - a[1]) * (b[1] - a[1])) / ((b[0] - a[0]) ** 2 + (b[1] - a[1]) ** 2 || 1)));
        const px = a[0] + t * (b[0] - a[0]), py = a[1] + t * (b[1] - a[1]);
        const d = Math.hypot(x - px, y - py);
        if (d < melhorD) { melhorD = d; melhor = i; }
      }
      pts.splice(melhor + 1, 0, [x, y]);
      return copia;
    });
  };

  const removerVertice = (loteIdx: number, ptIdx: number) => {
    snapshot();
    setLotes((prev) => {
      const copia = prev.map((l) => ({ ...l, pontos: l.pontos.map((p) => [...p] as [number, number]) }));
      if (copia[loteIdx].pontos.length > 3) copia[loteIdx].pontos.splice(ptIdx, 1);
      return copia;
    });
  };

  const salvar = async () => {
    setSalvando(true);
    setStatus('salvando…');
    try {
      const res = await fetch('/api/implantacao', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contornos: paraContornos(lotes) }),
      });
      const j = await res.json();
      setStatus(res.ok ? `salvo! ${j.total} lotes gravados` : `erro: ${j.error}`);
    } catch {
      setStatus('erro de conexão');
    } finally {
      setSalvando(false);
    }
  };

  const loteSel = lotes[sel];
  const hEsc = 6 / zoom; // handles com tamanho constante na tela, independentemente do zoom

  return (
    <div className="min-h-screen bg-neutral-900 p-4 text-white">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <h1 className="mr-2 font-mono text-sm">Marcações · Implantação</h1>
        <select value={sel} onChange={(e) => setSel(Number(e.target.value))} className="rounded bg-neutral-800 px-2 py-1 text-sm">
          {lotes.map((l, i) => (
            <option key={l.numero} value={i}>Lote {pad(l.numero)}</option>
          ))}
        </select>
        <button onClick={() => setSel((s) => (s - 1 + lotes.length) % lotes.length)} className="rounded bg-neutral-800 px-3 py-1 text-sm">‹</button>
        <button onClick={() => setSel((s) => (s + 1) % lotes.length)} className="rounded bg-neutral-800 px-3 py-1 text-sm">›</button>

        <span className="mx-2 h-5 w-px bg-neutral-700" />
        <button onClick={() => setZoom((z) => Math.min(4, +(z * 1.3).toFixed(2)))} className="rounded bg-neutral-800 px-3 py-1 text-sm">zoom +</button>
        <button onClick={() => setZoom((z) => Math.max(1, +(z / 1.3).toFixed(2)))} className="rounded bg-neutral-800 px-3 py-1 text-sm">zoom −</button>
        <span className="text-xs text-neutral-500">{Math.round(zoom * 100)}%</span>
        <button onClick={desfazer} disabled={!historico.length} className="rounded bg-neutral-800 px-3 py-1 text-sm disabled:opacity-40">↶ desfazer (Ctrl+Z)</button>

        <span className="mx-2 h-5 w-px bg-neutral-700" />
        <button onClick={salvar} disabled={salvando} className="rounded bg-blue-600 px-4 py-1 text-sm font-semibold disabled:opacity-50">salvar</button>
        {status && <span className="text-xs text-neutral-300">{status}</span>}
      </div>

      <p className="mb-2 text-xs text-neutral-500">
        arraste os cantos • clique numa aresta p/ inserir ponto • clique-direito num canto p/ remover • quadrado branco = posição do número
      </p>

      <div className="max-h-[78vh] overflow-auto rounded border border-neutral-800">
        <div style={{ width: `${zoom * 100}%` }}>
          <div className="relative select-none">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/implantacao/masterplan-implantacao.jpg" alt="" className="block w-full" draggable={false} />
            <svg
              ref={svgRef}
              viewBox={`0 0 ${W} ${H}`}
              className="absolute inset-0 h-full w-full"
              onPointerMove={onMove}
              onPointerUp={() => setArrasto(null)}
              onPointerLeave={() => setArrasto(null)}
            >
              {lotes.map((l, i) =>
                i === sel ? null : (
                  <polygon
                    key={l.numero}
                    points={l.pontos.map((p) => p.join(',')).join(' ')}
                    fill="rgba(6,82,138,0.14)"
                    stroke="rgba(255,255,255,0.3)"
                    strokeWidth={1 / zoom}
                    className="cursor-pointer"
                    onPointerDown={() => setSel(i)}
                  />
                )
              )}

              <polygon
                points={loteSel.pontos.map((p) => p.join(',')).join(' ')}
                fill="rgba(6,82,138,0.45)"
                stroke="#f2a06a"
                strokeWidth={2 / zoom}
                className="cursor-copy"
                onPointerDown={inserirVertice}
              />

              {loteSel.pontos.map((p, idx) => (
                <circle
                  key={idx}
                  cx={p[0]}
                  cy={p[1]}
                  r={hEsc}
                  fill="#f2a06a"
                  stroke="#fff"
                  strokeWidth={1.5 / zoom}
                  className="cursor-grab"
                  onPointerDown={(e) => { e.stopPropagation(); snapshot(); setArrasto({ tipo: 'vertice', loteIdx: sel, ptIdx: idx }); }}
                  onContextMenu={(e) => { e.preventDefault(); removerVertice(sel, idx); }}
                />
              ))}

              <rect
                x={loteSel.centroide[0] - hEsc}
                y={loteSel.centroide[1] - hEsc}
                width={hEsc * 2}
                height={hEsc * 2}
                fill="#fff"
                stroke="#0a1929"
                strokeWidth={2 / zoom}
                className="cursor-grab"
                onPointerDown={(e) => { e.stopPropagation(); snapshot(); setArrasto({ tipo: 'centroide', loteIdx: sel }); }}
              />
              <text
                x={loteSel.centroide[0]}
                y={loteSel.centroide[1]}
                textAnchor="middle"
                dominantBaseline="central"
                className="pointer-events-none"
                fill="#0a1929"
                style={{ fontSize: hEsc * 1.6, fontWeight: 700 }}
              >
                {pad(loteSel.numero)}
              </text>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
