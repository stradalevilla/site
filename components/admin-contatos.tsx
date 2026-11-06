import { dataDoContato, resumoDaOrigem, type Contato } from '@/lib/contato';

export function TabelaDeContatos({ contatos }: { contatos: Contato[] }) {
  if (contatos.length === 0) {
    return <p className="mt-8 font-body text-sm text-gray-500">Nenhum contato ainda.</p>;
  }

  return (
    <div className="mt-6 overflow-x-auto rounded border border-neutral-200 bg-white">
      <table className="w-full min-w-[960px] text-left font-body text-sm text-navy">
        <thead className="border-b border-neutral-200 text-[11px] uppercase tracking-wider text-gray-500">
          <tr>
            {['Data e hora', 'Nome', 'E-mail', 'Telefone', 'Origem', 'Enviou em', 'Aparelho', 'Local'].map((titulo) => (
              <th key={titulo} scope="col" className="whitespace-nowrap px-4 py-3 font-medium">
                {titulo}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {contatos.map((c) => (
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
                {resumoDaOrigem(c)}
                {c.entrada && <span className="block text-xs text-gray-500">entrou em {c.entrada.split('?')[0]}</span>}
              </td>
              <td className="px-4 py-3">{c.pagina ?? '-'}</td>
              <td className="px-4 py-3">{c.dispositivo ?? '-'}</td>
              <td className="px-4 py-3">{[c.cidade, c.estado, c.pais].filter(Boolean).join(', ') || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
