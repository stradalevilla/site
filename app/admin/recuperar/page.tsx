'use client';

import { useState } from 'react';
import Link from 'next/link';
import { criarSupabaseNavegador } from '@/lib/supabase/client';

/**
 * Pedido de recuperação de senha. O Supabase manda um e-mail com um link que
 * leva a /admin/nova-senha já com a sessão de recuperação aberta.
 *
 * A resposta é a mesma havendo ou não conta com aquele e-mail: dizer "este
 * e-mail não existe" entrega para qualquer um a lista de quem tem acesso ao
 * painel.
 */
export default function RecuperarSenha() {
  const [email, setEmail] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [erro, setErro] = useState('');

  const pedir = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');
    setEnviando(true);

    const supabase = criarSupabaseNavegador();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/admin/nova-senha`,
    });

    if (error) {
      const semConexao =
        error.name === 'AuthRetryableFetchError' ||
        !error.status ||
        /fetch|network|failed to/i.test(error.message);
      setErro(
        semConexao
          ? 'Não foi possível falar com o servidor. O serviço de login está fora do ar.'
          : 'Não foi possível enviar o e-mail agora. Tente de novo em instantes.'
      );
      setEnviando(false);
      return;
    }

    setEnviado(true);
    setEnviando(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-100 px-4">
      <div className="w-full max-w-sm space-y-5">
        <div className="text-center">
          <p className="font-heading text-2xl uppercase tracking-wide text-navy">Villa Stradale</p>
          <p className="mt-1 font-body text-xs uppercase tracking-[0.2em] text-gray-500">
            Recuperar senha
          </p>
        </div>

        {enviado ? (
          <>
            <p className="text-center font-body text-sm leading-relaxed text-gray-600">
              Se existir uma conta com esse e-mail, o link para criar uma senha
              nova acabou de ser enviado. Confira também a caixa de spam.
            </p>
            <Link
              href="/admin/login"
              className="block w-full rounded-sm bg-gold-dark py-3 text-center font-body text-sm uppercase tracking-widest text-white transition-colors hover:bg-navy"
            >
              voltar ao login
            </Link>
          </>
        ) : (
          <form onSubmit={pedir} className="space-y-5">
            <p className="text-center font-body text-sm leading-relaxed text-gray-600">
              Digite o e-mail da sua conta. Você recebe um link para criar uma
              senha nova.
            </p>

            <input
              type="email"
              required
              autoComplete="email"
              placeholder="E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded border border-navy/20 px-4 py-3 font-body text-sm outline-none focus:border-gold-dark"
            />

            {erro && <p className="text-center font-body text-sm text-red-600">{erro}</p>}

            <button
              type="submit"
              disabled={enviando}
              className="w-full rounded-sm bg-gold-dark py-3 font-body text-sm uppercase tracking-widest text-white transition-colors hover:bg-navy disabled:opacity-50"
            >
              {enviando ? 'enviando…' : 'enviar link'}
            </button>

            <Link
              href="/admin/login"
              className="block text-center font-body text-xs text-gray-500 underline-offset-4 hover:text-navy hover:underline"
            >
              voltar ao login
            </Link>
          </form>
        )}
      </div>
    </div>
  );
}
