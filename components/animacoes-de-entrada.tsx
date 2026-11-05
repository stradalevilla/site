'use client';

import { useEffect } from 'react';

/** quanto cada elemento espera o anterior, quando vários chegam juntos */
const PASSO_MS = 90;
/** a fila para de crescer aqui: o último não pode demorar a aparecer */
const MAIOR_ATRASO_MS = 540;
/** a imagem é revelada a uma velocidade fixa: quanto maior, mais tempo leva */
const PIXELS_POR_SEGUNDO = 550;
const IMAGEM_MIN_S = 0.9;
const IMAGEM_MAX_S = 2.2;

function revelar(el: HTMLElement, atraso: number) {
  const tipo = el.dataset.surgir;
  if (!tipo) return;
  if (tipo === 'imagem' || tipo === 'cortina') {
    const tempo = Math.min(IMAGEM_MAX_S, Math.max(IMAGEM_MIN_S, el.offsetWidth / PIXELS_POR_SEGUNDO));
    el.style.setProperty('--surgir-tempo', `${tempo.toFixed(2)}s`);
  }
  el.style.setProperty('--surgir-atraso', `${atraso}ms`);

  // sem isto, o clip-path e o translate da animação ficariam no elemento para
  // sempre, e um grafismo que cruza a moldura seria cortado
  const fim = (e: AnimationEvent) => {
    if (e.target !== el) return;
    el.removeEventListener('animationend', fim);
    el.removeAttribute('data-surgiu');
    el.removeAttribute('data-surgir');
    el.style.removeProperty('--surgir-tempo');
    el.style.removeProperty('--surgir-atraso');
  };
  el.addEventListener('animationend', fim);
  el.setAttribute('data-surgiu', tipo);
}

/**
 * Dispara a entrada do que está marcado com data-surgir, quando o elemento
 * chega à tela, uma vez só. O que chega junto entra em fila, na ordem de
 * leitura: é isso que faz os elementos aparecerem um de cada vez, sem precisar
 * marcar atraso à mão em cada um.
 *
 * Os efeitos estão no fim de app/globals.css. Marcar um elemento não muda o
 * layout: não existe invólucro, só o atributo.
 */
export function AnimacoesDeEntrada() {
  useEffect(() => {
    const raiz = document.documentElement;
    if (!raiz.classList.contains('surgir')) return;
    raiz.classList.add('surgir-vivo');

    const observador = new IntersectionObserver(
      (entradas) => {
        const chegaram = entradas
          .filter((e) => e.isIntersecting)
          .sort(
            (a, b) =>
              a.boundingClientRect.top - b.boundingClientRect.top ||
              a.boundingClientRect.left - b.boundingClientRect.left
          );
        let naFila = 0;
        chegaram.forEach((e) => {
          observador.unobserve(e.target);
          // já ficou para trás: ninguém veria a entrada, só o buraco ao voltar
          if (e.boundingClientRect.bottom <= 0) {
            e.target.removeAttribute('data-surgir');
            return;
          }
          revelar(e.target as HTMLElement, Math.min(naFila++ * PASSO_MS, MAIOR_ATRASO_MS));
        });
      },
      // sem margem embaixo: o fim do rodapé nunca passaria da linha e ficaria
      // escondido. Um pedaço do elemento à vista já basta. Em cima a área vigiada
      // vai além da página, para pegar o que uma rolagem rápida ou um salto de
      // âncora atravessou sem parar.
      { threshold: 0.12, rootMargin: '100000px 0px 0px 0px' }
    );

    const vigiar = (onde: ParentNode) =>
      onde.querySelectorAll('[data-surgir]:not([data-surgiu])').forEach((el) => observador.observe(el));
    vigiar(document);

    // as páginas trocam sem recarregar: o que chega depois entra na vigia
    const mudancas = new MutationObserver((lista) => {
      lista.forEach((m) =>
        m.addedNodes.forEach((no) => {
          if (!(no instanceof Element)) return;
          if (no.matches('[data-surgir]')) observador.observe(no);
          vigiar(no);
        })
      );
    });
    mudancas.observe(document.body, { childList: true, subtree: true });

    return () => {
      observador.disconnect();
      mudancas.disconnect();
    };
  }, []);

  return null;
}
