'use client';

import { useMemo, useState } from 'react';
import { Info } from 'lucide-react';
import { ExplicacaoDaOrigem, ICONE_DA_ORIGEM, ICONE_DE_TODOS, ICONE_SEM_ORIGEM, quantosContatos } from '@/components/plataforma/origens';
import { dataDoContato, resumoDaOrigem, situacaoNoCrm, type Contato } from '@/lib/contato';
import { ROTULO_DA_ORIGEM, type Origem } from '@/lib/origem';

const COLUNAS = ['Data e hora', 'Nome', 'E-mail', 'Telefone', 'Origem', 'CRM', 'Enviou em', 'Aparelho', 'Local'];

/**
 * Os contatos no painel do site, com os mesmos filtros e a mesma explicação das origens do
 * app: um desenho para cada origem e o "i" que conta, em palavras simples, o que ela quer dizer.
 */
export function TabelaDeContatos({ contatos }: { contatos: Contato[] }) {
  const [origem, setOrigem] = useState<Origem | null>(null);
  const [explicando, setExplicando] = useState(false);

  const contagem = useMemo(() => {
    const total: Partial<Record<Origem, number>> = {};
    contatos.forEach((c) => c.origem && (total[c.origem] = (total[c.origem] ?? 0) + 1));
    return total;
  }, [contatos]);
  const origens = useMemo(() => (Object.keys(ROTULO_DA_ORIGEM) as Origem[]).filter((o) => contagem[o]), [contagem]);
  const filtrados = useMemo(() => (origem ? contatos.filter((c) => c.origem === origem) : contatos), [contatos, origem]);

  return (
    <>
      {origens.length > 1 && (
        <div className="mt-6 flex items-start gap-3 font-body">
          <div className="flex min-w-0 flex-1 flex-wrap gap-2">
            {[null, ...origens].map((o) => {
              const Icone = o ? ICONE_DA_ORIGEM[o] : ICONE_DE_TODOS;
              const ativo = origem === o;
              return (
                <button
                  key={o ?? 'todos'}
                  type="button"
                  onClick={() => setOrigem(o)}
                  aria-pressed={ativo}
                  className={`flex items-center gap-1.5 rounded-full border py-1.5 pl-3 pr-4 text-sm outline-none transition focus-visible:ring-2 focus-visible:ring-[#D07748]/50 ${
                    ativo ? 'border-[#D07748] bg-[#D07748]/10 text-[#b9653a]' : 'border-neutral-300 bg-white text-navy/80 hover:bg-neutral-50'
                  }`}
                >
                  <Icone size={15} strokeWidth={1.7} aria-hidden />
                  {o ? ROTULO_DA_ORIGEM[o] : 'Todos'}
                  <span className={ativo ? 'text-[#b9653a]/70' : 'text-gray-400'}>{o ? contagem[o] : contatos.length}</span>
                </button>
              );
            })}
          </div>
          <button
            type="button"
            onClick={() => setExplicando((agora) => !agora)}
            aria-expanded={explicando}
            aria-controls="explicacao-da-origem"
            aria-label={origem ? `O que quer dizer ${ROTULO_DA_ORIGEM[origem]}` : 'O que quer dizer cada origem'}
            title="O que quer dizer cada origem"
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border outline-none transition focus-visible:ring-2 focus-visible:ring-[#D07748]/50 ${
              explicando ? 'border-[#D07748] bg-[#D07748]/10 text-[#b9653a]' : 'border-neutral-300 bg-white text-navy/70 hover:bg-neutral-50'
            }`}
          >
            <Info size={17} strokeWidth={1.7} aria-hidden />
          </button>
        </div>
      )}

      {explicando && (
        <div className="mt-4 max-w-4xl font-body">
          <ExplicacaoDaOrigem origem={origem} contagem={contagem} fechar={() => setExplicando(false)} tema="claro" />
        </div>
      )}

      {origem && <p className="mt-4 font-body text-sm text-gray-500">{quantosContatos(filtrados.length)}</p>}

      <div className="mt-6 overflow-x-auto rounded border border-neutral-200 bg-white">
        <table className="w-full min-w-[1080px] text-left font-body text-sm text-navy">
          <thead className="border-b border-neutral-200 text-[11px] uppercase tracking-wider text-gray-500">
            <tr>
              {COLUNAS.map((titulo) => (
                <th key={titulo} scope="col" className="whitespace-nowrap px-4 py-3 font-medium">
                  {titulo}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* Vazia, a tabela continua aparecendo: sem as colunas o painel parecia não ter tabela */}
            {filtrados.length === 0 && (
              <tr>
                <td colSpan={COLUNAS.length} className="px-4 py-10 text-center text-gray-500">
                  Nenhum contato ainda.
                </td>
              </tr>
            )}
            {filtrados.map((c) => {
              const Icone = c.origem ? (ICONE_DA_ORIGEM[c.origem] ?? ICONE_SEM_ORIGEM) : ICONE_SEM_ORIGEM;
              return (
                <tr key={c.id} className="border-b border-neutral-100 align-top last:border-0">
                  <td className="whitespace-nowrap px-4 py-3 tabular-nums">{dataDoContato(c.criado_em)}</td>
                  <td className="px-4 py-3 font-medium">{c.nome}</td>
                  <td className="px-4 py-3">
                    <a href={`mailto:${encodeURIComponent(c.email).replace('%40', '@')}`} className="underline-offset-2 hover:underline">
                      {c.email}
                    </a>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 tabular-nums">{c.telefone}</td>
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-1.5 font-medium">
                      <Icone size={15} strokeWidth={1.7} className="shrink-0 text-[#D07748]" aria-hidden />
                      {c.origem ? (ROTULO_DA_ORIGEM[c.origem] ?? c.origem) : '-'}
                    </span>
                    {c.origem !== 'direto' && <span className="block text-xs text-gray-500">{resumoDaOrigem(c)}</span>}
                    {c.entrada && <span className="block text-xs text-gray-500">entrou em {c.entrada.split('?')[0]}</span>}
                  </td>
                  <td className="px-4 py-3">{situacaoNoCrm(c)}</td>
                  <td className="px-4 py-3">{c.pagina ?? '-'}</td>
                  <td className="px-4 py-3">{c.dispositivo ?? '-'}</td>
                  <td className="px-4 py-3">{[c.cidade, c.estado, c.pais].filter(Boolean).join(', ') || '-'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
