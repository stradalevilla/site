'use client';

import { useRef } from 'react';
import * as AlertDialog from '@radix-ui/react-alert-dialog';

export type PedidoDeConfirmacao = {
  titulo: string;
  texto: string;
  rotulo: string;
  perigoso?: boolean;
  confirmar: () => void;
};

/** A pergunta antes de uma ação que avisa ou tira o acesso de alguém */
export function Confirmacao({ pedido, fechar }: { pedido: PedidoDeConfirmacao | null; fechar: () => void }) {
  // ao fechar, o foco volta para quem abriu: quem usa teclado não perde o lugar na tabela
  const origem = useRef<HTMLElement | null>(null);

  return (
    <AlertDialog.Root open={Boolean(pedido)} onOpenChange={(aberto) => !aberto && fechar()}>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="fixed inset-0 z-50 bg-navy/40" />
        <AlertDialog.Content
          onOpenAutoFocus={() => {
            origem.current = document.activeElement as HTMLElement | null;
          }}
          onCloseAutoFocus={(e) => {
            e.preventDefault();
            origem.current?.focus();
          }}
          className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-lg"
        >
          <AlertDialog.Title className="font-heading text-xl text-navy">{pedido?.titulo}</AlertDialog.Title>
          <AlertDialog.Description className="mt-2 font-body text-sm leading-relaxed text-gray-600">
            {pedido?.texto}
          </AlertDialog.Description>
          <div className="mt-6 flex justify-end gap-3">
            <AlertDialog.Cancel className="rounded-sm border border-navy/20 px-4 py-2 font-body text-xs uppercase tracking-wide text-navy transition-colors hover:bg-neutral-100">
              cancelar
            </AlertDialog.Cancel>
            <AlertDialog.Action
              onClick={() => pedido?.confirmar()}
              className={`rounded-sm px-4 py-2 font-body text-xs uppercase tracking-wide text-white transition-colors ${
                pedido?.perigoso ? 'bg-red-600 hover:bg-red-700' : 'bg-gold-dark hover:bg-navy'
              }`}
            >
              {pedido?.rotulo}
            </AlertDialog.Action>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}
