'use client';

import { useEffect, useRef, useState } from 'react';

/** Todos os filmes do site. A ordem é sorteada a cada abertura: cada pessoa vê de um jeito. */
const FILMES = [
  'hero-por-do-sol',
  'hero-peninsula-v2',
  'regiao-peninsula',
  'casa-clube-aerea',
  'casa-clube-perspectiva',
  'heliponto-helicoptero',
  'nautica-veleiro',
  'nautica-wake',
  'nautica-pier',
  'nautica-jet-ski',
  'racket-club-quadra',
  'racket-club-casal',
];

/** Estes têm um corte próprio para o celular em pé */
const TEM_RETRATO = ['hero-por-do-sol', 'hero-peninsula-v2'];

const DISSOLVE_S = 1.2;
const PRAZO_PARA_TOCAR_MS = 15000;
const ESPERA_MAXIMA_MS = 30000;

function sortear(naoComecarCom?: string) {
  const lista = [...FILMES];
  for (let i = lista.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [lista[i], lista[j]] = [lista[j], lista[i]];
  }
  if (lista[0] === naoComecarCom) lista.push(lista.shift()!);
  return lista;
}

/**
 * Os filmes atrás do app, um dissolvendo no outro, sem fim. A foto continua por baixo: quem
 * pede menos movimento, economia de dados ou está sem bateria fica com ela. São duas camadas:
 * uma passa enquanto a outra já baixa o próximo. Como tudo fica sob um véu escuro, o 720p
 * basta no celular, onde a rede costuma ser móvel. O iPhone não informa o tipo de rede, então
 * ali o filme roda mesmo no modo de dados reduzidos.
 */
export function FilmesDeFundo() {
  const camadas = useRef<(HTMLVideoElement | null)[]>([null, null]);
  const [visivel, setVisivel] = useState<number | null>(null);

  useEffect(() => {
    const rede = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || rede?.saveData || /2g/.test(rede?.effectiveType ?? '')) return;

    const [a, b] = camadas.current;
    if (!a || !b) return;
    const videos = [a, b];
    const emPe = window.matchMedia('(max-width: 767px) and (orientation: portrait)').matches;
    const tamanho = window.innerWidth >= 768 && window.innerWidth * Math.min(window.devicePixelRatio, 2) > 1400 ? 1080 : 720;
    const endereco = (filme: string) => `/videos/${filme}-${emPe && TEM_RETRATO.includes(filme) ? 'retrato' : tamanho}.mp4`;

    let fila = sortear();
    let noAr: string | undefined;
    const nomes: (string | undefined)[] = [undefined, undefined];
    let ativa = -1;
    let entrando = false;
    let tentativas = 0;
    let esperando = false; // o filme acabou e o seguinte ainda não começou
    let seguinteNaFila = false; // a outra camada ainda guarda o filme que acabou de sair
    let falhas = 0;
    let encerrado = false;
    let espera: ReturnType<typeof setTimeout>;
    let prazo: ReturnType<typeof setTimeout>;
    let religar: ReturnType<typeof setTimeout>;

    const carregar = (i: number) => {
      if (!fila.length) fila = sortear(noAr);
      const filme = fila.shift()!;
      nomes[i] = filme;
      seguinteNaFila = true;
      videos[i].src = endereco(filme);
      videos[i].load();
    };

    const liberar = () => {
      tentativas += 1;
      entrando = false;
      clearTimeout(prazo);
    };

    // a camada não tocou: tenta outro filme, com intervalo crescente, sem desistir. A rede pode
    // voltar sem o aparelho avisar, como no Wi-Fi que fica sem internet
    const falhou = (i: number) => {
      liberar();
      falhas += 1;
      seguinteNaFila = false;
      clearTimeout(religar);
      religar = setTimeout(() => {
        carregar(i);
        if (ativa === -1 || esperando) entrar(i);
      }, Math.min(1000 * 2 ** falhas, ESPERA_MAXIMA_MS));
    };

    // chama play() sem esperar o vídeo baixar: sem isso o iPhone nem começa o download
    const entrar = (i: number) => {
      if (encerrado || entrando || document.hidden) return;
      clearTimeout(religar); // senão ele trocaria o filme da camada que acabou de entrar
      entrando = true;
      tentativas += 1;
      const tentativa = tentativas;
      prazo = setTimeout(() => falhou(i), PRAZO_PARA_TOCAR_MS); // download parado não gera erro
      videos[i]
        .play()
        .then(() => {
          if (encerrado || tentativa !== tentativas) return;
          entrando = false;
          clearTimeout(prazo);
          const antiga = ativa;
          ativa = i;
          noAr = nomes[i];
          esperando = false;
          seguinteNaFila = false;
          falhas = 0;
          setVisivel(i);
          // a que saiu termina a dissolução e já vai baixando o filme seguinte
          espera = setTimeout(() => {
            if (antiga >= 0) videos[antiga].pause();
            carregar(1 - i);
            if (esperando) entrar(1 - i);
          }, DISSOLVE_S * 1000 + 100);
        })
        .catch((motivo) => {
          if (tentativa !== tentativas) return;
          // modo de economia do aparelho não deixa tocar: a foto segue, e tenta de novo ao voltar
          if (motivo?.name === 'NotAllowedError') liberar();
          else falhou(i);
        });
    };

    const avancar = () => {
      esperando = true;
      if (seguinteNaFila) entrar(1 - ativa);
    };

    const ouvintes = videos.map((v, i) => {
      const aoAndar = () => {
        if (i === ativa && !esperando && !entrando && v.duration - v.currentTime <= DISSOLVE_S) avancar();
      };
      const aoFalhar = () => {
        if (i !== ativa) falhou(i);
        else {
          // o filme da tela morreu: passa para o seguinte, ou o temporizador cuida disso
          falhas += 1;
          avancar();
        }
      };
      v.muted = true;
      v.addEventListener('timeupdate', aoAndar);
      v.addEventListener('error', aoFalhar);
      return () => {
        v.removeEventListener('timeupdate', aoAndar);
        v.removeEventListener('error', aoFalhar);
      };
    });

    const aoMudarDeAba = () => {
      if (document.hidden) {
        if (ativa >= 0) videos[ativa].pause();
        return;
      }
      liberar(); // um play() de antes do segundo plano pode nunca assentar
      if (ativa < 0) entrar(0);
      else if (esperando) {
        if (seguinteNaFila) entrar(1 - ativa);
      } else videos[ativa].play().catch(() => {});
    };
    document.addEventListener('visibilitychange', aoMudarDeAba);

    carregar(0);
    entrar(0);

    return () => {
      encerrado = true;
      clearTimeout(espera);
      clearTimeout(prazo);
      clearTimeout(religar);
      document.removeEventListener('visibilitychange', aoMudarDeAba);
      ouvintes.forEach((remover) => remover());
      videos.forEach((v) => {
        v.pause();
        v.removeAttribute('src');
        v.load();
      });
    };
  }, []);

  return (
    <>
      {[0, 1].map((i) => (
        <video
          key={i}
          ref={(el) => {
            camadas.current[i] = el;
          }}
          muted
          playsInline
          preload="auto"
          aria-hidden="true"
          tabIndex={-1}
          disablePictureInPicture
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[1200ms] ease-in-out ${
            visivel === i ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ))}
    </>
  );
}
