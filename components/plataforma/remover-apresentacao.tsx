'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Confirmacao, type PedidoDeConfirmacao } from '@/components/admin-confirmacao';

export function RemoverApresentacao({ id, titulo }: { id: string; titulo: string }) {
  const router = useRouter();
  const [pedido, setPedido] = useState<PedidoDeConfirmacao | null>(null);
  const [erro, setErro] = useState('');
  const [removendo, setRemovendo] = useState(false);

  const remover = async () => {
    setErro('');
    setRemovendo(true);
    const j = await fetch(`/api/plataforma/apresentacoes?id=${id}`, { method: 'DELETE' })
      // 404 é o segundo toque depois de uma resposta perdida: já foi removida
      .then(async (r) => (r.status === 404 ? { ok: true } : r.json()))
      .catch(() => ({ ok: false, error: 'Não foi possível falar com o servidor.' }));
    if (j.ok) {
      router.replace('/apresentacoes');
      router.refresh();
      return;
    }
    setErro(j.error);
    setRemovendo(false);
  };

  return (
    <>
      <button
        type="button"
        disabled={removendo}
        onClick={() =>
          setPedido({
            titulo: 'Remover a apresentação?',
            texto: `"${titulo}" sai do app para todo mundo. Isso não tem volta.`,
            rotulo: 'remover',
            perigoso: true,
            confirmar: remover,
          })
        }
        className="block w-full py-3 text-center text-sm text-[#F2A06A] disabled:opacity-50"
      >
        {removendo ? 'Removendo…' : 'Remover apresentação'}
      </button>
      {erro && <p role="alert" className="text-center text-sm text-[#F2A06A]">{erro}</p>}
      <Confirmacao pedido={pedido} fechar={() => setPedido(null)} />
    </>
  );
}
