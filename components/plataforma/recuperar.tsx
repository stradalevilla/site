'use client';

import { useState } from 'react';
import Link from 'next/link';
import { BOTAO, BOTAO_SECUNDARIO, CAMPO } from '@/components/plataforma/estilos';

/** A resposta é a mesma havendo ou não conta com o e-mail: dizer que não existe entregaria quem tem acesso */
export function Recuperar() {
  const [email, setEmail] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [erro, setErro] = useState('');

  const pedir = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');
    setEnviando(true);
    try {
      const resposta = await fetch('/api/admin/recuperar', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (resposta.ok) setEnviado(true);
      else setErro(resposta.status === 400 ? 'Confira o e-mail.' : 'Não foi possível enviar agora. Tente de novo em instantes.');
    } catch {
      setErro('Não foi possível falar com o servidor. Confira a sua conexão.');
    }
    setEnviando(false);
  };

  if (enviado) {
    return (
      <div className="w-full max-w-sm space-y-6 text-center">
        <h1 className="font-heading text-3xl italic">Confira o seu e-mail</h1>
        <p className="text-base leading-relaxed text-white/80">
          Se existir uma conta com esse e-mail, o link para criar uma senha nova acabou de ser enviado. Veja também a caixa de spam.
        </p>
        <Link href="/entrar" className={BOTAO_SECUNDARIO}>
          Voltar
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={pedir} className="w-full max-w-sm space-y-3">
      <h1 className="text-center font-heading text-3xl italic">Recuperar senha</h1>
      <p className="pb-3 text-center text-base leading-relaxed text-white/80">Digite o e-mail da sua conta e você recebe um link para criar uma senha nova.</p>
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
      {erro && (
        <p role="alert" className="text-center text-sm text-[#F2A06A]">
          {erro}
        </p>
      )}
      <button type="submit" disabled={enviando} className={`!mt-5 ${BOTAO}`}>
        {enviando ? 'Enviando…' : 'Enviar link'}
      </button>
      <Link href="/entrar" className="block py-3 text-center text-sm text-white/70 underline underline-offset-4">
        Voltar
      </Link>
    </form>
  );
}
