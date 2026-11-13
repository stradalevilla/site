'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { IconMessageCircle } from '@tabler/icons-react';

/**
 * "Fale com um Consultor", fixo no canto de baixo à direita em todas as páginas do site. Leva ao
 * formulário de interesse da própria página; onde não há formulário, leva ao da home. Some
 * enquanto o formulário está na tela, para não cobrir o que a pessoa está preenchendo, e não
 * aparece no painel.
 */
export function BotaoConsultor() {
  const caminho = usePathname();
  const [pronto, setPronto] = useState(false);
  const [formularioNaTela, setFormularioNaTela] = useState(false);

  // entra depois da abertura da página, sem disputar com ela
  useEffect(() => {
    const espera = setTimeout(() => setPronto(true), 1200);
    return () => clearTimeout(espera);
  }, []);

  // a seção do formulário muda a cada página: procura de novo quando a página troca
  useEffect(() => {
    setFormularioNaTela(false);
    const secao = document.getElementById('contato');
    if (!secao || !('IntersectionObserver' in window)) return;
    const observador = new IntersectionObserver(([entrada]) => setFormularioNaTela(entrada.isIntersecting), { threshold: 0.2 });
    observador.observe(secao);
    return () => observador.disconnect();
  }, [caminho]);

  if (caminho?.startsWith('/admin')) return null;

  const irAoFormulario = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const secao = document.getElementById('contato');
    if (!secao) return; // sem formulário nesta página: o link leva ao da home
    e.preventDefault();
    const suave = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    secao.scrollIntoView({ behavior: suave ? 'smooth' : 'auto', block: 'start' });
  };

  const escondido = !pronto || formularioNaTela;

  return (
    <Link
      href="/#contato"
      onClick={irAoFormulario}
      id="botao-fale-com-consultor"
      aria-hidden={escondido}
      tabIndex={escondido ? -1 : 0}
      className={`fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-4 z-40 inline-flex min-h-[42px] items-center gap-2 rounded-full bg-[#D07748] py-2 pl-3.5 pr-4 font-body text-[13px] font-medium tracking-wide text-white shadow-[0_8px_24px_rgba(10,25,41,0.3)] transition-all duration-500 ease-out hover:bg-[#b9653a] focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#D07748] md:bottom-8 md:right-8 md:text-sm ${
        escondido ? 'pointer-events-none translate-y-4 opacity-0' : 'translate-y-0 opacity-100'
      }`}
    >
      <IconMessageCircle size={17} stroke={1.6} aria-hidden />
      Fale com um Consultor
    </Link>
  );
}
