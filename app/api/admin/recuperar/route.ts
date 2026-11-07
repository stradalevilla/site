import { after, NextResponse } from 'next/server';
import { enviarRecuperacao } from '@/lib/acesso';
import { destinoDosLinks, doProprioSite } from '@/lib/pedido';
import { emailValido } from '@/lib/usuarios';

export const dynamic = 'force-dynamic';
export const maxDuration = 30;

/** "Esqueci minha senha". A resposta é sempre a mesma, exista ou não conta com esse e-mail. */
export async function POST(req: Request) {
  if (!doProprioSite(req)) {
    return NextResponse.json({ ok: false, error: 'origem invalida' }, { status: 403 });
  }

  const corpo = await req.json().catch(() => null);
  const email = typeof corpo?.email === 'string' ? corpo.email.trim().toLowerCase() : '';
  if (!emailValido(email)) {
    return NextResponse.json({ ok: false, error: 'e-mail invalido' }, { status: 400 });
  }

  const destino = destinoDosLinks(req);
  after(() => enviarRecuperacao(email, destino));
  return NextResponse.json({ ok: true });
}
