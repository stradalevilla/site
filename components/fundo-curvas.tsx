'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { CONFIG_PADRAO, criarDesenhista, type ConfigDoFundo, type Desenhista } from '@/lib/curvas-de-nivel';

/**
 * O fundo como o site o usa: atrás de tudo, menos no painel.
 *
 * No admin ele atrapalhava duas vezes. Desenhava a tela cheia por baixo de
 * uma interface opaca, que ninguém vê, e no /admin/grafismo somava o próprio
 * custo ao da prévia — o medidor de quadros marcava os dois canvas juntos, e
 * era com esse número que o admin decidia se uma calibragem podia ir para o
 * ar.
 */
export function FundoDoSite({ config }: { config?: ConfigDoFundo }) {
  const caminho = usePathname();
  if (caminho?.startsWith('/admin')) return null;
  return <FundoCurvas config={config} />;
}

/**
 * O grafismo de fundo do site, desenhado em movimento no lugar da imagem
 * estática que se repetia atrás de tudo.
 *
 * Cuidados que a versão do site tem e o protótipo não tinha:
 *  · com "reduzir movimento" ligado, desenha um quadro e para;
 *  · no celular a malha abre e as linhas diminuem, porque o custo cresce com
 *    a área e lá o desenho concorre com a rolagem;
 *  · para de desenhar quando a aba sai de vista;
 *  · se a máquina não acompanha, a malha afrouxa sozinha.
 */
export function FundoCurvas({
  config = CONFIG_PADRAO,
  className = 'fixed inset-0 -z-10 h-full w-full',
  aliviarNoCelular = true,
}: {
  config?: ConfigDoFundo;
  className?: string;
  /** o painel do admin desliga, para mostrar a calibragem como ela é */
  aliviarNoCelular?: boolean;
}) {
  const refTela = useRef<HTMLCanvasElement>(null);
  const refDesenhista = useRef<Desenhista | null>(null);

  function paraEstaTela(c: ConfigDoFundo): ConfigDoFundo {
    if (!aliviarNoCelular) return c;
    const celular = window.matchMedia('(max-width: 767px)').matches;
    if (!celular) return c;
    return { ...c, detalhe: Math.max(c.detalhe, 9), linhas: Math.min(c.linhas, 20) };
  }

  useEffect(() => {
    const tela = refTela.current;
    if (!tela) return;

    const desenhista = criarDesenhista(tela, paraEstaTela(config), { aliviarSozinho: true });
    if (!desenhista) return;
    refDesenhista.current = desenhista;
    desenhista.medir();
    // um quadro já: o canvas é opaco, e se o primeiro requestAnimationFrame
    // demorar (aba em segundo plano no carregamento) o site abriria com um
    // retângulo preto atrás de tudo
    desenhista.quadro(0);

    /* O fundo não precisa de 60 quadros por segundo. O movimento é lentíssimo
       de propósito, e a 24 o olho não vê diferença nenhuma — mas a máquina vê:
       é um terço do trabalho. Numa tela cheia com a malha fina, o desenho
       chega a 1,5 milhão de operações por quadro, e a 60fps isso compete com a
       hidratação do React e trava a navegação. */
    const INTERVALO = 1000 / 24;

    const semMovimento = window.matchMedia('(prefers-reduced-motion: reduce)');

    let pedido = 0;
    let ultimo = performance.now();
    let desenhadoEm = 0;

    const laco = (agora: number) => {
      pedido = requestAnimationFrame(laco);
      if (agora - desenhadoEm < INTERVALO) return;
      const dt = Math.min((agora - ultimo) / 1000, 0.1);
      ultimo = agora;
      desenhadoEm = agora;
      desenhista.quadro(dt);
    };

    const parar = () => {
      if (!pedido) return;
      cancelAnimationFrame(pedido);
      pedido = 0;
    };

    const andar = () => {
      if (pedido || semMovimento.matches || document.hidden) return;
      ultimo = performance.now();
      pedido = requestAnimationFrame(laco);
    };

    const comVisibilidade = () => {
      if (document.hidden) parar();
      else andar();
    };

    /* Quem liga "reduzir movimento" com a página aberta estava preso ao
       movimento até recarregar, e quem já tinha ligado nunca mais via o
       desenho acompanhar a janela. As duas situações passam por aqui. */
    const comPreferencia = () => {
      if (semMovimento.matches) {
        parar();
        desenhista.quadro(0);
      } else {
        andar();
      }
    };

    andar();
    document.addEventListener('visibilitychange', comVisibilidade);
    if (semMovimento.addEventListener) semMovimento.addEventListener('change', comPreferencia);

    /* O redimensionamento vale com ou sem movimento: é ele que remede o canvas
       quando o celular gira ou a barra de endereço recolhe. Sem isto, o único
       quadro desenhado fica esticado na proporção errada pelo resto da visita. */
    let espera: ReturnType<typeof setTimeout>;
    const aoRedimensionar = () => {
      clearTimeout(espera);
      espera = setTimeout(() => desenhista.medir(), 180);
    };
    window.addEventListener('resize', aoRedimensionar);

    return () => {
      parar();
      clearTimeout(espera);
      document.removeEventListener('visibilitychange', comVisibilidade);
      if (semMovimento.removeEventListener) semMovimento.removeEventListener('change', comPreferencia);
      window.removeEventListener('resize', aoRedimensionar);
      refDesenhista.current = null;
    };
    // de propósito: o laço nasce uma vez; a calibragem entra pelo efeito abaixo
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // calibragem em tempo real, para o painel do admin
  useEffect(() => {
    const d = refDesenhista.current;
    if (!d) return;
    d.calibrar(paraEstaTela(config));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config.velocidade, config.escala, config.linhas, config.espessura, config.contraste, config.detalhe]);

  return <canvas ref={refTela} aria-hidden className={className} />;
}
