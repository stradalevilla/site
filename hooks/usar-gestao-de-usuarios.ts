'use client';

import { useEffect, useState } from 'react';
import type { PedidoDeConfirmacao } from '@/components/admin-confirmacao';
import { ROTULO_DO_PAPEL, type Papel, type ResumoDoUsuario } from '@/lib/usuarios';

export type Aviso = { texto: string; ok: boolean; link?: string };

/** Tudo o que a tela de usuários faz, no painel e no app. Só o desenho muda entre os dois. */
export function useGestaoDeUsuarios() {
  const [usuarios, setUsuarios] = useState<ResumoDoUsuario[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [ocupado, setOcupado] = useState(false);
  const [aviso, setAviso] = useState<Aviso | null>(null);
  const [copiado, setCopiado] = useState(false);
  const [pedido, setPedido] = useState<PedidoDeConfirmacao | null>(null);

  const carregar = async () => {
    const j = await fetch('/api/admin/usuarios')
      .then((r) => r.json())
      .catch(() => null);
    if (j?.ok) setUsuarios(j.usuarios);
    else setAviso({ texto: j?.error ?? 'Não foi possível carregar a lista.', ok: false });
    setCarregando(false);
  };

  useEffect(() => {
    carregar();
  }, []);

  /** Toda ação passa por aqui: o e-mail pode falhar sem a ação ter falhado, e o link fica à mão */
  const executar = async (chamada: Promise<Response>, sucesso: string) => {
    setOcupado(true);
    setAviso(null);
    setCopiado(false);
    try {
      const j = await (await chamada).json();
      await carregar();
      if (!j.ok) setAviso({ texto: j.error, ok: false });
      else if (j.emailEnviado === false) {
        setAviso({ texto: 'O e-mail não saiu. Copie o link abaixo e mande por outro canal. Ele vale por 24 horas.', ok: false, link: j.link });
      } else setAviso({ texto: sucesso, ok: true });
      return Boolean(j.ok);
    } catch {
      setAviso({ texto: 'Não foi possível falar com o servidor.', ok: false });
      return false;
    } finally {
      setOcupado(false);
    }
  };

  const json = (metodo: string, corpo: object) =>
    fetch('/api/admin/usuarios', {
      method: metodo,
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(corpo),
    });

  const agir = (u: ResumoDoUsuario, acao: string, sucesso: string, extra: object = {}) =>
    executar(json('PATCH', { id: u.id, acao, ...extra }), sucesso);

  // e-mail digitado errado volta como devolução, e poucas devoluções já fazem o Resend pausar o envio
  const convidar = (dados: { nome: string; email: string; papel: Papel }, aoConcluir: () => void) =>
    setPedido({
      titulo: 'Enviar o convite?',
      texto: `O convite vai para ${dados.email}. Confira se o endereço está certo.`,
      rotulo: 'enviar convite',
      confirmar: async () => {
        if (await executar(json('POST', dados), `Convite enviado para ${dados.email}.`)) aoConcluir();
      },
    });

  const mudarPapel = (u: ResumoDoUsuario, novo: Papel) =>
    setPedido({
      titulo: 'Mudar o papel?',
      texto: `${u.email} passa a ser ${ROTULO_DO_PAPEL[novo]}.`,
      rotulo: 'mudar papel',
      confirmar: () => agir(u, 'papel', `Papel de ${u.email} alterado.`, { papel: novo }),
    });

  const desativar = (u: ResumoDoUsuario) =>
    setPedido({
      titulo: 'Desativar o acesso?',
      texto: `${u.email} para de entrar na hora e recebe um aviso por e-mail. Você pode reativar depois.`,
      rotulo: 'desativar',
      perigoso: true,
      confirmar: () => agir(u, 'desativar', `${u.email} foi desativado.`),
    });

  const remover = (u: ResumoDoUsuario) =>
    setPedido({
      titulo: 'Remover o acesso?',
      texto: `Isso não tem volta: para ${u.email} entrar de novo, só com outro convite.`,
      rotulo: 'remover',
      perigoso: true,
      confirmar: () => executar(fetch(`/api/admin/usuarios?id=${u.id}`, { method: 'DELETE' }), `${u.email} foi removido.`),
    });

  const copiar = async (link: string) => {
    await navigator.clipboard.writeText(link);
    setCopiado(true);
  };

  return { usuarios, carregando, ocupado, aviso, copiado, pedido, setPedido, agir, convidar, mudarPapel, desativar, remover, copiar };
}
