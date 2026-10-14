'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { criarSupabaseNavegador } from '@/lib/supabase/client';

/**
 * Onde o link do e-mail cai. O Supabase abre uma sessão de recuperação ao
 * chegar aqui, e com ela a pessoa troca a própria senha.
 *
 * Sem sessão não adianta mostrar o formulário: o link expirou ou foi aberto
 * fora do e-mail, e a troca ia falhar depois de a pessoa digitar duas vezes.
 */
export default function NovaSenha() {
  const router = useRouter();
  const [pronto, setPronto] = useState(false);
  const [temSessao, setTemSessao] = useState(false);
  const [senha, setSenha] = useState('');
  const [repetida, setRepetida] = useState('');
  const [erro, setErro] = useState('');
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    const supabase = criarSupabaseNavegador();

    // o link do e-mail chega como evento PASSWORD_RECOVERY
    const { data: assinatura } = supabase.auth.onAuthStateChange((_evento, sessao) => {
      if (sessao) {
        setTemSessao(true);
        setPronto(true);
      }
    });

    supabase.auth
      .getSession()
      .then(({ data }) => {
        if (data.session) setTemSessao(true);
      })
      .catch(() => {
        /* servidor fora do ar: cai no aviso de link inválido */
      })
      .finally(() => setPronto(true));

    return () => assinatura.subscription.unsubscribe();
  }, []);

  const salvar = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');

    if (senha.length < 8) {
      setErro('A senha precisa ter ao menos 8 caracteres.');
      return;
    }
    if (senha !== repetida) {
      setErro('As duas senhas não são iguais.');
      return;
    }

    setSalvando(true);
    const supabase = criarSupabaseNavegador();
    const { error } = await supabase.auth.updateUser({ password: senha });

    if (error) {
      const semConexao =
        error.name === 'AuthRetryableFetchError' ||
        !error.status ||
        /fetch|network|failed to/i.test(error.message);
      setErro(
        semConexao
          ? 'Não foi possível falar com o servidor. O serviço de login está fora do ar.'
          : 'Não foi possível trocar a senha. O link pode ter expirado.'
      );
      setSalvando(false);
      return;
    }

    router.replace('/admin');
    router.refresh();
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-100 px-4">
      <div className="w-full max-w-sm space-y-5">
        <div className="text-center">
          <p className="font-heading text-2xl uppercase tracking-wide text-navy">Villa Stradale</p>
          <p className="mt-1 font-body text-xs uppercase tracking-[0.2em] text-gray-500">
            Nova senha
          </p>
        </div>

        {!pronto ? (
          <p className="text-center font-body text-sm text-gray-500">abrindo…</p>
        ) : !temSessao ? (
          <>
            <p className="text-center font-body text-sm leading-relaxed text-gray-600">
              Este link não vale mais. Peça um novo e abra direto do e-mail, sem
              copiar e colar o endereço.
            </p>
            <Link
              href="/admin/recuperar"
              className="block w-full rounded-sm bg-gold-dark py-3 text-center font-body text-sm uppercase tracking-widest text-white transition-colors hover:bg-navy"
            >
              pedir outro link
            </Link>
          </>
        ) : (
          <form onSubmit={salvar} className="space-y-5">
            <input
              type="password"
              required
              autoComplete="new-password"
              placeholder="Nova senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="w-full rounded border border-navy/20 px-4 py-3 font-body text-sm outline-none focus:border-gold-dark"
            />
            <input
              type="password"
              required
              autoComplete="new-password"
              placeholder="Repita a nova senha"
              value={repetida}
              onChange={(e) => setRepetida(e.target.value)}
              className="w-full rounded border border-navy/20 px-4 py-3 font-body text-sm outline-none focus:border-gold-dark"
            />

            {erro && <p className="text-center font-body text-sm text-red-600">{erro}</p>}

            <button
              type="submit"
              disabled={salvando}
              className="w-full rounded-sm bg-gold-dark py-3 font-body text-sm uppercase tracking-widest text-white transition-colors hover:bg-navy disabled:opacity-50"
            >
              {salvando ? 'salvando…' : 'salvar senha'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
