'use client';

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, LayoutGrid, Maximize, Minimize, X, ZoomIn } from 'lucide-react';
import { Ampliacao } from '@/components/apresentacao/ampliacao';
import { TelaDoBook, type DadosDaImplantacao } from '@/components/apresentacao/tela-do-book';
import { ALTURA, capitulos, LARGURA, type Tela } from '@/lib/book-digital';

const SOME_EM_MS = 2800;

/** Mantém a tela acesa enquanto a apresentação está aberta: numa TV ou num notebook ligado nela, o descanso de tela cortaria a conversa */
function useTelaAcesa() {
  useEffect(() => {
    let trava: WakeLockSentinel | undefined;
    const pedir = () => {
      if (document.hidden) return;
      navigator.wakeLock
        ?.request('screen')
        .then((t) => (trava = t))
        .catch(() => {});
    };
    pedir();
    document.addEventListener('visibilitychange', pedir);
    return () => {
      document.removeEventListener('visibilitychange', pedir);
      trava?.release().catch(() => {});
    };
  }, []);
}

const doze = (n: number) => String(n).padStart(2, '0');

export function LeitorDoBook({
  telas,
  voltar,
  implantacao,
  aoMudarTela,
}: {
  telas: Tela[];
  voltar?: string;
  implantacao?: DadosDaImplantacao;
  /** Avisa a tela aberta: o link compartilhado conta quais telas o cliente viu */
  aoMudarTela?: (indice: number) => void;
}) {
  const raiz = useRef<HTMLDivElement>(null);
  const [emPe, setEmPe] = useState<boolean | null>(null);
  const [atual, setAtual] = useState(0);
  const [anterior, setAnterior] = useState<number | null>(null);
  const [controles, setControles] = useState(true);
  const [menu, setMenu] = useState(false);
  const [telaCheia, setTelaCheia] = useState(false);
  const [podeTelaCheia, setPodeTelaCheia] = useState(false);
  const [ampliada, setAmpliada] = useState(false);
  const esconder = useRef<ReturnType<typeof setTimeout>>(undefined);
  /** a tela pedida no endereço até ela abrir; -1 depois disso */
  const inicial = useRef<number | null>(null);
  const toque = useRef<{ x: number; y: number; t: number; tipo: string } | null>(null);
  const lista = capitulos(telas);
  const paraAmpliar = telas[atual].imagens.find((m) => m.ampliavel);
  const capitulo = lista.find((c) => atual >= c.inicio && atual <= c.fim);

  useTelaAcesa();

  // a página dupla do book cabe inteira na tela; o que sobra vira margem, que as fotos podem ocupar
  useLayoutEffect(() => {
    const el = raiz.current;
    if (!el) return;
    const medir = () => {
      const { width: w, height: h } = el.getBoundingClientRect();
      const fw = Math.min(w, (h * LARGURA) / ALTURA);
      const fh = (fw * ALTURA) / LARGURA;
      el.style.setProperty('--fw', `${fw}px`);
      el.style.setProperty('--fh', `${fh}px`);
      el.style.setProperty('--mx', `${(w - fw) / 2}px`);
      el.style.setProperty('--my', `${(h - fh) / 2}px`);
      setEmPe(w / h < 0.95);
    };
    medir();
    const observador = new ResizeObserver(medir);
    observador.observe(el);
    return () => observador.disconnect();
  }, []);

  // a tela aberta vai no endereço: dá para mandar o link de uma tela e voltar nela depois de recarregar
  useEffect(() => {
    const pedida = Number(new URLSearchParams(window.location.search).get('tela'));
    const valida = pedida >= 1 && pedida <= telas.length;
    inicial.current = valida ? pedida - 1 : 0;
    if (valida) setAtual(pedida - 1);
    setPodeTelaCheia(Boolean(document.fullscreenEnabled));
    const aoMudar = () => setTelaCheia(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', aoMudar);
    return () => document.removeEventListener('fullscreenchange', aoMudar);
  }, [telas.length]);

  // aberto direto numa tela do meio, a primeira não passou pela frente de ninguém: só avisa a pedida
  useEffect(() => {
    if (inicial.current === null || (inicial.current !== -1 && atual !== inicial.current)) return;
    inicial.current = -1;
    aoMudarTela?.(atual);
  }, [atual, aoMudarTela]);

  const ir = useCallback(
    (destino: number) => {
      const i = Math.max(0, Math.min(telas.length - 1, destino));
      setAtual((agora) => {
        if (i !== agora) setAnterior(agora);
        return i;
      });
      const url = new URL(window.location.href);
      url.searchParams.set('tela', String(i + 1));
      window.history.replaceState(null, '', url);
    },
    [telas.length]
  );

  const mostrarControles = useCallback(() => {
    setControles(true);
    clearTimeout(esconder.current);
    esconder.current = setTimeout(() => setControles(false), SOME_EM_MS);
  }, []);

  useEffect(() => {
    mostrarControles();
    return () => clearTimeout(esconder.current);
  }, [mostrarControles]);

  const alternarTelaCheia = useCallback(() => {
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    else raiz.current?.requestFullscreen().catch(() => {});
  }, []);

  useEffect(() => {
    const tecla = (e: KeyboardEvent) => {
      if (e.altKey || e.ctrlKey || e.metaKey) return;
      if (ampliada) return;
      if (menu) {
        if (e.key === 'Escape') setMenu(false);
        return;
      }
      const avancar = ['ArrowRight', 'ArrowDown', 'PageDown', ' '];
      const recuar = ['ArrowLeft', 'ArrowUp', 'PageUp'];
      if (avancar.includes(e.key)) ir(atual + 1);
      else if (recuar.includes(e.key)) ir(atual - 1);
      else if (e.key === 'Home') ir(0);
      else if (e.key === 'End') ir(telas.length - 1);
      else if (e.key === 'f' || e.key === 'F') alternarTelaCheia();
      else if ((e.key === 'z' || e.key === 'Z') && paraAmpliar) setAmpliada(true);
      else if (e.key === 'Enter' || e.key === 'm' || e.key === 'M') setMenu(true);
      else return;
      e.preventDefault();
      mostrarControles();
    };
    window.addEventListener('keydown', tecla);
    return () => window.removeEventListener('keydown', tecla);
  }, [atual, menu, ampliada, paraAmpliar, ir, telas.length, alternarTelaCheia, mostrarControles]);

  // arrastar troca de tela; toque curto mostra ou esconde os controles; clique do mouse avança ou volta
  const aoApertar = (e: React.PointerEvent) => {
    toque.current = { x: e.clientX, y: e.clientY, t: Date.now(), tipo: e.pointerType };
  };
  const aoSoltar = (e: React.PointerEvent) => {
    const inicio = toque.current;
    toque.current = null;
    if (!inicio || menu || ampliada) return;
    const dx = e.clientX - inicio.x;
    const dy = e.clientY - inicio.y;
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.2) {
      ir(atual + (dx < 0 ? 1 : -1));
      return;
    }
    if (Math.abs(dx) > 10 || Math.abs(dy) > 10 || Date.now() - inicio.t > 600) return;
    if (inicio.tipo === 'mouse') {
      const largura = raiz.current?.clientWidth ?? 1;
      ir(atual + (e.clientX < largura / 3 ? -1 : 1));
      mostrarControles();
    } else if (controles) {
      setControles(false);
      clearTimeout(esconder.current);
    } else mostrarControles();
  };

  const naTela = [atual - 1, atual, atual + 1, anterior].filter((i, pos, todos): i is number => i !== null && i >= 0 && i < telas.length && todos.indexOf(i) === pos);
  const visiveis = controles || menu;
  const parar = (e: React.PointerEvent | React.MouseEvent) => e.stopPropagation();

  return (
    <div
      ref={raiz}
      className="fixed inset-0 z-50 touch-pan-y select-none overflow-hidden bg-navy text-white"
      style={{ cursor: visiveis ? 'default' : 'none' }}
      onPointerDown={aoApertar}
      onPointerUp={aoSoltar}
      onPointerMove={(e) => e.pointerType === 'mouse' && mostrarControles()}
      role="region"
      aria-roledescription="apresentação"
      aria-label="Book Digital Villa Stradale"
    >
      {emPe !== null &&
        naTela.map((i) => (
          <section
            key={i}
            aria-roledescription="tela"
            aria-label={`${i + 1} de ${telas.length}`}
            aria-hidden={i !== atual}
            className={`absolute inset-0 transition-opacity duration-700 ease-out ${i === atual ? 'z-10 opacity-100' : 'z-0 opacity-0'}`}
            onTransitionEnd={() => i === anterior && setAnterior(null)}
          >
            <TelaDoBook tela={telas[i]} emPe={emPe} ativa={i === atual} prioridade={i === atual} implantacao={implantacao} />
          </section>
        ))}

      <p className="sr-only" aria-live="polite">
        Tela {atual + 1} de {telas.length}
        {telas[atual].titulo ? `: ${telas[atual].titulo!.linhas.join(' ')}` : ''}
      </p>

      {/* controles: somem sozinhos, voltam ao mexer o mouse, tocar ou usar o controle */}
      <div className={`pointer-events-none absolute inset-0 z-20 transition-opacity duration-500 ${visiveis ? 'opacity-100' : 'opacity-0'}`}>
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/30 to-transparent" />
        <div className="absolute inset-x-0 top-0 flex items-center gap-2 px-3 pt-[max(0.75rem,env(safe-area-inset-top))] md:px-6">
          {voltar ? (
            <Link href={voltar} aria-label="Fechar a apresentação" onPointerDown={parar} onPointerUp={parar} className={`pointer-events-auto flex h-11 w-11 items-center justify-center rounded-full bg-black/25 backdrop-blur-sm ${visiveis ? '' : 'invisible'}`}>
              <X size={20} aria-hidden />
            </Link>
          ) : (
            <span className="w-11" />
          )}
          <p className="min-w-0 flex-1 truncate text-center text-[11px] uppercase tracking-[0.3em] text-white/90">{capitulo?.nome}</p>
          <span className="text-xs tabular-nums text-white/80">
            {doze(atual + 1)} / {doze(telas.length)}
          </span>
          {paraAmpliar && (
            <button type="button" aria-label="Ampliar a imagem" onPointerDown={parar} onPointerUp={parar} onClick={() => setAmpliada(true)} className={`pointer-events-auto flex h-11 w-11 items-center justify-center rounded-full bg-black/25 backdrop-blur-sm ${visiveis ? '' : 'invisible'}`}>
              <ZoomIn size={19} aria-hidden />
            </button>
          )}
          <button type="button" aria-label="Todas as telas" onPointerDown={parar} onPointerUp={parar} onClick={() => setMenu(true)} className={`pointer-events-auto flex h-11 w-11 items-center justify-center rounded-full bg-black/25 backdrop-blur-sm ${visiveis ? '' : 'invisible'}`}>
            <LayoutGrid size={19} aria-hidden />
          </button>
          {podeTelaCheia && (
            <button type="button" aria-label={telaCheia ? 'Sair da tela cheia' : 'Tela cheia'} onPointerDown={parar} onPointerUp={parar} onClick={alternarTelaCheia} className={`pointer-events-auto hidden h-11 w-11 items-center justify-center rounded-full bg-black/25 backdrop-blur-sm md:flex ${visiveis ? '' : 'invisible'}`}>
              {telaCheia ? <Minimize size={19} aria-hidden /> : <Maximize size={19} aria-hidden />}
            </button>
          )}
        </div>

        {/* as setas ficam no meio da sobra ao lado da página, longe das linhas e fotos que encostam na beira */}
        <button type="button" aria-label="Tela anterior" disabled={atual === 0} onPointerDown={parar} onPointerUp={parar} onClick={() => ir(atual - 1)} style={{ left: 'max(1rem, calc(var(--mx) / 2 - 1.75rem))' }} className={`pointer-events-auto absolute top-1/2 hidden h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full bg-black/25 backdrop-blur-sm transition disabled:opacity-0 md:flex ${visiveis ? '' : 'invisible'}`}>
          <ChevronLeft size={26} aria-hidden />
        </button>
        <button type="button" aria-label="Próxima tela" disabled={atual === telas.length - 1} onPointerDown={parar} onPointerUp={parar} onClick={() => ir(atual + 1)} style={{ right: 'max(1rem, calc(var(--mx) / 2 - 1.75rem))' }} className={`pointer-events-auto absolute top-1/2 hidden h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full bg-black/25 backdrop-blur-sm transition disabled:opacity-0 md:flex ${visiveis ? '' : 'invisible'}`}>
          <ChevronRight size={26} aria-hidden />
        </button>
      </div>

      {/* o andamento fica sempre: uma linha fina em cobre no pé */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-[3px] bg-white/15" aria-hidden>
        <div className="h-full bg-[#d18455] transition-[width] duration-500" style={{ width: `${((atual + 1) / telas.length) * 100}%` }} />
      </div>

      {ampliada && paraAmpliar && <Ampliacao src={paraAmpliar.src} alt={paraAmpliar.alt} fechar={() => setAmpliada(false)} />}

      {menu && (
        <div
          className="absolute inset-0 z-30 overflow-y-auto bg-navy/95 px-5 pb-[max(2rem,env(safe-area-inset-bottom))] pt-[max(1rem,env(safe-area-inset-top))] backdrop-blur-md md:px-10"
          onPointerDown={parar}
          onPointerUp={parar}
          role="dialog"
          aria-modal="true"
          aria-label="Todas as telas"
        >
          <div className="sticky top-0 z-10 -mx-5 flex items-center justify-between bg-navy/95 px-5 py-3 md:-mx-10 md:px-10">
            <p className="font-heading text-2xl italic">Book Digital</p>
            <button type="button" aria-label="Fechar" onClick={() => setMenu(false)} className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10" autoFocus>
              <X size={20} aria-hidden />
            </button>
          </div>
          {lista.map((c) => (
            <section key={c.nome} className="mt-6">
              <h3 className="mb-3 text-[11px] uppercase tracking-[0.3em] text-white/70">{c.nome}</h3>
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-6">
                {telas.slice(c.inicio, c.fim + 1).map((t, j) => {
                  const i = c.inicio + j;
                  const capa = t.imagens.find((m) => !m.fixa) ?? t.imagens.find((m) => m.recorte);
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => {
                        ir(i);
                        setMenu(false);
                      }}
                      aria-label={`Ir para a tela ${i + 1}`}
                      aria-current={i === atual}
                      className={`relative aspect-[1361/964] overflow-hidden rounded-md bg-[#f9f1e1] ring-offset-2 ring-offset-navy ${i === atual ? 'ring-2 ring-[#d18455]' : ''}`}
                    >
                      {capa ? (
                        <Image src={capa.src} alt="" fill sizes="(min-width: 1024px) 16vw, 33vw" quality={75} className="object-cover" style={{ objectPosition: capa.foco }} />
                      ) : (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src="/midia/book-digital/logotipo-azul.svg" alt="" className="absolute left-1/2 top-1/2 w-1/2 -translate-x-1/2 -translate-y-1/2" />
                      )}
                      <span className="absolute bottom-1 left-1.5 text-[10px] tabular-nums text-white drop-shadow">{doze(i + 1)}</span>
                    </button>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
