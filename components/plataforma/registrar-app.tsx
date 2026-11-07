'use client';

import { useEffect } from 'react';

/** Liga o service worker, e confere se há versão nova sempre que o app volta para a frente */
export function RegistrarApp() {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production' || !('serviceWorker' in navigator)) return;

    let registro: ServiceWorkerRegistration | undefined;
    const conferir = () => {
      if (document.visibilityState === 'visible') registro?.update().catch(() => {});
    };

    navigator.serviceWorker
      .register('/sw.js', { updateViaCache: 'none' })
      .then((r) => {
        registro = r;
      })
      .catch(() => {});

    document.addEventListener('visibilitychange', conferir);
    return () => document.removeEventListener('visibilitychange', conferir);
  }, []);

  return null;
}
