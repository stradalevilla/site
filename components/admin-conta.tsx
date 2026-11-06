'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const CAMPO = 'w-full rounded border border-navy/20 px-3 py-2 font-body text-sm outline-none focus:border-gold-dark';
const BOTAO =
  'w-full rounded-sm bg-gold-dark py-2.5 font-body text-sm uppercase tracking-wide text-white transition-colors hover:bg-navy disabled:opacity-50';

export function MinhaConta({ nomeInicial, email }: { nomeInicial: string; email: string }) {
  const router = useRouter();
  const [nome, setNome] = useState(nomeInicial);
  const [avisoDoNome, setAvisoDoNome] = useState({ texto: '', ok: false });
  const [salvandoNome, setSalvandoNome] = useState(false);

  const [atual, setAtual] = useState('');
  const [nova, setNova] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [msg, setMsg] = useState('');
  const [ok, setOk] = useState(false);
  const [enviando, setEnviando] = useState(false);

  const salvarNome = async (e: React.FormEvent) => {
    e.preventDefault();
    setAvisoDoNome({ texto: '', ok: false });
    setSalvandoNome(true);
    const j = await fetch('/api/admin/conta', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome }),
    })
      .then((r) => r.json())
      .catch(() => ({ ok: false, error: 'Não foi possível falar com o servidor.' }));
    setAvisoDoNome(j.ok ? { texto: 'Nome salvo.', ok: true } : { texto: j.error, ok: false });
    setSalvandoNome(false);
    if (j.ok) router.refresh();
  };

  const trocar = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg('');
    setOk(false);
    if (nova !== confirmar) {
      setMsg('A confirmação não confere com a nova senha.');
      return;
    }
    setEnviando(true);
    try {
      const res = await fetch('/api/admin/senha', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ atual, nova }),
      });
      const j = await res.json();
      if (j.ok) {
        setOk(true);
        setMsg('Senha trocada. Você recebe um e-mail de aviso, e as outras sessões foram encerradas.');
        setAtual('');
        setNova('');
        setConfirmar('');
      } else {
        setMsg(j.error);
      }
    } catch {
      setMsg('Não foi possível falar com o servidor. Confira se a senha mudou antes de tentar de novo.');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="p-8 md:p-10">
      <h1 className="font-heading text-2xl uppercase tracking-wide text-navy md:text-3xl">Minha conta</h1>
      <p className="mt-1 font-body text-sm text-gray-500">{email}</p>

      <form onSubmit={salvarNome} className="mt-8 max-w-md space-y-3 rounded-lg border border-neutral-200 bg-white p-5">
        <p className="font-body text-sm font-semibold text-navy">Nome</p>
        <input required maxLength={120} placeholder="Seu nome" value={nome} onChange={(e) => setNome(e.target.value)} className={CAMPO} />
        {avisoDoNome.texto && (
          <p className={`font-body text-sm ${avisoDoNome.ok ? 'text-green-700' : 'text-red-600'}`}>{avisoDoNome.texto}</p>
        )}
        <button type="submit" disabled={salvandoNome} className={BOTAO}>
          {salvandoNome ? 'salvando…' : 'salvar nome'}
        </button>
      </form>

      <form onSubmit={trocar} className="mt-6 max-w-md space-y-3 rounded-lg border border-neutral-200 bg-white p-5">
        <p className="font-body text-sm font-semibold text-navy">Trocar senha</p>
        <input
          type="password"
          required
          autoComplete="current-password"
          placeholder="Senha atual"
          value={atual}
          onChange={(e) => setAtual(e.target.value)}
          className={CAMPO}
        />
        <input
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          placeholder="Nova senha (mín. 8)"
          value={nova}
          onChange={(e) => setNova(e.target.value)}
          className={CAMPO}
        />
        <input
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          placeholder="Confirmar nova senha"
          value={confirmar}
          onChange={(e) => setConfirmar(e.target.value)}
          className={CAMPO}
        />

        {msg && <p className={`font-body text-sm ${ok ? 'text-green-700' : 'text-red-600'}`}>{msg}</p>}

        <button type="submit" disabled={enviando} className={BOTAO}>
          {enviando ? 'trocando…' : 'trocar senha'}
        </button>
      </form>
    </div>
  );
}
