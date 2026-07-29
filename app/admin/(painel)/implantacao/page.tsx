import type { Metadata } from 'next';
import { ImplantacaoEditor } from '@/components/implantacao-editor';
import { getContornos } from '@/lib/getContornos';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Admin · Marcações da Implantação',
  robots: { index: false, follow: false },
};

export default async function AdminImplantacao() {
  // sem cache: quem acabou de salvar precisa reabrir e ver o próprio desenho
  const contornos = await getContornos(true);
  return <ImplantacaoEditor iniciais={contornos} />;
}
