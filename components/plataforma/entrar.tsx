'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { CAMPO, BOTAO } from '@/components/plataforma/estilos';
import { GuiaDeInstalacao, jaInstalado, sistemaDoCelular } from '@/components/plataforma/guia-de-instalacao';

const CHAVE_PULOU = 'villa-stradale-sem-instalar';
function pulouAInstalacao() {
  try {
    return sessionStorage.getItem(CHAVE_PULOU) === '1';
  } catch {
    return false;
  }
}

/**
 * Só dentro do app: um endereço de fora viraria um link de login que leva a pessoa para outro
 * site. Quem decide é o endereço já resolvido, e não o texto, porque o navegador apaga
 * tabulação e quebra de linha antes de ler, e /<tab>/site-falso.com vira //site-falso.com.
 */
function destinoDepoisDeEntrar() {
  try {
    const proximo = new URLSearchParams(window.location.search).get('proximo') || '/';
    const destino = new URL(proximo, window.location.origin);
    return destino.origin === window.location.origin ? destino.href : '/';
  } catch {
    return '/';
  }
}

export function Entrar() {
  const [sistema, setSistema] = useState<'ios' | 'android' | null | undefined>(undefined);
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [entrando, setEntrando] = useState(false);

  useEffect(() => {
    setSistema(jaInstalado() || pulouAInstalacao() ? null : sistemaDoCelular());
  }, []);

  const continuar = () => {
    try {
      sessionStorage.setItem(CHAVE_PULOU, '1');
    } catch {
      // aba privada: só volta a perguntar na próxima vez
    }
    setSistema(null);
  };

  const entrar = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');
    setEntrando(true);
    try {
      const resposta = await fetch('/api/plataforma/entrar', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email, senha }),
      });
      const j = await resposta.json();
      if (j.ok) {
        // recarrega de verdade: a tela precisa nascer com a sessão nova
        window.location.replace(destinoDepoisDeEntrar());
        return;
      }
      setErro(j.error);
    } catch {
      setErro('Não foi possível falar com o servidor. Confira a sua conexão.');
    }
    setEntrando(false);
  };

  if (sistema === undefined) return null;
  if (sistema) return <GuiaDeInstalacao sistema={sistema} continuar={continuar} />;

  return (
    <form onSubmit={entrar} className="w-full max-w-sm space-y-3">
      <h1 className="pb-3 text-center font-heading text-3xl italic">Entrar</h1>
      <input
        type="email"
        required
        autoComplete="email"
        inputMode="email"
        placeholder="E-mail"
        aria-label="E-mail"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className={CAMPO}
      />
      <input
        type="password"
        required
        autoComplete="current-password"
        placeholder="Senha"
        aria-label="Senha"
        value={senha}
        onChange={(e) => setSenha(e.target.value)}
        className={CAMPO}
      />

      {erro && (
        <p role="alert" className="text-center text-sm text-[#F2A06A]">
          {erro}
        </p>
      )}

      <button
        type="submit"
        disabled={entrando}
        className={`!mt-5 ${BOTAO}`}
      >
        {entrando ? 'Entrando…' : 'Entrar'}
      </button>

      <Link href="/recuperar" className="block py-3 text-center text-sm text-white/70 underline underline-offset-4">
        Esqueci minha senha
      </Link>
    </form>
  );
}
