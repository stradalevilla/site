'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { Map as MapaGL } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

export interface PinoMapa {
  nome: string;
  /** o pino do empreendimento, com o logotipo em vez do nome */
  marca?: boolean;
  lng: number;
  lat: number;
}

export interface CameraMapa {
  /** para onde a câmera olha */
  centro: [number, number];
  zoom: number;
  /** giro em graus: 0 = norte no topo */
  giro: number;
  /** inclinação em graus: 0 = de cima, 85 = quase rasante */
  inclinacao: number;
}

/* ============================================================ */
/* Os parafusos de aparência, num só lugar                       */
/* ============================================================ */

/** altura do terreno (1 = real; acima disso, dramatiza) */
const EXAGERO_DO_RELEVO = 2.2;
/** força da sombra do relevo, de 0 a 1 */
const SOMBREAMENTO = 0.38;
/** o verde-água da represa, no tom das fotos tratadas do projeto */
const COR_DA_AGUA = '#1c6f75';

/**
 * De onde vem a imagem do chão.
 *
 * 'maptiler'    — satélite da MapTiler. Mais detalhe no zoom fechado, mas o
 *                 mosaico emenda capturas de datas diferentes e na represa isso
 *                 vira uma mancha clara.
 * 's2cloudless' — mosaico Sentinel-2 sem nuvens da EOX, montado para não ter
 *                 emenda nem nuvem. Uniforme; em troca é 10 m por pixel.
 *                 Licença CC BY 4.0 — o crédito fica na atribuição do mapa.
 */
const BASE_DA_IMAGEM: 'maptiler' | 's2cloudless' = 's2cloudless';

const S2_CLOUDLESS =
  'https://tiles.maps.eox.at/wmts/1.0.0/s2cloudless-2020_3857/default/GoogleMapsCompatible/{z}/{y}/{x}.jpg';

/**
 * Cor da imagem, por base — cada mosaico chega com um tom diferente: o da
 * MapTiler é claro e muito verde, o da EOX é escuro e fechado. Valores -1 a 1;
 * o giro de matiz (em graus) puxa o verde para o lado do dourado, no clima de
 * fim de seca da arte do book.
 */
const COR_POR_BASE = {
  maptiler: { saturacao: 0, contraste: 0.08, luzMinima: 0.05, giroDeMatiz: -10 },
  s2cloudless: { saturacao: -0.12, contraste: 0.12, luzMinima: 0.16, giroDeMatiz: -16 },
};

/* ============================================================ */

type Fase = 'carregando' | 'pronto' | 'falhou';

/**
 * O mapa da região em relevo 3D, navegável — MapLibre GL com o relevo da
 * MapTiler e a imagem de satélite sem emendas da EOX.
 *
 * Arquitetura deliberadamente simples: cada visita à página cria UM mapa e o
 * destrói por inteiro ao sair (map.remove() devolve o contexto de vídeo ao
 * navegador). Nada sobrevive entre visitas — a volta recarrega rápido porque a
 * biblioteca e os tiles ficam no cache HTTP do navegador. Sem instância global
 * e sem estado de módulo: era essa "esperteza" que corrompia o carregamento.
 *
 * Regras de peso:
 *  · desktop: a roda do mouse não dá zoom até o visitante clicar no convite;
 *  · celular: gestos cooperativos — um dedo rola a página, o mapa se move com
 *    dois dedos (a dica aparece na tela), sem prender ninguém dentro do mapa;
 *  · sem a chave da MapTiler, ou se o mapa falhar, a imagem estática assume.
 *
 * A atribuição (© MapTiler / EOX / OpenStreetMap) é exigência de licença.
 */
export function MapaRegiao3D({
  pinos,
  camera,
  estatico,
  rotulo = 'Mapa da região em relevo, navegável',
}: {
  pinos: PinoMapa[];
  camera: CameraMapa;
  /** a imagem que fica no lugar quando o mapa não entra */
  estatico: React.ReactNode;
  rotulo?: string;
}) {
  const caixa = useRef<HTMLDivElement>(null);
  const mapaRef = useRef<MapaGL | null>(null);
  const [fase, setFase] = useState<Fase>('carregando');
  const [progresso, setProgresso] = useState(0);
  const [navegando, setNavegando] = useState(false);
  /** calibragem (só em desenvolvimento) */
  const [cameraAtual, setCameraAtual] = useState<CameraMapa | null>(null);
  const [salvando, setSalvando] = useState<'parado' | 'salvando' | 'salvo' | 'erro'>('parado');
  /** medido na montagem: muda os gestos e esconde o convite de clique */
  const [movel, setMovel] = useState(false);

  const chave = process.env.NEXT_PUBLIC_MAPTILER_KEY;
  /** decidido no build: sem chave o componente é só a imagem estática */
  const comMapa = Boolean(chave);

  useEffect(() => {
    const el = caixa.current;
    if (!el || !chave) return;
    const noCelular = window.innerWidth < 1024;
    setMovel(noCelular);

    let vivo = true;
    let mapa: MapaGL | null = null;
    const temporizadores: ReturnType<typeof setTimeout>[] = [];
    let observador: ResizeObserver | null = null;

    (async () => {
      const { Map: Mapa, Marker } = await import('maplibre-gl');
      if (!vivo) return;

      const estilo =
        BASE_DA_IMAGEM === 'maptiler'
          ? `https://api.maptiler.com/maps/satellite/style.json?key=${chave}`
          : {
              version: 8 as const,
              sources: {
                satelite: {
                  type: 'raster' as const,
                  tiles: [S2_CLOUDLESS],
                  tileSize: 256,
                  maxzoom: 14,
                  attribution:
                    'Sentinel-2 cloudless 2020 by <a href="https://s2maps.eu">EOX</a> (CC BY 4.0)',
                },
              },
              layers: [{ id: 'satelite', type: 'raster' as const, source: 'satelite' }],
            };

      mapa = new Mapa({
        container: el,
        style: estilo,
        center: camera.centro,
        zoom: camera.zoom,
        bearing: camera.giro,
        pitch: camera.inclinacao,
        maxPitch: 80,
        // desktop: a roda só dá zoom depois do clique no convite.
        // celular: um dedo rola a página; o mapa se move com dois dedos.
        scrollZoom: false,
        cooperativeGestures: noCelular,
        locale: {
          'CooperativeGesturesHandler.MobileHelpText': 'Use dois dedos para mover o mapa',
          'CooperativeGesturesHandler.WindowsHelpText': 'Segure Ctrl e role para dar zoom',
          'CooperativeGesturesHandler.MacHelpText': 'Segure ⌘ e role para dar zoom',
        },
        attributionControl: { compact: true },
      });
      mapaRef.current = mapa;

      /* ---------- falha honesta: a imagem estática assume ---------- */
      let estiloCarregou = false;
      mapa.on('error', () => {
        if (!estiloCarregou && vivo) setFase('falhou');
      });
      temporizadores.push(
        setTimeout(() => {
          if (!estiloCarregou && vivo) setFase('falhou');
        }, 12000)
      );
      mapa.getCanvas().addEventListener('webglcontextlost', () => {
        if (vivo) setFase('falhou');
      });

      /* ---------- porcentagem real: tiles pedidos × recebidos ---------- */
      let pedidos = 0;
      let recebidos = 0;
      let ultimo = 0;
      const contar = () => {
        if (!pedidos || !vivo) return;
        const pct = Math.min(97, Math.round((recebidos / pedidos) * 100));
        if (pct > ultimo) {
          ultimo = pct;
          setProgresso(pct);
        }
      };
      mapa.on('dataloading', (e) => {
        if ('tile' in e) {
          pedidos += 1;
          contar();
        }
      });
      mapa.on('data', (e) => {
        if ('tile' in e) {
          recebidos += 1;
          contar();
        }
      });

      /* ---------- o conteúdo, quando o estilo assenta ---------- */
      mapa.on('style.load', () => {
        if (!mapa || !vivo) return;
        estiloCarregou = true;
        // a caixa pode ter tido altura 0 na criação; aqui o layout já assentou
        mapa.resize();

        // relevo — sem tileSize: o TileJSON da MapTiler informa 512, e forçar
        // 256 fazia o DEM ser lido na escala errada (terreno achatado)
        mapa.addSource('relevo', {
          type: 'raster-dem',
          url: `https://api.maptiler.com/tiles/terrain-rgb-v2/tiles.json?key=${chave}`,
        });
        mapa.setTerrain({ source: 'relevo', exaggeration: EXAGERO_DO_RELEVO });

        // cor da imagem de satélite, e os rótulos do estilo apagados: os nomes
        // dos lugares aqui são os nossos pinos
        const cor = COR_POR_BASE[BASE_DA_IMAGEM];
        for (const camada of mapa.getStyle().layers ?? []) {
          if (camada.type === 'raster') {
            mapa.setPaintProperty(camada.id, 'raster-saturation', cor.saturacao);
            mapa.setPaintProperty(camada.id, 'raster-contrast', cor.contraste);
            mapa.setPaintProperty(camada.id, 'raster-brightness-min', cor.luzMinima);
            mapa.setPaintProperty(camada.id, 'raster-hue-rotate', cor.giroDeMatiz);
          }
          if (camada.type === 'symbol' || /border/i.test(camada.id)) {
            mapa.setLayoutProperty(camada.id, 'visibility', 'none');
          }
        }

        // sombreamento do terreno: é o que dá volume à serra nesta distância
        mapa.addLayer({
          id: 'relevo-sombra',
          type: 'hillshade',
          source: 'relevo',
          paint: {
            'hillshade-exaggeration': SOMBREAMENTO,
            'hillshade-shadow-color': '#0a1929',
            'hillshade-highlight-color': '#fff4e6',
            'hillshade-accent-color': '#D07748',
          },
        });

        // a água em cor sólida por cima da foto: apaga as emendas do mosaico
        // e traz a represa para o tom do projeto
        const fontes = mapa.getStyle().sources ?? {};
        const fonteVetorial =
          Object.keys(fontes).find((id) => fontes[id].type === 'vector') ?? 'vetor';
        if (!fontes[fonteVetorial]) {
          mapa.addSource(fonteVetorial, {
            type: 'vector',
            url: `https://api.maptiler.com/tiles/v3/tiles.json?key=${chave}`,
          });
        }
        mapa.addLayer({
          id: 'agua-uniforme',
          type: 'fill',
          source: fonteVetorial,
          'source-layer': 'water',
          paint: { 'fill-color': COR_DA_AGUA, 'fill-opacity': 0.92 },
        });

        // céu e névoa: transições longas para o horizonte derreter no terreno
        mapa.setSky({
          'sky-color': '#7fa8c6',
          'sky-horizon-blend': 0.9,
          'horizon-color': '#cdd7dc',
          'horizon-fog-blend': 0.85,
          'fog-color': '#dfe2df',
          'fog-ground-blend': 0.75,
          'atmosphere-blend': 0.7,
        });

        // os pinos, na tipografia do site
        for (const pino of pinos) {
          new Marker({ element: criarPino(pino), anchor: 'bottom' })
            .setLngLat([pino.lng, pino.lat])
            .addTo(mapa);
        }
      });

      /* ---------- revela só quando estiver inteiro ---------- */
      mapa.once('idle', () => {
        if (!mapa || !vivo) return;
        mapa.resize();
        setProgresso(100);
        setFase('pronto');
        // sem convite de clique no celular: os gestos cooperativos já protegem
        if (noCelular) setNavegando(true);
      });
      // se algum tile emperrar, mostra assim mesmo em vez de ficar preso
      temporizadores.push(
        setTimeout(() => {
          if (vivo && estiloCarregou) setFase('pronto');
        }, 15000)
      );

      /* ---------- a caixa muda de tamanho, o mapa acompanha ---------- */
      observador = new ResizeObserver(() => mapa?.resize());
      observador.observe(el);

      /* ---------- calibragem, só rodando local ---------- */
      if (process.env.NODE_ENV !== 'production') {
        const lerCamera = () => {
          if (!mapa || !vivo) return;
          setCameraAtual({
            centro: [
              Number(mapa.getCenter().lng.toFixed(5)),
              Number(mapa.getCenter().lat.toFixed(5)),
            ],
            zoom: Number(mapa.getZoom().toFixed(2)),
            giro: Number(mapa.getBearing().toFixed(1)),
            inclinacao: Number(mapa.getPitch().toFixed(1)),
          });
        };
        lerCamera();
        mapa.on('moveend', lerCamera);
        (window as unknown as Record<string, unknown>).__mapaRegiao = mapa;
      }
    })();

    return () => {
      vivo = false;
      temporizadores.forEach(clearTimeout);
      observador?.disconnect();
      // destrói por inteiro: devolve o contexto de vídeo ao navegador
      mapaRef.current?.remove();
      mapaRef.current = null;
    };
  }, [chave, camera, pinos]);

  const liberarNavegacao = useCallback(() => {
    mapaRef.current?.scrollZoom.enable();
    setNavegando(true);
  }, []);

  const voltarAoEnquadramento = useCallback(() => {
    mapaRef.current?.easeTo({
      center: camera.centro,
      zoom: camera.zoom,
      bearing: camera.giro,
      pitch: camera.inclinacao,
      duration: 1400,
    });
  }, [camera]);

  const salvarEnquadramento = useCallback(async () => {
    if (!cameraAtual) return;
    setSalvando('salvando');
    try {
      const r = await fetch('/api/enquadramento-mapa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cameraAtual),
      });
      setSalvando(r.ok ? 'salvo' : 'erro');
    } catch {
      setSalvando('erro');
    }
    setTimeout(() => setSalvando('parado'), 2500);
  }, [cameraAtual]);

  return (
    <div className="relative h-full w-full">
      {/* A imagem estática: o celular sempre, e o desktop só sem chave ou em
          falha. Com o mapa no lugar ela é escondida por CSS desde a primeira
          pintura — nunca pisca a "foto antiga" antes do mapa. */}
      {/* atrás do painel de carregamento; some quando o mapa assume */}
      <div className={comMapa && fase === 'pronto' ? 'hidden' : ''}>{estatico}</div>

      {comMapa && fase !== 'falhou' && (
        <>
          {/* O mapa nasce dentro desta caixa; o overflow corta os pinos que
              saem do quadro */}
          <div
            ref={caixa}
            aria-label={rotulo}
            className={`absolute inset-0 overflow-hidden ${
              fase === 'pronto' ? 'opacity-100' : 'opacity-0'
            } transition-opacity duration-700`}
          />

          {/* Enquanto não está inteiro: fundo navy e a contagem real dos tiles */}
          {fase === 'carregando' && (
            <div className="absolute inset-0 flex items-center justify-center bg-[#0a1929]">
              <div className="flex w-64 flex-col items-center gap-5">
                <span className="font-heading text-4xl font-light italic text-gold">
                  {progresso}%
                </span>
                <span className="block h-px w-full bg-white/15">
                  <span
                    className="block h-px bg-gold transition-[width] duration-300 ease-out"
                    style={{ width: `${progresso}%` }}
                  />
                </span>
                <span className="font-body text-[11px] uppercase tracking-[0.3em] text-white/60">
                  Carregando o mapa
                </span>
              </div>
            </div>
          )}

          {fase === 'pronto' && !navegando && !movel && (
            <button
              type="button"
              onClick={liberarNavegacao}
              className="group absolute inset-0 z-10 hidden items-end justify-center pb-10 lg:flex"
              aria-label="Clique para navegar pelo mapa"
            >
              <span className="flex items-center gap-3 bg-navy/70 px-6 py-3 font-body text-[11px] uppercase tracking-[0.25em] text-white backdrop-blur-sm transition-colors duration-300 group-hover:bg-navy/85 md:text-xs">
                Clique para navegar pelo mapa
              </span>
            </button>
          )}

          {fase === 'pronto' && navegando && (
            <button
              type="button"
              onClick={voltarAoEnquadramento}
              title="Voltar ao enquadramento inicial"
              aria-label="Voltar ao enquadramento inicial"
              className="absolute bottom-5 left-1/2 z-10 flex h-11 w-11 -translate-x-1/2 items-center justify-center rounded-full border border-white/50 bg-navy/60 text-white/90 backdrop-blur-sm transition-all duration-300 hover:border-white hover:bg-navy/85 hover:text-white"
            >
              {/* mira de recentrar */}
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                aria-hidden
              >
                <circle cx="12" cy="12" r="6" />
                <line x1="12" y1="2" x2="12" y2="5" />
                <line x1="12" y1="19" x2="12" y2="22" />
                <line x1="2" y1="12" x2="5" y2="12" />
                <line x1="19" y1="12" x2="22" y2="12" />
              </svg>
            </button>
          )}

          {/* Calibragem — só aparece rodando local. Posicione o mapa e salve: o
              enquadramento vira o padrão do site. */}
          {process.env.NODE_ENV !== 'production' && fase === 'pronto' && cameraAtual && (
            <div className="absolute bottom-5 right-5 z-10 hidden flex-col items-end gap-2 lg:flex">
              <span className="bg-navy/70 px-3 py-1 font-mono text-[10px] text-white/70 backdrop-blur-sm">
                {cameraAtual.centro[0]}, {cameraAtual.centro[1]} · zoom {cameraAtual.zoom} · giro{' '}
                {cameraAtual.giro}° · inclinação {cameraAtual.inclinacao}°
              </span>
              <button
                type="button"
                onClick={salvarEnquadramento}
                className="bg-[#D07748] px-4 py-2 font-body text-[11px] uppercase tracking-[0.2em] text-white transition-colors duration-300 hover:bg-[#b8623a]"
              >
                {salvando === 'salvando'
                  ? 'salvando…'
                  : salvando === 'salvo'
                    ? 'enquadramento salvo'
                    : salvando === 'erro'
                      ? 'não deu — veja o terminal'
                      : 'salvar este enquadramento'}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

/** O pino no desenho da arte: rótulo terracota, haste fina e o ponto no lugar */
function criarPino(pino: PinoMapa) {
  const raiz = document.createElement('div');
  raiz.className = 'flex flex-col items-center';

  const rotulo = document.createElement('div');
  if (pino.marca) {
    // o logotipo pede fundo claro; os cantos acompanham os outros pinos
    rotulo.className = 'rounded-md bg-white px-4 py-3 shadow-lg';
    const logo = document.createElement('img');
    logo.src = '/logos/Logotipo-VillaStradale escuro.svg';
    logo.alt = pino.nome;
    logo.className = 'h-8 w-auto';
    rotulo.appendChild(logo);
  } else {
    rotulo.className =
      'rounded-md bg-[#D07748] px-3 py-1 font-body text-xs text-white shadow-md';
    rotulo.textContent = pino.nome;
  }

  const haste = document.createElement('div');
  haste.className = 'h-10 w-px bg-[#D07748]';

  const ponto = document.createElement('div');
  ponto.className = 'h-2 w-2 -mt-px rounded-full bg-[#D07748] ring-1 ring-white/70';

  raiz.append(rotulo, haste, ponto);
  return raiz;
}
