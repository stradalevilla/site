import { NextResponse } from 'next/server';
import { exigirAdministrador } from '@/lib/acesso';
import { ARQUIVOS, BALDE, CAMINHO_VALIDO, TAMANHO_MAXIMO } from '@/lib/apresentacoes';
import { doProprioSite } from '@/lib/pedido';
import { criarSupabaseAdmin } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';

/**
 * Autoriza um arquivo a subir. Ele vai direto do aparelho para o Storage, em partes que podem
 * ser retomadas: pelo servidor do site, qualquer coisa acima de 4,5 MB seria recusada pela Vercel.
 */
export async function POST(req: Request) {
  if (!doProprioSite(req)) {
    return NextResponse.json({ ok: false, error: 'origem invalida' }, { status: 403 });
  }
  const { resposta } = await exigirAdministrador();
  if (resposta) return resposta;

  // autorização com prazo de 2 horas, e uma por arquivo
  const corpo = await req.json().catch(() => null);
  const arquivo = ARQUIVOS[String(corpo?.mime)];
  const tamanho = Number(corpo?.tamanho);
  if (!arquivo) return NextResponse.json({ ok: false, error: 'Envie um PDF ou um vídeo MP4 ou MOV.' }, { status: 400 });
  if (!(tamanho > 0) || tamanho > TAMANHO_MAXIMO) {
    return NextResponse.json({ ok: false, error: 'O arquivo passa de 400 MB.' }, { status: 400 });
  }

  const caminho = `${crypto.randomUUID()}.${arquivo.extensao}`;
  const { data, error } = await criarSupabaseAdmin().storage.from(BALDE).createSignedUploadUrl(caminho);
  if (error) {
    console.error('envio nao autorizado:', error.message);
    return NextResponse.json({ ok: false, error: 'Não foi possível preparar o envio.' }, { status: 500 });
  }
  return NextResponse.json({
    ok: true,
    caminho,
    tipo: arquivo.tipo,
    token: data.token,
    endereco: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/upload/resumable/sign`,
  });
}

/** Apaga um arquivo que subiu e não foi publicado. O que já tem registro não sai por aqui. */
export async function DELETE(req: Request) {
  if (!doProprioSite(req)) {
    return NextResponse.json({ ok: false, error: 'origem invalida' }, { status: 403 });
  }
  const { resposta } = await exigirAdministrador();
  if (resposta) return resposta;

  const caminho = new URL(req.url).searchParams.get('caminho') ?? '';
  if (!CAMINHO_VALIDO.test(caminho)) return NextResponse.json({ ok: false, error: 'Arquivo inválido.' }, { status: 400 });

  const banco = criarSupabaseAdmin();
  const { data, error } = await banco.from('apresentacoes').select('id').eq('caminho', caminho).limit(1);
  if (error) return NextResponse.json({ ok: false, error: 'Não foi possível remover.' }, { status: 500 });
  if (data.length) return NextResponse.json({ ok: true });

  const { error: erroDoArquivo } = await banco.storage.from(BALDE).remove([caminho]);
  if (erroDoArquivo) return NextResponse.json({ ok: false, error: 'Não foi possível remover.' }, { status: 500 });
  return NextResponse.json({ ok: true });
}
