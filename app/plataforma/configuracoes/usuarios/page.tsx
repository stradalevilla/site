import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { TelaInterna } from '@/components/plataforma/tela-interna';
import { UsuariosDoApp } from '@/components/plataforma/usuarios';
import { usuarioLogado } from '@/lib/acesso';
import { papelDe } from '@/lib/usuarios';

export const metadata: Metadata = { title: 'Usuários' };
export const dynamic = 'force-dynamic';

export default async function UsuariosPage() {
  const user = await usuarioLogado();
  if (!user) redirect('/entrar');
  if (papelDe(user) !== 'administrador') redirect('/configuracoes');

  return (
    <TelaInterna titulo="Usuários" voltar="/configuracoes">
      <UsuariosDoApp meuId={user.id} />
    </TelaInterna>
  );
}
