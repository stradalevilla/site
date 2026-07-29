import type { MedidaFace } from './lotes';

/**
 * As medidas de um lote apontam para o ÍNDICE da face no contorno. Quando
 * alguém insere ou remove um ponto no editor, as faces são renumeradas e as
 * medidas passam a apontar para o lado errado — o "88,71m" acaba num trecho de
 * 11 m. Isto aqui traduz os índices do contorno antigo para o novo, para as
 * medidas seguirem o desenho sem ninguém precisar refazê-las.
 */

type Ponto = [number, number];

/** "x,y x,y ..." -> [[x,y], ...], sem o ponto de fechamento repetido */
export function lerPontos(pontos: string): Ponto[] {
  const p = pontos
    .trim()
    .split(/\s+/)
    .map((q) => q.split(',').map(Number) as Ponto);
  if (p.length > 1 && p[0][0] === p[p.length - 1][0] && p[0][1] === p[p.length - 1][1]) p.pop();
  return p;
}

/**
 * Casa os pontos do contorno antigo com os do novo, aceitando que vértices
 * tenham sido movidos, inseridos ou removidos. Devolve, para cada índice
 * antigo, o índice novo correspondente (ou -1 se aquele ponto sumiu).
 *
 * É um alinhamento de sequências por programação dinâmica: casar dois pontos
 * custa a distância entre eles, e pular um ponto (inserção ou remoção) tem
 * custo fixo. O caminho mais barato é o que preserva a ordem do traçado.
 */
export function casarPontos(antigos: Ponto[], novos: Ponto[]): number[] {
  const N = antigos.length, M = novos.length;
  const PULO = 60; // custo de inserir/remover: acima disso, casar sai mais barato
  const dist = (a: Ponto, b: Ponto) => Math.hypot(a[0] - b[0], a[1] - b[1]);

  const custo: number[][] = Array.from({ length: N + 1 }, () => new Array(M + 1).fill(Infinity));
  const de: number[][] = Array.from({ length: N + 1 }, () => new Array(M + 1).fill(0));
  custo[0][0] = 0;
  for (let i = 1; i <= N; i++) { custo[i][0] = i * PULO; de[i][0] = 1; }
  for (let j = 1; j <= M; j++) { custo[0][j] = j * PULO; de[0][j] = 2; }

  for (let i = 1; i <= N; i++)
    for (let j = 1; j <= M; j++) {
      const casa = custo[i - 1][j - 1] + dist(antigos[i - 1], novos[j - 1]);
      const some = custo[i - 1][j] + PULO;   // ponto antigo removido
      const surge = custo[i][j - 1] + PULO;  // ponto novo inserido
      const min = Math.min(casa, some, surge);
      custo[i][j] = min;
      de[i][j] = min === casa ? 0 : min === some ? 1 : 2;
    }

  const mapa = new Array(N).fill(-1);
  let i = N, j = M;
  while (i > 0 || j > 0) {
    const d = i > 0 && j > 0 ? de[i][j] : i > 0 ? 1 : 2;
    if (d === 0) { mapa[i - 1] = j - 1; i--; j--; }
    else if (d === 1) i--;
    else j--;
  }
  return mapa;
}

/**
 * Traduz as medidas de um lote do contorno antigo para o novo.
 *
 * Uma medida cobre as faces [aresta..ate]. A face i vai do ponto i ao i+1, então
 * no contorno novo ela passa a cobrir do ponto casado com `aresta` até o
 * anterior ao casado com `ate+1` — assim um trecho que ganhou pontos no meio
 * vira um grupo, e continua valendo a mesma cota.
 *
 * Devolve null quando o contorno mudou demais para traduzir com segurança;
 * nesse caso é melhor manter o que estava e deixar a conferência para uma pessoa.
 */
export function reindexar(
  medidas: MedidaFace[],
  contornoAntigo: string,
  contornoNovo: string
): MedidaFace[] | null {
  if (!medidas.length) return null;
  const antigos = lerPontos(contornoAntigo);
  const novos = lerPontos(contornoNovo);
  if (antigos.length < 3 || novos.length < 3) return null;
  if (antigos.length === novos.length) return null; // só moveram vértices: índices seguem valendo

  const mapa = casarPontos(antigos, novos);
  // Se o vértice que delimitava uma medida foi removido, a fronteira passa a
  // ser o próximo vértice que sobreviveu — a medida encosta na vizinha em vez
  // de sumir.
  const aindaExiste = (i: number): number => {
    for (let k = 0; k < antigos.length; k++) {
      const j = mapa[(i + k) % antigos.length];
      if (j >= 0) return j;
    }
    return -1;
  };

  const saida: MedidaFace[] = [];
  for (const m of medidas) {
    const ate = m.ate ?? m.aresta;
    if (m.aresta < 0 || ate >= antigos.length) return null;
    const ini = mapa[m.aresta] >= 0 ? mapa[m.aresta] : aindaExiste(m.aresta);
    const seguinte = aindaExiste((ate + 1) % antigos.length);
    if (ini < 0 || seguinte < 0) return null; // o lote inteiro mudou de forma
    // o grupo vai de `ini` até a face anterior à que começa em `seguinte`
    const fim = (seguinte - 1 + novos.length) % novos.length;
    if (fim === ini) saida.push({ aresta: ini, texto: m.texto });
    else if (fim > ini) saida.push({ aresta: ini, ate: fim, texto: m.texto });
    else return null; // grupo daria a volta no fechamento: não dá para representar
  }
  // não pode haver face coberta por duas medidas
  const usadas = new Set<number>();
  for (const m of saida) {
    for (let i = m.aresta; i <= (m.ate ?? m.aresta); i++) {
      if (usadas.has(i)) return null;
      usadas.add(i);
    }
  }
  return saida;
}
