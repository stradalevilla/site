-- As apresentações do app: PDF, vídeo ou link. O arquivo fica no balde privado "apresentacoes"
-- e abre só por URL assinada, gerada no servidor para quem está logado: é material comercial do
-- lançamento e não pode ter endereço público permanente. Com RLS ligado e nenhuma política, a
-- chave pública não enxerga nada.
create table if not exists public.apresentacoes (
  id uuid primary key default gen_random_uuid(),
  criado_em timestamptz not null default now(),
  titulo text not null,
  tipo text not null,
  caminho text,
  endereco text,
  tamanho bigint,
  criado_por uuid
);

alter table public.apresentacoes enable row level security;

create index if not exists apresentacoes_criado_em_idx on public.apresentacoes (criado_em desc);

comment on table public.apresentacoes is 'Apresentações do app. pdf e video guardam o caminho no balde apresentacoes; link guarda o endereço.';
