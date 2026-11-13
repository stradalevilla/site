'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronRight, Search } from 'lucide-react';
import { CAMPO, CARTAO } from '@/components/plataforma/estilos';
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

  const origens = useMemo(
    () => (Object.keys(ROTULO_DA_ORIGEM) as Origem[]).filter((o) => contatos.some((c) => c.origem === o)),
    [contatos]
  );

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
        <div className="-mx-6 flex gap-2 overflow-x-auto px-6 pb-1 [scrollbar-width:none]">
          {[null, ...origens].map((o) => (
            <button
              key={o ?? 'todos'}
              type="button"
              onClick={() => setOrigem(o)}
              aria-pressed={origem === o}
              className={`shrink-0 rounded-full border px-4 py-2 text-sm transition ${
                origem === o ? 'border-gold bg-gold/15 text-gold' : 'border-white/15 text-white/80'
              }`}
            >
              {o ? ROTULO_DA_ORIGEM[o] : 'Todos'}
            </button>
          ))}
        </div>
      )}

      <p className="text-sm text-white/60">{filtrados.length === 1 ? '1 contato' : `${filtrados.length} contatos`}</p>

      <ul className="space-y-2">
        {filtrados.map((c) => (
          <li key={c.id}>
            {/* sem pré-busca de cada linha visível (cada uma ia ao servidor): ela começa quando o dedo encosta */}
            <Link
              href={`/contatos/${c.id}`}
              prefetch={false}
              onPointerDown={() => router.prefetch(`/contatos/${c.id}`)}
              className={`${CARTAO} flex items-center gap-3 p-4 transition active:bg-white/[0.12]`}
            >
              <span className="min-w-0 flex-1">
                <span className="block truncate text-base font-medium">{c.nome}</span>
                <span className="mt-0.5 block truncate text-sm text-white/60">
                  {dataDoContato(c.criado_em)}
                  {c.origem ? ` · ${ROTULO_DA_ORIGEM[c.origem] ?? c.origem}` : ''}
                </span>
              </span>
              <ChevronRight size={18} className="shrink-0 text-white/40" aria-hidden />
            </Link>
          </li>
        ))}
      </ul>

      {filtrados.length === 0 && <p className="pt-4 text-center text-base text-white/70">Nada encontrado.</p>}
    </div>
  );
}
