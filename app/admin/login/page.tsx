'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { criarSupabaseNavegador } from '@/lib/supabase/client';

function Formulario() {
  const router = useRouter();
  const params = useSearchParams();
  const proximo = params.get('proximo') || '/admin';

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [entrando, setEntrando] = useState(false);

  const entrar = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');
    setEntrando(true);
    const supabase = criarSupabaseNavegador();
    const { error } = await supabase.auth.signInWithPassword({ email, password: senha });
    if (error) {
      setErro('E-mail ou senha incorretos.');
      setEntrando(false);
      return;
    }
    router.replace(proximo);
    router.refresh();
  };

  return (
    <form onSubmit={entrar} className="w-full max-w-sm space-y-5">
      <div className="text-center">
        <p className="font-heading text-2xl uppercase tracking-wide text-navy">Villa Stradale</p>
        <p className="mt-1 font-body text-xs uppercase tracking-[0.2em] text-gray-500">
          Painel de gestão
        </p>
      </div>

      <div className="space-y-3">
        <input
          type="email"
          required
          autoComplete="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded border border-navy/20 px-4 py-3 font-body text-sm outline-none focus:border-gold-dark"
        />
        <input
          type="password"
          required
          autoComplete="current-password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          className="w-full rounded border border-navy/20 px-4 py-3 font-body text-sm outline-none focus:border-gold-dark"
        />
      </div>

      {erro && <p className="text-center font-body text-sm text-red-600">{erro}</p>}

      <button
        type="submit"
        disabled={entrando}
        className="w-full rounded-sm bg-gold-dark py-3 font-body text-sm uppercase tracking-widest text-white transition-colors hover:bg-navy disabled:opacity-50"
      >
        {entrando ? 'entrando…' : 'entrar'}
      </button>
    </form>
  );
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-100 px-4">
      <Suspense>
        <Formulario />
      </Suspense>
    </div>
  );
}
