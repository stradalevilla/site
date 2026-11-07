import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

/** O cabeçalho das telas de dentro: no app instalado não existe botão de voltar do navegador */
export function TelaInterna({ titulo, voltar = '/', acao, children }: { titulo: string; voltar?: string; acao?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="mx-auto flex min-h-dvh max-w-3xl flex-col">
      <header className="sticky top-0 z-10 flex items-center gap-1 bg-navy/90 px-3 pb-3 pt-[max(0.75rem,env(safe-area-inset-top))] backdrop-blur-xl">
        <Link href={voltar} aria-label="Voltar" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full active:bg-white/10">
          <ChevronLeft size={26} strokeWidth={1.6} aria-hidden />
        </Link>
        <h1 className="min-w-0 flex-1 truncate font-heading text-2xl italic">{titulo}</h1>
        {acao}
      </header>
      <main className="flex-1 px-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-2">{children}</main>
    </div>
  );
}
