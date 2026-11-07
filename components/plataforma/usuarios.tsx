'use client';

import { useEffect, useRef, useState } from 'react';
import { ChevronDown, UserPlus } from 'lucide-react';
import { Confirmacao } from '@/components/admin-confirmacao';
import { BOTAO, BOTAO_SECUNDARIO, CAMPO, CARTAO } from '@/components/plataforma/estilos';
import { usarGestaoDeUsuarios } from '@/hooks/usar-gestao-de-usuarios';
import { ROTULO_DA_SITUACAO, ROTULO_DO_PAPEL, type Papel, type SituacaoDoUsuario } from '@/lib/usuarios';

const COR_DA_SITUACAO: Record<SituacaoDoUsuario, string> = {
  ativo: 'bg-green-400/15 text-green-300',
  convite: 'bg-amber-400/15 text-amber-300',
  desativado: 'bg-white/10 text-white/70',
};

const ACAO = 'rounded-xl border border-white/15 px-3 py-2 text-sm transition active:bg-white/10 disabled:opacity-40';

/** Sem a seta, a escolha do papel parece um campo de texto */
function Escolha({ className = '', ...resto }: React.ComponentProps<'select'>) {
  return (
    <div className="relative">
      <select {...resto} className={`${CAMPO} appearance-none pr-11 ${className}`} />
      <ChevronDown size={18} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-white/50" aria-hidden />
    </div>
  );
}

export function UsuariosDoApp({ meuId }: { meuId: string }) {
  const g = usarGestaoDeUsuarios();
  const { usuarios, carregando, ocupado, aviso, copiado, pedido, setPedido, agir, mudarPapel, desativar, remover, copiar } = g;
  const [abrirConvite, setAbrirConvite] = useState(false);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [papel, setPapel] = useState<Papel>('equipe');
  const avisoNaTela = useRef<HTMLDivElement>(null);

  // quem age na pessoa do fim da lista precisa ver o resultado, sobretudo quando o e-mail não sai
  useEffect(() => {
    if (aviso) avisoNaTela.current?.scrollIntoView({ block: 'center', behavior: 'smooth' });
  }, [aviso]);

  const convidar = (e: React.FormEvent) => {
    e.preventDefault();
    g.convidar({ nome, email, papel }, () => {
      setNome('');
      setEmail('');
      setPapel('equipe');
      setAbrirConvite(false);
    });
  };

  return (
    <div className="space-y-4">
      {abrirConvite ? (
        <form onSubmit={convidar} className={`${CARTAO} space-y-3 p-4`}>
          <p className="text-base font-medium">Convidar pessoa</p>
          <input required disabled={ocupado} maxLength={120} autoComplete="off" placeholder="Nome" aria-label="Nome" value={nome} onChange={(e) => setNome(e.target.value)} className={CAMPO} />
          <input type="email" required disabled={ocupado} inputMode="email" autoComplete="off" placeholder="E-mail" aria-label="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} className={CAMPO} />
          <Escolha value={papel} disabled={ocupado} aria-label="Papel" onChange={(e) => setPapel(e.target.value as Papel)}>
            <option value="equipe" className="text-navy">Equipe: usa o app</option>
            <option value="administrador" className="text-navy">Administrador: também gerencia usuários</option>
          </Escolha>
          <p className="text-sm text-white/60">A pessoa recebe um e-mail para criar a própria senha.</p>
          <button type="submit" disabled={ocupado} className={BOTAO}>
            Enviar convite
          </button>
          <button type="button" onClick={() => setAbrirConvite(false)} className={BOTAO_SECUNDARIO}>
            Cancelar
          </button>
        </form>
      ) : (
        <button type="button" onClick={() => setAbrirConvite(true)} className={`${BOTAO} flex items-center justify-center gap-2`}>
          <UserPlus size={20} strokeWidth={1.6} aria-hidden />
          Convidar pessoa
        </button>
      )}

      {aviso && (
        <div ref={avisoNaTela} role="status" className={`text-sm ${aviso.ok ? 'text-green-300' : 'text-[#F2A06A]'}`}>
          <p>{aviso.texto}</p>
          {aviso.link && (
            <div className="mt-2 flex gap-2">
              <input readOnly value={aviso.link} aria-label="Link" onFocus={(e) => e.target.select()} className={`${CAMPO} py-3 text-sm`} />
              <button type="button" onClick={() => copiar(aviso.link!)} className={ACAO}>
                {copiado ? 'Copiado' : 'Copiar'}
              </button>
            </div>
          )}
        </div>
      )}

      {carregando ? (
        <p className="text-center text-base text-white/60">Carregando…</p>
      ) : (
        <ul className="space-y-2">
          {usuarios.map((u) => {
            const eu = u.id === meuId;
            return (
              <li key={u.id} className={`${CARTAO} space-y-3 p-4`}>
                <div className="flex items-start gap-2">
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-base font-medium">
                      {u.nome || u.email}
                      {eu && <span className="ml-2 text-sm font-normal text-white/50">você</span>}
                    </span>
                    {u.nome && <span className="mt-0.5 block truncate text-sm text-white/60">{u.email}</span>}
                  </span>
                  <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs ${COR_DA_SITUACAO[u.situacao]}`}>{ROTULO_DA_SITUACAO[u.situacao]}</span>
                </div>

                {eu ? (
                  <p className="text-sm text-white/60">{ROTULO_DO_PAPEL[u.papel]}</p>
                ) : (
                  <>
                    <Escolha
                      value={u.papel}
                      disabled={ocupado}
                      aria-label={`Papel de ${u.email}`}
                      onChange={(e) => mudarPapel(u, e.target.value as Papel)}
                      className="py-3"
                    >
                      <option value="equipe" className="text-navy">{ROTULO_DO_PAPEL.equipe}</option>
                      <option value="administrador" className="text-navy">{ROTULO_DO_PAPEL.administrador}</option>
                    </Escolha>
                    <div className="flex flex-wrap gap-2">
                      {u.situacao === 'convite' && (
                        <button type="button" disabled={ocupado} onClick={() => agir(u, 'reenviar_convite', `Convite reenviado para ${u.email}.`)} className={ACAO}>
                          Reenviar convite
                        </button>
                      )}
                      {u.situacao === 'ativo' && (
                        <button type="button" disabled={ocupado} onClick={() => agir(u, 'nova_senha', `Link de nova senha enviado para ${u.email}.`)} className={ACAO}>
                          Enviar nova senha
                        </button>
                      )}
                      {u.situacao === 'ativo' && (
                        <button type="button" disabled={ocupado} onClick={() => desativar(u)} className={ACAO}>
                          Desativar
                        </button>
                      )}
                      {u.situacao === 'desativado' && (
                        <button type="button" disabled={ocupado} onClick={() => agir(u, 'reativar', `${u.email} foi reativado.`)} className={ACAO}>
                          Reativar
                        </button>
                      )}
                      <button type="button" disabled={ocupado} onClick={() => remover(u)} className={`${ACAO} text-[#F2A06A]`}>
                        Remover
                      </button>
                    </div>
                  </>
                )}
              </li>
            );
          })}
        </ul>
      )}

      <Confirmacao pedido={pedido} fechar={() => setPedido(null)} />
    </div>
  );
}
