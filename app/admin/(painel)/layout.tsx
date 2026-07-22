import { redirect } from 'next/navigation';
import { AdminShell } from '@/components/admin-shell';
import { criarSupabaseServidor } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export default async function PainelLayout({ children }: { children: React.ReactNode }) {
  const supabase = await criarSupabaseServidor();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Rede de segurança: o middleware já protege, mas confirmamos no servidor.
  if (!user) redirect('/admin/login');

  return <AdminShell email={user.email ?? ''}>{children}</AdminShell>;
}
