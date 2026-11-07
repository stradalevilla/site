import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ChevronRight, UserRound, UsersRound, type LucideIcon } from 'lucide-react';
import { BotaoSair } from '@/components/plataforma/botao-sair';
import { CARTAO } from '@/components/plataforma/estilos';
import { TelaInterna } from '@/components/plataforma/tela-interna';
import { usuarioLogado } from '@/lib/acesso';
import { nomeDe, papelDe, ROTULO_DO_PAPEL } from '@/lib/usuarios';

export const metadata: Metadata = { title: 'Configurações' };
export const dynamic = 'force-dynamic';

function Opcao({ href, Icone, titulo, detalhe }: { href: string; Icone: LucideIcon; titulo: string; detalhe: string }) {
  return (
    <Link href={href} className={`${CARTAO} flex items-center gap-4 p-4 transition active:bg-white/[0.12]`}>
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-gold">
        <Icone size={22} strokeWidth={1.5} aria-hidden />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-base font-medium">{titulo}</span>
        <span className="mt-0.5 block truncate text-sm text-white/60">{detalhe}</span>
      </span>
      <ChevronRight size={18} className="shrink-0 text-white/40" aria-hidden />
    </Link>
  );
}

export default async function ConfiguracoesPage() {
  const user = await usuarioLogado();
  if (!user) redirect('/entrar');
  const papel = papelDe(user);

  return (
    <TelaInterna titulo="Configurações">
      <div className="space-y-2">
        <Opcao href="/configuracoes/conta" Icone={UserRound} titulo="Minha conta" detalhe={nomeDe(user) || user.email || ''} />
        {papel === 'administrador' && (
          <Opcao href="/configuracoes/usuarios" Icone={UsersRound} titulo="Usuários" detalhe="Convidar e gerenciar acessos" />
        )}
      </div>
      <p className="mt-6 text-center text-sm text-white/50">
        {user.email} · {ROTULO_DO_PAPEL[papel]}
      </p>
      <BotaoSair />
    </TelaInterna>
  );
}
