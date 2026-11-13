import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { CompartilharBook, type AcessosDaEquipe } from '@/components/plataforma/compartilhar-book';
import { TelaInterna } from '@/components/plataforma/tela-interna';
import { usuarioLogado } from '@/lib/acesso';
import { enderecoDoLink, linkDoUsuario, type LinkDoBook, type VisitaDoBook } from '@/lib/book-compartilhado';
import { TELAS } from '@/lib/book-digital-telas';
import { criarSupabaseAdmin } from '@/lib/supabase/admin';
import { nomeDe, papelDe, situacaoDe } from '@/lib/usuarios';

export const metadata: Metadata = { title: 'Compartilhar o Book Digital' };
export const dynamic = 'force-dynamic';

const ULTIMAS = 50;

/** Os acessos de cada pessoa da equipe, para quem administra: só a contagem, não a senha. A conta é feita no banco. */
async function acessosDaEquipe(meu: string): Promise<AcessosDaEquipe> {
  const banco = criarSupabaseAdmin();
  const [{ data: links, error }, { data: resumo }, { data: pessoas }] = await Promise.all([
    banco.from('links_do_book').select('id, usuario, ativo'),
    banco.rpc('resumo_das_visitas_do_book'),
    banco.auth.admin.listUsers({ page: 1, perPage: 1000 }),
  ]);
  if (error) return null;
  const porLink = new Map(((resumo ?? []) as { link: string; acessos: number; ultimo: string }[]).map((r) => [r.link, r]));
  const contas = new Map((pessoas?.users ?? []).map((u) => [u.id, u]));
  return (links ?? [])
    .filter((l) => l.usuario !== meu)
    .map((l) => {
      const conta = l.usuario ? contas.get(l.usuario) : undefined;
      const r = porLink.get(l.id);
      return {
        id: l.id,
        nome: conta ? nomeDe(conta) || conta.email || 'Sem nome' : 'Usuário removido',
        // conta desativada ou apagada leva o link junto
        ativo: l.ativo && Boolean(conta) && situacaoDe(conta!) !== 'desativado',
        acessos: Number(r?.acessos ?? 0),
        ultimo: r?.ultimo ?? null,
      };
    })
    .sort((a, b) => (b.ultimo ?? '').localeCompare(a.ultimo ?? '') || a.nome.localeCompare(b.nome));
}

export default async function CompartilharBookPage() {
  const user = await usuarioLogado();
  if (!user) redirect('/entrar');

  // o link, as visitas dele e a lista da equipe saem juntos: as visitas vêm pelo dono do link
  const banco = criarSupabaseAdmin();
  const [achado, { data: visitas, count }, equipe] = await Promise.all([
    linkDoUsuario(user.id).catch(() => null),
    banco
      .from('visitas_do_book')
      .select('*, links_do_book!inner(usuario)', { count: 'exact' })
      .eq('links_do_book.usuario', user.id)
      .order('criado_em', { ascending: false })
      .limit(ULTIMAS),
    papelDe(user) === 'administrador' ? acessosDaEquipe(user.id) : Promise.resolve(null),
  ]);
  if (!achado) {
    return (
      <TelaInterna titulo="Compartilhar" voltar="/apresentacoes">
        <p className="pt-8 text-center text-base text-white/70">Não foi possível carregar. Tente de novo em instantes.</p>
      </TelaInterna>
    );
  }
  const link: LinkDoBook = achado;

  return (
    <TelaInterna titulo="Compartilhar" voltar="/apresentacoes">
      <CompartilharBook
        // depois de um router.refresh, a tela nasce de novo com a senha e o estado do banco
        key={`${link.senha}|${link.ativo}`}
        administrador={papelDe(user) === 'administrador'}
        endereco={enderecoDoLink(link.codigo, (await headers()).get('host') ?? '')}
        senhaInicial={link.senha}
        ativoInicial={link.ativo}
        visitas={(visitas ?? []) as VisitaDoBook[]}
        totalDeVisitas={count ?? 0}
        totalDeTelas={TELAS.length}
        equipe={equipe}
      />
    </TelaInterna>
  );
}
