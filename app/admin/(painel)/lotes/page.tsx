'use client';

import { useEffect, useState } from 'react';

type Item = { label: string; valor: string };

type Lote = {
  numero: number;
  area: string | null;
  parametros_itens: Item[] | null;
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
    setMsg('');
  };

  useEffect(() => {
    carregar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const salvar = async () => {
    if (sel === null) return;
    setSalvando(true);
    setMsg('');
    const itens: Item[] = CAMPOS.filter((c) => valores[c]?.trim()).map((c) => ({
      label: c,
      valor: valores[c].trim(),
    }));
    const res = await fetch('/api/admin/lotes', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ numero: sel, area, parametros_itens: itens.length ? itens : null }),
    });
    const j = await res.json();
    if (j.ok) {
      setMsg(`Lote ${pad(sel)} salvo. O site reflete em até 1 minuto.`);
      // atualiza a lista local sem perder a seleção
      setLotes((ls) =>
        ls.map((l) =>
          l.numero === sel ? { ...l, area: area || null, parametros_itens: itens } : l
        )
      );
    } else {
      setMsg(`Erro: ${j.error}`);
    }
    setSalvando(false);
  };

  const lote = lotes.find((l) => l.numero === sel);

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
          <div className="max-w-3xl">
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

            {/* Seção 2: close do lote (metragem) — editor visual na próxima etapa */}
            <section className="mt-4 rounded-lg border border-dashed border-neutral-300 bg-neutral-50 p-6">
              <h2 className="font-body text-xs font-semibold uppercase tracking-wide text-gray-400">
                Close do lote · Metragem do terreno
              </h2>
              <p className="mt-2 font-body text-sm text-gray-400">
                Editor visual do contorno, medidas das faces e selo do lote — em construção
                (protótipo no lote 39).
              </p>
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
