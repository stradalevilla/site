'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { BOTAO, CAMPO } from '@/components/plataforma/estilos';

type Tipo = 'invite' | 'recovery';

/**
 * Onde o link do e-mail cai. O código vem depois do # e só é gasto quando a pessoa envia a
 * senha, então os filtros de e-mail que abrem os links sozinhos não queimam o uso único.
 */
export function NovaSenha() {
  const [link, setLink] = useState<{ codigo: string; tipo: Tipo } | null>(null);
  const [pronto, setPronto] = useState(false);
  const [vencido, setVencido] = useState(false);
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
      setVencido(false);
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
        // recarrega de verdade: a tela inicial precisa nascer com a sessão nova
        window.location.replace('/');
        return;
      }
      if (j.error === 'link') setVencido(true);
      else setErro(j.error);
    } catch {
      setErro('Não foi possível falar com o servidor. Confira a sua conexão.');
    }
    setSalvando(false);
  };

  if (!pronto) return null;

  if (!link || vencido) {
    return (
      <div className="w-full max-w-sm space-y-6 text-center">
        <h1 className="font-heading text-3xl italic">Link vencido</h1>
        <p className="text-base leading-relaxed text-white/80">
          Este link não vale mais. Ele dura 24 horas e só funciona uma vez. Peça outro e abra direto do e-mail mais recente.
        </p>
        <Link href="/recuperar" className={BOTAO}>
          Pedir outro link
        </Link>
      </div>
    );
  }

  const convite = link.tipo === 'invite';

  return (
    <form onSubmit={salvar} className="w-full max-w-sm space-y-3">
      <h1 className="text-center font-heading text-3xl italic">{convite ? 'Crie a sua senha' : 'Nova senha'}</h1>
      <p className="pb-3 text-center text-base leading-relaxed text-white/80">
        Use ao menos 8 caracteres: uma frase curta é fácil de lembrar e difícil de adivinhar.
      </p>
      <input
        type="password"
        required
        autoComplete="new-password"
        placeholder="Nova senha"
        aria-label="Nova senha"
        value={senha}
        onChange={(e) => setSenha(e.target.value)}
        className={CAMPO}
      />
      <input
        type="password"
        required
        autoComplete="new-password"
        placeholder="Repita a nova senha"
        aria-label="Repita a nova senha"
        value={repetida}
        onChange={(e) => setRepetida(e.target.value)}
        className={CAMPO}
      />
      {erro && (
        <p role="alert" className="text-center text-sm text-[#F2A06A]">
          {erro}
        </p>
      )}
      <button type="submit" disabled={salvando} className={`!mt-5 ${BOTAO}`}>
        {salvando ? 'Salvando…' : 'Salvar senha'}
      </button>
    </form>
  );
}
