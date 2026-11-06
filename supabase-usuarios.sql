-- O que a gestão de usuários do painel guarda no banco. Papel e nome de cada pessoa ficam
-- no próprio Supabase Auth (app_metadata e user_metadata), e o Gustavo é o administrador
-- inicial: papel = administrador em app_metadata.

-- Registro dos e-mails automáticos: convites, recuperação de senha e avisos. Serve de
-- histórico e de limite: quem pede "esqueci minha senha" sem parar não enche a caixa de
-- ninguém. Só o servidor grava e lê, com a chave de serviço: com RLS ligado e nenhuma
-- política, a chave pública não enxerga nada.
create table if not exists public.emails_enviados (
  id uuid primary key default gen_random_uuid(),
  criado_em timestamptz not null default now(),
  tipo text not null,
  para text not null,
  resend_id text,
  erro text
);

alter table public.emails_enviados enable row level security;

create index if not exists emails_enviados_para_idx on public.emails_enviados (para, tipo, criado_em desc);

comment on table public.emails_enviados is 'E-mails automáticos do painel, com o resultado de cada envio pelo Resend.';

-- Reserva a vaga antes de enviar. Contar e gravar acontecem juntos, sob uma trava por
-- endereço: pedidos simultâneos não passam todos pela contagem. Envio que falhou não conta.
-- Devolve o id da reserva, ou nulo se o limite da última hora já foi atingido.
create or replace function public.reservar_email(destinatario text, categoria text, limite integer)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  reserva uuid;
begin
  perform pg_advisory_xact_lock(hashtext(destinatario));

  if (
    select count(*) from public.emails_enviados
    where para = destinatario and tipo = categoria and erro is null and criado_em > now() - interval '1 hour'
  ) >= limite then
    return null;
  end if;

  insert into public.emails_enviados (tipo, para) values (categoria, destinatario) returning id into reserva;
  return reserva;
end;
$$;

-- Encerra todas as sessões de uma pessoa. O Supabase só faz isso a partir do token dela, e
-- quem desativa uma conta tem apenas o id. Sem isto, reativar a conta ressuscitaria as
-- sessões antigas, inclusive a de um aparelho perdido.
create or replace function public.encerrar_sessoes(usuario uuid)
returns void
language sql
security definer
set search_path = ''
as $$
  delete from auth.sessions where user_id = usuario;
$$;

-- As duas funções passam por cima das regras de acesso: só a chave de serviço pode chamar
revoke all on function public.reservar_email(text, text, integer) from public, anon, authenticated;
revoke all on function public.encerrar_sessoes(uuid) from public, anon, authenticated;
grant execute on function public.reservar_email(text, text, integer) to service_role;
grant execute on function public.encerrar_sessoes(uuid) to service_role;
