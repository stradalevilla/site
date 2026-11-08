import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { BookCompartilhado } from '@/components/apresentacao/book-compartilhado';
import { acessoValido, linkPeloCodigo, nomeDoCookie } from '@/lib/book-compartilhado';
import { TELAS } from '@/lib/book-digital-telas';
import { consultaDoBook } from '@/lib/book-endereco';
import { getContornos } from '@/lib/getContornos';
import { lotesDisponiveis, lotesData } from '@/lib/lotes';
import { getLotesDb } from '@/lib/lotes-db';

export const dynamic = 'force-dynamic';

type Props = { params: Promise<{ codigo: string }>; searchParams: Promise<Record<string, string | string[] | undefined>> };

/** O book inteiro, só com o cookie da senha deste link. Sem ele, volta para a porta, que explica o motivo. */
export default async function BookPeloLink({ params, searchParams }: Props) {
  const [{ codigo }, busca] = await Promise.all([params, searchParams]);
  const achado = await linkPeloCodigo(codigo).catch(() => undefined);
  const guardado = (await cookies()).get(nomeDoCookie(codigo))?.value;
  if (!achado?.disponivel || !acessoValido(guardado, achado.link)) {
    // acabou de acertar a senha e o cookie não veio: o navegador está recusando cookies
    redirect(`/book/${codigo}${consultaDoBook(busca, busca.entrou && achado?.disponivel ? { bloqueado: '1' } : {})}`);
  }

  // o cookie chegou: a marca de quem acabou de digitar a senha sai do endereço
  if (busca.entrou) redirect(`/book/${codigo}/ver${consultaDoBook(busca)}`);

  // os mesmos 52 lotes e as mesmas áreas do site
  const [contornos, banco] = await Promise.all([getContornos(), getLotesDb().catch(() => new Map())]);
  const areas = Object.fromEntries(lotesDisponiveis.map((n) => [n, banco.get(n)?.area ?? lotesData[n]?.area ?? null]));

  return <BookCompartilhado codigo={codigo} telas={TELAS} implantacao={{ contornos, areas }} previa={busca.previa === '1'} />;
}
