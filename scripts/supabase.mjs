#!/usr/bin/env node
/**
 * Porta de administração do Supabase deste projeto.
 *
 * Existe para que as tarefas de banco e de configuração sejam feitas aqui,
 * pelo Claude, em vez de virarem lição de casa no painel do Supabase. É uma
 * porta só, com o projeto fixo no código, para a permissão liberada no
 * Claude Code ter um alcance conhecido: este script e nada além dele.
 *
 * O token sai de .cursor/mcp.json, que está no .gitignore. Ele nunca é
 * impresso, nem quando a API devolve erro com o cabeçalho ecoado.
 *
 *   node scripts/supabase.mjs sql "select count(*) from public.lotes"
 *   node scripts/supabase.mjs sql -f caminho/consulta.sql
 *   node scripts/supabase.mjs get /v1/projects/{ref}/config/auth
 *   node scripts/supabase.mjs patch /v1/projects/{ref}/config/auth '{"site_url":"..."}'
 *   node scripts/supabase.mjs post /v1/projects/{ref}/... '{...}'
 *
 * Em qualquer caminho, {ref} é trocado pelo projeto deste site.
 */

import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const REF = 'krwrnzcoefribvtyznnf'; // projeto "Site Stradale"
const BASE = 'https://api.supabase.com';

function pegarToken() {
  let bruto;
  try {
    bruto = readFileSync(resolve(RAIZ, '.cursor/mcp.json'), 'utf8');
  } catch {
    erro('não achei .cursor/mcp.json — é de lá que sai o token de gerenciamento.');
  }
  const achado = bruto.match(/sbp_[A-Za-z0-9]+/);
  if (!achado) erro('não achei um token sbp_ dentro de .cursor/mcp.json.');
  return achado[0];
}

function erro(mensagem) {
  console.error('erro: ' + mensagem);
  process.exit(1);
}

/** tira o token de qualquer texto antes de ele chegar na tela */
function limpar(texto, token) {
  return String(texto).split(token).join('<TOKEN>');
}

async function chamar(metodo, caminho, corpo, token) {
  const alvo = BASE + caminho.replace('{ref}', REF);
  const resposta = await fetch(alvo, {
    method: metodo,
    headers: {
      Authorization: 'Bearer ' + token,
      ...(corpo ? { 'Content-Type': 'application/json' } : {}),
    },
    ...(corpo ? { body: typeof corpo === 'string' ? corpo : JSON.stringify(corpo) } : {}),
  });
  const texto = await resposta.text();
  let dado;
  try {
    dado = JSON.parse(texto);
  } catch {
    dado = texto;
  }
  return { status: resposta.status, ok: resposta.ok, dado: limparFundo(dado, token) };
}

function limparFundo(dado, token) {
  if (typeof dado === 'string') return limpar(dado, token);
  try {
    return JSON.parse(limpar(JSON.stringify(dado), token));
  } catch {
    return dado;
  }
}

const [, , comando, ...resto] = process.argv;

if (!comando || comando === '-h' || comando === '--help') {
  console.log(
    [
      'uso:',
      '  node scripts/supabase.mjs sql "<consulta>"',
      '  node scripts/supabase.mjs sql -f <arquivo.sql>',
      '  node scripts/supabase.mjs get <caminho>',
      '  node scripts/supabase.mjs patch <caminho> \'<json>\'',
      '  node scripts/supabase.mjs post <caminho> \'<json>\'',
      '',
      'projeto fixo: ' + REF + '  (use {ref} no caminho)',
    ].join('\n')
  );
  process.exit(0);
}

const token = pegarToken();

if (comando === 'sql') {
  let consulta;
  if (resto[0] === '-f') {
    if (!resto[1]) erro('faltou o arquivo depois de -f.');
    consulta = readFileSync(resolve(process.cwd(), resto[1]), 'utf8');
  } else {
    consulta = resto.join(' ');
  }
  if (!consulta.trim()) erro('consulta vazia.');

  const r = await chamar(
    'POST',
    `/v1/projects/{ref}/database/query`,
    { query: consulta },
    token
  );
  console.log('HTTP ' + r.status);
  console.log(JSON.stringify(r.dado, null, 2));
  process.exit(r.ok ? 0 : 1);
}

/**
 * O Git Bash do Windows reescreve argumento que começa com barra como caminho
 * de arquivo: "/v1/projects/..." chega aqui como "C:/Program Files/Git/v1/...".
 * Então em vez de exigir a barra, procuro onde a rota de verdade começa.
 */
function normalizarCaminho(bruto) {
  if (!bruto) return null;
  const versao = bruto.match(/\/v\d+\/.*/s);
  if (versao) return versao[0];
  return bruto.startsWith('/') ? bruto : '/' + bruto;
}

if (comando === 'get' || comando === 'patch' || comando === 'post') {
  const caminho = normalizarCaminho(resto[0]);
  if (!caminho) erro('faltou o caminho — ex: /v1/projects/{ref}/config/auth');

  let corpo = null;
  if (comando !== 'get') {
    if (!resto[1]) erro('faltou o corpo em json.');
    try {
      corpo = JSON.parse(resto.slice(1).join(' '));
    } catch (e) {
      erro('o corpo não é json válido: ' + e.message);
    }
  }

  const r = await chamar(comando.toUpperCase(), caminho, corpo, token);
  console.log('HTTP ' + r.status);
  console.log(JSON.stringify(r.dado, null, 2));
  process.exit(r.ok ? 0 : 1);
}

erro('comando desconhecido: ' + comando);
