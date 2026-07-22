'use client';

import { useEffect, useState } from 'react';

type Usuario = {
  id: string;
  email: string | null;
  criado_em: string;
  ultimo_login: string | null;
};

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [msg, setMsg] = useState('');
  const [enviando, setEnviando] = useState(false);

  const carregar = async () => {
    setCarregando(true);
    const res = await fetch('/api/admin/usuarios');
    const j = await res.json();
    if (j.ok) setUsuarios(j.usuarios);
    setCarregando(false);
  };

  useEffect(() => {
    carregar();
  }, []);

  const adicionar = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg('');
    setEnviando(true);
    const res = await fetch('/api/admin/usuarios', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, senha }),
    });
    const j = await res.json();
    if (j.ok) {
      setMsg(`Usuário ${email} criado.`);
      setEmail('');
      setSenha('');
      carregar();
    } else {
      setMsg(`Erro: ${j.error}`);
    }
    setEnviando(false);
  };

  const remover = async (u: Usuario) => {
    if (!confirm(`Remover o acesso de ${u.email}?`)) return;
    const res = await fetch(`/api/admin/usuarios?id=${u.id}`, { method: 'DELETE' });
    const j = await res.json();
    if (j.ok) carregar();
    else alert(`Erro: ${j.error}`);
  };

  const fmt = (d: string | null) =>
    d ? new Date(d).toLocaleDateString('pt-BR') : '—';

  return (
    <div className="p-8 md:p-10">
      <h1 className="font-heading text-2xl uppercase tracking-wide text-navy md:text-3xl">Usuários</h1>
      <p className="mt-1 font-body text-sm text-gray-500">Quem pode acessar o painel de gestão.</p>

      {/* Formulário de novo usuário */}
      <form onSubmit={adicionar} className="mt-8 max-w-xl rounded-lg border border-neutral-200 bg-white p-5">
        <p className="font-body text-sm font-semibold text-navy">Adicionar acesso</p>
        <div className="mt-3 flex flex-col gap-3 sm:flex-row">
          <input
            type="email"
            required
            placeholder="e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 rounded border border-navy/20 px-3 py-2 font-body text-sm outline-none focus:border-gold-dark"
          />
          <input
            type="text"
            required
            minLength={8}
            placeholder="senha (mín. 8)"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            className="flex-1 rounded border border-navy/20 px-3 py-2 font-body text-sm outline-none focus:border-gold-dark"
          />
          <button
            type="submit"
            disabled={enviando}
            className="rounded-sm bg-gold-dark px-5 py-2 font-body text-sm uppercase tracking-wide text-white transition-colors hover:bg-navy disabled:opacity-50"
          >
            Adicionar
          </button>
        </div>
        {msg && <p className="mt-3 font-body text-sm text-gray-600">{msg}</p>}
        <p className="mt-2 font-body text-xs text-gray-400">
          A pessoa entra em /admin/login com esse e-mail e senha. Avise a senha a ela por um canal seguro.
        </p>
      </form>

      {/* Lista */}
      <div className="mt-8 max-w-3xl overflow-hidden rounded-lg border border-neutral-200 bg-white">
        {carregando ? (
          <p className="p-5 font-body text-sm text-gray-500">carregando…</p>
        ) : (
          <table className="w-full text-left font-body text-sm">
            <thead className="border-b border-neutral-200 bg-neutral-50 text-xs uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-5 py-3">E-mail</th>
                <th className="px-5 py-3">Criado</th>
                <th className="px-5 py-3">Último acesso</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((u) => (
                <tr key={u.id} className="border-b border-neutral-100 last:border-0">
                  <td className="px-5 py-3 text-navy">{u.email}</td>
                  <td className="px-5 py-3 text-gray-500">{fmt(u.criado_em)}</td>
                  <td className="px-5 py-3 text-gray-500">{fmt(u.ultimo_login)}</td>
                  <td className="px-5 py-3 text-right">
                    <button
                      onClick={() => remover(u)}
                      className="font-body text-xs uppercase tracking-wide text-red-600 hover:underline"
                    >
                      remover
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
