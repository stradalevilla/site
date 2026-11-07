import { NextResponse } from 'next/server';
import { exigirAdministrador } from '@/lib/acesso';
import { BALDE, CAMINHO_VALIDO, type Apresentacao } from '@/lib/apresentacoes';
import { doProprioSite } from '@/lib/pedido';
import { criarSupabaseAdmin } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';

const recusa = (error: string, status = 400) => NextResponse.json({ ok: false, error }, { status });

function enderecoValido(valor: string) {
  try {
    return ['http:', 'https:'].includes(new URL(valor).protocol);
  } catch {
    return false;
  }
}

/** Registra uma apresentação: um arquivo que já subiu, ou um link. */
export async function POST(req: Request) {
  if (!doProprioSite(req)) return recusa('origem invalida', 403);
  const { user, resposta } = await exigirAdministrador();
  if (resposta) return resposta;

  const corpo = await req.json().catch(() => null);
  const titulo = typeof corpo?.titulo === 'string' ? corpo.titulo.trim().slice(0, 160) : '';
  const tipo = corpo?.tipo;
  if (!titulo) return recusa('Dê um título à apresentação.');

  const banco = criarSupabaseAdmin();
  // o id vem do aparelho e se repete na nova tentativa: se a resposta se perdeu, não publica em dobro
  const id = /^[0-9a-f-]{36}$/i.test(String(corpo?.id)) ? { id: String(corpo.id) } : {};
  let registro: Partial<Apresentacao> & { criado_por: string };

  if (tipo === 'link') {
    const endereco = typeof corpo?.endereco === 'string' ? corpo.endereco.trim() : '';
    if (!enderecoValido(endereco)) return recusa('Confira o link. Ele precisa começar com https://');
    registro = { ...id, titulo, tipo, endereco, criado_por: user.id };
  } else if (tipo === 'pdf' || tipo === 'video') {
    const caminho = String(corpo?.caminho);
    if (!CAMINHO_VALIDO.test(caminho)) return recusa('Arquivo inválido.');
    registro = { ...id, titulo, tipo, caminho, tamanho: Number(corpo?.tamanho) || null, criado_por: user.id };
  } else {
    return recusa('Tipo inválido.');
  }

  const { error } = await banco.from('apresentacoes').insert(registro);
  if (error && error.code !== '23505') {
    console.error('apresentacao nao gravada:', error.message);
    return recusa('Não foi possível salvar.', 500);
  }
  return NextResponse.json({ ok: true });
}

/** Remove a apresentação e o arquivo dela. */
export async function DELETE(req: Request) {
  if (!doProprioSite(req)) return recusa('origem invalida', 403);
  const { resposta } = await exigirAdministrador();
  if (resposta) return resposta;

  const id = new URL(req.url).searchParams.get('id') ?? '';
  if (!/^[0-9a-f-]{36}$/i.test(id)) return recusa('id ausente');

  const banco = criarSupabaseAdmin();
  const { data, error: erroDaBusca } = await banco.from('apresentacoes').select('caminho').eq('id', id).maybeSingle();
  if (erroDaBusca) return recusa('Não foi possível remover.', 500);
  if (!data) return recusa('Apresentação não encontrada.', 404);

  // a linha sai primeiro: um arquivo que sobra não aparece para ninguém, e uma linha sem arquivo aparece
  const { error } = await banco.from('apresentacoes').delete().eq('id', id);
  if (error) return recusa('Não foi possível remover.', 500);
  if (data.caminho) {
    const { error: erroDoArquivo } = await banco.storage.from(BALDE).remove([data.caminho]);
    if (erroDoArquivo) console.error('arquivo sobrou no balde:', data.caminho, erroDoArquivo.message);
  }
  return NextResponse.json({ ok: true });
}
