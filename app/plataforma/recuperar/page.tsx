import type { Metadata } from 'next';
import { FundoDoApp } from '@/components/plataforma/fundo-do-app';
import { Marca } from '@/components/plataforma/marca';
import { Recuperar } from '@/components/plataforma/recuperar';

export const metadata: Metadata = { title: 'Recuperar senha' };

export default function RecuperarPage() {
  return (
    <main className="flex min-h-dvh flex-col items-center px-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-[max(2.5rem,env(safe-area-inset-top))]">
      <FundoDoApp />
      <Marca />
      <div className="flex w-full flex-1 items-center justify-center py-8">
        <Recuperar />
      </div>
    </main>
  );
}
