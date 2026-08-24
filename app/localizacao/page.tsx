import type { Metadata } from 'next';
import Image from 'next/image';
import { IconCar, IconHelicopter, IconBrandWaze } from '@tabler/icons-react';
import { Navbar } from '@/components/navbar';
import { MobileNav } from '@/components/mobile-nav';
import { PaginaHero } from '@/components/pagina-hero';
import { ContatoSection } from '@/components/contato-section';
import { DivisorCapitulo } from '@/components/divisor-capitulo';
import { MapaRegiao3D } from '@/components/mapa-regiao-3d';
import { DecorativeGraphic } from '@/components/decorative-graphic';
import { Footer } from '@/components/footer';
import enquadramento from '@/lib/enquadramento-mapa.json';

export const metadata: Metadata = {
  title: 'Localização',
  description:
    'Piracaia, a 96 km de São Paulo: a região no mapa, o antigo vilarejo de Santo Antônio da Cachoeira e o acesso por terra e pelo ar.',
};

/**
 * Página da categoria Localização — item "Localização" do menu do topo.
 * Três seções, na ordem em que a página conta a história, cada uma com id de
 * âncora: #a-regiao (o mapa macro), #piracaia (a cidade), #como-chegar.
 * As duas primeiras dividem um único container branco — o mapa, o bloco navy e
 * a cidade correm dentro da mesma moldura dourada.
 *
 * Copy: book p27 (mapa) e p28 (Piracaia). Regra do wireframe da categoria:
 * quilometragem sempre com asterisco, nunca tempo de viagem — por isso o
 * "a 30 minutos de Piracaia" do book não sobe para o site.
 */

/**
 * Os pinos do mapa em relevo.
 *
 * A península veio do Google Earth: 22°58'33.58"S 46°22'48.61"W, elevação de
 * 854,76 m. As cidades são as mesmas da arte do book (p27), com coordenada do
 * centro de cada uma.
 */
const PENINSULA = { lat: -22.975994, lng: -46.380169 };

const pinosDoMapa = [
  { nome: 'Villa Stradale', marca: true, ...PENINSULA },
  { nome: 'Piracaia', lat: -23.0536, lng: -46.3583 },
  { nome: 'Atibaia', lat: -23.1171, lng: -46.5504 },
  { nome: 'Bragança Paulista', lat: -22.9526, lng: -46.5419 },
  { nome: 'Joanópolis', lat: -22.9291, lng: -46.2745 },
  { nome: 'Extrema', lat: -22.8553, lng: -46.3181 },
  { nome: 'Monte Verde', lat: -22.8611, lng: -46.0389 },
];

/**
 * O enquadramento de abertura vem de lib/enquadramento-mapa.json, gravado pelo
 * botão "salvar este enquadramento" que aparece sobre o mapa rodando local.
 * Para mudar, posicione o mapa na tela e salve — não precisa editar código.
 */
const cameraDaRegiao = {
  ...enquadramento,
  centro: enquadramento.centro as [number, number],
};

/** As cidades do mapa macro — os pinos da arte do book (p27) */
const vizinhas = [
  { nome: 'Piracaia', nota: 'A cidade do empreendimento' },
  { nome: 'Atibaia', nota: 'Serviços e o acesso pela Fernão Dias' },
  { nome: 'Bragança Paulista', nota: 'Gastronomia e infraestrutura' },
  { nome: 'Joanópolis', nota: 'A vizinha da represa' },
  { nome: 'Extrema', nota: 'Já em Minas Gerais' },
  { nome: 'Monte Verde', nota: 'O vilarejo de montanha' },
];

/** A tira de três fotos da cidade, como na p28 do book */
const tiraCidade = [
  {
    src: '/images/regiao/cachoeira-dos-pretos.jpg',
    alt: 'A Cachoeira dos Pretos, entre a mata da serra',
    legenda: 'Cachoeira dos Pretos',
  },
  {
    src: '/images/regiao/igreja-matriz.jpg',
    alt: 'A Igreja Matriz de Santo Antônio da Cachoeira, vista da rua',
    legenda: 'Igreja Matriz',
  },
  {
    src: '/images/regiao/mesa-com-vista.jpg',
    alt: 'Mesa posta em restaurante da região, com a represa e os morros ao fundo',
    legenda: 'A mesa com a represa à vista',
  },
];

/** O trajeto por rodovia, em etapas */
const porTerra = [
  {
    etapa: 'Rodovia Fernão Dias',
    texto: 'BR-381, sentido Belo Horizonte, de São Paulo até Atibaia.',
  },
  { etapa: 'SP-036', texto: 'De Atibaia até Piracaia, na estrada que corta a serra.' },
  {
    etapa: 'Piracaia até a península',
    texto: 'Da cidade, o acesso segue até a portaria do Villa Stradale.',
  },
  {
    etapa: 'Rota alternativa',
    texto: 'Rodovia dos Bandeirantes, para quem sai da zona oeste da capital.',
  },
];

export default function Localizacao() {
  return (
    <>
      <Navbar />
      <MobileNav />

      <main>
        <PaginaHero
          titulo={
            <>
              Água, terra e o melhor
              <br />
              da vida no interior paulista
            </>
          }
          tagline="Piracaia · São Paulo"
          imagem="/images/imagem da regiao.jpeg"
          alt="A represa e a Serra da Mantiqueira ao amanhecer, com neblina baixa sobre os morros"
        />

        {/* ================= A REGIÃO — o mapa macro (book p27) =================
            O fim do container avança sobre a faixa azul de "Como chegar", como
            nas outras páginas: 112px no desktop. */}
        <section
          id="a-regiao"
          className="relative z-10 -mb-16 scroll-mt-28 overflow-hidden pt-20 md:-mb-24 md:pt-32 lg:-mb-28"
        >
          <div className="container relative z-10 mx-auto px-4 md:px-8">
            {/* O mapa abre o container encostado no topo, e a moldura dourada
                começa mais abaixo, emoldurando por cima da imagem: o respiro de
                cima é a faixa de mapa que sobra acima do fio dourado. */}
            <div className="relative bg-white px-4 pb-12 md:px-12 md:pb-16 lg:px-16">
              <div className="relative">
                <div className="pointer-events-none absolute bottom-0 left-0 right-0 top-12 z-50 border-2 border-[#D07748]/50 md:top-16" />

                {/* O mapa na largura do container, atrás das linhas douradas. No
                    desktop entra inteiro, na proporção da arte, para nenhum pino
                    ficar de fora; no celular é um recorte do centro, onde estão a
                    península e Piracaia. */}
                <div className="relative -mx-6 h-[420px] md:-mx-12 md:h-[560px] lg:-mx-16 lg:aspect-[1832/1077] lg:h-auto">
                  <MapaRegiao3D
                    pinos={pinosDoMapa}
                    camera={cameraDaRegiao}
                    estatico={
                      <Image
                        src="/images/regiao/mapa-google.jpg"
                        alt="Mapa da região: a península do Villa Stradale entre Piracaia, Atibaia, Bragança Paulista, Joanópolis, Extrema e Monte Verde"
                        fill
                        className="object-cover"
                        sizes="(max-width: 1024px) 100vw, 90vw"
                        quality={90}
                      />
                    }
                  />
                </div>

                {/* O texto do book, no bloco navy colado ao mapa. Respiro largo:
                    o bloco tem altura de sobra e a lista das vizinhas anda com
                    espaço entre os fios, sem apertar a informação. */}
                <div className="relative -mx-6 bg-[#0a1929] px-14 py-20 md:-mx-12 md:px-24 md:py-28 lg:-mx-16 lg:px-32 lg:py-36">
                  <div className="grid grid-cols-1 gap-16 lg:grid-cols-[1.1fr_1fr] lg:gap-28">
                    <div>
                      <span className="mb-8 block font-heading text-sm font-thin uppercase italic tracking-[0.35em] text-[#D07748] md:text-base">
                        No entorno
                      </span>
                      <h2 className="mb-8 max-w-2xl font-heading text-2xl font-light uppercase italic leading-tight text-white md:text-3xl lg:text-4xl">
                        No centro de tudo, um
                        <br />
                        paraíso à beira d’água
                      </h2>
                      <p className="max-w-md font-body text-sm leading-loose text-white/80 md:text-base">
                        O Villa Stradale fica em Piracaia, com Bragança Paulista, Atibaia e
                        Joanópolis como vizinhas, ampliando as opções de gastronomia, serviços e
                        infraestrutura no entorno.
                      </p>
                    </div>

                    <ul className="grid grid-cols-1 gap-x-12 gap-y-10 sm:grid-cols-2">
                      {vizinhas.map(({ nome, nota }) => (
                        <li key={nome} className="border-t border-white/15 pt-5">
                          <span className="block font-heading text-base font-light uppercase italic text-gold md:text-lg">
                            {nome}
                          </span>
                          <span className="mt-2 block font-body text-[11px] leading-relaxed text-white/60 md:text-xs">
                            {nota}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* ================= PIRACAIA — a cidade (book p28) ================= */}
                <div
                  id="piracaia"
                  className="relative scroll-mt-28 px-4 py-12 md:px-12 md:py-16 lg:px-16 lg:py-20"
                >
                  <DecorativeGraphic position="right" className="right-0 top-10 z-20" />

                  <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,0.85fr)_1fr] lg:gap-20">
                    <div>
                      <div className="mb-6">
                        <Image
                          src="/logos/Icone-VillaStradale escuro.svg"
                          alt="Villa Stradale"
                          width={64}
                          height={40}
                          className="h-9 w-auto md:h-10"
                        />
                      </div>
                      <span className="mb-6 block font-heading text-sm font-thin uppercase italic tracking-[0.3em] text-[#D07748] md:text-base">
                        A cidade
                      </span>
                      <h2 className="font-heading text-2xl font-light uppercase italic leading-snug text-navy md:text-3xl lg:text-4xl">
                        Piracaia
                        <br />
                        São Paulo
                      </h2>
                    </div>

                    <div className="space-y-6">
                      <p className="font-body text-base leading-relaxed text-gray-700 md:text-lg">
                        Poucos lugares reúnem natureza, autenticidade e beleza em equilíbrio tão
                        raro. Piracaia é um refúgio serrano do interior paulista, onde a Serra da
                        Mantiqueira se encontra com as águas do Sistema Cantareira, criando uma
                        paisagem viva que combina montanha, horizonte e serenidade.
                      </p>
                      <p className="font-body text-sm leading-relaxed text-gray-700 md:text-base">
                        O antigo vilarejo de Santo Antônio da Cachoeira preserva o que o tempo
                        consagrou: ruas tranquilas, comércio local, vida em torno da praça e uma fé
                        que faz parte da rotina. Esse espírito de comunidade e permanência cria o
                        pano de fundo ideal para um modo de vida mais essencial, onde o tempo corre
                        de outro jeito e cada final de semana se prolonga.
                      </p>
                      <p className="font-body text-sm leading-relaxed text-gray-700 md:text-base">
                        A represa se abre em penínsulas e enseadas perfeitas para esportes náuticos,
                        passeios de barco e contemplação. No alto, o Santo Cruzeiro guarda a cidade;
                        no centro, a Igreja Matriz revela o teto pintado com todos os papas,
                        símbolos da história e da devoção que moldam o lugar.
                      </p>
                    </div>
                  </div>
                </div>

                {/* A tira de três fotos — a composição da p28 do book */}
                <div className="-mx-6 grid grid-cols-1 md:-mx-12 md:grid-cols-3 lg:-mx-16">
                  {tiraCidade.map(({ src, alt, legenda }) => (
                    <figure key={src} className="relative m-0">
                      <div className="relative h-[300px] md:h-[380px] lg:h-[440px]">
                        <Image
                          src={src}
                          alt={alt}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                      </div>
                      <figcaption className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-5 pb-4 pt-10 font-body text-[11px] uppercase tracking-[0.18em] text-white/90">
                        {legenda}
                      </figcaption>
                    </figure>
                  ))}
                </div>

                {/* O fecho da página do book */}
                <div className="px-4 py-14 md:px-12 md:py-16 lg:px-16 lg:py-20">
                  <p className="mx-auto max-w-3xl text-center font-heading text-xl font-light uppercase italic leading-relaxed text-[#D07748] md:text-2xl lg:text-3xl">
                    Piracaia reflete o que o Villa Stradale representa: um território que acolhe,
                    preserva e convida a criar raízes.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= COMO CHEGAR ================= */}
        <DivisorCapitulo
          id="como-chegar"
          rotulo="Como chegar"
          titulo={
            <>
              96 km* de São Paulo,
              <br />
              por terra e pelo ar
            </>
          }
          frase="São dois caminhos possíveis a partir da capital, ambos pavimentados, e três spots de pouso na península."
        />

        {/* O container avança sobre a faixa azul, como nas outras páginas */}
        <section className="relative z-10 -mt-16 overflow-hidden md:-mt-24 lg:-mt-28">
          <div className="container relative z-10 mx-auto px-4 md:px-8">
            <div className="relative bg-white px-4 py-12 md:px-12 md:py-16 lg:px-16">
              <div className="relative">
                <div className="pointer-events-none absolute inset-0 z-50 border-2 border-[#D07748]/50" />

                {/* Por terra */}
                <div className="px-4 py-12 md:px-12 md:py-16 lg:px-16 lg:py-20">
                  <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-20">
                    <div>
                      <div className="mb-6 flex items-center gap-2 text-[#D07748]">
                        <IconCar size={22} stroke={1.5} />
                        <span className="font-heading text-sm font-thin uppercase italic tracking-[0.3em] md:text-base">
                          Por terra
                        </span>
                      </div>
                      <h3 className="mb-8 font-heading text-2xl font-light uppercase italic leading-snug text-navy md:text-3xl lg:text-4xl">
                        Todo o trajeto
                        <br />
                        por rodovia
                      </h3>
                      <div className="max-w-md space-y-5">
                        <p className="font-body text-sm leading-relaxed text-gray-700 md:text-base">
                          O Villa Stradale fica na região bragantina do interior paulista, onde a
                          Serra da Mantiqueira encontra as águas do Sistema Cantareira.
                        </p>
                        <p className="font-body text-sm leading-relaxed text-gray-700 md:text-base">
                          São dois caminhos possíveis a partir da capital, ambos pavimentados.
                        </p>
                      </div>

                      <div className="mt-10 flex items-center gap-3">
                        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#05c8f7] text-white">
                          <IconBrandWaze size={22} stroke={1.5} />
                        </span>
                        <span className="font-body text-sm text-gray-600 md:text-base">
                          Pino no Waze em definição.
                        </span>
                      </div>
                    </div>

                    <ol className="space-y-8 lg:border-l lg:border-navy/15 lg:pl-12 xl:pl-16">
                      {porTerra.map(({ etapa, texto }, i) => (
                        <li key={etapa} className="flex gap-6">
                          <span className="pt-0.5 font-heading text-sm text-[#D07748] md:text-base">
                            {String(i + 1).padStart(2, '0')}
                          </span>
                          <div>
                            <span className="mb-2 block font-body text-base text-navy md:text-lg">
                              {etapa}
                            </span>
                            <p className="max-w-sm font-body text-sm leading-relaxed text-gray-700 md:text-base">
                              {texto}
                            </p>
                          </div>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>

                {/* Pelo ar — bloco navy */}
                <div className="relative -mx-6 bg-[#0a1929] px-14 py-16 md:-mx-12 md:px-24 md:py-20 lg:-mx-16 lg:px-32">
                  <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-20">
                    <div className="text-white">
                      <div className="mb-6 flex items-center gap-2 text-[#D07748]">
                        <IconHelicopter size={22} stroke={1.5} />
                        <span className="font-heading text-sm font-thin uppercase italic tracking-[0.35em] md:text-base">
                          Pelo ar
                        </span>
                      </div>
                      <h3 className="mb-6 font-heading text-2xl font-light uppercase italic leading-tight md:text-3xl lg:text-4xl">
                        Do Helicidade ao
                        <br />
                        heliponto da península
                      </h3>
                      <p className="max-w-md font-body text-sm leading-relaxed text-white/80 md:text-base">
                        Três spots privativos de pouso, integrados à paisagem e recuados junto à
                        marina. A linha de silêncio mantém o heliponto fora do centro de
                        convivência.
                      </p>
                    </div>

                    <div className="relative h-[280px] w-full md:h-[360px] lg:h-[420px]">
                      <Image
                        src="/images/amenities/heliponto.jpg"
                        alt="Heliponto da península, com helicóptero pousado e a represa ao fundo"
                        fill
                        className="object-cover"
                        sizes="(max-width: 1024px) 100vw, 50vw"
                      />
                    </div>
                  </div>
                </div>

                {/* Nota do asterisco */}
                <div className="px-4 py-10 md:px-12 md:py-12 lg:px-16">
                  <p className="max-w-2xl font-body text-[11px] leading-relaxed text-gray-500 md:text-xs">
                    * Quilometragem aproximada, medida por rodovia a partir da cidade de São Paulo.
                    As distâncias variam conforme o ponto de partida e a rota escolhida.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Fecho padrão do site: o formulário de interesse */}
        <ContatoSection respiroNoTopo />
      </main>

      <Footer />
    </>
  );
}
