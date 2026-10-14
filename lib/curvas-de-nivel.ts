/**
 * O grafismo de curvas de nível, desenhado em vez de ser uma imagem.
 *
 * Um relevo inventado por ruído de Perlin em 3D é fatiado em várias alturas, e
 * cada fatia vira uma curva. A terceira dimensão do ruído é o tempo: atravessá-la
 * devagar deforma as curvas em vez de arrastá-las, que é o que dá a sensação de
 * terreno respirando.
 *
 * Os pedaços de curva são encadeados pela aresta da malha onde nascem (cada
 * aresta é compartilhada por duas células, então os pedaços se reconhecem) e
 * desenhados como quadráticas pelos pontos médios. Por isso não sobra quina
 * nenhuma, em zoom nenhum — se fossem retas soltas, de longe viraria polígono.
 */

export interface ConfigDoFundo {
  /** quão rápido o relevo se deforma */
  velocidade: number;
  /** tamanho dos morros: quanto maior, mais aberto o desenho */
  escala: number;
  /** em quantas alturas o relevo é fatiado */
  linhas: number;
  /** espessura do traço, em décimos de pixel */
  espessura: number;
  /** presença da linha sobre o papel */
  contraste: number;
  /** lado da célula da malha, em pixels: menor = mais fiel e mais pesado */
  detalhe: number;
}

/** A calibragem aprovada para o site. */
export const CONFIG_PADRAO: ConfigDoFundo = {
  velocidade: 13,
  escala: 23,
  linhas: 30,
  espessura: 10,
  contraste: 38,
  detalhe: 5,
};

export const COR_DO_PAPEL = '#EFEBE3';
export const COR_DA_LINHA = '176, 162, 134';

// ---------------------------------------------------------------- ruído

const perm = new Uint8Array(512);
(function semear() {
  const p = new Uint8Array(256);
  for (let i = 0; i < 256; i++) p[i] = i;
  // embaralho determinístico: o desenho é sempre o mesmo em qualquer máquina
  let semente = 1337;
  for (let j = 255; j > 0; j--) {
    semente = (semente * 1664525 + 1013904223) >>> 0;
    const k = semente % (j + 1);
    const t = p[j];
    p[j] = p[k];
    p[k] = t;
  }
  for (let m = 0; m < 512; m++) perm[m] = p[m & 255];
})();

function suavizar(t: number) {
  return t * t * t * (t * (t * 6 - 15) + 10);
}

function misturar(a: number, b: number, t: number) {
  return a + t * (b - a);
}

function gradiente(h: number, x: number, y: number, z: number) {
  switch (h & 15) {
    case 0: return x + y;
    case 1: return -x + y;
    case 2: return x - y;
    case 3: return -x - y;
    case 4: return x + z;
    case 5: return -x + z;
    case 6: return x - z;
    case 7: return -x - z;
    case 8: return y + z;
    case 9: return -y + z;
    case 10: return y - z;
    case 11: return -y - z;
    case 12: return y + x;
    case 13: return -y + z;
    case 14: return y - x;
    default: return -y - z;
  }
}

function ruido(x: number, y: number, z: number) {
  const X = Math.floor(x) & 255;
  const Y = Math.floor(y) & 255;
  const Z = Math.floor(z) & 255;
  x -= Math.floor(x);
  y -= Math.floor(y);
  z -= Math.floor(z);
  const u = suavizar(x);
  const v = suavizar(y);
  const w = suavizar(z);
  const A = perm[X] + Y;
  const AA = perm[A] + Z;
  const AB = perm[A + 1] + Z;
  const B = perm[X + 1] + Y;
  const BA = perm[B] + Z;
  const BB = perm[B + 1] + Z;
  return misturar(
    misturar(
      misturar(gradiente(perm[AA], x, y, z), gradiente(perm[BA], x - 1, y, z), u),
      misturar(gradiente(perm[AB], x, y - 1, z), gradiente(perm[BB], x - 1, y - 1, z), u),
      v
    ),
    misturar(
      misturar(gradiente(perm[AA + 1], x, y, z - 1), gradiente(perm[BA + 1], x - 1, y, z - 1), u),
      misturar(
        gradiente(perm[AB + 1], x, y - 1, z - 1),
        gradiente(perm[BB + 1], x - 1, y - 1, z - 1),
        u
      ),
      v
    ),
    w
  );
}

/** duas oitavas: a primeira faz os morros, a segunda as reentrâncias */
function relevo(x: number, y: number, t: number) {
  return ruido(x, y, t) + 0.45 * ruido(x * 2.07, y * 2.07, t * 1.3 + 31.4);
}

// ---------------------------------------------------------------- desenho

export interface Desenhista {
  /** redimensiona para a caixa atual do canvas */
  medir: () => void;
  /** desenha um quadro; `dt` em segundos */
  quadro: (dt: number) => void;
  /** troca a calibragem em tempo real */
  calibrar: (config: ConfigDoFundo) => void;
  /** o passo da malha em uso, que pode ter sido afrouxado sozinho */
  passoEmUso: () => number;
}

export function criarDesenhista(
  canvas: HTMLCanvasElement,
  inicial: ConfigDoFundo,
  opcoes: { aliviarSozinho?: boolean } = {}
): Desenhista | null {
  const ctx = canvas.getContext('2d', { alpha: false });
  if (!ctx) return null;

  let cfg = { ...inicial };
  let passo = Math.max(3, Math.round(cfg.detalhe));
  let larg = 0;
  let alt = 0;
  let colunas = 0;
  let linhas = 0;
  let campo = new Float32Array(0);
  /* mínimo e máximo dos quatro cantos de cada célula: a maioria das células
     não é cruzada pela maioria dos níveis, e com isso a varredura descarta
     cada uma com duas comparações em vez de oito leituras */
  let celulaMin = new Float32Array(0);
  let celulaMax = new Float32Array(0);
  let tempo = 0;

  // ligações entre as arestas, para a curva sair contínua
  let ex = new Float32Array(0);
  let ey = new Float32Array(0);
  let viz1 = new Int32Array(0);
  let viz2 = new Int32Array(0);
  let registrado = new Uint8Array(0);
  let visitado = new Uint8Array(0);
  let tocados = new Int32Array(0);
  let px = new Float32Array(0);
  let py = new Float32Array(0);
  let nTocados = 0;
  let nPontos = 0;

  function alocar() {
    const r = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    larg = Math.max(1, Math.round(r.width));
    alt = Math.max(1, Math.round(r.height));
    canvas.width = Math.round(larg * dpr);
    canvas.height = Math.round(alt * dpr);
    ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);

    colunas = Math.ceil(larg / passo) + 1;
    linhas = Math.ceil(alt / passo) + 1;
    campo = new Float32Array(colunas * linhas);
    celulaMin = new Float32Array(Math.max(1, (colunas - 1) * (linhas - 1)));
    celulaMax = new Float32Array(Math.max(1, (colunas - 1) * (linhas - 1)));

    const capacidade = (colunas + 1) * (linhas + 1) * 2;
    ex = new Float32Array(capacidade);
    ey = new Float32Array(capacidade);
    viz1 = new Int32Array(capacidade);
    viz2 = new Int32Array(capacidade);
    registrado = new Uint8Array(capacidade);
    visitado = new Uint8Array(capacidade);
    tocados = new Int32Array(capacidade);
    px = new Float32Array(capacidade);
    py = new Float32Array(capacidade);
    nTocados = 0;

    /* Desenha antes de devolver, e isto não é zelo: o contexto é opaco
       (alpha: false), então atribuir canvas.width acima reinicializa o bitmap
       em PRETO. Como o canvas cobre a viewport inteira atrás do site, sair
       daqui sem repintar deixa a página preta até alguém chamar quadro() —
       o que não acontece no redimensionamento, nem no alívio automático, nem
       com "reduzir movimento" ligado. */
    desenhar();
  }

  const idH = (i: number, j: number) => (j * (colunas + 1) + i) * 2;
  const idV = (i: number, j: number) => (j * (colunas + 1) + i) * 2 + 1;

  function pontoNaAresta(id: number, x: number, y: number) {
    if (!registrado[id]) {
      registrado[id] = 1;
      ex[id] = x;
      ey[id] = y;
      viz1[id] = -1;
      viz2[id] = -1;
      visitado[id] = 0;
      tocados[nTocados++] = id;
    }
  }

  function conectar(ia: number, xa: number, ya: number, ib: number, xb: number, yb: number) {
    pontoNaAresta(ia, xa, ya);
    pontoNaAresta(ib, xb, yb);
    if (viz1[ia] === -1) viz1[ia] = ib;
    else if (viz2[ia] === -1) viz2[ia] = ib;
    if (viz1[ib] === -1) viz1[ib] = ia;
    else if (viz2[ib] === -1) viz2[ib] = ia;
  }

  function levantarNivel(nivel: number) {
    for (let t = 0; t < nTocados; t++) registrado[tocados[t]] = 0;
    nTocados = 0;

    for (let j = 0; j < linhas - 1; j++) {
      const base = j * colunas;
      const baseB = base + colunas;
      const y = j * passo;
      const linhaCelula = j * (colunas - 1);
      for (let i = 0; i < colunas - 1; i++) {
        if (nivel < celulaMin[linhaCelula + i] || nivel > celulaMax[linhaCelula + i]) continue;
        const a = campo[base + i];
        const b = campo[base + i + 1];
        const d = campo[baseB + i + 1];
        const e = campo[baseB + i];

        const caso =
          (a > nivel ? 8 : 0) | (b > nivel ? 4 : 0) | (d > nivel ? 2 : 0) | (e > nivel ? 1 : 0);
        if (caso === 0 || caso === 15) continue;

        const x = i * passo;
        const cimaX = x + passo * ((nivel - a) / (b - a));
        const dirY = y + passo * ((nivel - b) / (d - b));
        const baixoX = x + passo * ((nivel - e) / (d - e));
        const esqY = y + passo * ((nivel - a) / (e - a));

        const iCima = idH(i, j);
        const iBaixo = idH(i, j + 1);
        const iEsq = idV(i, j);
        const iDir = idV(i + 1, j);

        switch (caso) {
          case 1: case 14:
            conectar(iEsq, x, esqY, iBaixo, baixoX, y + passo); break;
          case 2: case 13:
            conectar(iBaixo, baixoX, y + passo, iDir, x + passo, dirY); break;
          case 3: case 12:
            conectar(iEsq, x, esqY, iDir, x + passo, dirY); break;
          case 4: case 11:
            conectar(iCima, cimaX, y, iDir, x + passo, dirY); break;
          case 6: case 9:
            conectar(iCima, cimaX, y, iBaixo, baixoX, y + passo); break;
          case 7: case 8:
            conectar(iEsq, x, esqY, iCima, cimaX, y); break;
          case 5:
            conectar(iEsq, x, esqY, iCima, cimaX, y);
            conectar(iBaixo, baixoX, y + passo, iDir, x + passo, dirY);
            break;
          case 10:
            conectar(iEsq, x, esqY, iBaixo, baixoX, y + passo);
            conectar(iCima, cimaX, y, iDir, x + passo, dirY);
            break;
        }
      }
    }
  }

  /** quadráticas pelos pontos médios: cada vértice vira controle, nunca canto */
  function curvar(fechado: boolean) {
    if (nPontos < 2) return;
    if (nPontos === 2) {
      ctx!.moveTo(px[0], py[0]);
      ctx!.lineTo(px[1], py[1]);
      return;
    }
    if (fechado) {
      ctx!.moveTo((px[nPontos - 1] + px[0]) / 2, (py[nPontos - 1] + py[0]) / 2);
      for (let i = 0; i < nPontos; i++) {
        const k = (i + 1) % nPontos;
        ctx!.quadraticCurveTo(px[i], py[i], (px[i] + px[k]) / 2, (py[i] + py[k]) / 2);
      }
    } else {
      ctx!.moveTo(px[0], py[0]);
      for (let n = 1; n < nPontos - 1; n++) {
        ctx!.quadraticCurveTo(px[n], py[n], (px[n] + px[n + 1]) / 2, (py[n] + py[n + 1]) / 2);
      }
      ctx!.lineTo(px[nPontos - 1], py[nPontos - 1]);
    }
  }

  function percorrer(inicio: number, fechado: boolean) {
    nPontos = 0;
    let atual = inicio;
    let anterior = -1;
    while (atual !== -1 && !visitado[atual] && nPontos < px.length) {
      visitado[atual] = 1;
      px[nPontos] = ex[atual];
      py[nPontos] = ey[atual];
      nPontos++;
      const a = viz1[atual];
      const b = viz2[atual];
      let prox = -1;
      if (a !== -1 && a !== anterior && !visitado[a]) prox = a;
      else if (b !== -1 && b !== anterior && !visitado[b]) prox = b;
      anterior = atual;
      atual = prox;
    }
    curvar(fechado);
  }

  function tracarNivel() {
    for (let t = 0; t < nTocados; t++) {
      const id = tocados[t];
      if (!visitado[id] && viz2[id] === -1) percorrer(id, false);
    }
    for (let t = 0; t < nTocados; t++) {
      const id = tocados[t];
      if (!visitado[id]) percorrer(id, true);
    }
  }

  // alívio automático: se a máquina não dá conta, a malha afrouxa sozinha
  let somaDeTempo = 0;
  let quadrosMedidos = 0;

  function desenhar() {
    const escala = 1 / (cfg.escala * 7);
    let k = 0;
    for (let j = 0; j < linhas; j++) {
      const y = j * passo * escala;
      for (let i = 0; i < colunas; i++) campo[k++] = relevo(i * passo * escala, y, tempo);
    }

    for (let j = 0; j < linhas - 1; j++) {
      const base = j * colunas;
      const baseB = base + colunas;
      const linhaCelula = j * (colunas - 1);
      for (let i = 0; i < colunas - 1; i++) {
        const a = campo[base + i];
        const b = campo[base + i + 1];
        const d = campo[baseB + i + 1];
        const e = campo[baseB + i];
        let mn = a, mx = a;
        if (b < mn) mn = b; else if (b > mx) mx = b;
        if (d < mn) mn = d; else if (d > mx) mx = d;
        if (e < mn) mn = e; else if (e > mx) mx = e;
        celulaMin[linhaCelula + i] = mn;
        celulaMax[linhaCelula + i] = mx;
      }
    }

    ctx!.fillStyle = COR_DO_PAPEL;
    ctx!.fillRect(0, 0, larg, alt);

    const opacidade = Math.min(1, (cfg.contraste / 100) * 0.5);
    ctx!.strokeStyle = `rgba(${COR_DA_LINHA}, ${opacidade.toFixed(3)})`;
    ctx!.lineWidth = cfg.espessura / 10;
    ctx!.lineCap = 'round';
    ctx!.lineJoin = 'round';

    ctx!.beginPath();
    const quantas = Math.max(1, Math.round(cfg.linhas));
    for (let n = 0; n < quantas; n++) {
      levantarNivel(-1.25 + (2.5 * (n + 0.5)) / quantas);
      tracarNivel();
    }
    ctx!.stroke();
  }

  return {
    medir: alocar,
    passoEmUso: () => passo,
    calibrar(novo: ConfigDoFundo) {
      const mudouMalha = Math.round(novo.detalhe) !== Math.round(cfg.detalhe);
      cfg = { ...novo };
      if (mudouMalha) {
        passo = Math.max(3, Math.round(cfg.detalhe));
        alocar(); // já repinta
        return;
      }
      /* Sem laço rodando — "reduzir movimento" ligado, ou velocidade zero — a
         prévia do painel ficaria parada no desenho antigo enquanto o admin
         arrasta espessura, contraste ou linhas. Um quadro aqui custa pouco e
         é o que faz o controle responder. */
      desenhar();
    },
    quadro(dt: number) {
      tempo += dt * (cfg.velocidade / 1000);
      const antes = opcoes.aliviarSozinho ? performance.now() : 0;
      desenhar();

      if (!opcoes.aliviarSozinho) return;
      somaDeTempo += performance.now() - antes;
      quadrosMedidos++;
      if (quadrosMedidos >= 45) {
        const medio = somaDeTempo / quadrosMedidos;
        somaDeTempo = 0;
        quadrosMedidos = 0;
        // acima de 11ms por quadro o desenho já come metade do orçamento de
        // 60fps sozinho: afrouxa a malha até caber
        if (medio > 11 && passo < 14) {
          passo += 2;
          alocar();
        }
      }
    },
  };
}
