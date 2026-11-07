'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Download, X } from 'lucide-react';
import { jaInstalado, sistemaDoCelular } from '@/components/plataforma/guia-de-instalacao';

const CHAVE = 'villa-stradale-aviso-instalar';

/** Quem entrou pelo navegador do celular, por um convite por exemplo, descobre aqui que dá para instalar */
export function AvisoDeInstalacao() {
  const [mostrar, setMostrar] = useState(false);

  useEffect(() => {
    let dispensado = false;
    try {
      dispensado = localStorage.getItem(CHAVE) === '1';
    } catch {
      // armazenamento bloqueado: o aviso volta na próxima vez
    }
    setMostrar(!dispensado && !jaInstalado() && Boolean(sistemaDoCelular()));
  }, []);

  if (!mostrar) return null;

  const dispensar = () => {
    try {
      localStorage.setItem(CHAVE, '1');
    } catch {
      // só vale para esta abertura
    }
    setMostrar(false);
  };

  return (
    <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.08] py-1 pl-4 pr-1 backdrop-blur-md">
      <Download size={18} strokeWidth={1.6} className="shrink-0 text-gold" aria-hidden />
      <Link href="/instalar" className="flex-1 py-3 text-sm">
        Instale o app na tela de início
      </Link>
      <button type="button" onClick={dispensar} aria-label="Dispensar aviso" className="flex h-11 w-11 items-center justify-center rounded-full text-white/70 active:bg-white/10">
        <X size={18} aria-hidden />
      </button>
    </div>
  );
}
