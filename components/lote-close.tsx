import { IMPLANTACAO_CANVAS } from '@/lib/implantacao';
import type { EstiloLote, MedidaFace } from '@/lib/lotes';

/** Estilo padrão: o navy dos overlays do arquiteto */
export const ESTILO_PADRAO: Required<EstiloLote> = {
  fillTopo: '#023764',
  fillBase: '#06528a',
  fillOpacidade: 0.97,
  contornoCor: '',
  contornoLargura: 1,
};

export interface JanelaClose {
  x: number;
  y: number;
  w: number;
  h: number;
  /** Imagem de fundo (recorte em alta do render), cobrindo exatamente a janela */
  imagem: string;
}

const pad = (n: number) => String(n).padStart(2, '0');

/**
 * Close dinâmico do lote: recorte do masterplan com a marcação desenhada
 * por cima — polígono navy, medidas ao longo das faces e selo com número,
 * metragem e o emblema. Substitui as artes estáticas exportadas no Photoshop.
 *
 * Tudo em coordenadas do canvas da implantação (1822x1015): o viewBox faz o
 * zoom na janela e os pontos do contorno valem sem conversão.
 */
export function LoteClose({
  numero,
  area,
  pontos,
  medidas,
  janela,
  estilo,
  arestasDestacadas,
}: {
  numero: number;
  area?: string;
  pontos: string;
  medidas: MedidaFace[];
  janela: JanelaClose;
  estilo?: EstiloLote;
  /** Arestas pintadas de dourado (usado pelo editor para mostrar qual face é qual) */
  arestasDestacadas?: number[];
}) {
  const est = { ...ESTILO_PADRAO, ...estilo };
  // pontos únicos (o contorno pode repetir o primeiro no fim)
  const pts = pontos.split(' ').map((p) => p.split(',').map(Number) as [number, number]);
  if (
    pts.length > 1 &&
    pts[0][0] === pts[pts.length - 1][0] &&
    pts[0][1] === pts[pts.length - 1][1]
  ) {
    pts.pop();
  }

  // centroide (para orientar as medidas para fora e posicionar o selo)
  const anel = pts.concat([pts[0]]);
  let cx = 0,
    cy = 0,
    a2 = 0;
  for (let i = 0; i < anel.length - 1; i++) {
    const cross = anel[i][0] * anel[i + 1][1] - anel[i + 1][0] * anel[i][1];
    a2 += cross;
    cx += (anel[i][0] + anel[i + 1][0]) * cross;
    cy += (anel[i][1] + anel[i + 1][1]) * cross;
  }
  cx /= 3 * a2;
  cy /= 3 * a2;

  // geometria de cada medida: ponto médio (pelo comprimento do trecho),
  // ângulo pela corda do trecho e deslocamento para fora do lote.
  // Um trecho pode cobrir várias arestas consecutivas (curvas agrupadas).
  const rotulos = medidas
    .filter((m) => m.aresta >= 0 && m.aresta < pts.length && m.texto)
    .map((m) => {
      const fim = Math.min(m.ate ?? m.aresta, pts.length - 1);
      // vértices do trecho [aresta .. fim+1]
      const verts: [number, number][] = [];
      for (let i = m.aresta; i <= fim + 1; i++) verts.push(pts[i % pts.length]);
      // comprimento acumulado e ponto no meio do arco
      let total = 0;
      const lens: number[] = [];
      for (let i = 0; i < verts.length - 1; i++) {
        const l = Math.hypot(verts[i + 1][0] - verts[i][0], verts[i + 1][1] - verts[i][1]);
        lens.push(l);
        total += l;
      }
      let alvo = total / 2;
      let mx = verts[0][0];
      let my = verts[0][1];
      for (let i = 0; i < lens.length; i++) {
        if (alvo <= lens[i] || i === lens.length - 1) {
          const t = lens[i] ? alvo / lens[i] : 0;
          mx = verts[i][0] + t * (verts[i + 1][0] - verts[i][0]);
          my = verts[i][1] + t * (verts[i + 1][1] - verts[i][1]);
          break;
        }
        alvo -= lens[i];
      }
      // ângulo pela corda (início -> fim do trecho)
      const a = verts[0];
      const b = verts[verts.length - 1];
      let ang = (Math.atan2(b[1] - a[1], b[0] - a[0]) * 180) / Math.PI;
      // texto sempre "de pé"
      if (ang > 90) ang -= 180;
      if (ang < -90) ang += 180;
      // desloca para fora do lote (na direção oposta ao centroide)
      const nx = mx - cx;
      const ny = my - cy;
      const norm = Math.hypot(nx, ny) || 1;
      const OFF = 7;
      return {
        ...m,
        x: mx + (nx / norm) * OFF,
        y: my + (ny / norm) * OFF,
        ang,
      };
    });

  const { width: W, height: H } = IMPLANTACAO_CANVAS;
  // escala tipográfica proporcional à janela (mesmo tamanho visual em qualquer zoom)
  const u = janela.w / 400;

  return (
    <svg
      viewBox={`${janela.x} ${janela.y} ${janela.w} ${janela.h}`}
      className="h-auto w-full"
      role="img"
      aria-label={`Lote ${pad(numero)} com as medidas do terreno`}
    >
      <defs>
        <linearGradient id={`lote-fill-${numero}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={est.fillTopo} />
          <stop offset="100%" stopColor={est.fillBase} />
        </linearGradient>
      </defs>

      {/* Fundo: recorte em alta do render, cobrindo exatamente a janela */}
      <image
        href={janela.imagem}
        x={janela.x}
        y={janela.y}
        width={janela.w}
        height={janela.h}
        preserveAspectRatio="none"
      />
      {/* Área fora do canvas (se a janela vazar) fica navy */}
      <rect x={-W} y={-H} width={W} height={3 * H} fill="#0a1929" opacity={0} />

      {/* Marcação do lote */}
      <polygon
        points={pts.map((p) => p.join(',')).join(' ')}
        fill={`url(#lote-fill-${numero})`}
        fillOpacity={est.fillOpacidade}
        stroke={est.contornoCor || 'none'}
        strokeWidth={est.contornoCor ? est.contornoLargura * u : 0}
        strokeLinejoin="round"
      />

      {/* Arestas destacadas (só no editor) */}
      {arestasDestacadas?.map(
        (idx) =>
          pts[idx] && (
            <line
              key={idx}
              x1={pts[idx][0]}
              y1={pts[idx][1]}
              x2={pts[(idx + 1) % pts.length][0]}
              y2={pts[(idx + 1) % pts.length][1]}
              stroke="#f2a06a"
              strokeWidth={2.5 * u}
              strokeLinecap="round"
            />
          )
      )}

      {/* Medidas ao longo das faces */}
      {rotulos.map((r) => (
        <text
          key={r.aresta}
          x={r.x}
          y={r.y}
          transform={`rotate(${r.ang} ${r.x} ${r.y})`}
          textAnchor="middle"
          dominantBaseline="central"
          fill="#ffffff"
          style={{ fontSize: 8.5 * u, fontWeight: 600, letterSpacing: 0.4 }}
          className="font-body"
        >
          {r.texto}
        </text>
      ))}

      {/* Selo: emblema + caixas com numero e metragem */}
      <image
        href="/logos/Icone-VillaStradale branco.svg"
        x={cx - 15 * u}
        y={cy - 24 * u}
        width={30 * u}
        height={8 * u}
      />
      <g className="font-body">
        <rect
          x={cx - 18 * u}
          y={cy - 10 * u}
          width={36 * u}
          height={9.5 * u}
          fill="rgba(10,25,41,0.25)"
          stroke="#ffffff"
          strokeWidth={0.5 * u}
        />
        <text
          x={cx}
          y={cy - 5.2 * u}
          textAnchor="middle"
          dominantBaseline="central"
          fill="#ffffff"
          style={{ fontSize: 5.5 * u, fontWeight: 600 }}
        >
          Lote {pad(numero)}
        </text>
        <rect
          x={cx - 18 * u}
          y={cy - 0.5 * u}
          width={36 * u}
          height={9.5 * u}
          fill="rgba(10,25,41,0.25)"
          stroke="#ffffff"
          strokeWidth={0.5 * u}
        />
        <text
          x={cx}
          y={cy + 4.3 * u}
          textAnchor="middle"
          dominantBaseline="central"
          fill="#ffffff"
          style={{ fontSize: 6 * u, fontWeight: 600 }}
        >
          {area ? `${area} m²` : ''}
        </text>
      </g>
    </svg>
  );
}
