'use client';

import { useState } from 'react';

export default function SenhaPage() {
  const [atual, setAtual] = useState('');
  const [nova, setNova] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [msg, setMsg] = useState('');
  const [ok, setOk] = useState(false);
  const [enviando, setEnviando] = useState(false);

  const trocar = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg('');
    setOk(false);
    if (nova !== confirmar) {
      setMsg('A confirmação não confere com a nova senha.');
      return;
    }
    setEnviando(true);
    const res = await fetch('/api/admin/senha', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ atual, nova }),
    });
    const j = await res.json();
    if (j.ok) {
      setOk(true);
      setMsg('Senha trocada com sucesso.');
      setAtual('');
      setNova('');
      setConfirmar('');
    } else {
      setMsg(`Erro: ${j.error}`);
    }
    setEnviando(false);
  };

  return (
    <div className="p-8 md:p-10">
      <h1 className="font-heading text-2xl uppercase tracking-wide text-navy md:text-3xl">
        Trocar minha senha
      </h1>
      <p className="mt-1 font-body text-sm text-gray-500">
        Altere a senha da sua conta de acesso ao painel.
      </p>

      <form onSubmit={trocar} className="mt-8 max-w-md space-y-3 rounded-lg border border-neutral-200 bg-white p-5">
        <input
          type="password"
          required
          autoComplete="current-password"
          placeholder="Senha atual"
          value={atual}
          onChange={(e) => setAtual(e.target.value)}
          className="w-full rounded border border-navy/20 px-3 py-2 font-body text-sm outline-none focus:border-gold-dark"
        />
        <input
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          placeholder="Nova senha (mín. 8)"
          value={nova}
          onChange={(e) => setNova(e.target.value)}
          className="w-full rounded border border-navy/20 px-3 py-2 font-body text-sm outline-none focus:border-gold-dark"
        />
        <input
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          placeholder="Confirmar nova senha"
          value={confirmar}
          onChange={(e) => setConfirmar(e.target.value)}
          className="w-full rounded border border-navy/20 px-3 py-2 font-body text-sm outline-none focus:border-gold-dark"
        />

        {msg && (
          <p className={`font-body text-sm ${ok ? 'text-green-700' : 'text-red-600'}`}>{msg}</p>
        )}

        <button
          type="submit"
          disabled={enviando}
          className="w-full rounded-sm bg-gold-dark py-2.5 font-body text-sm uppercase tracking-wide text-white transition-colors hover:bg-navy disabled:opacity-50"
        >
          {enviando ? 'trocando…' : 'trocar senha'}
        </button>
      </form>
    </div>
  );
}
