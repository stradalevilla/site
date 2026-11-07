import type { Metadata } from 'next';
import { FundoDoApp } from '@/components/plataforma/fundo-do-app';
import { Instalar } from '@/components/plataforma/instalar';
import { Marca } from '@/components/plataforma/marca';

export const metadata: Metadata = { title: 'Instalar' };

export default function InstalarPage() {
  return (
    <main className="flex min-h-dvh flex-col items-center px-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-[max(2.5rem,env(safe-area-inset-top))]">
      <FundoDoApp />
      <Marca />
      <div className="flex w-full flex-1 items-center justify-center py-8">
        <Instalar />
      </div>
    </main>
  );
}
