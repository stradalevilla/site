import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { TabelaDeContatos } from '@/components/admin-contatos';
import { criarSupabaseAdmin } from '@/lib/supabase/admin';
import { criarSupabaseServidor } from '@/lib/supabase/server';
import type { Contato } from '@/lib/contato';

export const metadata: Metadata = { title: 'Contatos' };
export const dynamic = 'force-dynamic';

const LIMITE = 1000;

export default async function ContatosPage() {
  // O layout do painel não roda de novo ao trocar de página pelo menu. Como aqui
  // há dados pessoais e a leitura usa a chave de serviço, a página confere sozinha.
  const supabase = await criarSupabaseServidor();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/admin/login');

  const { data, count, error } = await criarSupabaseAdmin()
    .from('contatos')
    .select('*', { count: 'exact' })
    .order('criado_em', { ascending: false })
    .limit(LIMITE);

  return (
    <div className="p-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl uppercase tracking-wide text-navy">Contatos</h1>
          <p className="mt-1 font-body text-sm text-gray-500">
            {count === 1 ? '1 contato recebido pelo formulário do site' : `${count ?? 0} contatos recebidos pelo formulário do site`}
            {count && count > LIMITE ? `. Aqui aparecem os ${LIMITE} mais recentes, a planilha traz todos.` : ''}
          </p>
        </div>
        {/* A planilha é um download: um link comum basta */}
        <a
          href="/api/admin/contatos"
          className="rounded bg-navy px-4 py-2 font-body text-sm text-white transition-colors hover:bg-navy/90"
        >
          Baixar planilha
        </a>
      </div>

      {error ? (
        <p className="mt-8 font-body text-sm text-red-600">Não foi possível carregar os contatos.</p>
      ) : (
        <TabelaDeContatos contatos={(data ?? []) as Contato[]} />
      )}
    </div>
  );
}
