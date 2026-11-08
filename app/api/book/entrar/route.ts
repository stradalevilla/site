import { NextResponse } from 'next/server';
import { cookieDeAcesso, DIAS_DE_ACESSO, linkPeloCodigo, nomeDoCookie, senhaConfere } from '@/lib/book-compartilhado';
import { doProprioSite } from '@/lib/pedido';
import { devolverTentativa, esquecerTentativas, reservarTentativa } from '@/lib/tentativas';

export const dynamic = 'force-dynamic';

/**
 * A senha do link do Book Digital. Certa, o cliente ganha o cookie daquele link. O limite de
 * tentativas é o mesmo do login do app, contado por link e por endereço de rede: quem tenta
 * adivinhar a senha de um link não tranca os clientes dos outros.
 */
export async function POST(req: Request) {
  if (!doProprioSite(req)) {
    return NextResponse.json({ ok: false, error: 'origem invalida' }, { status: 403 });
  }

  const corpo = await req.json().catch(() => null);
  const codigo = typeof corpo?.codigo === 'string' ? corpo.codigo : '';
  const senha = typeof corpo?.senha === 'string' ? corpo.senha.slice(0, 200) : '';
  if (!senha.trim()) {
    return NextResponse.json({ ok: false, error: 'Digite a senha.' }, { status: 400 });
  }

  const tentativa = await reservarTentativa(req, `book:${codigo}`, 'book:');
  if (!tentativa.liberada) {
    return NextResponse.json({ ok: false, error: 'Muitas tentativas. Aguarde alguns minutos e tente de novo.' }, { status: 429 });
  }

  let achado: Awaited<ReturnType<typeof linkPeloCodigo>>;
  try {
    achado = await linkPeloCodigo(codigo);
  } catch {
    await devolverTentativa(tentativa);
    return NextResponse.json({ ok: false, error: 'Não foi possível conferir a senha. Tente de novo em instantes.' }, { status: 503 });
  }
  if (!achado?.disponivel) {
    return NextResponse.json({ ok: false, error: 'Este link foi desligado. Fale com quem enviou o Book Digital.' }, { status: 410 });
  }
  if (!senhaConfere(senha, achado.link.senha)) {
    return NextResponse.json({ ok: false, error: 'Senha incorreta.' }, { status: 400 });
  }

  await esquecerTentativas(tentativa);
  const resposta = NextResponse.json({ ok: true });
  resposta.cookies.set(nomeDoCookie(achado.link.codigo), cookieDeAcesso(achado.link), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: DIAS_DE_ACESSO * 24 * 60 * 60,
  });
  return resposta;
}
