-- As senhas erradas no login do app, para limitar quem tenta adivinhar. Guarda só um resumo
-- da pessoa e do endereço de rede, nunca o e-mail ou o IP. Com RLS ligado e nenhuma política,
-- só a chave de serviço enxerga.
create table if not exists public.tentativas_de_entrada (
  id bigint generated always as identity primary key,
  criado_em timestamptz not null default now(),
  chave text not null
);

alter table public.tentativas_de_entrada enable row level security;

create index if not exists tentativas_de_entrada_chave_idx on public.tentativas_de_entrada (chave, criado_em desc);

comment on table public.tentativas_de_entrada is 'Senhas erradas no login do app, por resumo da pessoa e do endereço de rede.';

-- Reserva a vaga antes de testar a senha. Contar e gravar acontecem juntos, sob uma trava por
-- endereço de rede: sem isso, pedidos simultâneos leriam zero e passariam todos. Devolve os ids
-- gravados, para desfazer se a senha estiver certa, ou nulo se o limite de 15 minutos já foi
-- atingido. O que passa de um dia sai aqui mesmo.
create or replace function public.reservar_tentativa(pessoa text, endereco text, limite_pessoa integer, limite_endereco integer)
returns bigint[]
language plpgsql
security definer
set search_path = ''
as $$
declare
  novos bigint[];
  janela timestamptz := now() - interval '15 minutes';
begin
  perform pg_advisory_xact_lock(hashtext(endereco));

  delete from public.tentativas_de_entrada where criado_em < now() - interval '1 day';

  if (select count(*) from public.tentativas_de_entrada where chave = pessoa and criado_em > janela) >= limite_pessoa
    or (select count(*) from public.tentativas_de_entrada where chave = endereco and criado_em > janela) >= limite_endereco then
    return null;
  end if;

  with gravadas as (
    insert into public.tentativas_de_entrada (chave) values (pessoa), (endereco) returning id
  )
  select array_agg(id) into novos from gravadas;
  return novos;
end;
$$;

-- passa por cima das regras de acesso: só a chave de serviço pode chamar
revoke all on function public.reservar_tentativa(text, text, integer, integer) from public, anon, authenticated;
grant execute on function public.reservar_tentativa(text, text, integer, integer) to service_role;
