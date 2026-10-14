'use client';

import { useEffect, useState } from 'react';
import { FundoCurvas } from '@/components/fundo-curvas';
import { CONFIG_PADRAO, type ConfigDoFundo } from '@/lib/curvas-de-nivel';

/**
 * Painel de calibragem do grafismo de fundo.
 *
 * O desenho aqui é o mesmo componente que o site usa, com a mesma calibragem,
 * então o que se vê neste quadro é o que vai para o ar. Salvar grava no banco
 * e vale para todo mundo que visitar o site, com até um minuto de atraso por
 * causa do cache.
 */

const CONTROLES: {
  campo: keyof ConfigDoFundo;
  nome: string;
  min: number;
  max: number;
  ajuda: string;
  formatar?: (v: number) => string;
}[] = [
  {
    campo: 'velocidade',
    nome: 'Velocidade',
    min: 0,
    max: 100,
    ajuda: 'Quão rápido o relevo se deforma. Em zero o desenho congela.',
  },
  {
    campo: 'escala',
    nome: 'Escala do relevo',
    min: 10,
    max: 100,
    ajuda: 'Tamanho dos morros. Quanto maior, mais aberto e calmo o desenho.',
  },
  {
    campo: 'linhas',
    nome: 'Linhas',
    min: 6,
    max: 40,
    ajuda: 'Em quantas alturas o terreno é fatiado. Mais linhas, mais denso.',
  },
  {
    campo: 'espessura',
    nome: 'Espessura',
    min: 4,
    max: 26,
    ajuda: 'Peso do traço, em décimos de pixel.',
    formatar: (v) => (v / 10).toFixed(1),
  },
  {
    campo: 'contraste',
    nome: 'Contraste da linha',
    min: 20,
    max: 220,
    ajuda: 'Presença da linha sobre o papel. Alto demais rouba o texto.',
  },
  {
    campo: 'detalhe',
    nome: 'Detalhe da malha',
    min: 4,
    max: 16,
    ajuda: 'Lado da célula em pixels. Menor é mais fiel e bem mais pesado.',
  },
];

export function PainelDoGrafismo() {
  const [cfg, setCfg] = useState<ConfigDoFundo>(CONFIG_PADRAO);
  const [salvo, setSalvo] = useState<ConfigDoFundo>(CONFIG_PADRAO);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [aviso, setAviso] = useState('');
  const [fps, setFps] = useState<number | null>(null);

  // o que está no ar manda na abertura
  useEffect(() => {
    let vivo = true;
    fetch('/api/admin/grafismo')
      .then((r) => r.json())
      .then((d) => {
        if (!vivo || !d?.ok) return;
        setCfg(d.config);
        setSalvo(d.config);
      })
      .catch(() => {
        /* sem banco: fica no padrão do código */
      })
      .finally(() => {
        if (vivo) setCarregando(false);
      });
    return () => {
      vivo = false;
    };
  }, []);

  const mudou = (Object.keys(cfg) as (keyof ConfigDoFundo)[]).some((k) => cfg[k] !== salvo[k]);

  async function salvar() {
    setSalvando(true);
    setAviso('');
    try {
      const r = await fetch('/api/admin/grafismo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ config: cfg }),
      });
      const d = await r.json();
      if (!d?.ok) throw new Error(d?.detalhe || d?.error || 'falha');
      setCfg(d.config);
      setSalvo(d.config);
      setAviso('Salvo. O site mostra a mudança em até um minuto.');
    } catch {
      setAviso('Não foi possível salvar. Confira se o banco está no ar.');
    }
    setSalvando(false);
  }

  // medidor de quadros: é ele que decide se a calibragem pode ir para o ar
  useEffect(() => {
    let pedido = 0;
    let marca = performance.now();
    let contados = 0;
    const laco = () => {
      contados++;
      const agora = performance.now();
      if (agora - marca >= 1000) {
        setFps(Math.round((contados * 1000) / (agora - marca)));
        contados = 0;
        marca = agora;
      }
      pedido = requestAnimationFrame(laco);
    };
    pedido = requestAnimationFrame(laco);
    return () => cancelAnimationFrame(pedido);
  }, []);

  function mudar(campo: keyof ConfigDoFundo, valor: number) {
    setCfg((antes) => ({ ...antes, [campo]: valor }));
  }

  return (
    <div className="p-8 md:p-10">
      <h1 className="font-heading text-2xl uppercase tracking-wide text-navy md:text-3xl">
        Grafismo de fundo
      </h1>
      <p className="mt-1 max-w-2xl font-body text-sm text-gray-500">
        As curvas de nível que ficam atrás de todo o site. O quadro abaixo é o
        desenho de verdade, com a mesma calibragem que vai para o ar.
      </p>

      {/* A prévia */}
      <div className="relative mt-8 h-[420px] overflow-hidden border border-gray-200">
        <FundoCurvas config={cfg} className="absolute inset-0 h-full w-full" aliviarNoCelular={false} />
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-3 px-6 text-center">
          <span className="font-body text-[11px] uppercase tracking-[0.3em] text-[#D07748]">
            Piracaia · São Paulo
          </span>
          <p className="font-heading text-2xl font-light uppercase italic leading-tight text-navy md:text-4xl">
            Água, terra e o melhor
            <br />
            da vida no interior paulista
          </p>
          <p className="max-w-md font-body text-sm leading-relaxed text-navy/70">
            Texto de prova, para ver se a linha em movimento atrapalha a leitura
            ou passa despercebida.
          </p>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-4">
        <span className="font-body text-xs tabular-nums text-gray-500">
          {fps === null ? 'medindo…' : `${fps} quadros por segundo`}
        </span>
        <span className="font-body text-xs text-gray-400">
          Abaixo de 50 a calibragem está pesada demais para o site.
        </span>
      </div>

      {/* Os controles */}
      <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {CONTROLES.map(({ campo, nome, min, max, ajuda, formatar }) => (
          <div key={campo} className="flex flex-col gap-2">
            <label
              htmlFor={`grafismo-${campo}`}
              className="flex items-baseline justify-between gap-3 font-body text-xs uppercase tracking-[0.18em] text-gray-500"
            >
              {nome}
              <b className="font-body text-sm font-normal tabular-nums text-[#D07748]">
                {formatar ? formatar(cfg[campo]) : cfg[campo]}
              </b>
            </label>
            <input
              id={`grafismo-${campo}`}
              type="range"
              min={min}
              max={max}
              value={cfg[campo]}
              onChange={(e) => mudar(campo, Number(e.target.value))}
              className="w-full accent-[#D07748]"
            />
            <span className="font-body text-xs leading-snug text-gray-400">{ajuda}</span>
          </div>
        ))}
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={salvar}
          disabled={salvando || carregando || !mudou}
          className="inline-flex min-h-[44px] items-center rounded-full bg-[#D07748] px-6 font-body text-xs uppercase tracking-[0.18em] text-white transition-opacity hover:opacity-90 disabled:opacity-40"
        >
          {salvando ? 'salvando…' : mudou ? 'Salvar para o site' : 'Salvo'}
        </button>

        <button
          type="button"
          onClick={() => setCfg(salvo)}
          disabled={!mudou}
          className="inline-flex min-h-[44px] items-center rounded-full border border-navy/30 px-5 font-body text-xs uppercase tracking-[0.18em] text-navy transition-colors hover:border-navy hover:bg-navy hover:text-white disabled:opacity-40"
        >
          Desfazer
        </button>

        <button
          type="button"
          onClick={() => setCfg(CONFIG_PADRAO)}
          className="inline-flex min-h-[44px] items-center font-body text-xs uppercase tracking-[0.18em] text-gray-500 underline-offset-4 transition-colors hover:text-navy hover:underline"
        >
          Voltar ao padrão de fábrica
        </button>

        {aviso && (
          <span className="font-body text-xs text-gray-500">{aviso}</span>
        )}
      </div>

      <p className="mt-4 max-w-2xl font-body text-xs leading-relaxed text-gray-400">
        Salvar grava a calibragem no banco e vale para todo mundo que visitar o
        site. A troca aparece em até um minuto, que é o tempo de cache das
        páginas. Se o banco estiver fora do ar, o site desenha com a calibragem
        de fábrica em vez de ficar sem fundo.
      </p>

    </div>
  );
}
