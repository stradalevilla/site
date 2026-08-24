'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

export interface ImagemParallax {
  src: string;
  /** o lugar, em caixa alta espaçada sob o contador */
  legenda: string;
}

/** A seta da linguagem do site, na pílula vazada */
function Seta({ sentido }: { sentido: 'anterior' | 'proximo' }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={`transition-transform duration-300 ease-out ${
        sentido === 'proximo' ? 'group-hover:translate-x-1' : '-scale-x-100 group-hover:-translate-x-1'
      }`}
    >
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

/**
 * Faixa parallax que vira galeria: a imagem continua fixa (parallax) enquanto a
 * página rola, e quando o meio da faixa alcança o meio da tela os controles
 * entram — contador, legenda e setas — para percorrer as imagens do
 * empreendimento sem sair do lugar.
 *
 * As camadas de fundo são carregadas conforme a navegação (a atual e as
 * vizinhas), para a página não baixar dez imagens grandes de uma vez.
 */
export function ParallaxGaleria({
  imagens,
  altura = 'h-[70vh] md:h-[100vh] lg:h-[130vh]',
  rotulo = 'Galeria do empreendimento',
}: {
  imagens: ImagemParallax[];
  /** classes de altura da faixa */
  altura?: string;
  rotulo?: string;
}) {
  const secaoRef = useRef<HTMLElement>(null);
  const toqueX = useRef<number | null>(null);
  const reveladoRef = useRef(false);
  const [atual, setAtual] = useState(0);
  /** os controles entram quando o meio da faixa alcança o meio da tela */
  const [revelado, setRevelado] = useState(false);
  /**
   * Quanto da saída já aconteceu, de 0 a 1, calculado da posição de rolagem —
   * e não de uma transição temporizada. Amarrado à rolagem, o desaparecimento
   * nunca "atrasa" em relação à chegada do container de baixo.
   */
  const [saida, setSaida] = useState(0);
  /** o convite sai de cena na primeira navegação */
  const [interagiu, setInteragiu] = useState(false);
  /** só as camadas já pedidas ficam no DOM */
  const [carregadas, setCarregadas] = useState<number[]>([0]);

  const irPara = useCallback(
    (passo: number) => {
      setInteragiu(true);
      setAtual((i) => {
        const proximo = (i + passo + imagens.length) % imagens.length;
        setCarregadas((antes) =>
          antes.includes(proximo) ? antes : [...antes, proximo]
        );
        return proximo;
      });
    },
    [imagens.length]
  );

  /**
   * Revela enquanto o meio da tela estiver sobre a faixa. O rootMargin de -50%
   * em cima e embaixo reduz a raiz do observador a uma linha no centro da
   * janela: a faixa "intersecta" essa linha exatamente quando o meio da tela
   * está sobre ela — sem listener de scroll.
   */
  useEffect(() => {
    const el = secaoRef.current;
    if (!el) return;

    let ultimaVez = 0;
    const avaliar = () => {
      const agora = performance.now();
      if (agora - ultimaVez < 80) return;
      ultimaVez = agora;

      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const comecou = r.top < vh / 2;
      if (comecou !== reveladoRef.current) {
        reveladoRef.current = comecou;
        setRevelado(comecou);
      }

      /**
       * O container da seção seguinte avança 112px sobre a faixa: o topo dele
       * alcança a base dos controles quando a base da faixa chega a ~vh + 12.
       * A saída é distribuída nos 500px de rolagem anteriores a isso, então aos
       * olhos ela termina antes do encontro, em qualquer velocidade de scroll.
       */
      const inicioDaSaida = vh + 512;
      const fimDaSaida = vh + 12;
      const bruto = (inicioDaSaida - r.bottom) / (inicioDaSaida - fimDaSaida);
      setSaida(Math.min(1, Math.max(0, bruto)));
    };

    avaliar();
    window.addEventListener('scroll', avaliar, { passive: true });
    window.addEventListener('resize', avaliar);
    return () => {
      window.removeEventListener('scroll', avaliar);
      window.removeEventListener('resize', avaliar);
    };
  }, []);

  // com os controles à vista, as setas do teclado navegam
  useEffect(() => {
    if (!revelado) return;
    const noTeclado = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        irPara(1);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        irPara(-1);
      }
    };
    window.addEventListener('keydown', noTeclado);
    return () => window.removeEventListener('keydown', noTeclado);
  }, [revelado, irPara]);

  // pré-carrega a próxima assim que os controles aparecem
  useEffect(() => {
    if (!revelado) return;
    const proxima = (atual + 1) % imagens.length;
    setCarregadas((antes) => (antes.includes(proxima) ? antes : [...antes, proxima]));
  }, [revelado, atual, imagens.length]);

  const entrada = (atraso: number) =>
    ({
      transitionDelay: revelado ? `${atraso}ms` : '0ms',
    }) as React.CSSProperties;

  return (
    <section
      ref={secaoRef}
      aria-label={rotulo}
      className={`relative w-full ${altura}`}
      onTouchStart={(e) => {
        toqueX.current = e.touches[0].clientX;
      }}
      onTouchEnd={(e) => {
        if (toqueX.current === null) return;
        const dx = e.changedTouches[0].clientX - toqueX.current;
        if (Math.abs(dx) > 50) irPara(dx < 0 ? 1 : -1);
        toqueX.current = null;
      }}
    >
      {/* Camadas de fundo: o parallax continua em cada uma, e a troca é um
          crossfade lento entre elas. */}
      <div className="absolute inset-0 overflow-hidden bg-navy">
        {imagens.map((img, i) =>
          carregadas.includes(i) ? (
            <div
              key={img.src}
              aria-hidden
              className="absolute inset-0 bg-cover bg-center transition-opacity duration-[1100ms] ease-out lg:bg-fixed"
              style={{ backgroundImage: `url('${img.src}')`, opacity: i === atual ? 1 : 0 }}
            />
          ) : null
        )}
      </div>

      {/* Lente preta na base da tela, atrás dos controles: entra com eles e se
          dissolve antes de chegar ao meio, só para o slider ler bem sobre
          qualquer imagem. */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-x-0 bottom-0 z-[5] h-[45vh] bg-gradient-to-t from-black/75 via-black/30 to-transparent transition-opacity duration-700"
        style={{ opacity: revelado ? 1 - saida : 0 }}
      />

      {/* Trilho do sticky: os controles ficam presos perto da base da tela
          enquanto a faixa passa. */}
      <div className="relative h-full">
        {/* O recuo acompanha o tamanho dos elementos: com eles maiores, o trilho
            sobe para manter a mesma folga até a base da tela. */}
        <div className="sticky top-[calc(100vh-210px)] z-10 px-4 md:px-8">
          {/* Na saída, título e controles sobem juntos e se dissolvem — ligados à
              rolagem, então acompanham o container de baixo em qualquer
              velocidade. A transição curta só suaviza os saltos da roda. */}
          <div
            className="container mx-auto flex flex-col gap-8 transition-[opacity,transform] duration-150 ease-out md:flex-row md:items-end md:justify-between"
            style={{ opacity: 1 - saida, transform: `translateY(${-44 * saida}px)` }}
          >
            {/* Convite, à esquerda, no formato dos títulos sobre foto do site.
                Sai de cena quando o visitante começa a passar as imagens. */}
            <div
              className={`transition-all duration-700 ease-out ${
                revelado && !interagiu
                  ? 'translate-y-0 opacity-100'
                  : 'pointer-events-none translate-y-4 opacity-0'
              }`}
              style={entrada(60)}
            >
              <h2 className="font-heading text-3xl font-light uppercase italic leading-tight text-white md:text-4xl lg:text-5xl">
                O projeto
                <br />
                em imagens
              </h2>
              <p className="mt-5 font-body text-xs uppercase tracking-[0.25em] text-white/80 md:text-sm">
                Veja as imagens do empreendimento
              </p>
            </div>

            <div
              className={`w-full transition-opacity duration-700 md:max-w-lg ${
                revelado ? 'opacity-100' : 'pointer-events-none opacity-0'
              }`}
            >
              {/* Fio dourado que se desenha na entrada */}
              <span
                aria-hidden
                className={`block h-px origin-right bg-gold/70 transition-transform duration-[900ms] ease-out ${
                  revelado ? 'scale-x-100' : 'scale-x-0'
                }`}
                style={entrada(0)}
              />

              <div className="flex items-end justify-between gap-6 pt-6">
                <div
                  className={`transition-all duration-700 ease-out ${
                    revelado ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                  }`}
                  style={entrada(120)}
                >
                  <p className="font-heading text-base italic tracking-[0.2em] text-gold md:text-lg">
                    {String(atual + 1).padStart(2, '0')} / {String(imagens.length).padStart(2, '0')}
                  </p>
                  <p className="mt-2 font-body text-xs uppercase tracking-[0.25em] text-white md:text-sm">
                    {imagens[atual].legenda}
                  </p>
                </div>

                <div
                  className={`flex shrink-0 items-center gap-4 transition-all duration-700 ease-out ${
                    revelado ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                  }`}
                  style={entrada(240)}
                >
                  <button
                    type="button"
                    onClick={() => irPara(-1)}
                    aria-label="Imagem anterior"
                    className="group flex h-12 w-16 items-center justify-center rounded-full border border-white/70 text-white backdrop-blur-sm transition-all duration-300 ease-out hover:border-white hover:bg-white hover:text-navy focus:outline-none focus-visible:ring-2 focus-visible:ring-gold md:h-14 md:w-20"
                  >
                    <Seta sentido="anterior" />
                  </button>
                  <button
                    type="button"
                    onClick={() => irPara(1)}
                    aria-label="Próxima imagem"
                    className="group flex h-12 w-16 items-center justify-center rounded-full border border-white/70 text-white backdrop-blur-sm transition-all duration-300 ease-out hover:border-white hover:bg-white hover:text-navy focus:outline-none focus-visible:ring-2 focus-visible:ring-gold md:h-14 md:w-20"
                  >
                    <Seta sentido="proximo" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
