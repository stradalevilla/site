'use client';

import { useEffect, useState } from 'react';
import { GuiaDeInstalacao, jaInstalado, sistemaDoCelular } from '@/components/plataforma/guia-de-instalacao';

export function Instalar() {
  const [sistema, setSistema] = useState<'ios' | 'android' | null>(null);

  useEffect(() => {
    const encontrado = jaInstalado() ? null : sistemaDoCelular();
    if (encontrado) setSistema(encontrado);
    else window.location.replace('/');
  }, []);

  if (!sistema) return null;
  return <GuiaDeInstalacao sistema={sistema} continuar={() => window.location.replace('/')} />;
}
