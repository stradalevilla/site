'use client';

import { useCallback, useEffect, useRef } from 'react';
import { LeitorDoBook } from '@/components/apresentacao/leitor-do-book';
import type { DadosDaImplantacao } from '@/components/apresentacao/tela-do-book';
import type { Tela } from '@/lib/book-digital';

const PASSO_MS = 5000;
const ENVIA_A_CADA = 6; // passos: meio minuto
const PARADO_MS = 10 * 60 * 1000;
const MESMA_VISITA_MS = 30 * 60 * 1000;

type Andamento = { id: string; telas: number[]; segundos: number; em: number };

function novoId() {
  if (typeof crypto.randomUUID === 'function') return crypto.randomUUID();
  // navegador antigo: o mesmo formato, com o sorteio do próprio navegador
  const b = crypto.getRandomValues(new Uint8Array(16));
  b[6] = (b[6] & 0x0f) | 0x40;
  b[8] = (b[8] & 0x3f) | 0x80;
  const h = Array.from(b, (n) => n.toString(16).padStart(2, '0')).join('');
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`;
}

const novaVisita = (): Andamento => ({ id: novoId(), telas: [], segundos: 0, em: Date.now() });

/**
 * O book que o cliente abre pelo link, e o registro da visita para quem mandou: quais telas
 * passaram e quanto tempo o book ficou aberto na frente. O id da visita nasce aqui e fica na
 * aba: recarregar continua a mesma visita, e reenviar não duplica. Depois de meia hora sem
 * notícia, a volta vira outra visita. O tempo para de contar depois de 10 minutos sem ninguém
 * mexer, para uma aba esquecida não virar horas de leitura. Na prévia do usuário, nada é gravado.
 */
export function BookCompartilhado({ codigo, telas, implantacao, previa }: { codigo: string; telas: Tela[]; implantacao: DadosDaImplantacao; previa: boolean }) {
  // nasce no navegador, no efeito: no servidor não há visita
  const andamento = useRef<Andamento>({ id: '', telas: [], segundos: 0, em: 0 });
  const vistas = useRef(new Set<number>());
  const mexeuEm = useRef(0);
  const mudou = useRef(true);

  const aoMudarTela = useCallback((i: number) => {
    mexeuEm.current = Date.now();
    if (!vistas.current.has(i)) {
      vistas.current.add(i);
      mudou.current = true;
    }
  }, []);

  useEffect(() => {
    if (previa) return;

    const chave = `book-visita-${codigo}`;
    andamento.current = novaVisita();
    mexeuEm.current = Date.now();
    const guardar = () => {
      andamento.current = { ...andamento.current, telas: [...vistas.current], em: Date.now() };
      try {
        sessionStorage.setItem(chave, JSON.stringify(andamento.current));
      } catch {
        // aba privada: recarregar abre outra visita
      }
    };
    /** meia hora sem notícia: a volta é outra visita, e só a tela de agora conta */
    const recomecarSeVelha = () => {
      if (Date.now() - andamento.current.em < MESMA_VISITA_MS) return;
      const agora = [...vistas.current].pop();
      andamento.current = novaVisita();
      vistas.current = new Set(agora === undefined ? [] : [agora]);
      mudou.current = true;
    };

    try {
      const antes = JSON.parse(sessionStorage.getItem(chave) ?? 'null') as Andamento | null;
      if (antes?.id && Date.now() - antes.em < MESMA_VISITA_MS) {
        andamento.current = antes;
        antes.telas.forEach((t) => vistas.current.add(t));
      }
    } catch {
      // sem nada guardado, a visita começa agora
    }

    const enviar = (fechando = false) => {
      recomecarSeVelha();
      guardar();
      mudou.current = false;
      fetch('/api/book/visita', {
        method: 'POST',
        keepalive: true,
        headers: { 'content-type': 'text/plain;charset=UTF-8' },
        body: JSON.stringify({
          codigo,
          id: andamento.current.id,
          telas: andamento.current.telas,
          segundos: Math.round(andamento.current.segundos),
          toques: navigator.maxTouchPoints || 0,
        }),
      })
        .then((r) => {
          // falhou: a próxima rodada manda de novo. Na página fechando, não há próxima
          if (!r.ok && !fechando) mudou.current = true;
        })
        .catch(() => {
          if (!fechando) mudou.current = true;
        });
    };

    enviar();

    let passos = 0;
    const relogio = setInterval(() => {
      if (document.hidden || Date.now() - mexeuEm.current > PARADO_MS) return;
      andamento.current.segundos += PASSO_MS / 1000;
      mudou.current = true;
      if (++passos % ENVIA_A_CADA === 0) enviar();
    }, PASSO_MS);

    const mexeu = () => (mexeuEm.current = Date.now());
    const trocouDeAba = () => {
      if (document.visibilityState === 'hidden') {
        if (mudou.current) enviar();
      } else {
        mexeuEm.current = Date.now();
        // volta depois de muito tempo: abre a visita nova na hora
        if (Date.now() - andamento.current.em >= MESMA_VISITA_MS) enviar();
      }
    };
    const fechou = () => mudou.current && enviar(true);

    window.addEventListener('pointerdown', mexeu);
    window.addEventListener('keydown', mexeu);
    document.addEventListener('visibilitychange', trocouDeAba);
    window.addEventListener('pagehide', fechou);
    return () => {
      clearInterval(relogio);
      window.removeEventListener('pointerdown', mexeu);
      window.removeEventListener('keydown', mexeu);
      document.removeEventListener('visibilitychange', trocouDeAba);
      window.removeEventListener('pagehide', fechou);
    };
  }, [codigo, previa]);

  return <LeitorDoBook telas={telas} implantacao={implantacao} aoMudarTela={aoMudarTela} />;
}
