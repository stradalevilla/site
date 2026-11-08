import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { acessoValido, aparelhoDe, linkPeloCodigo, nomeDoCookie } from '@/lib/book-compartilhado';
import { TELAS } from '@/lib/book-digital-telas';
import { doProprioSite } from '@/lib/pedido';
import { criarSupabaseAdmin } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
const UM_DIA = 24 * 60 * 60;

/**
 * O andamento de quem abriu o book pelo link. O id da visita nasce no navegador: o primeiro
 * envio abre a visita, os seguintes só somam telas e tempo, e reenviar não duplica nada. Só vale
 * com o cookie da senha daquele link. O corpo vem como texto, porque o último envio sai quando
 * a página fecha.
 */
export async function POST(req: Request) {
  if (!doProprioSite(req)) return NextResponse.json({ ok: false }, { status: 403 });

  const corpo = await req
    .text()
    .then((t) => JSON.parse(t.slice(0, 4000)))
    .catch(() => null);
  const codigo = typeof corpo?.codigo === 'string' ? corpo.codigo : '';
  const id = typeof corpo?.id === 'string' ? corpo.id.toLowerCase() : '';
  if (!UUID.test(id)) return NextResponse.json({ ok: false }, { status: 400 });

  const achado = await linkPeloCodigo(codigo).catch(() => null);
  const guardado = (await cookies()).get(nomeDoCookie(codigo))?.value;
  if (!achado?.disponivel || !acessoValido(guardado, achado.link)) return NextResponse.json({ ok: false }, { status: 401 });

  const telas = Array.isArray(corpo.telas)
    ? [...new Set<number>(corpo.telas.filter((n: unknown): n is number => Number.isInteger(n) && (n as number) >= 0 && (n as number) < TELAS.length))]
    : [];
  const segundos = Number.isFinite(corpo.segundos) ? Math.max(0, Math.min(UM_DIA, Math.round(corpo.segundos))) : 0;

  const { data, error } = await criarSupabaseAdmin().rpc('registrar_visita_do_book', {
    visita: id,
    do_link: achado.link.id,
    no_aparelho: aparelhoDe(req.headers.get('user-agent') ?? '', Number(corpo.toques) || 0),
    vistas: telas,
    tempo: segundos,
  });
  if (error) return NextResponse.json({ ok: false }, { status: 503 });
  if (data === 'limite') return NextResponse.json({ ok: false }, { status: 429 });
  if (data === 'recusada') return NextResponse.json({ ok: false }, { status: 409 });
  return NextResponse.json({ ok: true });
}
