import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { ListaDeContatos, type ContatoDaLista } from '@/components/plataforma/lista-de-contatos';
import { TelaInterna } from '@/components/plataforma/tela-interna';
import { usuarioLogado } from '@/lib/acesso';
import { criarSupabaseAdmin } from '@/lib/supabase/admin';

export const metadata: Metadata = { title: 'Contatos' };
export const dynamic = 'force-dynamic';

const LIMITE = 1000;

export default async function ContatosPage() {
  // a tela usa a chave de serviço: confere a sessão por conta própria, sem depender do layout.
  // O login e a lista saem juntos, e nada é mostrado antes de o login ser conferido
  const [user, { data, error }] = await Promise.all([
    usuarioLogado(),
    criarSupabaseAdmin().from('contatos').select('id, nome, email, telefone, origem, criado_em').order('criado_em', { ascending: false }).limit(LIMITE),
  ]);
  if (!user) redirect('/entrar');

  return (
    <TelaInterna titulo="Contatos">
      {error ? (
        <p className="pt-8 text-center text-base text-white/70">Não foi possível carregar os contatos. Tente de novo em instantes.</p>
      ) : (
        <>
          <ListaDeContatos contatos={(data ?? []) as ContatoDaLista[]} />
          {data?.length === LIMITE && <p className="pt-6 text-center text-sm text-white/60">Mostrando os {LIMITE} contatos mais recentes. A lista completa está no painel do site.</p>}
        </>
      )}
    </TelaInterna>
  );
}
