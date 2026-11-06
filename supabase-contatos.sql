-- Os contatos do formulário do site. Só o servidor grava e lê, com a chave de
-- serviço: com RLS ligado e nenhuma política, a chave pública não enxerga nada.
create table if not exists public.contatos (
  id uuid primary key default gen_random_uuid(),
  criado_em timestamptz not null default now(),

  nome text not null,
  email text not null,
  telefone text not null,
  aceite_texto text not null,

  -- de onde veio: a página do envio e a primeira página da visita
  pagina text,
  entrada text,
  referencia text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_term text,
  utm_content text,
  gclid text,
  fbclid text,

  -- com o quê e de onde: a cidade vem da rede da Vercel, sem guardar o IP
  dispositivo text,
  navegador text,
  cidade text,
  estado text,
  pais text
);

alter table public.contatos enable row level security;

create index if not exists contatos_criado_em_idx on public.contatos (criado_em desc);

comment on table public.contatos is 'Contatos do formulário do site, com origem e horário. Ficam guardados mesmo depois de ligar o CRM.';

-- A origem do acesso (organico, direto, social, IA, referencia ou pago) e a entrega
-- ao CRM da Sotheby's pelo webhook do Zapier. Origem sem lista fechada de valores de
-- propósito: um valor novo no código nunca pode custar a gravação de um contato.
-- crm_pendente só nasce ligado em produção: o localhost grava neste mesmo banco, e o
-- reenvio diário não pode mandar um teste daqui para a Sotheby's.
alter table public.contatos
  add column if not exists origem text,
  add column if not exists crm_pendente boolean not null default false,
  add column if not exists crm_enviado_em timestamptz,
  add column if not exists crm_erro text;
