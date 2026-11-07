'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

const VELHO_MS = 2 * 60 * 60 * 1000;

/**
 * O link assinado sai pronto do servidor e vale 3 horas: no iPhone, buscar o endereço depois
 * do toque perderia a permissão de abrir. Quem volta a uma tela antiga recebe um link novo
 * antes de tocar. Com vídeo tocando espera, porque trocar o endereço reiniciaria o filme.
 */
export function RenovarLinks({ geradoEm }: { geradoEm: number }) {
  const router = useRouter();
  const pedidoEm = useRef(0); // aparelho com o relógio errado pediria um link novo sem parar

  useEffect(() => {
    const conferir = () => {
      const agora = Date.now();
      if (document.hidden || agora - geradoEm < VELHO_MS || agora - pedidoEm.current < VELHO_MS) return;
      if (document.querySelector('video')?.paused === false) return;
      pedidoEm.current = agora;
      router.refresh();
    };
    conferir();
    document.addEventListener('visibilitychange', conferir);
    const relogio = setInterval(conferir, 5 * 60 * 1000);
    return () => {
      document.removeEventListener('visibilitychange', conferir);
      clearInterval(relogio);
    };
  }, [geradoEm, router]);

  return null;
}
