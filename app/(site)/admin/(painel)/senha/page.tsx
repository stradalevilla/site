import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { MinhaConta } from '@/components/admin-conta';
import { usuarioLogado } from '@/lib/acesso';
import { nomeDe } from '@/lib/usuarios';

export const metadata: Metadata = { title: 'Minha conta' };
export const dynamic = 'force-dynamic';

export default async function ContaPage() {
  const user = await usuarioLogado();
  if (!user) redirect('/admin/login');

  return <MinhaConta nomeInicial={nomeDe(user)} email={user.email ?? ''} />;
}
