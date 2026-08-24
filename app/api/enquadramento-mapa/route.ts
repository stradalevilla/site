import { writeFile } from 'node:fs/promises';
import path from 'node:path';
import { NextResponse } from 'next/server';

/**
 * Grava o enquadramento de abertura do mapa da região em lib/enquadramento-mapa.json.
 *
 * Existe só para a calibragem: o Gustavo posiciona o mapa na tela, clica em
 * salvar e a posição vira o padrão do site. Fora de desenvolvimento a rota não
 * existe — nada no site publicado escreve arquivo.
 */
const ARQUIVO = path.join(process.cwd(), 'lib', 'enquadramento-mapa.json');

function numero(v: unknown, min: number, max: number) {
  return typeof v === 'number' && Number.isFinite(v) && v >= min && v <= max;
}

export async function POST(req: Request) {
  if (process.env.NODE_ENV === 'production') {
    return new NextResponse(null, { status: 404 });
  }

  const corpo = await req.json().catch(() => null);
  const centro = corpo?.centro;

  const valido =
    Array.isArray(centro) &&
    centro.length === 2 &&
    numero(centro[0], -180, 180) &&
    numero(centro[1], -85, 85) &&
    numero(corpo?.zoom, 0, 22) &&
    numero(corpo?.giro, -180, 360) &&
    numero(corpo?.inclinacao, 0, 85);

  if (!valido) {
    return NextResponse.json({ erro: 'enquadramento inválido' }, { status: 400 });
  }

  const enquadramento = {
    centro: [Number(centro[0].toFixed(5)), Number(centro[1].toFixed(5))],
    zoom: Number(corpo.zoom.toFixed(2)),
    giro: Number(corpo.giro.toFixed(1)),
    inclinacao: Number(corpo.inclinacao.toFixed(1)),
  };

  await writeFile(ARQUIVO, JSON.stringify(enquadramento, null, 2) + '\n', 'utf8');
  return NextResponse.json({ ok: true, enquadramento });
}
