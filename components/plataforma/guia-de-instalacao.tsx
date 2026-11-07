'use client';

import { useEffect, useState } from 'react';
import { Ellipsis, Share, SquarePlus, Download } from 'lucide-react';

export function sistemaDoCelular() {
  const navegador = navigator.userAgent;
  // o iPad moderno se apresenta como Mac: quem denuncia é a tela de toque
  if (/iPhone|iPad|iPod/.test(navegador) || (/Macintosh/.test(navegador) && navigator.maxTouchPoints > 1)) return 'ios';
  return /Android/.test(navegador) ? 'android' : null;
}

export function jaInstalado() {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

type PedidoDeInstalacao = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: string }> };
type JanelaDoApp = Window & { __pedidoDeInstalacao?: PedidoDeInstalacao };

const PASSOS_DO_IPHONE = [
  { Icone: Ellipsis, texto: 'Toque nos três pontos, ao lado do endereço, ou no botão de compartilhar.' },
  { Icone: Share, texto: 'Toque em Compartilhar, se aparecer, e role até o fim da lista.' },
  { Icone: SquarePlus, texto: 'Escolha Adicionar à Tela de Início, deixe Abrir como App ligado e confirme.' },
];

const PASSOS_DO_ANDROID = [
  { Icone: Ellipsis, texto: 'Toque no menu de três pontos do navegador.' },
  { Icone: Download, texto: 'Escolha Instalar app ou Adicionar à tela inicial, e confirme.' },
];

/**
 * A primeira tela de quem abre o endereço no celular. O iPhone não deixa o site instalar
 * nada sozinho, então ela ensina o caminho. No Android, quando o navegador permite, um botão
 * resolve. A instalação vem antes do login para a pessoa entrar uma vez só, já dentro do app.
 */
export function GuiaDeInstalacao({ sistema, continuar }: { sistema: 'ios' | 'android'; continuar: () => void }) {
  const [podeInstalar, setPodeInstalar] = useState(false);
  const [instalando, setInstalando] = useState(false);
  const [instalado, setInstalado] = useState(false);

  useEffect(() => {
    const conferir = () => setPodeInstalar(Boolean((window as JanelaDoApp).__pedidoDeInstalacao));
    conferir();
    window.addEventListener('app-instalavel', conferir);
    return () => window.removeEventListener('app-instalavel', conferir);
  }, []);

  const instalar = async () => {
    const pedido = (window as JanelaDoApp).__pedidoDeInstalacao;
    if (!pedido) return;
    setInstalando(true);
    await pedido.prompt();
    const escolha = await pedido.userChoice.catch(() => null);
    (window as JanelaDoApp).__pedidoDeInstalacao = undefined;
    setInstalado(escolha?.outcome === 'accepted');
    setPodeInstalar(false);
    setInstalando(false);
  };

  const passos = sistema === 'ios' ? PASSOS_DO_IPHONE : PASSOS_DO_ANDROID;

  return (
    <div className="w-full max-w-sm">
      <h1 className="text-center font-heading text-3xl italic">Instale o app</h1>
      <p className="mt-3 text-center text-base leading-relaxed text-white/75">
        O Villa Stradale fica na sua tela de início, como um aplicativo.
      </p>

      {instalado ? (
        <p className="mt-8 rounded-2xl border border-white/10 bg-white/[0.06] p-4 text-center text-base leading-relaxed text-white/90">
          Pronto. Abra o Villa Stradale pelo ícone na tela de início.
        </p>
      ) : podeInstalar ? (
        <button
          type="button"
          onClick={instalar}
          disabled={instalando}
          className="mt-8 w-full rounded-2xl bg-gold-dark py-4 text-base font-medium transition active:scale-[0.98] disabled:opacity-60"
        >
          Instalar agora
        </button>
      ) : (
        <ol className="mt-8 space-y-3">
          {passos.map(({ Icone, texto }, i) => (
            <li key={texto} className="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/[0.06] p-4 backdrop-blur-xl">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-gold">
                <Icone size={20} strokeWidth={1.6} aria-hidden />
              </span>
              <span className="text-[15px] leading-snug text-white/90">
                <span className="sr-only">Passo {i + 1}: </span>
                {texto}
              </span>
            </li>
          ))}
        </ol>
      )}

      {sistema === 'ios' && (
        <p className="mt-4 text-center text-sm leading-relaxed text-white/60">
          Se veio de um link no Instagram ou no WhatsApp, abra primeiro no Safari.
        </p>
      )}

      <button type="button" onClick={continuar} className="mt-6 w-full py-3 text-sm text-white/70 underline underline-offset-4">
        Continuar no navegador
      </button>
    </div>
  );
}
