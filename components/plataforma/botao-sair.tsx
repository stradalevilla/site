'use client';

import { useState } from 'react';

export function BotaoSair() {
  const [saindo, setSaindo] = useState(false);
  const [erro, setErro] = useState('');

  const sair = async () => {
    setErro('');
    setSaindo(true);
    const resposta = await fetch('/api/plataforma/sair', { method: 'POST' }).catch(() => null);
    if (resposta?.ok) {
      // recarrega de verdade: nada da conta fica na memória da tela
      window.location.replace('/entrar');
      return;
    }
    // sem isto a pessoa acharia que saiu, e num aparelho compartilhado a conta ficaria aberta
    setErro('Não foi possível sair. Confira a sua conexão e tente de novo.');
    setSaindo(false);
  };

  return (
    <>
      <button
        type="button"
        onClick={sair}
        disabled={saindo}
        className="mt-8 w-full rounded-2xl border border-white/15 py-4 text-base text-[#F2A06A] transition active:scale-[0.98] disabled:opacity-60"
      >
        {saindo ? 'Saindo…' : 'Sair da conta'}
      </button>
      {erro && (
        <p role="alert" className="mt-3 text-center text-sm text-[#F2A06A]">
          {erro}
        </p>
      )}
    </>
  );
}
