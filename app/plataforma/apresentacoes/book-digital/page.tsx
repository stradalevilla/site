import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { LeitorDoBook } from '@/components/apresentacao/leitor-do-book';
import { usuarioLogado } from '@/lib/acesso';
import { TELAS } from '@/lib/book-digital-telas';
import { preCarregarCapa } from '@/lib/book-preload';
import { getContornos } from '@/lib/getContornos';
import { lotesDisponiveis, lotesData } from '@/lib/lotes';
import { getLotesDb } from '@/lib/lotes-db';

export const metadata: Metadata = { title: 'Book Digital' };
export const dynamic = 'force-dynamic';

export default async function BookDigitalPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  preCarregarCapa(TELAS, (await searchParams).tela);
  // os mesmos 52 lotes e as mesmas áreas do site: o que o painel mudar aparece aqui também.
  // Saem junto com o login, e nada é mostrado antes de o login ser conferido
  const [user, contornos, banco] = await Promise.all([usuarioLogado(), getContornos(), getLotesDb().catch(() => new Map())]);
  if (!user) redirect('/entrar');
  const areas = Object.fromEntries(lotesDisponiveis.map((n) => [n, banco.get(n)?.area ?? lotesData[n]?.area ?? null]));

  return <LeitorDoBook telas={TELAS} voltar="/apresentacoes" implantacao={{ contornos, areas }} />;
}
