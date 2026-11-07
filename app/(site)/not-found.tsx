import Link from 'next/link';

export default function PaginaNaoEncontrada() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#0a1929] px-6 text-center text-white">
      <h1 className="font-heading text-3xl italic md:text-4xl">Página não encontrada</h1>
      <p className="mt-4 max-w-md font-body text-base text-white/80">Este endereço não existe ou mudou de lugar.</p>
      <Link href="/" className="mt-8 font-body text-sm uppercase tracking-[0.2em] text-[#F2A06A] underline-offset-4 hover:underline">
        Voltar ao início
      </Link>
    </main>
  );
}
