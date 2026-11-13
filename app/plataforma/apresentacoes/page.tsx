import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ChevronRight, FileText, Link2, Plus, Send, Video, type LucideIcon } from 'lucide-react';
import { BOTAO, CARTAO } from '@/components/plataforma/estilos';
import { TelaInterna } from '@/components/plataforma/tela-interna';
import { usuarioLogado } from '@/lib/acesso';
import { dataDaApresentacao, ROTULO_DO_TIPO, tamanhoLegivel, type Apresentacao, type TipoDeApresentacao } from '@/lib/apresentacoes';
import { criarSupabaseAdmin } from '@/lib/supabase/admin';
import { papelDe } from '@/lib/usuarios';

export const metadata: Metadata = { title: 'Apresentações' };
export const dynamic = 'force-dynamic';

const ICONE: Record<TipoDeApresentacao, LucideIcon> = { pdf: FileText, video: Video, link: Link2 };

export default async function ApresentacoesPage() {
  // o login e a lista saem juntos, e nada é mostrado antes de o login ser conferido
  const [user, { data, error }] = await Promise.all([usuarioLogado(), criarSupabaseAdmin().from('apresentacoes').select('*').order('criado_em', { ascending: false })]);
  if (!user) redirect('/entrar');
  const lista = (data ?? []) as Apresentacao[];

  return (
    <TelaInterna titulo="Apresentações">
      <div className="space-y-4">
        <Link href="/apresentacoes/book-digital" className="group relative block aspect-[16/9] overflow-hidden rounded-2xl border border-white/10 md:aspect-[21/9]">
          <Image src="/images/renders/hero-por-do-sol.jpg" alt="" fill sizes="(min-width: 768px) 720px, 100vw" quality={75} className="object-cover transition duration-700 group-active:scale-[1.02]" />
          <span className="absolute inset-0 bg-gradient-to-t from-navy/85 via-navy/20 to-transparent" />
          <span className="absolute inset-x-5 bottom-4">
            <span className="block text-[11px] uppercase tracking-[0.3em] text-white/80">Apresentação interativa</span>
            <span className="mt-1 block font-heading text-3xl italic">Book Digital</span>
          </span>
        </Link>
        <Link href="/apresentacoes/book-digital/compartilhar" className={`${CARTAO} flex items-center gap-4 p-4 transition active:bg-white/[0.12]`}>
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-gold">
            <Send size={21} strokeWidth={1.5} aria-hidden />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-base font-medium">Compartilhar o Book Digital</span>
            <span className="mt-0.5 block truncate text-sm text-white/60">Seu link com senha e os acessos</span>
          </span>
          <ChevronRight size={18} className="shrink-0 text-white/40" aria-hidden />
        </Link>

        {papelDe(user) === 'administrador' && (
          <Link href="/apresentacoes/nova" className={`${BOTAO} flex items-center justify-center gap-2`}>
            <Plus size={20} strokeWidth={1.6} aria-hidden />
            Adicionar apresentação
          </Link>
        )}

        {error && <p className="pt-8 text-center text-base text-white/70">Não foi possível carregar. Tente de novo em instantes.</p>}
        {!error && lista.length === 0 && <p className="pt-8 text-center text-base text-white/70">Nenhuma apresentação ainda.</p>}

        <ul className="space-y-2">
          {lista.map((a) => {
            const Icone = ICONE[a.tipo] ?? FileText;
            return (
              <li key={a.id}>
                <Link href={`/apresentacoes/${a.id}`} className={`${CARTAO} flex items-center gap-4 p-4 transition active:bg-white/[0.12]`}>
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-gold">
                    <Icone size={22} strokeWidth={1.5} aria-hidden />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-base font-medium">{a.titulo}</span>
                    <span className="mt-0.5 block truncate text-sm text-white/60">
                      {[ROTULO_DO_TIPO[a.tipo], tamanhoLegivel(a.tamanho), dataDaApresentacao(a.criado_em)].filter(Boolean).join(' · ')}
                    </span>
                  </span>
                  <ChevronRight size={18} className="shrink-0 text-white/40" aria-hidden />
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </TelaInterna>
  );
}
