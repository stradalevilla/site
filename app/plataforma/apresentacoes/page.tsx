import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ChevronRight, FileText, Link2, Plus, Video, type LucideIcon } from 'lucide-react';
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
  const user = await usuarioLogado();
  if (!user) redirect('/entrar');

  const { data, error } = await criarSupabaseAdmin().from('apresentacoes').select('*').order('criado_em', { ascending: false });
  const lista = (data ?? []) as Apresentacao[];

  return (
    <TelaInterna titulo="Apresentações">
      <div className="space-y-4">
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
