'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { MapaImplantacao } from '@/components/mapa-implantacao';
import FORMAS from '@/lib/book-digital-formas.json';
import {
  ALTURA,
  AVISO_LEGAL,
  CASA_CLUBE,
  CIDADES,
  DIFERENCIAIS,
  EQUIPAMENTOS,
  INFRAESTRUTURA,
  LARGURA,
  type Caixa,
  type ImagemDaTela,
  type Lado,
  type Linhas as LinhasDoBook,
  type Tela,
  type Texto,
} from '@/lib/book-digital';
import type { LoteContorno } from '@/lib/implantacao';

const NAVY = '#152f4e';
const COBRE = '#d18455';
const AZUL_LISO = '#152b4b';
const PASTA = '/midia/book-digital';
/** o papel azul do book: a meia página espelhada na dobra, inteira na tela */
const AZUL: React.CSSProperties = { backgroundColor: AZUL_LISO, backgroundImage: `url(${PASTA}/papel-azul-dupla.jpg)`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' };
const FUNDO: Record<Tela['fundo'], React.CSSProperties> = {
  creme: { backgroundColor: '#f9f1e1', backgroundImage: `url(${PASTA}/papel-creme.jpg)` },
  claro: { backgroundColor: '#f4f0e8', backgroundImage: `url(${PASTA}/papel-claro.jpg)` },
  branco: { backgroundColor: '#f5f3f0', backgroundImage: `url(${PASTA}/papel-branco.jpg)` },
  neutro: { backgroundColor: '#f6f2ec', backgroundImage: `url(${PASTA}/papel-diferenciais.jpg)` },
  pedro: { backgroundColor: '#f3f3f3', backgroundImage: `url(${PASTA}/papel-pedro.jpg)` },
  desenho: { backgroundColor: '#f9f3ee' },
  azul: AZUL,
  foto: { backgroundColor: '#0a1929' },
};
/** filmes que o site tem cortados para o celular em pé */
const FILMES_EM_PE = ['hero-por-do-sol', 'hero-peninsula-v2'];
/** as linhas do book têm pouco mais de um ponto */
const FIO = 'max(1px, calc(var(--fw) * 1.2 / 1361))';
const TOPO = 'pt-[max(4.5rem,calc(env(safe-area-inset-top)+3.5rem))]';
const formasDoPapel = FORMAS as { paginas: Record<string, string[]>; formas: Record<string, string> };

export type DadosDaImplantacao = { contornos: LoteContorno[]; areas: Record<number, string | null> };

/** Medida do book em unidades da tela: o leitor define --fw, a largura da página dupla na tela */
const pt = (valor: number) => `calc(var(--fw) * ${valor} / ${LARGURA})`;
const px = (v: number) => `${(v / LARGURA) * 100}%`;
const py = (v: number) => `${(v / ALTURA) * 100}%`;
const doze = (n: number) => String(n).padStart(2, '0');
const parar = (e: React.PointerEvent) => e.stopPropagation();

/**
 * Posição de uma caixa do book dentro da moldura. Nos lados em `beira` a distância é medida da
 * beira da tela: uma foto que sangra vai até a borda, e o fio de margem fica a 40 pt dela.
 */
function posicao([x0, y0, x1, y1]: Caixa, beira: Lado[] = []): React.CSSProperties {
  const esq = beira.includes('esquerda');
  const dir = beira.includes('direita');
  const topo = beira.includes('topo');
  const base = beira.includes('base');
  return {
    left: esq ? `calc(${px(x0)} - var(--mx))` : px(x0),
    top: topo ? `calc(${py(y0)} - var(--my))` : py(y0),
    width: `calc(${px(x1 - x0)}${esq ? ' + var(--mx)' : ''}${dir ? ' + var(--mx)' : ''})`,
    height: `calc(${py(y1 - y0)}${topo ? ' + var(--my)' : ''}${base ? ' + var(--my)' : ''})`,
  };
}

/** O ponto de um texto, medido da beira da tela nos lados em `beira` */
function pontoNaBeira(x: number, y: number, beira: Lado[] = []) {
  const dx = beira.includes('esquerda') ? ' - var(--mx)' : beira.includes('direita') ? ' + var(--mx)' : '';
  const dy = beira.includes('topo') ? ' - var(--my)' : beira.includes('base') ? ' + var(--my)' : '';
  return { left: dx ? `calc(${px(x)}${dx})` : px(x), top: dy ? `calc(${py(y)}${dy})` : py(y) };
}

function Foto({ imagem, ativa, sizes, prioridade, emPe = false, ajuste = 'cover' }: { imagem: ImagemDaTela; ativa: boolean; sizes: string; prioridade: boolean; emPe?: boolean; ajuste?: 'cover' | 'contain' }) {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <Image
        src={emPe && imagem.emPe ? imagem.emPe : imagem.src}
        alt={imagem.alt}
        fill
        sizes={sizes}
        priority={prioridade}
        quality={75}
        draggable={false}
        className={`select-none ${ajuste === 'contain' ? 'object-contain' : 'object-cover'} ${imagem.fixa ? '' : `transition-transform duration-[2200ms] ease-out ${ativa ? 'scale-100' : 'scale-[1.045]'}`}`}
        style={{ objectPosition: (emPe && imagem.focoEmPe) || imagem.foco || '50% 50%' }}
      />
    </div>
  );
}

/** A tomada do filme do site: entra por cima da foto quando começa a tocar, e só toca na tela ativa */
function Filme({ nome, tamanho, ativa, ajuste = 'cover', foco }: { nome: string; tamanho: 'retrato' | '720' | '1080'; ativa: boolean; ajuste?: 'cover' | 'contain'; foco?: string }) {
  const video = useRef<HTMLVideoElement>(null);
  const [tocando, setTocando] = useState(false);

  useEffect(() => {
    const v = video.current;
    if (!v) return;
    if (ativa && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      v.currentTime = 0;
      v.play().catch(() => setTocando(false));
    } else v.pause();
  }, [ativa]);

  return (
    <video
      ref={video}
      src={`/videos/${nome}-${tamanho === 'retrato' && !FILMES_EM_PE.includes(nome) ? '720' : tamanho}.mp4`}
      muted
      loop
      playsInline
      preload="metadata"
      aria-hidden="true"
      tabIndex={-1}
      onPlaying={() => setTocando(true)}
      onPause={() => setTocando(false)}
      className={`absolute inset-0 h-full w-full ${ajuste === 'contain' ? 'object-contain' : 'object-cover'} transition-opacity duration-700 ${tocando ? 'opacity-100' : 'opacity-0'}`}
      style={{ objectPosition: foco }}
    />
  );
}

function Emblema({ largura, className = '' }: { largura: string; className?: string }) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src="/logos/Icone-VillaStradale%20cobre.svg" alt="" aria-hidden className={`block ${className}`} style={{ width: largura, height: 'auto' }} />;
}

/** As formas em dois tons do papel do book, desenhadas como no PDF; passam da página, por isso o desenho não corta */
function FormasDoPapel({ pagina }: { pagina?: number }) {
  const chaves = pagina ? formasDoPapel.paginas[String(pagina)] : undefined;
  if (!chaves) return null;
  return (
    <svg aria-hidden viewBox={`0 0 ${LARGURA} ${ALTURA}`} preserveAspectRatio="none" className="pointer-events-none absolute inset-0 h-full w-full overflow-visible">
      {chaves.map((chave, i) => (
        <path key={i} d={formasDoPapel.formas[chave]} fill="#b5a07a" fillOpacity={0.045} />
      ))}
    </svg>
  );
}

/** As linhas em cobre, sempre com o comprimento do book. A ponta 'borda' fica presa na beira da tela. */
function Linhas({ conjunto }: { conjunto: LinhasDoBook }) {
  const { y, passo = 7.2, de, ate } = conjunto;
  const quantas = conjunto.quantas ?? Math.max(Array.isArray(de) ? de.length : 1, Array.isArray(ate) ? ate.length : 1);
  return (
    <>
      {Array.from({ length: quantas }, (_, i) => {
        const ini = Array.isArray(de) ? de[i] : de;
        const fim = Array.isArray(ate) ? ate[i] : ate;
        const estilo: React.CSSProperties =
          ini === 'borda'
            ? { left: 'calc(-1 * var(--mx))', width: px(fim as number) }
            : fim === 'borda'
              ? { right: 'calc(-1 * var(--mx))', width: px(LARGURA - ini) }
              : { left: px(ini), width: px((fim as number) - ini) };
        return <span key={i} aria-hidden className="absolute" style={{ ...estilo, top: py(y + i * passo), height: FIO, backgroundColor: COBRE }} />;
      })}
    </>
  );
}

/** As cinco linhas no pé do celular, com o comprimento proporcional ao do book */
function LinhasDoCelular() {
  return (
    <div aria-hidden className="pointer-events-none absolute bottom-[max(1.4rem,calc(env(safe-area-inset-bottom)+0.6rem))] left-0">
      {[57.2, 96.7, 112.3, 83.6, 61.4].map((fim, i) => (
        <span key={i} className="block" style={{ width: fim * 0.42, height: 1, marginTop: i ? 3 : 0, backgroundColor: COBRE }} />
      ))}
    </div>
  );
}

const FONTE: Record<NonNullable<Texto['fonte']>, string> = {
  ivy: 'font-heading font-thin italic',
  'ivy-reto': 'font-heading font-thin',
  swiss: 'font-body',
  'swiss-leve': 'font-body font-light',
};

/** Um bloco de texto do book, no lugar e no corpo do book */
function TextoDeitado({ texto }: { texto: Texto }) {
  const tamanho = texto.tamanho ?? 10;
  const entrelinha = texto.entrelinha ?? tamanho * 1.2;
  const acima = texto.emblemaAcima ?? 27;
  const ponto = pontoNaBeira(texto.x, texto.y, texto.beira);
  const estilo: React.CSSProperties = {
    left: ponto.left,
    top: texto.emblema ? `calc(${ponto.top} - ${pt(acima)})` : ponto.top,
    fontSize: pt(tamanho),
    lineHeight: pt(entrelinha),
    color: texto.cor ?? NAVY,
    letterSpacing: texto.espaco ? `${texto.espaco}em` : undefined,
    width: texto.largura ? px(texto.largura) : undefined,
  };
  if (texto.centro) {
    estilo.transform = 'translateX(-50%)';
    if (texto.espaco) estilo.paddingLeft = `${texto.espaco}em`;
  }

  return (
    <div className={`absolute ${FONTE[texto.fonte ?? 'swiss']} ${texto.caixaAlta ? 'uppercase' : ''} ${texto.centro ? 'text-center' : ''}`} style={estilo}>
      {texto.emblema && (
        <div className={`flex items-start ${texto.centro ? 'justify-center' : ''}`} style={{ height: pt(acima), marginLeft: texto.centro && texto.espaco ? `-${texto.espaco}em` : undefined }}>
          <Emblema largura={pt(64)} />
        </div>
      )}
      {texto.linhas?.map((linha) => (
        <span key={linha} className="block whitespace-nowrap">
          {linha}
        </span>
      ))}
      {texto.paragrafos?.map((p, i) => (
        <p key={i} lang="pt-BR" className={texto.justificar ? 'text-justify [hyphens:auto]' : ''} style={{ marginTop: i ? pt(entrelinha) : undefined }}>
          {p}
        </p>
      ))}
    </div>
  );
}

const RUMO: Record<Lado, string> = { esquerda: 'to right', direita: 'to left', topo: 'to bottom', base: 'to top' };
const SOBRA: Record<Lado, string> = { esquerda: '--mx', direita: '--mx', topo: '--my', base: '--my' };

/**
 * A beira do desenho se desfaz no papel ao longo da sobra da tela naquele lado, até 64 px. Sem sobra
 * (a tela do tamanho da página) a máscara não apaga nada, e o desenho acaba no corte, como no book.
 */
function esfumado(lados?: Lado[]): React.CSSProperties | undefined {
  if (!lados?.length) return undefined;
  const camadas = lados.map((l) => `linear-gradient(${RUMO[l]}, transparent, #000 min(var(${SOBRA[l]}), 64px))`).join(', ');
  return { maskImage: camadas, WebkitMaskImage: camadas, maskComposite: 'intersect', WebkitMaskComposite: 'source-in' };
}

function CaixaDaImagem({ imagem, ativa, prioridade }: { imagem: ImagemDaTela; ativa: boolean; prioridade: boolean }) {
  const largura = Math.round(((imagem.caixa[2] - imagem.caixa[0]) / LARGURA) * 100);
  const conteudo = (
    <>
      <Foto imagem={imagem} ativa={ativa} sizes={`${Math.min(100, largura + 10)}vw`} prioridade={prioridade} />
      {imagem.filme && <Filme nome={imagem.filme} tamanho={largura > 55 ? '1080' : '720'} ativa={ativa} foco={imagem.foco} />}
    </>
  );
  if (imagem.recorte) {
    // a imagem do book passa por trás de uma máscara: só aparece o que cai dentro do recorte
    const [rx0, ry0, rx1, ry1] = imagem.recorte;
    const [x0, y0, x1, y1] = imagem.caixa;
    return (
      <div className="absolute overflow-hidden" style={posicao(imagem.recorte)}>
        <div className="absolute" style={{ left: `${((x0 - rx0) / (rx1 - rx0)) * 100}%`, top: `${((y0 - ry0) / (ry1 - ry0)) * 100}%`, width: `${((x1 - x0) / (rx1 - rx0)) * 100}%`, height: `${((y1 - y0) / (ry1 - ry0)) * 100}%` }}>
          {conteudo}
        </div>
      </div>
    );
  }
  return (
    <div className="absolute overflow-hidden" style={{ ...posicao(imagem.caixa, imagem.sangra), ...esfumado(imagem.esfuma) }}>
      {conteudo}
    </div>
  );
}

/** Masterplan: os números na imagem e a legenda acendem juntos, no toque ou no mouse */
function Masterplan({ emPe }: { emPe: boolean }) {
  const [ativo, setAtivo] = useState<number | null>(null);
  const tocar = (n: number) => ({
    onPointerEnter: (ev: React.PointerEvent) => ev.pointerType === 'mouse' && setAtivo(n),
    onPointerLeave: (ev: React.PointerEvent) => ev.pointerType === 'mouse' && setAtivo(null),
    onPointerDown: parar,
    onPointerUp: parar,
    // no mouse o passar por cima já acende: o clique só confirma, sem apagar
    onClick: () => setAtivo(n),
  });
  // no celular os números ficariam empilhados: viram pontos, e só o escolhido mostra o número
  const marcadores = EQUIPAMENTOS.map((e) => {
    const escolhido = ativo === e.n;
    return (
      <button
        key={e.n}
        type="button"
        aria-label={`${doze(e.n)}. ${e.nome}`}
        aria-pressed={escolhido}
        {...tocar(e.n)}
        className={`absolute flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full font-body tabular-nums shadow-sm transition-all duration-200 ${escolhido ? 'z-10 bg-[#d18455] text-white' : 'bg-white text-black'} ${escolhido && !emPe ? 'scale-150' : ''}`}
        style={
          emPe
            ? { left: `${((e.cx - 75.1) / 950.6) * 100}%`, top: `${((e.cy - 78) / 805.2) * 100}%`, width: escolhido ? 22 : 9, height: escolhido ? 22 : 9, fontSize: 9 }
            : { left: px(e.cx), top: py(e.cy), width: pt(13.3), height: pt(13.3), fontSize: pt(6.6) }
        }
      >
        {(!emPe || escolhido) && doze(e.n)}
      </button>
    );
  });
  const legenda = (
    <ol className="font-body" style={emPe ? { fontSize: 13, lineHeight: '22px' } : { fontSize: pt(9), lineHeight: pt(15) }}>
      {EQUIPAMENTOS.map((e) => (
        <li key={e.n} style={{ marginTop: e.n === 15 ? (emPe ? 12 : pt(15)) : undefined }}>
          <button type="button" {...tocar(e.n)} className="text-left" style={{ color: NAVY, textDecoration: ativo === e.n ? 'underline' : undefined, textDecorationColor: COBRE, textUnderlineOffset: 3 }}>
            <span style={{ color: COBRE }}>{doze(e.n)}.</span> {e.nome}
          </button>
        </li>
      ))}
      <li style={{ marginTop: emPe ? 10 : pt(40) }}>
        <ul>
          {CASA_CLUBE.map((item) => (
            <li key={item} style={{ color: NAVY, paddingLeft: emPe ? 14 : pt(17.4), textIndent: emPe ? -10 : pt(-6), lineHeight: emPe ? undefined : pt(14) }}>
              <span style={{ color: COBRE }}>•</span> {item}
            </li>
          ))}
        </ul>
      </li>
    </ol>
  );

  if (emPe) {
    return (
      <div className={`absolute inset-0 overflow-y-auto bg-cover pb-16 ${TOPO}`} style={{ backgroundColor: '#f7f5f2', backgroundImage: `url(${PASTA}/cartao.jpg)` }}>
        <div className="flex flex-col items-center px-6 pb-5 text-center">
          <Emblema largura="54px" className="mb-3" />
          <h2 className="font-heading text-[1.6rem] font-thin uppercase italic" style={{ color: NAVY }}>
            Masterplan
          </h2>
        </div>
        <div className="relative mx-4 aspect-[950.6/805.2]">
          <Image src={`${PASTA}/masterplan.jpg`} alt="Perspectiva ilustrada da implantação, com os equipamentos numerados" fill sizes="100vw" quality={75} className="object-cover" />
          {marcadores}
        </div>
        <p className="px-6 pt-3 text-center text-xs text-black/50">Toque num item para ver onde fica</p>
        <div className="px-6 pt-4">{legenda}</div>
      </div>
    );
  }
  return (
    <>
      {marcadores}
      <div className="absolute" style={{ left: px(1066.9), top: py(380.7), width: px(190) }}>
        {legenda}
      </div>
    </>
  );
}

/** Os 52 lotes da implantação, os mesmos do site: o toque mostra o número e a área */
function Implantacao({ dados, emPe }: { dados?: DadosDaImplantacao; emPe: boolean }) {
  const [lote, setLote] = useState<number | null>(null);
  const area = lote ? dados?.areas[lote] : null;
  const ficha = (
    <div className="flex min-h-[3.25rem] items-center justify-center gap-3 text-center font-body" style={{ color: NAVY }} aria-live="polite">
      {lote ? (
        <>
          <span className="font-heading text-[1.6em] font-thin italic">Lote {doze(lote)}</span>
          {area && <span className="text-[0.95em]">{area} m²</span>}
        </>
      ) : (
        <span className="text-[0.8em] text-black/55">Toque num lote para ver a área</span>
      )}
    </div>
  );
  const mapa = (
    <div onPointerDown={parar} onPointerUp={parar}>
      <MapaImplantacao contornos={dados?.contornos} pontos={[]} aoEscolherLote={setLote} loteEscolhido={lote} />
    </div>
  );

  if (emPe) {
    return (
      <div className={`absolute inset-0 flex flex-col justify-center overflow-hidden bg-cover px-4 pb-10 ${TOPO}`} style={{ backgroundColor: '#f7f5f2', backgroundImage: `url(${PASTA}/cartao.jpg)` }}>
        <div className="mb-4 flex flex-col items-center text-center">
          <Emblema largura="54px" className="mb-3" />
          <h2 className="font-heading text-[1.6rem] font-thin uppercase italic" style={{ color: NAVY }}>
            Implantação
          </h2>
        </div>
        {mapa}
        <div className="mt-3 text-base">{ficha}</div>
      </div>
    );
  }
  return (
    <>
      <div className="absolute" style={{ left: px(155), top: py(140), width: px(1051) }}>
        {mapa}
      </div>
      <div className="absolute" style={{ left: px(155), top: py(740), width: px(1051), fontSize: pt(15) }}>
        {ficha}
      </div>
    </>
  );
}

/** O marcador em triângulo cheio do book */
function Triangulo({ emPe }: { emPe: boolean }) {
  const lado = emPe ? '4px' : pt(2.6);
  return <span aria-hidden className="mr-[0.45em] inline-block align-middle" style={{ width: 0, height: 0, borderTop: `${lado} solid transparent`, borderBottom: `${lado} solid transparent`, borderLeft: `calc(${lado} * 1.5) solid #f5b075` }} />;
}

function ListaDeDiferenciais({ emPe }: { emPe: boolean }) {
  return (
    <>
      <ul style={emPe ? undefined : { position: 'absolute', left: px(983.9), top: py(348.8), width: px(320) }}>
        {DIFERENCIAIS.map((d, i) => (
          <li key={d} className="flex items-start font-body text-[#f9f2e2]" style={emPe ? { gap: 10, fontSize: 14, marginTop: i ? 12 : 0 } : { gap: pt(4.7), fontSize: pt(10), lineHeight: pt(14), height: pt(30.6) }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`${PASTA}/icones/diferencial-${doze(i + 1)}.png`} alt="" aria-hidden className="shrink-0 rounded-full" style={emPe ? { width: 22, height: 22 } : { width: pt(14), height: pt(14) }} />
            <span>{d}</span>
          </li>
        ))}
      </ul>
      <div className="font-body text-[#f9f2e2]" style={emPe ? { marginTop: 28, fontSize: 13 } : { position: 'absolute', left: px(983.9), top: py(696.2), width: px(215), fontSize: pt(9), lineHeight: pt(10.8) }}>
        <p style={{ marginBottom: emPe ? 10 : pt(10.8) }}>Infraestrutura</p>
        <ul>
          {INFRAESTRUTURA.map((item) => (
            <li key={item} style={emPe ? { marginTop: 6, lineHeight: 1.35 } : undefined}>
              <Triangulo emPe={emPe} />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

/**
 * Croqui: o nome de cada cidade com o fio até ela, e a península marcada. Em pontos do book,
 * ou relativo à caixa do croqui quando ele aparece sozinho no celular.
 */
function PinosDoMapa({ caixa }: { caixa?: Caixa }) {
  const [x0, y0, x1, y1] = caixa ?? [0, 0, LARGURA, ALTURA];
  const ex = (v: number) => `${((v - x0) / (x1 - x0)) * 100}%`;
  const ey = (v: number) => `${((v - y0) / (y1 - y0)) * 100}%`;
  const corpo = (v: number) => (caixa ? `calc(${v} * 100cqw / ${x1 - x0})` : pt(v));
  const fio = caixa ? '1px' : FIO;
  return (
    <div className="absolute inset-0 [container-type:inline-size]">
      {CIDADES.map((c) => (
        <div key={c.nome}>
          <p className="absolute -translate-x-1/2 whitespace-nowrap font-body font-bold text-white" style={{ left: ex(c.cx), top: ey(c.y), fontSize: corpo(12.7), textShadow: '0 0 2px #155648, 0 0 2px #155648, 0 0 3px #155648' }}>
            {c.nome}
          </p>
          <span className="absolute -translate-x-1/2 bg-white" style={{ left: ex(c.cx), top: ey(c.y + 24.6), height: `${((c.ponta - c.y - 24.6) / (y1 - y0)) * 100}%`, width: fio }} />
          <span className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full bg-white" style={{ left: ex(c.cx), top: ey(c.ponta), width: corpo(8), height: corpo(8) }} />
        </div>
      ))}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={`${PASTA}/logotipo-azul.svg`} alt="Villa Stradale Península" className="absolute -translate-x-1/2" style={{ left: ex(1025.5), top: ey(405), width: corpo(186) }} />
      <span className="absolute -translate-x-1/2 bg-white" style={{ left: ex(1032.9), top: ey(506), height: `${(68.4 / (y1 - y0)) * 100}%`, width: fio }} />
      <span className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full bg-white" style={{ left: ex(1032.9), top: ey(574.4), width: corpo(8), height: corpo(8) }} />
    </div>
  );
}

/**
 * Capa e contracapa: a página em pé do book, inteira, como o livro fechado. No celular a capa
 * ocupa a tela; a contracapa aparece inteira no pé, para as marcas e o aviso não perderem as pontas.
 */
function PaginaEmPe({ src, alt, emPe, prioridade, inteira = false }: { src: string; alt: string; emPe: boolean; prioridade: boolean; inteira?: boolean }) {
  return (
    <div className="absolute inset-0 overflow-hidden" style={{ backgroundColor: emPe ? (inteira ? '#14395e' : AZUL_LISO) : '#0d1f35' }}>
      {emPe && inteira ? (
        <>
          {/* o mesmo papel preenche o alto, e a página inteira entra por cima dele, sem emenda */}
          <Image src={src} alt="" aria-hidden fill sizes="100vw" quality={75} className="object-cover object-top" />
          <div className="absolute inset-x-0 bottom-0 aspect-[680/964] [mask-image:linear-gradient(to_bottom,transparent,#000_22%)]">
            <Image src={src} alt={alt} fill sizes="100vw" priority={prioridade} quality={90} className="object-cover" />
          </div>
        </>
      ) : (
        <div className={`absolute ${emPe ? 'inset-0' : 'inset-y-[4%] left-1/2 aspect-[680/964] -translate-x-1/2 shadow-[0_30px_80px_rgba(0,0,0,0.45)]'}`}>
          <Image src={src} alt={alt} fill sizes={emPe ? '100vw' : '50vw'} priority={prioridade} quality={90} className="object-cover" />
        </div>
      )}
    </div>
  );
}

const ALT_CONTRACAPA = `Contracapa: Bossa Nova Sotheby’s International Realty e Stradale. ${AVISO_LEGAL}`;

function Deitada({ tela, ativa, prioridade, implantacao }: { tela: Tela; ativa: boolean; prioridade: boolean; implantacao?: DadosDaImplantacao }) {
  if (tela.especial === 'capa') return <PaginaEmPe src={tela.imagens[0].src} alt={tela.imagens[0].alt} emPe={false} prioridade={prioridade} />;
  if (tela.especial === 'contracapa') return <PaginaEmPe src={`${PASTA}/contracapa.jpg`} alt={ALT_CONTRACAPA} emPe={false} prioridade={prioridade} />;
  const fixas = tela.imagens.filter((m) => m.fixa);
  const conteudo = tela.imagens.filter((m) => !m.fixa);
  return (
    <div className="absolute inset-0 overflow-hidden bg-cover bg-center" style={FUNDO[tela.fundo]}>
      <div className="absolute" style={{ left: 'var(--mx)', top: 'var(--my)', width: 'var(--fw)', height: 'var(--fh)' }}>
        {fixas.map((imagem, i) => (
          <CaixaDaImagem key={`${imagem.src}-${i}`} imagem={imagem} ativa={ativa} prioridade={false} />
        ))}
        <FormasDoPapel pagina={tela.pagina} />
        {conteudo.map((imagem, i) => (
          <CaixaDaImagem key={`${imagem.src}-${i}`} imagem={imagem} ativa={ativa} prioridade={prioridade && i === 0} />
        ))}

        {tela.retangulos?.map((r, i) => (
          <span key={i} aria-hidden className="absolute" style={{ ...posicao(r.caixa, r.beira), ...(r.contorno ? { border: `${FIO} solid ${r.cor}` } : { backgroundColor: r.cor }) }} />
        ))}

        {tela.linhas?.map((l, i) => <Linhas key={i} conjunto={l} />)}

        {tela.emblemaSolto && (
          <div className="absolute" style={{ left: px(tela.emblemaSolto[0]), top: py(tela.emblemaSolto[1]), width: px(tela.emblemaSolto[2] - tela.emblemaSolto[0]) }}>
            <Emblema largura="100%" />
          </div>
        )}

        {tela.marca && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={`${PASTA}/logotipo-azul.svg`} alt="Villa Stradale Península" className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: px(tela.marca.cx), top: py(tela.marca.cy), width: pt(tela.marca.largura) }} />
        )}

        {tela.titulo && (
          <div className="absolute -translate-x-1/2 text-center" style={{ left: px(tela.titulo.cx), top: `calc(${py(tela.titulo.y)} - ${pt(27)})` }}>
            {tela.titulo.emblema && (
              <div className="flex items-start justify-center" style={{ height: pt(27) }}>
                <Emblema largura={pt(64)} />
              </div>
            )}
            <h2
              className="whitespace-nowrap font-heading font-thin uppercase italic"
              style={{ fontSize: pt(tela.titulo.tamanho ?? 21), lineHeight: pt(25.2), color: tela.titulo.claro ? '#fff' : NAVY, textShadow: tela.titulo.claro ? '0 1px 18px rgba(0,0,0,.35)' : undefined }}
            >
              {tela.titulo.linhas.map((linha) => (
                <span key={linha} className="block">
                  {linha}
                </span>
              ))}
            </h2>
          </div>
        )}

        {tela.rotulo && (
          <p
            className="absolute -translate-x-1/2 whitespace-nowrap text-center font-body uppercase"
            style={{ left: px(tela.rotulo.cx), top: py(tela.rotulo.y), fontSize: pt(10), lineHeight: pt(14.7), letterSpacing: '0.3em', paddingLeft: '0.3em', color: tela.rotulo.claro ? '#fff' : '#142c47' }}
          >
            {[tela.rotulo.texto].flat().map((l) => (
              <span key={l} className="block">
                {l}
              </span>
            ))}
          </p>
        )}

        {tela.textos?.map((t, i) => <TextoDeitado key={i} texto={t} />)}

        {tela.especial === 'masterplan' && <Masterplan emPe={false} />}
        {tela.especial === 'implantacao' && <Implantacao dados={implantacao} emPe={false} />}
        {tela.especial === 'diferenciais' && <ListaDeDiferenciais emPe={false} />}
        {tela.especial === 'mapa' && <PinosDoMapa />}
      </div>
    </div>
  );
}

function BlocoDoTitulo({ tela }: { tela: Tela }) {
  if (!tela.titulo && !tela.rotulo) return null;
  const claro = tela.titulo?.claro;
  return (
    <div className="text-center">
      {tela.titulo?.emblema && (
        <div className="mb-3 flex justify-center">
          <Emblema largura="clamp(44px, 13vw, 64px)" />
        </div>
      )}
      {tela.titulo && (
        <h2
          className="font-heading text-[clamp(1.15rem,5.2vw,1.9rem)] font-thin uppercase italic leading-[1.18] [text-wrap:balance]"
          style={{ color: claro ? '#fff' : NAVY, textShadow: claro ? '0 1px 18px rgba(0,0,0,.35)' : undefined }}
        >
          {tela.titulo.linhas.map((linha) => (
            <span key={linha} className="block">
              {linha}
            </span>
          ))}
        </h2>
      )}
      {tela.rotulo && (
        <p className="mt-3 pl-[0.25em] font-body text-[clamp(.55rem,2.35vw,.75rem)] uppercase leading-relaxed tracking-[0.25em] [text-wrap:balance]" style={{ color: claro ? '#fff' : '#142c47' }}>
          {[tela.rotulo.texto].flat().map((l) => (
            <span key={l} className="block">
              {l}
            </span>
          ))}
        </p>
      )}
    </div>
  );
}

/** O texto do book no celular: na ordem do book, um embaixo do outro, no corpo de leitura do celular */
function TextosEmPe({ textos }: { textos: Texto[] }) {
  return (
    <div className="space-y-4">
      {textos
        .filter((t) => t.papel !== 'fora' && t.papel !== 'legenda')
        .map((t, i) => {
          const cor = t.cor ?? NAVY;
          const classe = `${FONTE[t.fonte ?? 'swiss']} ${t.caixaAlta ? 'uppercase' : ''}`;
          if (t.papel === 'titulo') {
            return (
              <div key={i} className={t.centro ? 'text-center' : ''}>
                {t.emblema && <Emblema largura="54px" className={`mb-3 ${t.centro ? 'mx-auto' : ''}`} />}
                <h2 className={`${classe} text-[clamp(1.25rem,5.6vw,1.8rem)] leading-tight [text-wrap:balance]`} style={{ color: cor, letterSpacing: t.espaco ? `${t.espaco}em` : undefined, paddingLeft: t.centro && t.espaco ? `${t.espaco}em` : undefined }}>
                  {t.linhas?.map((l) => (
                    <span key={l} className="block">
                      {l}
                    </span>
                  ))}
                </h2>
              </div>
            );
          }
          if (t.papel === 'rotulo') {
            return (
              <p key={i} className={`${classe} text-[0.72rem]`} style={{ color: cor, letterSpacing: `${Math.min(t.espaco ?? 0.3, 0.3)}em` }}>
                {t.linhas?.join(' ')}
              </p>
            );
          }
          if (t.papel === 'destaque') {
            return (
              <p key={i} className={`${classe} ${t.fonte === 'ivy' ? 'text-xl' : 'text-[15px] leading-relaxed'}`} style={{ color: cor }}>
                {t.linhas?.join(' ') ?? t.paragrafos?.join(' ')}
              </p>
            );
          }
          return (
            <div key={i} className="space-y-3 font-body text-[15px] leading-relaxed" style={{ color: cor }}>
              {t.paragrafos?.map((p, j) => <p key={j}>{p}</p>)}
            </div>
          );
        })}
    </div>
  );
}

/** A legenda pequena da foto, como no canto da foto do book */
function Legenda({ tela, className = '' }: { tela: Tela; className?: string }) {
  const legenda = tela.textos?.find((t) => t.papel === 'legenda');
  if (!legenda) return null;
  return <p className={`font-body text-[10px] text-white/85 [text-shadow:0_1px_6px_rgba(0,0,0,.45)] ${className}`}>{legenda.linhas?.join(' ')}</p>;
}

function EmPe({ tela, ativa, prioridade, implantacao }: { tela: Tela; ativa: boolean; prioridade: boolean; implantacao?: DadosDaImplantacao }) {
  const conteudo = tela.imagens.filter((m) => !m.fixa);
  const [principal, ...outras] = conteudo;
  const papel = tela.fundo !== 'foto' && tela.fundo !== 'azul';

  if (tela.especial === 'contracapa') return <PaginaEmPe src={`${PASTA}/contracapa.jpg`} alt={ALT_CONTRACAPA} emPe prioridade={prioridade} inteira />;
  if (tela.especial === 'masterplan') return <Masterplan emPe />;
  if (tela.especial === 'implantacao') return <Implantacao dados={implantacao} emPe />;

  if (tela.retrato === 'capa' || tela.retrato === 'foto') {
    return (
      <div className="absolute inset-0 overflow-hidden bg-navy">
        {principal && <Foto imagem={principal} ativa={ativa} sizes="100vw" prioridade={prioridade} emPe />}
        {principal?.filme && <Filme nome={principal.filme} tamanho="retrato" ativa={ativa} foco={principal.focoEmPe ?? principal.foco} />}
        {tela.titulo && (
          <>
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/45 to-transparent" />
            <div className="absolute inset-x-6 bottom-[max(4.5rem,calc(env(safe-area-inset-bottom)+3.5rem))]">
              <BlocoDoTitulo tela={tela} />
            </div>
          </>
        )}
        <Legenda tela={tela} className="absolute bottom-[max(1.2rem,env(safe-area-inset-bottom))] left-5" />
      </div>
    );
  }

  if (tela.retrato === 'marca') {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-cover bg-center" style={FUNDO[tela.fundo]}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`${PASTA}/logotipo-azul.svg`} alt="Villa Stradale Península" className="w-[52vw] max-w-[260px]" />
        <LinhasDoCelular />
      </div>
    );
  }

  // abertura de capítulo: o cartão creme com o título no meio e o desenho no pé
  if (tela.retrato === 'capitulo') {
    const desenho = tela.imagens.find((m) => m.recorte);
    return (
      <div className="absolute inset-0 overflow-hidden bg-cover bg-center" style={{ backgroundColor: '#f7f5f2', backgroundImage: `url(${PASTA}/cartao.jpg)` }}>
        <div className="absolute inset-x-0 top-[30%] px-6">
          <TextosEmPe textos={tela.textos ?? []} />
        </div>
        {desenho && (
          <div className="absolute inset-x-0 bottom-0 h-[46%]">
            <Image src={desenho.src} alt={desenho.alt} fill sizes="100vw" quality={75} className="object-cover object-bottom" />
          </div>
        )}
        <LinhasDoCelular />
      </div>
    );
  }

  if (tela.retrato === 'perspectiva' || tela.especial === 'mapa') {
    return (
      <div className={`absolute inset-0 flex flex-col justify-center ${TOPO} pb-12`} style={AZUL}>
        {principal && (
          <div className="relative w-full" style={{ aspectRatio: `${principal.caixa[2] - principal.caixa[0]} / ${principal.caixa[3] - principal.caixa[1]}` }}>
            <Foto imagem={principal} ativa={ativa} sizes="100vw" prioridade={prioridade} />
            {principal.filme && <Filme nome={principal.filme} tamanho="720" ativa={ativa} foco={principal.foco} />}
            {tela.especial === 'mapa' && <PinosDoMapa caixa={principal.caixa} />}
          </div>
        )}
        <Legenda tela={tela} className="mt-3 px-5" />
        {principal?.ampliavel && <p className="mt-6 text-center text-[11px] uppercase tracking-[0.3em] text-white/60">Toque em ampliar para ver de perto</p>}
      </div>
    );
  }

  if (tela.especial === 'diferenciais') {
    return (
      <div className="absolute inset-0 overflow-y-auto bg-[#002c58] pb-16">
        <div className="relative h-[34dvh] overflow-hidden bg-[#f9f3ee]">
          <Image src={tela.imagens[0].src} alt={tela.imagens[0].alt} fill sizes="100vw" quality={75} className="object-cover" style={{ objectPosition: '30% 60%' }} />
        </div>
        <div className="px-6 pt-7">
          <TextosEmPe textos={tela.textos ?? []} />
          <div className="mt-6">
            <ListaDeDiferenciais emPe />
          </div>
        </div>
      </div>
    );
  }

  if (tela.retrato === 'texto') {
    return (
      <div className={`absolute inset-0 overflow-y-auto bg-cover bg-center pb-16 ${TOPO}`} style={tela.fundo === 'azul' ? { backgroundColor: '#f7f5f2', backgroundImage: `url(${PASTA}/cartao.jpg)` } : FUNDO[tela.fundo]}>
        {principal && (
          <div className="relative mx-[5vw] h-[44dvh] overflow-hidden">
            <Foto imagem={principal} ativa={ativa} sizes="90vw" prioridade={prioridade} emPe />
            {principal.filme && <Filme nome={principal.filme} tamanho="720" ativa={ativa} foco={principal.focoEmPe ?? principal.foco} />}
            <Legenda tela={tela} className="absolute bottom-2 left-3" />
          </div>
        )}
        {outras.length > 0 && (
          <div className="mt-[3vw] grid grid-cols-3 gap-[2vw] px-[5vw]">
            {outras.map((imagem) => (
              <div key={imagem.src} className="relative aspect-[4/5] overflow-hidden">
                <Foto imagem={imagem} ativa={ativa} sizes="32vw" prioridade={false} emPe />
              </div>
            ))}
          </div>
        )}
        <div className="px-6 pt-7">
          <TextosEmPe textos={tela.textos ?? []} />
        </div>
      </div>
    );
  }

  if (tela.retrato === 'moldura') {
    // a foto inteira, como no book: um recorte em pé cortaria o assunto da cena
    return (
      <div className={`absolute inset-0 flex flex-col justify-center gap-9 bg-cover bg-center px-[5vw] pb-[max(3rem,env(safe-area-inset-bottom))] ${TOPO}`} style={FUNDO[tela.fundo]}>
        {principal && (
          <div className="relative w-full overflow-hidden" style={{ aspectRatio: `${principal.caixa[2] - principal.caixa[0]} / ${principal.caixa[3] - principal.caixa[1]}` }}>
            <Foto imagem={principal} ativa={ativa} sizes="92vw" prioridade={prioridade} />
            {principal.filme && <Filme nome={principal.filme} tamanho="720" ativa={ativa} foco={principal.foco} />}
          </div>
        )}
        <BlocoDoTitulo tela={tela} />
        {papel && <LinhasDoCelular />}
      </div>
    );
  }

  // mosaico: a foto principal no alto, as menores lado a lado, e o título no pé
  return (
    <div className="absolute inset-0 flex flex-col bg-cover bg-center pb-[max(2.5rem,env(safe-area-inset-bottom))]" style={FUNDO[tela.fundo]}>
      {principal && (
        <div className="relative min-h-0 flex-[1_1_52%] overflow-hidden">
          <Foto imagem={principal} ativa={ativa} sizes="100vw" prioridade={prioridade} emPe />
          {principal.filme && <Filme nome={principal.filme} tamanho="720" ativa={ativa} foco={principal.focoEmPe ?? principal.foco} />}
        </div>
      )}
      {outras.length > 0 && (
        <div className={`mt-[4vw] grid flex-[0_0_19%] gap-[3vw] px-[5vw] ${outras.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
          {outras.map((imagem) => (
            <div key={imagem.src} className="relative overflow-hidden">
              <Foto imagem={imagem} ativa={ativa} sizes={outras.length > 1 ? '46vw' : '90vw'} prioridade={false} emPe />
              {imagem.filme && <Filme nome={imagem.filme} tamanho="720" ativa={ativa} foco={imagem.focoEmPe ?? imagem.foco} />}
            </div>
          ))}
        </div>
      )}
      <div className="flex flex-[0_0_auto] items-center justify-center px-[6vw] pt-[7vw]">
        <BlocoDoTitulo tela={tela} />
      </div>
      {papel && <LinhasDoCelular />}
    </div>
  );
}

export function TelaDoBook({ tela, emPe, ativa, prioridade, implantacao }: { tela: Tela; emPe: boolean; ativa: boolean; prioridade: boolean; implantacao?: DadosDaImplantacao }) {
  return emPe ? <EmPe tela={tela} ativa={ativa} prioridade={prioridade} implantacao={implantacao} /> : <Deitada tela={tela} ativa={ativa} prioridade={prioridade} implantacao={implantacao} />;
}
