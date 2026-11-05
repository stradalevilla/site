'use client';

import { useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import Image from 'next/image';

/**
 * Os arquivos ficam no Storage do Supabase, no balde público "filme", e não em
 * public/videos: cada versão passa de 100 MB, o limite do GitHub por arquivo.
 *
 * Saem do master 4K (04_59_Filme_Lettering_4k), e não da versão de WhatsApp,
 * para não comprimir de novo o que já veio comprimido. Trocar o filme = subir
 * com outro nome (v2): a CDN guarda pelo endereço.
 */
const FILME = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/filme/campanha-v1`;
const CAPA = '/images/renders/filme-capa.jpg';

/**
 * O filme da campanha. Até o clique só existe a capa: nada do vídeo baixa, e o
 * site abre como se ele não estivesse aqui. O som depende do clique também,
 * porque navegador nenhum deixa tocar com som sozinho.
 *
 * A versão sai do quadro na hora do clique: celular e quem pede economia de
 * dados ficam no 720p, e o 1440p só vai para quadro grande em tela densa.
 */
export function FilmeCampanha() {
  const quadro = useRef<HTMLDivElement>(null);
  const filme = useRef<HTMLVideoElement>(null);
  const [fonte, setFonte] = useState<string | null>(null);

  function assistir() {
    const largura = quadro.current?.clientWidth ?? 0;
    const economia = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    const altura =
      economia || largura < 700 ? 720 : largura * window.devicePixelRatio > 2000 ? 1440 : 1080;
    // o play() precisa sair daqui, ainda dentro do toque: no iPhone o autoPlay
    // chega depois do gesto e o filme ficaria parado até um segundo toque
    flushSync(() => setFonte(`${FILME}-${altura}.mp4`));
    filme.current?.play().catch(() => {});
  }

  // é o único vídeo com som do site: não segue tocando longe da vista, nem
  // baixando o resto do arquivo. Em tela cheia o quadro não conta.
  useEffect(() => {
    const el = quadro.current;
    if (!fonte || !el) return;
    const vigia = new IntersectionObserver(([e]) => {
      const v = filme.current as (HTMLVideoElement & { webkitDisplayingFullscreen?: boolean }) | null;
      if (!e.isIntersecting && !document.fullscreenElement && !v?.webkitDisplayingFullscreen) v?.pause();
    });
    vigia.observe(el);
    return () => vigia.disconnect();
  }, [fonte]);

  return (
    <div ref={quadro} data-surgir="imagem" className="relative aspect-video w-full overflow-hidden bg-navy">
      {fonte ? (
        <video
          ref={filme}
          src={fonte}
          poster={CAPA}
          className="absolute inset-0 h-full w-full bg-black"
          controls
          autoPlay
          playsInline
          controlsList="nodownload"
          aria-label="O filme do Villa Stradale"
        />
      ) : (
        <button
          type="button"
          onClick={assistir}
          aria-label="Assistir ao filme do Villa Stradale"
          className="group absolute inset-0 h-full w-full cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#D07748]"
        >
          <Image
            src={CAPA}
            alt=""
            fill
            className="object-cover"
            quality={90}
            sizes="(max-width: 768px) 100vw, 90vw"
          />
          {/* Lente leve, a mesma das faixas: só o bastante para o botão destacar */}
          <span className="absolute inset-0 bg-black/15" />

          <span className="absolute inset-0 flex items-center justify-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-full border border-white/70 bg-white/10 backdrop-blur-sm transition-all duration-300 ease-out group-hover:scale-105 group-hover:border-white group-hover:bg-white/20 md:h-24 md:w-24">
              <svg
                width="30"
                height="30"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden
                className="ml-1 text-white"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
          </span>
        </button>
      )}
    </div>
  );
}
