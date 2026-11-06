import { NextResponse } from 'next/server';
import { criarSupabaseServidor } from '@/lib/supabase/server';
import { criarSupabaseAdmin } from '@/lib/supabase/admin';
import { dataDoContato, resumoDaOrigem, type Contato } from '@/lib/contato';

export const dynamic = 'force-dynamic';

/**
 * Número puro o Excel converte para notação científica e estraga para sempre.
 * Formatado como (11) 98765-4321 ele fica texto, e o CRM importa do mesmo jeito.
 */
function telefoneDaPlanilha(telefone: string) {
  const digitos = telefone.replace(/\D/g, '').replace(/^55(?=\d{10,11}$)/, '');
  if (digitos.length !== 10 && digitos.length !== 11) return telefone;
  return `(${digitos.slice(0, 2)}) ${digitos.slice(2, -4)}-${digitos.slice(-4)}`;
}

const COLUNAS: [string, (c: Contato) => string | null][] = [
  ['Data e hora', (c) => dataDoContato(c.criado_em).replace(', ', ' ')],
  ['Nome', (c) => c.nome],
  ['E-mail', (c) => c.email],
  ['Telefone', (c) => telefoneDaPlanilha(c.telefone)],
  ['Origem', resumoDaOrigem],
  ['Página de entrada', (c) => c.entrada],
  ['Enviou em', (c) => c.pagina],
  ['Veio de', (c) => c.referencia],
  ['utm_source', (c) => c.utm_source],
  ['utm_medium', (c) => c.utm_medium],
  ['utm_campaign', (c) => c.utm_campaign],
  ['utm_term', (c) => c.utm_term],
  ['utm_content', (c) => c.utm_content],
  ['gclid', (c) => c.gclid],
  ['fbclid', (c) => c.fbclid],
  ['Aparelho', (c) => c.dispositivo],
  ['Cidade', (c) => c.cidade],
  ['Estado', (c) => c.estado],
  ['País', (c) => c.pais],
];

/** Célula que começa com = + - @ viraria fórmula ao abrir no Excel */
function celula(valor: string | null) {
  const seguro = /^[=+\-@\t\r]/.test(valor ?? '') ? `'${valor}` : (valor ?? '');
  return `"${seguro.replace(/"/g, '""')}"`;
}

/** A planilha com todos os contatos. Ponto e vírgula e BOM para abrir certo no Excel. */
export async function GET() {
  const supabase = await criarSupabaseServidor();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ ok: false, error: 'nao autenticado' }, { status: 401 });
  }

  const admin = criarSupabaseAdmin();
  const contatos: Contato[] = [];
  // o Supabase devolve no máximo mil linhas por vez
  for (let de = 0; ; de += 1000) {
    const { data, error } = await admin
      .from('contatos')
      .select('*')
      .order('criado_em', { ascending: false })
      .range(de, de + 999);
    if (error) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }
    contatos.push(...(data as Contato[]));
    if (data.length < 1000) break;
  }

  const linhas = [
    COLUNAS.map(([titulo]) => celula(titulo)).join(';'),
    ...contatos.map((c) => COLUNAS.map(([, ler]) => celula(ler(c))).join(';')),
  ];

  return new NextResponse(`﻿${linhas.join('\r\n')}`, {
    headers: {
      'content-type': 'text/csv; charset=utf-8',
      'content-disposition': 'attachment; filename="contatos-villa-stradale.csv"',
      'cache-control': 'no-store',
    },
  });
}
