'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BOTAO, CAMPO, CARTAO } from '@/components/plataforma/estilos';

export function MinhaContaDoApp({ nomeInicial, email }: { nomeInicial: string; email: string }) {
  const router = useRouter();
  const [nome, setNome] = useState(nomeInicial);
  const [avisoDoNome, setAvisoDoNome] = useState({ texto: '', ok: false });
  const [salvandoNome, setSalvandoNome] = useState(false);

  const [atual, setAtual] = useState('');
  const [nova, setNova] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [aviso, setAviso] = useState({ texto: '', ok: false });
  const [trocando, setTrocando] = useState(false);

  const salvarNome = async (e: React.FormEvent) => {
    e.preventDefault();
    setAvisoDoNome({ texto: '', ok: false });
    setSalvandoNome(true);
    const j = await fetch('/api/admin/conta', {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
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
    setAviso({ texto: '', ok: false });
    if (nova !== confirmar) {
      setAviso({ texto: 'A confirmação não confere com a nova senha.', ok: false });
      return;
    }
    setTrocando(true);
    try {
      const j = await (
        await fetch('/api/admin/senha', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ atual, nova }),
        })
      ).json();
      if (j.ok) {
        setAviso({ texto: 'Senha trocada. Você recebe um e-mail de aviso, e as outras sessões foram encerradas.', ok: true });
        setAtual('');
        setNova('');
        setConfirmar('');
      } else {
        setAviso({ texto: j.error, ok: false });
      }
    } catch {
      setAviso({ texto: 'Não foi possível falar com o servidor. Confira se a senha mudou antes de tentar de novo.', ok: false });
    } finally {
      setTrocando(false);
    }
  };

  const cor = (ok: boolean) => (ok ? 'text-green-300' : 'text-[#F2A06A]');

  return (
    <div className="space-y-4">
      <p className="text-sm text-white/60">{email}</p>

      <form onSubmit={salvarNome} className={`${CARTAO} space-y-3 p-4`}>
        <p className="text-base font-medium">Nome</p>
        <input required maxLength={120} autoComplete="name" placeholder="Seu nome" aria-label="Seu nome" value={nome} onChange={(e) => setNome(e.target.value)} className={CAMPO} />
        {avisoDoNome.texto && <p className={`text-sm ${cor(avisoDoNome.ok)}`}>{avisoDoNome.texto}</p>}
        <button type="submit" disabled={salvandoNome} className={BOTAO}>
          {salvandoNome ? 'Salvando…' : 'Salvar nome'}
        </button>
      </form>

      <form onSubmit={trocar} className={`${CARTAO} space-y-3 p-4`}>
        <p className="text-base font-medium">Trocar senha</p>
        <input type="password" required autoComplete="current-password" placeholder="Senha atual" aria-label="Senha atual" value={atual} onChange={(e) => setAtual(e.target.value)} className={CAMPO} />
        <input type="password" required minLength={8} autoComplete="new-password" placeholder="Nova senha (mín. 8)" aria-label="Nova senha" value={nova} onChange={(e) => setNova(e.target.value)} className={CAMPO} />
        <input type="password" required minLength={8} autoComplete="new-password" placeholder="Confirmar nova senha" aria-label="Confirmar nova senha" value={confirmar} onChange={(e) => setConfirmar(e.target.value)} className={CAMPO} />
        {aviso.texto && <p className={`text-sm ${cor(aviso.ok)}`}>{aviso.texto}</p>}
        <button type="submit" disabled={trocando} className={BOTAO}>
          {trocando ? 'Trocando…' : 'Trocar senha'}
        </button>
      </form>
    </div>
  );
}
