'use client';

import { useState } from 'react';
import { Confirmacao } from '@/components/admin-confirmacao';
import { useGestaoDeUsuarios } from '@/hooks/usar-gestao-de-usuarios';
import { ROTULO_DA_SITUACAO, ROTULO_DO_PAPEL, type Papel, type SituacaoDoUsuario } from '@/lib/usuarios';

const CAMPO =
  'rounded border border-navy/20 px-3 py-2 font-body text-sm outline-none focus:border-gold-dark disabled:opacity-50';
const ACAO = 'font-body text-xs uppercase tracking-wide text-navy underline-offset-2 hover:underline disabled:opacity-40';

const COR_DA_SITUACAO: Record<SituacaoDoUsuario, string> = {
  ativo: 'bg-green-100 text-green-800',
  convite: 'bg-amber-100 text-amber-800',
  desativado: 'bg-neutral-200 text-neutral-700',
};

const data = (valor: string | null) => (valor ? new Date(valor).toLocaleDateString('pt-BR') : '—');

export function GestaoDeUsuarios({ meuId }: { meuId: string }) {
  const g = useGestaoDeUsuarios();
  const { usuarios, carregando, ocupado, aviso, copiado, pedido, setPedido, agir, mudarPapel, desativar, remover, copiar } = g;
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [papel, setPapel] = useState<Papel>('equipe');

  const convidar = (e: React.FormEvent) => {
    e.preventDefault();
    g.convidar({ nome, email, papel }, () => {
      setNome('');
      setEmail('');
      setPapel('equipe');
    });
  };

  return (
    <div className="p-8 md:p-10">
      <h1 className="font-heading text-2xl uppercase tracking-wide text-navy md:text-3xl">Usuários</h1>
      <p className="mt-1 font-body text-sm text-gray-500">Quem pode acessar o painel de gestão.</p>

      <form onSubmit={convidar} className="mt-8 max-w-3xl rounded-lg border border-neutral-200 bg-white p-5">
        <p className="font-body text-sm font-semibold text-navy">Convidar pessoa</p>
        <div className="mt-3 flex flex-col gap-3 md:flex-row">
          <input
            required
            disabled={ocupado}
            maxLength={120}
            placeholder="nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className={`${CAMPO} flex-1`}
          />
          <input
            type="email"
            required
            disabled={ocupado}
            placeholder="e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`${CAMPO} flex-1`}
          />
          <select value={papel} disabled={ocupado} onChange={(e) => setPapel(e.target.value as Papel)} aria-label="Papel" className={CAMPO}>
            <option value="equipe">{ROTULO_DO_PAPEL.equipe}</option>
            <option value="administrador">{ROTULO_DO_PAPEL.administrador}</option>
          </select>
          <button
            type="submit"
            disabled={ocupado}
            className="rounded-sm bg-gold-dark px-5 py-2 font-body text-sm uppercase tracking-wide text-white transition-colors hover:bg-navy disabled:opacity-50"
          >
            Convidar
          </button>
        </div>
        <p className="mt-2 font-body text-xs text-gray-500">
          A pessoa recebe um e-mail para criar a própria senha. Equipe usa o painel; administrador também gerencia os usuários.
        </p>
      </form>

      {aviso && (
        <div role="status" className={`mt-5 max-w-3xl font-body text-sm ${aviso.ok ? 'text-green-700' : 'text-red-600'}`}>
          <p>{aviso.texto}</p>
          {aviso.link && (
            <div className="mt-2 flex gap-2">
              <input readOnly value={aviso.link} aria-label="Link" onFocus={(e) => e.target.select()} className={`${CAMPO} flex-1 text-navy`} />
              <button
                type="button"
                onClick={() => copiar(aviso.link!)}
                className="rounded-sm border border-navy/20 px-4 font-body text-xs uppercase tracking-wide text-navy hover:bg-neutral-100"
              >
                {copiado ? 'copiado' : 'copiar'}
              </button>
            </div>
          )}
        </div>
      )}

      <div className="mt-8 overflow-x-auto rounded-lg border border-neutral-200 bg-white">
        {carregando ? (
          <p className="p-5 font-body text-sm text-gray-500">carregando…</p>
        ) : (
          <table className="w-full min-w-[820px] text-left font-body text-sm">
            <thead className="border-b border-neutral-200 bg-neutral-50 text-xs uppercase tracking-wide text-gray-500">
              <tr>
                <th scope="col" className="px-5 py-3">Pessoa</th>
                <th scope="col" className="px-5 py-3">Papel</th>
                <th scope="col" className="px-5 py-3">Situação</th>
                <th scope="col" className="px-5 py-3">Último acesso</th>
                <th scope="col" className="px-5 py-3">Ações</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((u) => {
                const eu = u.id === meuId;
                return (
                  <tr key={u.id} className="border-b border-neutral-100 align-top last:border-0">
                    <td className="px-5 py-3 text-navy">
                      <span className="font-medium">{u.nome || u.email}</span>
                      {eu && <span className="ml-2 text-xs text-gray-500">você</span>}
                      {u.nome && <span className="block text-xs text-gray-500">{u.email}</span>}
                    </td>
                    <td className="px-5 py-3">
                      {eu ? (
                        <span className="text-gray-600">{ROTULO_DO_PAPEL[u.papel]}</span>
                      ) : (
                        <select
                          value={u.papel}
                          disabled={ocupado}
                          aria-label={`Papel de ${u.email}`}
                          onChange={(e) => mudarPapel(u, e.target.value as Papel)}
                          className={CAMPO}
                        >
                          <option value="equipe">{ROTULO_DO_PAPEL.equipe}</option>
                          <option value="administrador">{ROTULO_DO_PAPEL.administrador}</option>
                        </select>
                      )}
                    </td>
                    <td className="px-5 py-3">
                      <span className={`inline-block whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs ${COR_DA_SITUACAO[u.situacao]}`}>
                        {ROTULO_DA_SITUACAO[u.situacao]}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-gray-500">{data(u.ultimo_login)}</td>
                    <td className="px-5 py-3">
                      <div className="flex flex-wrap gap-x-4 gap-y-1">
                        {u.situacao === 'convite' && (
                          <button disabled={ocupado} onClick={() => agir(u, 'reenviar_convite', `Convite reenviado para ${u.email}.`)} className={ACAO}>
                            reenviar convite
                          </button>
                        )}
                        {u.situacao === 'ativo' && !eu && (
                          <button disabled={ocupado} onClick={() => agir(u, 'nova_senha', `Link de nova senha enviado para ${u.email}.`)} className={ACAO}>
                            enviar nova senha
                          </button>
                        )}
                        {u.situacao === 'ativo' && !eu && (
                          <button disabled={ocupado} onClick={() => desativar(u)} className={ACAO}>
                            desativar
                          </button>
                        )}
                        {u.situacao === 'desativado' && (
                          <button disabled={ocupado} onClick={() => agir(u, 'reativar', `${u.email} foi reativado.`)} className={ACAO}>
                            reativar
                          </button>
                        )}
                        {!eu && (
                          <button
                            disabled={ocupado}
                            onClick={() => remover(u)}
                            className="font-body text-xs uppercase tracking-wide text-red-600 underline-offset-2 hover:underline disabled:opacity-40"
                          >
                            remover
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      <Confirmacao pedido={pedido} fechar={() => setPedido(null)} />
    </div>
  );
}
