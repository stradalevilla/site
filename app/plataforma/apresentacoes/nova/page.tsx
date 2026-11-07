import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { NovaApresentacao } from '@/components/plataforma/nova-apresentacao';
import { TelaInterna } from '@/components/plataforma/tela-interna';
import { usuarioLogado } from '@/lib/acesso';
import { papelDe } from '@/lib/usuarios';

export const metadata: Metadata = { title: 'Nova apresentação' };
export const dynamic = 'force-dynamic';

export default async function NovaApresentacaoPage() {
  const user = await usuarioLogado();
  if (!user) redirect('/entrar');
  if (papelDe(user) !== 'administrador') redirect('/apresentacoes');

  return (
    <TelaInterna titulo="Nova apresentação" voltar="/apresentacoes">
      <NovaApresentacao />
    </TelaInterna>
  );
}
