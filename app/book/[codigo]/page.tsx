import { cookies } from 'next/headers';
import { notFound, redirect } from 'next/navigation';
import { EntradaDoBook, LinkIndisponivel } from '@/components/apresentacao/entrada-do-book';
import { estadoDoAcesso, linkPeloCodigo, nomeDoCookie } from '@/lib/book-compartilhado';
import { consultaDoBook } from '@/lib/book-endereco';

export const dynamic = 'force-dynamic';

type Props = { params: Promise<{ codigo: string }>; searchParams: Promise<Record<string, string | string[] | undefined>> };

/**
 * A porta do book pelo link de um usuário: só a tela da senha. O book mora em /ver, que é outra
 * página: assim quem tem o link mas não a senha não recebe nem o JavaScript do leitor.
 */
export default async function EntradaPeloLink({ params, searchParams }: Props) {
  const [{ codigo }, busca] = await Promise.all([params, searchParams]);
  const achado = await linkPeloCodigo(codigo).catch(() => undefined);
  if (achado === undefined) return <LinkIndisponivel motivo="fora-do-ar" />;
  if (!achado) notFound();
  if (!achado.disponivel) return <LinkIndisponivel motivo="desligado" />;

  const estado = estadoDoAcesso((await cookies()).get(nomeDoCookie(codigo))?.value, achado.link);
  if (estado === 'valido') redirect(`/book/${codigo}/ver${consultaDoBook(busca)}`);

  return (
    <EntradaDoBook
      codigo={codigo}
      enviadoPor={achado.enviadoPor}
      consulta={consultaDoBook(busca)}
      aviso={busca.bloqueado ? 'cookies' : estado === 'antigo' ? 'expirou' : undefined}
    />
  );
}
