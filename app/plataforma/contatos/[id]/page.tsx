import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { Mail, MessageCircle, Phone, type LucideIcon } from 'lucide-react';
import { CARTAO } from '@/components/plataforma/estilos';
import { TelaInterna } from '@/components/plataforma/tela-interna';
import { usuarioLogado } from '@/lib/acesso';
import { dataDoContato, resumoDaOrigem, situacaoNoCrm, telefoneNoWhatsapp, type Contato } from '@/lib/contato';
import { ROTULO_DA_ORIGEM } from '@/lib/origem';
import { criarSupabaseAdmin } from '@/lib/supabase/admin';

export const metadata: Metadata = { title: 'Contato' };
export const dynamic = 'force-dynamic';

function Acao({ href, Icone, rotulo, novaAba }: { href: string; Icone: LucideIcon; rotulo: string; novaAba?: boolean }) {
  return (
    <a
      href={href}
      {...(novaAba ? { target: '_blank', rel: 'noopener' } : {})}
      className={`${CARTAO} flex flex-1 flex-col items-center gap-2 py-4 text-sm transition active:bg-white/[0.12]`}
    >
      <Icone size={22} strokeWidth={1.5} className="text-gold" aria-hidden />
      {rotulo}
    </a>
  );
}

function Item({ rotulo, valor }: { rotulo: string; valor: string | null | undefined }) {
  if (!valor) return null;
  return (
    <div className="px-4 py-3">
      <dt className="text-xs uppercase tracking-wider text-white/50">{rotulo}</dt>
      <dd className="mt-1 break-words text-base">{valor}</dd>
    </div>
  );
}

export default async function ContatoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  // o login e o contato saem juntos, e nada é mostrado antes de o login ser conferido
  const [user, { data, error }] = await Promise.all([
    usuarioLogado(),
    /^[0-9a-f-]{36}$/i.test(id) ? criarSupabaseAdmin().from('contatos').select('*').eq('id', id).maybeSingle() : Promise.resolve({ data: null, error: null }),
  ]);
  if (!user) redirect('/entrar');
  if (error) {
    return (
      <TelaInterna titulo="Contato" voltar="/contatos">
        <p className="pt-8 text-center text-base text-white/70">Não foi possível carregar o contato. Tente de novo em instantes.</p>
      </TelaInterna>
    );
  }
  if (!data) notFound();
  const c = data as Contato;
  const local = [c.cidade, c.estado, c.pais].filter(Boolean).join(', ');

  return (
    <TelaInterna titulo={c.nome} voltar="/contatos">
      <div className="space-y-4">
        <div className="flex gap-2">
          <Acao href={`tel:${c.telefone.replace(/[^\d+]/g, '')}`} Icone={Phone} rotulo="Ligar" />
          <Acao href={`https://wa.me/${telefoneNoWhatsapp(c.telefone)}`} Icone={MessageCircle} rotulo="WhatsApp" novaAba />
          <Acao href={`mailto:${encodeURIComponent(c.email).replace('%40', '@')}`} Icone={Mail} rotulo="E-mail" />
        </div>

        <dl className={`${CARTAO} divide-y divide-white/10`}>
          <Item rotulo="E-mail" valor={c.email} />
          <Item rotulo="Telefone" valor={c.telefone} />
          <Item rotulo="Recebido em" valor={dataDoContato(c.criado_em)} />
        </dl>

        <dl className={`${CARTAO} divide-y divide-white/10`}>
          <Item rotulo="Origem" valor={c.origem ? (ROTULO_DA_ORIGEM[c.origem] ?? c.origem) : null} />
          {c.origem !== 'direto' && <Item rotulo="Detalhe" valor={resumoDaOrigem(c)} />}
          <Item rotulo="Enviou em" valor={c.pagina} />
          <Item rotulo="Aparelho" valor={c.dispositivo} />
          <Item rotulo="Local" valor={local} />
          <Item rotulo="CRM da Sotheby's" valor={situacaoNoCrm(c)} />
        </dl>
      </div>
    </TelaInterna>
  );
}
