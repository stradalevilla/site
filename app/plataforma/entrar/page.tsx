import type { Metadata } from 'next';
import { Entrar } from '@/components/plataforma/entrar';
import { FundoDoApp } from '@/components/plataforma/fundo-do-app';
import { Marca } from '@/components/plataforma/marca';

export const metadata: Metadata = { title: 'Entrar' };

export default function EntrarPage() {
  return (
    <main className="flex min-h-dvh flex-col items-center px-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-[max(2.5rem,env(safe-area-inset-top))]">
      <FundoDoApp />
      <Marca />
      <div className="flex w-full flex-1 items-center justify-center py-8">
        <Entrar />
      </div>
    </main>
  );
}
