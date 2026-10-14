-- Tabela de configurações do site, editáveis pelo painel do admin.
-- Por enquanto guarda só a calibragem do grafismo de fundo, mas é chave/valor
-- de propósito: a próxima configuração entra como outra linha, sem migração.
--
-- Rode isto uma vez no SQL Editor do Supabase.

create table if not exists public.config_site (
  chave text primary key,
  valor jsonb not null,
  atualizado_em timestamptz not null default now()
);

alter table public.config_site enable row level security;

-- Leitura liberada: o site público precisa ler a calibragem com a chave anon.
-- Não há segredo aqui, são números de desenho.
drop policy if exists "config_site leitura publica" on public.config_site;
create policy "config_site leitura publica"
  on public.config_site
  for select
  to anon, authenticated
  using (true);

-- Escrita não tem policy nenhuma de propósito: só a chave de serviço grava,
-- e ela só é usada no servidor, pela rota que exige usuário logado.

insert into public.config_site (chave, valor)
values (
  'grafismo',
  '{"velocidade":13,"escala":23,"linhas":30,"espessura":10,"contraste":38,"detalhe":5}'::jsonb
)
on conflict (chave) do nothing;
