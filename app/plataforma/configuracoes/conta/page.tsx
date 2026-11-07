import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { MinhaContaDoApp } from '@/components/plataforma/minha-conta';
import { TelaInterna } from '@/components/plataforma/tela-interna';
import { usuarioLogado } from '@/lib/acesso';
import { nomeDe } from '@/lib/usuarios';

export const metadata: Metadata = { title: 'Minha conta' };
export const dynamic = 'force-dynamic';

export default async function ContaPage() {
  const user = await usuarioLogado();
  if (!user) redirect('/entrar');

  return (
    <TelaInterna titulo="Minha conta" voltar="/configuracoes">
      <MinhaContaDoApp nomeInicial={nomeDe(user)} email={user.email ?? ''} />
    </TelaInterna>
  );
}
