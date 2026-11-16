'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronRight, Info, Search } from 'lucide-react';
import { CAMPO, CARTAO } from '@/components/plataforma/estilos';
import { ExplicacaoDaOrigem, ICONE_DA_ORIGEM, ICONE_DE_TODOS, ICONE_SEM_ORIGEM, quantosContatos } from '@/components/plataforma/origens';
import { dataDoContato } from '@/lib/contato';
import { ROTULO_DA_ORIGEM, type Origem } from '@/lib/origem';

export type ContatoDaLista = {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  origem: Origem | null;
  criado_em: string;
};

const limpar = (texto: string) =>
  texto
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase();

export function ListaDeContatos({ contatos }: { contatos: ContatoDaLista[] }) {
  const router = useRouter();
  const [busca, setBusca] = useState('');
  const [origem, setOrigem] = useState<Origem | null>(null);
  const [explicando, setExplicando] = useState(false);

  const contagem = useMemo(() => {
    const total: Partial<Record<Origem, number>> = {};
    contatos.forEach((c) => c.origem && (total[c.origem] = (total[c.origem] ?? 0) + 1));
    return total;
  }, [contatos]);

  const origens = useMemo(() => (Object.keys(ROTULO_DA_ORIGEM) as Origem[]).filter((o) => contagem[o]), [contagem]);

  const filtrados = useMemo(() => {
    const termo = limpar(busca.trim());
    const digitos = busca.replace(/\D/g, '');
    return contatos.filter((c) => {
      if (origem && c.origem !== origem) return false;
      if (!termo) return true;
      return limpar(`${c.nome} ${c.email}`).includes(termo) || (digitos.length > 2 && c.telefone.replace(/\D/g, '').includes(digitos));
    });
  }, [contatos, busca, origem]);

  if (contatos.length === 0) {
    return <p className="pt-8 text-center text-base text-white/70">Nenhum contato ainda. Quem preencher o formulário do site aparece aqui.</p>;
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/50" aria-hidden />
        <input
          type="search"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Buscar por nome, e-mail ou telefone"
          aria-label="Buscar contato"
          className={`${CAMPO} pl-11`}
        />
      </div>

      {origens.length > 1 && (
        <div className="flex items-start gap-2">
          {/* todos os filtros à vista, quebrando linha quando não cabem; o "i" fica no canto oposto */}
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
                  className={`flex shrink-0 items-center gap-1.5 rounded-full border py-2 pl-3 pr-4 text-sm outline-none transition focus-visible:ring-2 focus-visible:ring-gold/60 ${
                    ativo ? 'border-gold bg-gold/15 text-gold' : 'border-white/15 text-white/80'
                  }`}
                >
                  <Icone size={16} strokeWidth={1.7} aria-hidden />
                  {o ? ROTULO_DA_ORIGEM[o] : 'Todos'}
                  <span className={ativo ? 'text-gold/70' : 'text-white/45'}>{o ? contagem[o] : contatos.length}</span>
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
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border outline-none transition focus-visible:ring-2 focus-visible:ring-gold/60 ${
              explicando ? 'border-gold bg-gold/15 text-gold' : 'border-white/15 text-white/80'
            }`}
          >
            <Info size={18} strokeWidth={1.7} aria-hidden />
          </button>
        </div>
      )}

      {explicando && <ExplicacaoDaOrigem origem={origem} contagem={contagem} fechar={() => setExplicando(false)} />}

      <p className="text-sm text-white/60">{quantosContatos(filtrados.length)}</p>

      <ul className="space-y-2">
        {filtrados.map((c) => {
          const Icone = c.origem ? (ICONE_DA_ORIGEM[c.origem] ?? ICONE_SEM_ORIGEM) : ICONE_SEM_ORIGEM;
          const rotulo = c.origem ? (ROTULO_DA_ORIGEM[c.origem] ?? c.origem) : 'Origem desconhecida';
          return (
            <li key={c.id}>
              {/* sem pré-busca de cada linha visível (cada uma ia ao servidor): ela começa quando o dedo encosta */}
              <Link
                href={`/contatos/${c.id}`}
                prefetch={false}
                onPointerDown={() => router.prefetch(`/contatos/${c.id}`)}
                className={`${CARTAO} flex items-center gap-3 p-4 transition active:bg-white/[0.12]`}
              >
                <span title={rotulo} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-gold">
                  <Icone size={20} strokeWidth={1.6} aria-hidden />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-base font-medium">{c.nome}</span>
                  <span className="mt-0.5 block truncate text-sm text-white/60">
                    {dataDoContato(c.criado_em)}
                    {c.origem ? ` · ${rotulo}` : ''}
                  </span>
                </span>
                <ChevronRight size={18} className="shrink-0 text-white/40" aria-hidden />
              </Link>
            </li>
          );
        })}
      </ul>

      {filtrados.length === 0 && <p className="pt-4 text-center text-base text-white/70">Nada encontrado.</p>}
    </div>
  );
}
