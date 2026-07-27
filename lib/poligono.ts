export type Ponto = [number, number];

/** Área assinada (shoelace). Positiva/negativa indica a orientação do anel. */
export function areaAssinada(pts: Ponto[]): number {
  let a = 0;
  for (let i = 0; i < pts.length; i++) {
    const b = pts[(i + 1) % pts.length];
    a += pts[i][0] * b[1] - b[0] * pts[i][1];
  }
  return a / 2;
}

export function centroide(pts: Ponto[]): Ponto {
  const a = areaAssinada(pts);
  if (!a) return pts[0];
  let cx = 0;
  let cy = 0;
  for (let i = 0; i < pts.length; i++) {
    const b = pts[(i + 1) % pts.length];
    const cross = pts[i][0] * b[1] - b[0] * pts[i][1];
    cx += (pts[i][0] + b[0]) * cross;
    cy += (pts[i][1] + b[1]) * cross;
  }
  return [cx / (6 * a), cy / (6 * a)];
}

/**
 * Escala do desenho: quantos metros cada unidade do canvas representa,
 * derivada da área real do lote (m²) versus a área do polígono em unidades².
 */
export function metrosPorUnidade(pts: Ponto[], areaM2: number): number {
  const areaU = Math.abs(areaAssinada(pts));
  if (!areaU || !areaM2) return 0;
  return Math.sqrt(areaM2 / areaU);
}

/**
 * Recolhe o polígono para dentro por uma distância uniforme (offset interno):
 * desloca cada aresta e recalcula os vértices pela interseção das arestas
 * vizinhas. Serve de ponto de partida para o limite dos recuos, que o usuário
 * ajusta arrastando.
 */
export function offsetInterno(pts: Ponto[], d: number): Ponto[] {
  const n = pts.length;
  if (n < 3 || d <= 0) return pts;
  // sinal da normal que aponta para dentro depende da orientação do anel
  const sentido = areaAssinada(pts) > 0 ? 1 : -1;

  // arestas deslocadas: ponto + normal * d
  const arestas = pts.map((a, i) => {
    const b = pts[(i + 1) % n];
    const dx = b[0] - a[0];
    const dy = b[1] - a[1];
    const len = Math.hypot(dx, dy) || 1;
    const nx = (-dy / len) * sentido;
    const ny = (dx / len) * sentido;
    return {
      p: [a[0] + nx * d, a[1] + ny * d] as Ponto,
      dir: [dx / len, dy / len] as Ponto,
    };
  });

  const saida: Ponto[] = [];
  for (let i = 0; i < n; i++) {
    const ant = arestas[(i - 1 + n) % n];
    const atual = arestas[i];
    // interseção das retas (ant.p + t*ant.dir) e (atual.p + s*atual.dir)
    const det = ant.dir[0] * atual.dir[1] - ant.dir[1] * atual.dir[0];
    if (Math.abs(det) < 1e-9) {
      saida.push(atual.p); // arestas quase paralelas: usa o ponto deslocado
      continue;
    }
    const dx = atual.p[0] - ant.p[0];
    const dy = atual.p[1] - ant.p[1];
    const t = (dx * atual.dir[1] - dy * atual.dir[0]) / det;
    saida.push([
      Math.round((ant.p[0] + ant.dir[0] * t) * 10) / 10,
      Math.round((ant.p[1] + ant.dir[1] * t) * 10) / 10,
    ]);
  }

  // se o recuo "engoliu" o lote, devolve o original (usuário reduz a distância)
  if (Math.abs(areaAssinada(saida)) < Math.abs(areaAssinada(pts)) * 0.02) return pts;
  return saida;
}

/** Retângulo centrado, usado ao criar um volume novo */
export function retanguloCentrado(c: Ponto, w: number, h: number): Ponto[] {
  return [
    [Math.round(c[0] - w / 2), Math.round(c[1] - h / 2)],
    [Math.round(c[0] + w / 2), Math.round(c[1] - h / 2)],
    [Math.round(c[0] + w / 2), Math.round(c[1] + h / 2)],
    [Math.round(c[0] - w / 2), Math.round(c[1] + h / 2)],
  ];
}
