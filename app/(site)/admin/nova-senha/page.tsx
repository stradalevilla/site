'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

type Tipo = 'invite' | 'recovery';

/**
 * Onde o link do e-mail cai, tanto de convite quanto de recuperação. O código vem depois
 * do # e só é gasto quando a pessoa envia a senha. Por isso a página não sabe de antemão
 * se o link ainda vale: se não valer, avisa ao enviar, e a senha digitada não é perdida
 * à toa, porque a mesma página oferece pedir outro link.
 */
export default function NovaSenha() {
  const router = useRouter();
  const [link, setLink] = useState<{ codigo: string; tipo: Tipo } | null>(null);
  const [pronto, setPronto] = useState(false);
  const [linkVencido, setLinkVencido] = useState(false);
  const [senha, setSenha] = useState('');
  const [repetida, setRepetida] = useState('');
  const [erro, setErro] = useState('');
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    // colar um link novo na mesma aba só muda o que vem depois do #, e a página não recarrega
    const lerLink = () => {
      const dados = new URLSearchParams(window.location.hash.slice(1));
      const codigo = dados.get('t');
      const tipo = dados.get('tipo');
      setLink(codigo && (tipo === 'invite' || tipo === 'recovery') ? { codigo, tipo } : null);
      setLinkVencido(false);
      setErro('');
      setPronto(true);
    };
    lerLink();
    window.addEventListener('hashchange', lerLink);
    return () => window.removeEventListener('hashchange', lerLink);
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
    try {
      const resposta = await fetch('/api/admin/definir-senha', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ ...link, senha }),
      });
      const j = await resposta.json();
      if (j.ok) {
        router.replace('/admin');
        router.refresh();
        return;
      }
      if (j.error === 'link') setLinkVencido(true);
      else setErro(j.error);
    } catch {
      setErro('Não foi possível falar com o servidor. Tente de novo em instantes.');
    }
    setSalvando(false);
  };

  const convite = link?.tipo === 'invite';

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-100 px-4">
      <div className="w-full max-w-sm space-y-5">
        <div className="text-center">
          <p className="font-heading text-2xl uppercase tracking-wide text-navy">Villa Stradale</p>
          <p className="mt-1 font-body text-xs uppercase tracking-[0.2em] text-gray-500">
            {convite ? 'Crie a sua senha' : 'Nova senha'}
          </p>
        </div>

        {!pronto ? (
          <p className="text-center font-body text-sm text-gray-500">abrindo…</p>
        ) : !link || linkVencido ? (
          <>
            <p className="text-center font-body text-sm leading-relaxed text-gray-600">
              Este link não vale mais. Ele dura 24 horas e só funciona uma vez.
              {convite
                ? ' Peça um novo convite a quem chamou você, ou use o botão abaixo.'
                : ' Peça outro e abra direto do e-mail mais recente.'}
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
            <p className="text-center font-body text-sm leading-relaxed text-gray-600">
              {convite ? 'Bem-vindo ao painel. Crie a senha que você vai usar para entrar.' : 'Crie uma senha nova para a sua conta.'}{' '}
              Use ao menos 8 caracteres: uma frase curta é fácil de lembrar e difícil de adivinhar.
            </p>

            <input
              type="password"
              required
              autoComplete="new-password"
              placeholder="Nova senha (mín. 8)"
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
