-- O Book Digital fora do app: cada usuário tem um link com senha para mandar aos clientes, e
-- cada vez que alguém abre o book por ele fica registrado no nome desse usuário. O cliente não
-- tem conta: entra só com a senha do link. Com RLS ligado e nenhuma política, só o servidor,
-- com a chave de serviço, lê e grava as duas tabelas.

create table if not exists public.links_do_book (
  id uuid primary key default gen_random_uuid(),
  usuario uuid not null unique references auth.users (id) on delete cascade,
  -- o que vai no endereço, villastradale.com.br/book/<codigo>
  codigo text not null unique,
  -- a senha é para ser repassada ao cliente, e o usuário precisa poder vê-la de novo no app:
  -- por isso fica legível aqui, numa tabela que só o servidor enxerga
  senha text not null,
  -- sobe a cada troca de senha e a cada vez que o link é desligado: quem já tinha entrado sai
  versao integer not null default 1,
  ativo boolean not null default true,
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);

alter table public.links_do_book enable row level security;

comment on table public.links_do_book is 'O link com senha do Book Digital de cada usuário do app.';

-- Uma linha por abertura do book. Não guarda IP nem nada que identifique o cliente: só quando
-- foi, o tipo de aparelho, quais telas passaram e quanto tempo o book ficou aberto na frente.
create table if not exists public.visitas_do_book (
  id uuid primary key default gen_random_uuid(),
  link uuid not null references public.links_do_book (id) on delete cascade,
  criado_em timestamptz not null default now(),
  visto_em timestamptz not null default now(),
  aparelho text not null,
  telas smallint[] not null default '{}',
  segundos integer not null default 0
);

alter table public.visitas_do_book enable row level security;

create index if not exists visitas_do_book_link_idx on public.visitas_do_book (link, criado_em desc);

comment on table public.visitas_do_book is 'Cada abertura do Book Digital por um link de usuário: quando, aparelho, telas vistas e tempo.';

-- O histórico de visitas fica mesmo se a conta de quem mandou o link for apagada: o link perde
-- o dono e deixa de abrir, mas a contagem continua.
alter table public.links_do_book alter column usuario drop not null;
alter table public.links_do_book drop constraint if exists links_do_book_usuario_fkey;
alter table public.links_do_book add constraint links_do_book_usuario_fkey
  foreign key (usuario) references auth.users (id) on delete set null;

create index if not exists visitas_do_book_criado_em_idx on public.visitas_do_book (criado_em);

-- Abre ou atualiza uma visita. O id vem do navegador, então reenviar não duplica. Só soma: as
-- telas viram a união e o tempo só cresce, sem passar do que de fato correu desde a abertura.
-- Um link não abre mais de 30 visitas em 10 minutos, e o que passa de 12 meses sai aqui mesmo.
-- Devolve 'atualizada', 'criada', 'recusada' (id de outro link) ou 'limite'.
create or replace function public.registrar_visita_do_book(visita uuid, do_link uuid, no_aparelho text, vistas smallint[], tempo integer)
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  aberta timestamptz;
begin
  perform pg_advisory_xact_lock(hashtext(do_link::text));

  select criado_em into aberta from public.visitas_do_book where id = visita and link = do_link;
  if found then
    update public.visitas_do_book
      set telas = (select coalesce(array_agg(distinct t order by t), '{}') from unnest(telas || vistas) as t),
          segundos = least(greatest(segundos, tempo), extract(epoch from now() - aberta)::integer + 60),
          visto_em = now()
      where id = visita;
    return 'atualizada';
  end if;

  if exists (select 1 from public.visitas_do_book where id = visita) then
    return 'recusada';
  end if;

  if (select count(*) from public.visitas_do_book where link = do_link and criado_em > now() - interval '10 minutes') >= 30 then
    return 'limite';
  end if;

  delete from public.visitas_do_book where link = do_link and criado_em < now() - interval '12 months';

  insert into public.visitas_do_book (id, link, aparelho, telas, segundos)
    values (visita, do_link, no_aparelho, (select coalesce(array_agg(distinct t order by t), '{}') from unnest(vistas) as t), least(greatest(tempo, 0), 60));
  return 'criada';
end;
$$;

-- A contagem por link, feita no banco: a lista da equipe não depende de quantas linhas a API devolve
create or replace function public.resumo_das_visitas_do_book()
returns table (link uuid, acessos bigint, ultimo timestamptz)
language sql
stable
security definer
set search_path = ''
as $$
  select v.link, count(*), max(v.criado_em) from public.visitas_do_book v group by v.link;
$$;

-- passam por cima das regras de acesso: só a chave de serviço pode chamar
revoke all on function public.registrar_visita_do_book(uuid, uuid, text, smallint[], integer) from public, anon, authenticated;
revoke all on function public.resumo_das_visitas_do_book() from public, anon, authenticated;
grant execute on function public.registrar_visita_do_book(uuid, uuid, text, smallint[], integer) to service_role;
grant execute on function public.resumo_das_visitas_do_book() to service_role;
