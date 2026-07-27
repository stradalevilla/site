'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ESTILO_PADRAO } from '@/components/lote-close';
import { CloseEditor, type OpContorno } from '@/components/close-editor';
import { janelasClose } from '@/lib/lote-close-config';
import type { EstiloLote, MedidaFace } from '@/lib/lotes';
import type { LoteContorno } from '@/lib/implantacao';

/** 'x,y x,y ...' -> pares, sem o ponto de fechamento repetido */
const parsePontos = (s: string): [number, number][] => {
  const pts = s.split(' ').map((p) => p.split(',').map(Number) as [number, number]);
  if (
    pts.length > 1 &&
    pts[0][0] === pts[pts.length - 1][0] &&
    pts[0][1] === pts[pts.length - 1][1]
  ) {
    pts.pop();
  }
  return pts;
};

/** centroide do polígono (posição do rótulo na home) */
const centroideDe = (pts: [number, number][]): [number, number] => {
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
  return [Math.round(cx / (3 * a2)), Math.round(cy / (3 * a2))];
};

type Item = { label: string; valor: string };

type Lote = {
  numero: number;
  area: string | null;
  parametros_itens: Item[] | null;
  medidas: MedidaFace[] | null;
  estilo: EstiloLote | null;
};

const pad = (n: number) => String(n).padStart(2, '0');

/** Campos técnicos padrão de todo lote, na ordem de exibição do site. */
const CAMPOS = [
  'Recuo frontal',
  'Recuos laterais',
  'Recuo de fundos',
  'Taxa de ocupação',
  'Coeficiente de aproveitamento',
  'Pavimentos',
  'Altura máxima',
  'Cota de implantação',
] as const;

/** Campos de texto longo: ocupam a largura toda, sem cortar */
const CAMPOS_LONGOS = new Set<string>(['Altura máxima', 'Cota de implantação']);

export default function LotesAdminPage() {
  const [lotes, setLotes] = useState<Lote[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [sel, setSel] = useState<number | null>(null);
  const [area, setArea] = useState('');
  const [valores, setValores] = useState<Record<string, string>>({});
  /** texto da medida, chaveado pela primeira aresta do trecho */
  const [textos, setTextos] = useState<Record<number, string>>({});
  /** aresta i presente = face i unida com a face i+1 (curvas em trecho único) */
  const [unioes, setUnioes] = useState<number[]>([]);
  const [estilo, setEstilo] = useState<EstiloLote>({});
  const [grupoFoco, setGrupoFoco] = useState<number[] | undefined>(undefined);
  /** face sendo arrastada no painel de camadas */
  const [dragFace, setDragFace] = useState<number | null>(null);
  const [alvoDrop, setAlvoDrop] = useState<string | null>(null);
  /** histórico do desfazer: fotos de {pontos, textos, uniões} antes de cada edição */
  const [historico, setHistorico] = useState<
    { pontos: [number, number][]; textos: Record<number, string>; unioes: number[] }[]
  >([]);
  /** marca a última digitação: dentro de um campo recém-digitado, o Ctrl+Z é do navegador */
  const digitouEm = useRef(0);
  const [contornos, setContornos] = useState<LoteContorno[]>([]);
  const [pontosEdit, setPontosEdit] = useState<[number, number][]>([]);
  const [pontosDe, setPontosDe] = useState<number | null>(null);
  const [salvando, setSalvando] = useState(false);
  const [msg, setMsg] = useState('');

  const carregar = async () => {
    setCarregando(true);
    const res = await fetch('/api/admin/lotes');
    const j = await res.json();
    if (j.ok) {
      setLotes(j.lotes);
      if (sel === null && j.lotes.length) selecionar(j.lotes[0]);
    }
    setCarregando(false);
  };

  const selecionar = (l: Lote) => {
    setSel(l.numero);
    setArea(l.area ?? '');
    const v: Record<string, string> = {};
    for (const campo of CAMPOS) {
      v[campo] = l.parametros_itens?.find((i) => i.label === campo)?.valor ?? '';
    }
    setValores(v);
    const t: Record<number, string> = {};
    const u: number[] = [];
    for (const md of l.medidas ?? []) {
      t[md.aresta] = md.texto;
      if (md.ate !== undefined && md.ate > md.aresta) {
        for (let i = md.aresta; i < md.ate; i++) u.push(i);
      }
    }
    setTextos(t);
    setUnioes(u);
    setEstilo(l.estilo ?? {});
    setGrupoFoco(undefined);
    setHistorico([]); // o desfazer não atravessa lotes
    setMsg('');
  };

  useEffect(() => {
    carregar();
    // contornos da implantação (para o editor do close e a lista de faces)
    fetch('/api/implantacao')
      .then((r) => r.json())
      .then((j) => j.ok && setContornos(j.contornos))
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // carrega o contorno editável quando muda o lote selecionado
  useEffect(() => {
    if (sel === null || pontosDe === sel) return;
    const c = contornos.find((x) => x.numero === sel);
    if (c) {
      setPontosEdit(parsePontos(c.pontos));
      setPontosDe(sel);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sel, contornos]);

  // edição do contorno: realinha textos e uniões quando insere/remove ponto
  const onContorno = (pts: [number, number][], op?: OpContorno) => {
    if (op) snapshot(); // inserir/remover entram no histórico (arrastos via onInicioArrasto)
    setPontosEdit(pts);
    if (!op) return;
    if (op.tipo === 'inserir') {
      // a face dividida vira duas, unidas: a medida dela passa a cobrir o trecho
      setTextos((t) => {
        const novo: Record<number, string> = {};
        for (const [k, v] of Object.entries(t)) {
          const a = Number(k);
          novo[a > op.idx ? a + 1 : a] = v;
        }
        return novo;
      });
      setUnioes((u) => [...u.map((x) => (x >= op.idx ? x + 1 : x)), op.idx]);
    } else {
      // faces idx-1 e idx se fundem
      setTextos((t) => {
        const novo: Record<number, string> = {};
        for (const [k, v] of Object.entries(t)) {
          const a = Number(k);
          if (a === op.idx) {
            if (novo[op.idx - 1] === undefined) novo[op.idx - 1] = v;
            continue;
          }
          novo[a > op.idx ? a - 1 : a] = v;
        }
        return novo;
      });
      setUnioes((u) =>
        u
          .filter((x) => x !== op.idx - 1)
          .map((x) => (x >= op.idx ? x - 1 : x))
          .filter((x, i, arr) => x >= 0 && arr.indexOf(x) === i)
      );
    }
  };

  // grupos de faces: [inicio, fim] derivados das uniões
  const gruposDe = (n: number): [number, number][] => {
    const grupos: [number, number][] = [];
    let i = 0;
    while (i < n) {
      let fim = i;
      while (unioes.includes(fim) && fim + 1 < n) fim++;
      grupos.push([i, fim]);
      i = fim + 1;
    }
    return grupos;
  };

  /** medidas no formato salvo/desenhado, a partir de textos + uniões */
  const montarMedidas = (): MedidaFace[] => {
    const n = pontosEdit.length;
    if (n < 3) return [];
    return gruposDe(n)
      .filter(([ini]) => textos[ini]?.trim())
      .map(([ini, fim]) => ({
        aresta: ini,
        ...(fim > ini ? { ate: fim } : {}),
        texto: textos[ini].trim(),
      }));
  };

  /** fotografa o estado atual do desenho antes de uma edição */
  const snapshot = () => {
    setHistorico((h) => [
      ...h.slice(-49),
      {
        pontos: pontosEdit.map((p) => [...p] as [number, number]),
        textos: { ...textos },
        unioes: [...unioes],
      },
    ]);
  };

  const desfazer = useCallback(() => {
    setHistorico((h) => {
      if (!h.length) return h;
      const ultimo = h[h.length - 1];
      setPontosEdit(ultimo.pontos);
      setTextos(ultimo.textos);
      setUnioes(ultimo.unioes);
      return h.slice(0, -1);
    });
  }, []);

  /**
   * Ctrl+Z desfaz a edição do desenho. Dentro de um campo de texto só cedemos
   * ao desfazer nativo se o usuário acabou de digitar ali; se ele apenas
   * clicou no campo (caso comum, já que clicar acende a face), o atalho
   * continua desfazendo o desenho.
   */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!(e.ctrlKey || e.metaKey) || e.key.toLowerCase() !== 'z') return;
      const alvo = e.target as HTMLElement | null;
      const emCampo =
        alvo?.tagName === 'INPUT' || alvo?.tagName === 'TEXTAREA' || alvo?.isContentEditable;
      if (emCampo && Date.now() - digitouEm.current < 3000) return;
      e.preventDefault();
      desfazer();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [desfazer]);

  /** grupo [ini,fim] que contém a face f */
  const grupoDaFace = (f: number): [number, number] => {
    let ini = f;
    while (ini > 0 && unioes.includes(ini - 1)) ini--;
    let fim = f;
    while (unioes.includes(fim) && fim + 1 < pontosEdit.length) fim++;
    return [ini, fim];
  };

  /** solta a face arrastada num grupo (só a vizinha de cima/baixo entra) */
  const soltarNoGrupo = (ini: number, fim: number) => {
    if (dragFace === null) return;
    if (dragFace >= ini && dragFace <= fim) return; // já está dentro
    if (dragFace === ini - 1 || dragFace === fim + 1) snapshot();
    if (dragFace === ini - 1) {
      // entra por cima: o nome do grupo migra para o novo início
      setTextos((t) => {
        const novo = { ...t };
        novo[ini - 1] = t[ini] ?? '';
        delete novo[ini];
        return novo;
      });
      setUnioes((u) => [...u, ini - 1]);
    } else if (dragFace === fim + 1) {
      // entra por baixo: o nome próprio da face se perde (vale o do grupo)
      setTextos((t) => {
        const novo = { ...t };
        delete novo[fim + 1];
        return novo;
      });
      setUnioes((u) => [...u, fim]);
    }
  };

  /** solta a face fora do grupo (só a primeira/última do grupo consegue sair) */
  const soltarFora = () => {
    if (dragFace === null) return;
    const [ini, fim] = grupoDaFace(dragFace);
    if (ini === fim) return; // já está solta
    if (dragFace === ini || dragFace === fim) snapshot();
    if (dragFace === ini) {
      // sai por cima: o nome do grupo migra para o novo início
      setTextos((t) => {
        const novo = { ...t };
        novo[ini + 1] = t[ini] ?? '';
        delete novo[ini];
        return novo;
      });
      setUnioes((u) => u.filter((x) => x !== ini));
    } else if (dragFace === fim) {
      setUnioes((u) => u.filter((x) => x !== fim - 1));
    }
  };

  /** face arrastada sobre outra face solta e vizinha: forma um grupo novo */
  const soltarNaFace = (j: number) => {
    if (dragFace === null || Math.abs(dragFace - j) !== 1) return;
    snapshot();
    const ini = Math.min(dragFace, j);
    setTextos((t) => {
      const novo = { ...t };
      novo[ini] = t[j] || t[dragFace] || '';
      delete novo[Math.max(dragFace, j)];
      return novo;
    });
    setUnioes((u) => [...u, ini]);
  };

  const salvar = async () => {
    if (sel === null) return;
    setSalvando(true);
    setMsg('');
    const itens: Item[] = CAMPOS.filter((c) => valores[c]?.trim()).map((c) => ({
      label: c,
      valor: valores[c].trim(),
    }));
    const medidasArr: MedidaFace[] = montarMedidas();
    const estiloLimpo = Object.fromEntries(
      Object.entries(estilo).filter(([, v]) => v !== undefined && v !== '')
    );
    const res = await fetch('/api/admin/lotes', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        numero: sel,
        area,
        parametros_itens: itens.length ? itens : null,
        medidas: medidasArr,
        estilo: Object.keys(estiloLimpo).length ? estiloLimpo : null,
      }),
    });
    const j = await res.json();

    // grava o contorno editado (mesma fonte da seção Implantação da home)
    let okContorno = true;
    if (pontosDe === sel && pontosEdit.length >= 3) {
      const atualizados = contornos.map((c) =>
        c.numero === sel
          ? {
              ...c,
              pontos: pontosEdit.map((p) => p.join(',')).join(' '),
              centroide: centroideDe(pontosEdit),
            }
          : c
      );
      const resC = await fetch('/api/implantacao', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contornos: atualizados }),
      });
      okContorno = (await resC.json()).ok === true;
      if (okContorno) setContornos(atualizados);
    }

    if (j.ok && okContorno) {
      setMsg(`Lote ${pad(sel)} salvo. O site reflete em até 1 minuto.`);
      // atualiza a lista local sem perder a seleção
      setLotes((ls) =>
        ls.map((l) =>
          l.numero === sel
            ? {
                ...l,
                area: area || null,
                parametros_itens: itens,
                medidas: medidasArr,
                estilo: Object.keys(estiloLimpo).length ? (estiloLimpo as EstiloLote) : null,
              }
            : l
        )
      );
    } else {
      setMsg(`Erro: ${j.ok ? 'falha ao salvar o contorno' : j.error}`);
    }
    setSalvando(false);
  };

  const lote = lotes.find((l) => l.numero === sel);
  const contorno = contornos.find((c) => c.numero === sel);
  const janela = sel !== null ? janelasClose[sel] : undefined;
  const pontosProntos = pontosDe === sel && pontosEdit.length >= 3;
  // quantidade de faces = pontos do contorno em edição
  const nFaces = pontosProntos ? pontosEdit.length : 0;

  return (
    <div className="flex h-full">
      {/* Coluna esquerda: cards pequenos dos lotes */}
      <aside className="w-52 shrink-0 overflow-y-auto border-r border-neutral-200 bg-white p-3">
        <p className="px-2 pb-2 font-body text-[10px] uppercase tracking-wide text-gray-400">
          Lotes
        </p>
        {carregando ? (
          <p className="px-2 font-body text-sm text-gray-400">carregando…</p>
        ) : (
          <div className="space-y-1">
            {lotes.map((l) => {
              const ativo = l.numero === sel;
              return (
                <button
                  key={l.numero}
                  onClick={() => selecionar(l)}
                  className={`block w-full rounded px-3 py-2 text-left transition-colors ${
                    ativo ? 'bg-navy text-white' : 'hover:bg-neutral-100'
                  }`}
                >
                  <span className={`font-heading text-sm uppercase tracking-wide ${ativo ? 'text-white' : 'text-navy'}`}>
                    Lote {pad(l.numero)}
                  </span>
                  <span className={`block font-body text-xs ${ativo ? 'text-white/70' : l.area ? 'text-gray-500' : 'text-gray-300'}`}>
                    {l.area ? `${l.area} m²` : 'sem área'}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </aside>

      {/* Coluna direita: edição completa do lote selecionado */}
      <div className="flex-1 overflow-y-auto p-8">
        {!lote ? (
          <p className="font-body text-sm text-gray-400">selecione um lote…</p>
        ) : (
          <div className="w-full">
            {/* Cabeçalho + salvar */}
            <div className="flex items-center justify-between gap-4">
              <h1 className="font-heading text-2xl uppercase tracking-wide text-navy md:text-3xl">
                Lote {pad(lote.numero)}
              </h1>
              <button
                onClick={salvar}
                disabled={salvando}
                className="rounded-sm bg-gold-dark px-5 py-2 font-body text-xs uppercase tracking-wide text-white hover:bg-navy disabled:opacity-50"
              >
                {salvando ? 'salvando…' : 'salvar'}
              </button>
            </div>
            {msg && <p className="mt-2 font-body text-sm text-navy">{msg}</p>}

            {/* Seção 1: informações técnicas */}
            <section className="mt-6 rounded-lg border border-neutral-200 bg-white p-6">
              <h2 className="font-body text-xs font-semibold uppercase tracking-wide text-gray-500">
                Informações técnicas
              </h2>

              <div className="mt-4 grid gap-x-6 gap-y-3 sm:grid-cols-2">
                <div>
                  <label className="font-body text-[10px] uppercase tracking-wide text-gray-400">
                    Área (m²)
                  </label>
                  <input
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    placeholder="ex.: 3.302,77"
                    className="mt-0.5 w-full rounded border border-navy/20 px-2 py-1.5 font-body text-sm outline-none focus:border-gold-dark"
                  />
                </div>
                <div aria-hidden className="hidden sm:block" />

                {CAMPOS.map((campo) => {
                  const longo = CAMPOS_LONGOS.has(campo);
                  return (
                    <div key={campo} className={longo ? 'sm:col-span-2' : ''}>
                      <label className="font-body text-[10px] uppercase tracking-wide text-gray-400">
                        {campo}
                      </label>
                      {longo ? (
                        <textarea
                          value={valores[campo] ?? ''}
                          onChange={(e) => setValores((v) => ({ ...v, [campo]: e.target.value }))}
                          rows={2}
                          className="mt-0.5 w-full resize-y rounded border border-navy/20 px-2 py-1.5 font-body text-sm leading-snug outline-none focus:border-gold-dark"
                        />
                      ) : (
                        <input
                          value={valores[campo] ?? ''}
                          onChange={(e) => setValores((v) => ({ ...v, [campo]: e.target.value }))}
                          className="mt-0.5 w-full rounded border border-navy/20 px-2 py-1.5 font-body text-sm outline-none focus:border-gold-dark"
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Seção 2: close do lote (metragem) — editor visual */}
            <section className="mt-4 rounded-lg border border-neutral-200 bg-white p-6">
              <h2 className="font-body text-xs font-semibold uppercase tracking-wide text-gray-500">
                Close do lote · Metragem do terreno
              </h2>

              {!janela || !contorno || !pontosProntos ? (
                <p className="mt-2 font-body text-sm text-gray-400">
                  {!janela || !contorno
                    ? 'Este lote ainda não tem o close dinâmico gerado.'
                    : 'carregando contorno…'}
                </p>
              ) : (
                <>
                  <div className="mt-1 flex flex-wrap items-center justify-between gap-2">
                    <p className="font-body text-[11px] text-gray-400">
                      arraste os cantos • clique numa face para inserir ponto • clique-direito
                      num canto para remover • o contorno é o mesmo da seção Implantação da home
                    </p>
                    <button
                      type="button"
                      onClick={desfazer}
                      disabled={!historico.length}
                      className="rounded border border-neutral-200 px-3 py-1 font-body text-xs text-gray-500 hover:bg-neutral-100 hover:text-navy disabled:opacity-40"
                    >
                      ↶ desfazer (Ctrl+Z)
                    </button>
                  </div>
                  <div className="mt-4 grid gap-6 xl:grid-cols-[1fr_300px]">
                    {/* Canvas de edição */}
                    <div className="overflow-hidden rounded border border-neutral-200">
                      <CloseEditor
                        numero={lote.numero}
                        area={area || undefined}
                        janela={janela}
                        estilo={estilo}
                        medidas={montarMedidas()}
                        pontos={pontosEdit}
                        onChange={onContorno}
                        onInicioArrasto={snapshot}
                        arestasDestacadas={grupoFoco}
                      />
                    </div>

                  {/* Controles */}
                  <div className="space-y-5">
                    <div>
                      <p className="font-body text-[10px] uppercase tracking-wide text-gray-400">
                        Medidas das faces
                      </p>
                      <p className="font-body text-[11px] text-gray-400">
                        arraste uma face para dentro de um grupo (ou sobre a vizinha) para
                        unir • arraste para fora para tirar • o nome do grupo é a medida
                      </p>
                      <div
                        className={`mt-2 space-y-1 rounded p-1 ${
                          dragFace !== null && alvoDrop === 'fora' ? 'bg-gold/10' : ''
                        }`}
                        onDragOver={(e) => {
                          e.preventDefault();
                          if (alvoDrop === null) setAlvoDrop('fora');
                        }}
                        onDragLeave={() => setAlvoDrop(null)}
                        onDrop={(e) => {
                          e.preventDefault();
                          if (alvoDrop === 'fora') soltarFora();
                          setAlvoDrop(null);
                          setDragFace(null);
                        }}
                      >
                        {gruposDe(nFaces).map(([ini, fim]) => {
                          const arestasDoGrupo = Array.from(
                            { length: fim - ini + 1 },
                            (_, k) => ini + k
                          );
                          const ehGrupo = fim > ini;
                          const idDrop = `g${ini}`;

                          const linhaFace = (f: number, dentro: boolean) => (
                            <div
                              key={f}
                              draggable
                              onDragStart={(e) => {
                                e.stopPropagation();
                                setDragFace(f);
                              }}
                              onDragEnd={() => {
                                setDragFace(null);
                                setAlvoDrop(null);
                              }}
                              onMouseEnter={() => setGrupoFoco([f])}
                              onMouseLeave={() => setGrupoFoco(undefined)}
                              className={`flex cursor-grab items-center gap-2 rounded px-2 py-1 font-body text-xs active:cursor-grabbing ${
                                dentro ? 'ml-5 text-gray-500' : 'text-gray-600'
                              } ${dragFace === f ? 'opacity-40' : 'hover:bg-neutral-100'}`}
                            >
                              <span aria-hidden className="tracking-tighter text-gray-300">
                                ⋮⋮
                              </span>
                              Face {f + 1}
                            </div>
                          );

                          if (!ehGrupo) {
                            // camada solta: nome = medida da própria face
                            const f = ini;
                            return (
                              <div
                                key={idDrop}
                                onDragOver={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  if (dragFace !== null && Math.abs(dragFace - f) === 1)
                                    setAlvoDrop(idDrop);
                                }}
                                onDrop={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  soltarNaFace(f);
                                  setAlvoDrop(null);
                                  setDragFace(null);
                                }}
                                className={`flex items-center gap-1.5 rounded border px-1 py-0.5 ${
                                  alvoDrop === idDrop
                                    ? 'border-gold-dark bg-gold/10'
                                    : 'border-transparent'
                                }`}
                              >
                                {linhaFace(f, false)}
                                <input
                                  value={textos[f] ?? ''}
                                  onChange={(e) => {
                                    digitouEm.current = Date.now();
                                    setTextos((t) => ({ ...t, [f]: e.target.value }));
                                  }}
                                  onFocus={() => setGrupoFoco([f])}
                                  onBlur={() => setGrupoFoco(undefined)}
                                  placeholder="medida (ex.: 43,31m)"
                                  className="w-full rounded border border-navy/20 px-2 py-1 font-body text-sm outline-none focus:border-gold-dark"
                                />
                              </div>
                            );
                          }

                          // grupo: pasta com nome = medida do trecho
                          return (
                            <div
                              key={idDrop}
                              onDragOver={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                if (
                                  dragFace !== null &&
                                  (dragFace === ini - 1 || dragFace === fim + 1)
                                )
                                  setAlvoDrop(idDrop);
                              }}
                              onDrop={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                soltarNoGrupo(ini, fim);
                                setAlvoDrop(null);
                                setDragFace(null);
                              }}
                              className={`rounded border bg-neutral-50 p-1.5 ${
                                alvoDrop === idDrop
                                  ? 'border-gold-dark bg-gold/10'
                                  : 'border-neutral-200'
                              }`}
                            >
                              <div className="flex items-center gap-1.5">
                                <span aria-hidden className="font-body text-xs text-gray-400">
                                  📁
                                </span>
                                <input
                                  value={textos[ini] ?? ''}
                                  onChange={(e) => {
                                    digitouEm.current = Date.now();
                                    setTextos((t) => ({ ...t, [ini]: e.target.value }));
                                  }}
                                  onFocus={() => setGrupoFoco(arestasDoGrupo)}
                                  onBlur={() => setGrupoFoco(undefined)}
                                  placeholder="medida do trecho"
                                  className="w-full rounded border border-navy/20 bg-white px-2 py-1 font-body text-sm outline-none focus:border-gold-dark"
                                />
                                <button
                                  type="button"
                                  title="desagrupar"
                                  onClick={() => {
                                    snapshot();
                                    setUnioes((u) => u.filter((x) => x < ini || x >= fim));
                                  }}
                                  className="shrink-0 rounded px-1.5 py-0.5 font-body text-[11px] text-gray-400 hover:bg-neutral-100 hover:text-navy"
                                >
                                  desagrupar
                                </button>
                              </div>
                              <div className="mt-1">
                                {arestasDoGrupo.map((f) => linhaFace(f, true))}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <p className="font-body text-[10px] uppercase tracking-wide text-gray-400">
                        Estilo da marcação
                      </p>
                      <div className="mt-2 space-y-2">
                        <label className="flex items-center justify-between gap-2 font-body text-xs text-gray-600">
                          Preenchimento (topo)
                          <input
                            type="color"
                            value={estilo.fillTopo ?? ESTILO_PADRAO.fillTopo}
                            onChange={(e) => setEstilo((s) => ({ ...s, fillTopo: e.target.value }))}
                            className="h-7 w-12 cursor-pointer rounded border border-navy/20"
                          />
                        </label>
                        <label className="flex items-center justify-between gap-2 font-body text-xs text-gray-600">
                          Preenchimento (base)
                          <input
                            type="color"
                            value={estilo.fillBase ?? ESTILO_PADRAO.fillBase}
                            onChange={(e) => setEstilo((s) => ({ ...s, fillBase: e.target.value }))}
                            className="h-7 w-12 cursor-pointer rounded border border-navy/20"
                          />
                        </label>
                        <label className="flex items-center justify-between gap-2 font-body text-xs text-gray-600">
                          Opacidade: {Math.round((estilo.fillOpacidade ?? ESTILO_PADRAO.fillOpacidade) * 100)}%
                          <input
                            type="range"
                            min={0.2}
                            max={1}
                            step={0.01}
                            value={estilo.fillOpacidade ?? ESTILO_PADRAO.fillOpacidade}
                            onChange={(e) =>
                              setEstilo((s) => ({ ...s, fillOpacidade: Number(e.target.value) }))
                            }
                            className="w-28"
                          />
                        </label>
                        <label className="flex items-center justify-between gap-2 font-body text-xs text-gray-600">
                          <span className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={!!estilo.contornoCor}
                              onChange={(e) =>
                                setEstilo((s) => ({
                                  ...s,
                                  contornoCor: e.target.checked ? '#ffffff' : '',
                                }))
                              }
                            />
                            Traço no contorno
                          </span>
                          {!!estilo.contornoCor && (
                            <input
                              type="color"
                              value={estilo.contornoCor}
                              onChange={(e) =>
                                setEstilo((s) => ({ ...s, contornoCor: e.target.value }))
                              }
                              className="h-7 w-12 cursor-pointer rounded border border-navy/20"
                            />
                          )}
                        </label>
                        <button
                          type="button"
                          onClick={() => setEstilo({})}
                          className="font-body text-[11px] text-gray-400 underline hover:text-navy"
                        >
                          voltar ao padrão (navy)
                        </button>
                      </div>
                    </div>
                  </div>
                  </div>
                </>
              )}
            </section>

            {/* Seção 3: área construtiva — editor visual na próxima etapa */}
            <section className="mt-4 rounded-lg border border-dashed border-neutral-300 bg-neutral-50 p-6">
              <h2 className="font-body text-xs font-semibold uppercase tracking-wide text-gray-400">
                Área construtiva
              </h2>
              <p className="mt-2 font-body text-sm text-gray-400">
                Desenho dos recuos e volumes sugeridos — em construção.
              </p>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
