import type { Metadata } from 'next';
import { ImplantacaoEditor } from '@/components/implantacao-editor';
import { getContornos } from '@/lib/getContornos';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Admin · Marcações da Implantação',
  robots: { index: false, follow: false },
};

export default async function AdminImplantacao() {
  const contornos = await getContornos();
  return <ImplantacaoEditor iniciais={contornos} />;
}
