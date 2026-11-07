import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { GestaoDeUsuarios } from '@/components/admin-usuarios';
import { usuarioLogado } from '@/lib/acesso';
import { papelDe } from '@/lib/usuarios';

export const metadata: Metadata = { title: 'Usuários' };
export const dynamic = 'force-dynamic';

export default async function UsuariosPage() {
  // o layout do painel não roda de novo ao trocar de página pelo menu
  const user = await usuarioLogado();
  if (!user) redirect('/admin/login');
  if (papelDe(user) !== 'administrador') redirect('/admin');

  return <GestaoDeUsuarios meuId={user.id} />;
}
