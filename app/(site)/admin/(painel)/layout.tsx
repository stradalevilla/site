import { redirect } from 'next/navigation';
import { AdminShell } from '@/components/admin-shell';
import { usuarioLogado } from '@/lib/acesso';
import { papelDe } from '@/lib/usuarios';

export const dynamic = 'force-dynamic';

export default async function PainelLayout({ children }: { children: React.ReactNode }) {
  const user = await usuarioLogado();

  // Rede de segurança: o middleware já protege, mas confirmamos no servidor.
  if (!user) redirect('/admin/login');

  return (
    <AdminShell email={user.email ?? ''} papel={papelDe(user)}>
      {children}
    </AdminShell>
  );
}
