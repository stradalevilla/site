import Link from 'next/link';

export default function NaoEncontrada() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center px-6 text-center">
      <h1 className="font-heading text-3xl italic">Tela não encontrada</h1>
      <Link href="/" className="mt-6 text-base text-gold underline underline-offset-4">
        Voltar ao início
      </Link>
    </main>
  );
}
