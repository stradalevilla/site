import type { Metadata } from 'next';
import Image from 'next/image';
import { Navbar } from '@/components/navbar';
import { MobileNav } from '@/components/mobile-nav';
import { PaginaHero } from '@/components/pagina-hero';
import { ContatoSection } from '@/components/contato-section';
import { DivisorCapitulo } from '@/components/divisor-capitulo';
import { ParallaxGaleria } from '@/components/parallax-galeria';
import { DecorativeGraphic } from '@/components/decorative-graphic';
import { Footer } from '@/components/footer';
import { TOTAL_LOTES } from '@/lib/lotes';
import { imagensDoEmpreendimento } from '@/lib/galeria';

export const metadata: Metadata = {
  title: 'Villa Stradale',
  description:
    'Um condomínio pé na água de edição limitada: 54 lotes de 2.000 a 4.554 m² numa península irreplicável em Piracaia, assinado por Greg Bousquet (AO) e Luiz Carlos Orsini.',
};

/**
 * Página da categoria Villa Stradale — item "Villa Stradale" do menu do topo.
 * As três seções são os guias de conteúdo do mapa do menu, e cada uma tem id
 * para servir de âncora: #o-projeto, #arquitetura-paisagismo, #stakeholders.
 *
 * Copy: book de vendas do cliente (V12) — p2, p5, p6, p8, p22, p23, p26, p30,
 * p31, p33, p34 e p35. Ver DOSSIE-COPY-BOOK.md.
 * Lotes: 52, de lib/lotes.ts (conferido na planta; o book escreve 54).
 */

/** Amenities: copy do book p8/p22/p23, programa do masterplan p26 */
const amenities = [
  {
    overline: 'Lazer e convivência',
    nome: 'Casa Clube',
    lema: 'Mais do que um clube, uma casa para ser vivida.',
    texto:
      'Um mirante voltado para a represa, onde o lazer assume o tom de lar. Piscina, bangalôs, spa, capela, brinquedoteca, restaurante e bar, todos voltados à vista da água. Aqui, o bem-estar nasce da convivência.',
    programa: [
      'Bar e restaurante',
      'Sala de jogos e convivência com lareira',
      'Piscina adulto e infantil',
      'Brinquedoteca e playground',
      'Academia com equipamentos Technogym',
      'Espaço ao ar livre para yoga ou funcional',
      'Saunas seca e a vapor',
      'Sala de massagem',
      'Hot spa com vista e acesso à área externa',
      'Cold spa e área de descanso',
      'Capela ecumênica',
    ],
    imagem: '/images/amenities/piscinas-clube.jpg',
    alt: 'Piscina da casa clube com deck e vista da represa',
  },
  {
    overline: 'Esporte e comunidade',
    nome: 'Racket Club',
    lema: 'É o lugar onde a comunidade se encontra em terra.',
    texto:
      'No Villa Stradale, o Racket Club reúne tênis, padel e beach tennis em clima de casa entre amigos. As quadras recebem jogos combinados entre vizinhos, aulas em família e finais de tarde que misturam crianças, jovens e adultos em torno do mesmo prazer de jogar.',
    programa: [
      '2 quadras de tênis',
      '1 quadra de padel',
      '2 quadras de beach tennis',
      'Campo de futebol society',
      'Trilha de 3 km para corrida, caminhada ou bicicleta',
      'Pista de cooper',
    ],
    imagem: '/images/amenities/quadras.jpg',
    alt: 'Quadras do Racket Club vistas do alto, com a represa ao fundo',
  },
  {
    overline: 'Náutica',
    nome: 'Garagem Náutica',
    lema: 'O acesso do Villa Stradale à represa.',
    texto:
      'A garagem náutica, com rampa de acesso à água, conecta o dia a dia da comunidade à represa. Do píer, o caminho segue para a Casa Clube pela água.',
    programa: ['Apoio náutico', 'Rampa de acesso à água', 'Píer para acesso à Casa Clube'],
    imagem: '/images/amenities/marina.jpg',
    alt: 'Enseada da marina com veleiro e píeres de madeira',
  },
  {
    overline: 'Acesso pelo ar',
    nome: 'Heliponto',
    lema: 'Para quem chega pelo ar.',
    texto:
      'Três spots de pouso integrados à paisagem, recuados junto à marina. A linha de silêncio mantém o heliponto fora do centro de convivência e resguarda as quadras.',
    programa: ['Três spots de pouso', 'Recuado junto à marina'],
    imagem: '/images/amenities/heliponto.jpg',
    alt: 'Heliponto na beira da represa com helicóptero pousado',
  },
];

/** Diferenciais: a lista do book p33, na ordem do original */
const diferenciais = [
  'Portaria com controle de acesso 24 horas',
  'Monitoramento por câmeras em todo o perímetro',
  'Ronda terrestre e aquática permanente',
  'Sistema de vigilância integrado por sensores e câmeras',
  'Acesso independente para moradores, visitantes e serviços',
  'Cabeamento subterrâneo para maior proteção e estética',
  'Iluminação perimetral e de vias com fotocélulas',
  'Equipe treinada para atendimento emergencial',
  'Monitoramento remoto do sistema de segurança',
  'Administração e protocolo operacional pela BBZ',
  'Shuttle de helicóptero',
];

/** Infraestrutura: a especificação do book p26 */
const infraestrutura = [
  {
    nome: 'Drenagem e terraplenagem',
    texto:
      'Tubulação em PEAD Kanaflex, de maior resistência e durabilidade. Terraplenagem e drenagem executadas com a linha Black Caterpillar.',
  },
  {
    nome: 'Poço artesiano de 250 metros',
    texto: 'Abastecimento próprio, com caixa d’água de 200 mil litros.',
  },
  {
    nome: 'Elétrica nível T3',
    texto: '125 ampères e 47 kVA, acima do entregue na maioria dos condomínios.',
  },
  {
    nome: 'Cabeamento subterrâneo',
    texto:
      'Luz e internet enterradas. Iluminação perimetral e de vias com fotocélulas, sem fiação atravessando a paisagem.',
  },
  { nome: 'Vias', texto: 'Piso intertravado permeável e guias no formato americano.' },
  { nome: 'Tratamento de efluentes', texto: 'Estação própria, dentro do empreendimento.' },
  {
    nome: 'Segurança 24 horas',
    texto:
      'Controle de acesso na portaria, monitoramento por câmeras em todo o perímetro e ronda permanente por terra e por água.',
  },
];

/** Os dois autores: book p30 e p31 */
const autores = [
  {
    tag: 'Arquitetura',
    cardNome: 'AO / Greg Bousquet',
    cardBio:
      'Arquiteto formado na École de Paris, com mestrados pela ENSA Paris-La Villette e pela Sorbonne. Co-fundador da Triptyque, acumulou 23 anos de trajetória internacional antes de fundar, em 2021, a Architects Office (AO).',
    retrato: '/images/casaclube/arquitetos/AO-Greg Bousquet.png',
    lema: 'Arquitetura em estado de pouso',
    paragrafos: [
      'A AO é uma agência de arquitetura, urbanismo e interiores com sedes em São Paulo e Lisboa. Atua em 14 estados no Brasil e em países como Peru, Chile e Portugal, sempre com foco em urbanismo virtuoso e arquitetura ética.',
      'No Villa Stradale, Greg parte do princípio de que a natureza é protagonista; a resposta formal é arquitetura em estado de pouso: volumes baixos, pedra e madeira que assumem a pátina do tempo, vãos que enquadram a água e clube-casa voltado ao poente.',
      'A “linha de silêncio” resguarda as quadras e o heliponto recuado permanece junto à marina. O quiet luxury é percebido no conforto, na luz e na honestidade dos materiais.',
    ],
    marcas: ['Natureza protagonista', 'Linha de silêncio', 'Quiet luxury'],
  },
  {
    tag: 'Paisagismo',
    cardNome: 'Orsini',
    cardBio:
      'Luiz Carlos Orsini é paisagista mineiro, de Belo Horizonte, formado em 1984 na Escuela de Jardinería y Paisajismo “Castillo de Batres” (Madri). Atua desde 1979 e se tornou um dos nomes centrais do paisagismo brasileiro contemporâneo.',
    retrato: '/images/casaclube/arquitetos/orsini.png',
    lema: 'Paisagismo como moldura viva',
    paragrafos: [
      'Entre 2000 e 2004, foi responsável por 25 ha do Instituto Inhotim, referência mundial em paisagismo tropical. Autor de Luiz Carlos Orsini: 30 Anos de Paisagismo (2008) e Orsini (2017), mantém escritórios em São Paulo e Belo Horizonte.',
      'No Villa Stradale, o escritório Orsini define o conceito de moldura viva: o verde não decora, prolonga o horizonte: bosque nativo nas encostas, faixa-praia minimalista na orla e pista de cooper que costura decks, mirantes e nichos de pausa.',
      'Predominam espécies nativas (Mata Atlântica com inserções de Cerrado), drenagem e irrigação passivas e manutenção quase silenciosa, numa atmosfera descrita como “270 graus de paz”.',
    ],
    marcas: ['Moldura viva', 'Bosque nativo + Mata Atlântica', '25 ha do Inhotim'],
  },
];


/** A trajetória do fundador: book p34 */
const trajetoria = [
  { marco: '17 anos', texto: 'Início da carreira na empresa da família, a Caçula de Pneus.' },
  { marco: 'FAAP · INSPER', texto: 'Graduação em Administração e pós em Business Management.' },
  {
    marco: 'COO',
    texto:
      'Liderou a operação da companhia, conduzindo a expansão e a posterior venda ao grupo italiano Pirelli.',
  },
  {
    marco: '2018',
    texto:
      'Criou a Stradale Car Service, focada em veículos premium, hoje flagship store da Michelin no Brasil, com três lojas.',
  },
  {
    marco: '2020',
    texto:
      'Nasce o braço imobiliário do grupo, com projetos autorais no segmento de segunda residência.',
  },
  {
    marco: 'Forbes Under 30',
    texto:
      'Selecionado pela lista anual da revista, que destaca jovens de até 30 anos que revolucionam negócios.',
  },
  {
    marco: 'Porsche GT3 Cup',
    texto:
      'Campeão sul-americano em 2017. Pedro é também piloto profissional de automobilismo.',
  },
];

export default function VillaStradale() {
  return (
    <>
      <Navbar />
      <MobileNav />

      <main>
        {/* HERO — book p6, com a assinatura da marca (p3) */}
        <PaginaHero
          titulo={
            <>
              Um condomínio pé na água
              <br />
              de edição limitada
            </>
          }
          frase="São 54 lotes residenciais voltados à água, com casa-clube, marina, heliponto, quadras esportivas e infraestrutura subterrânea, em um território protegido por segurança 24h por terra e por água."
          tagline="Raro por natureza"
          imagem="/images/aereas/peninsula-aerea.jpg"
          alt="Vista aérea da península do Villa Stradale, cercada pela represa"
        />

        {/* ================= O PROJETO =================
            A margem negativa embaixo faz o cartão branco avançar por cima da
            faixa da piscina que vem a seguir — o mesmo gesto que o bloco de
            Infraestrutura faz sobre a faixa da portaria, ao contrário. */}
        <section
          id="o-projeto"
          className="relative z-10 -mb-16 scroll-mt-28 overflow-hidden pt-20 md:-mb-24 md:pt-32 lg:-mb-28"
        >
          <div className="container relative z-10 mx-auto px-4 md:px-8">
            <div className="relative bg-white px-4 py-12 md:px-12 md:py-16 lg:px-16">
              <div className="relative z-10">
                <div className="relative">
                  <div className="pointer-events-none absolute inset-0 z-50 border-2 border-[#D07748]/50" />

                  {/* Casa-Clube — book p8. Mesma formatação da abertura que já
                      existia aqui: emblema centralizado, título terracota em
                      duas linhas e os parágrafos centralizados. */}
                  <div className="px-4 py-12 md:px-12 md:py-16 lg:px-16 lg:py-20">
                    <div className="mb-12 flex justify-center">
                      <Image
                        src="/logos/Icone-VillaStradale escuro.svg"
                        alt="Villa Stradale"
                        width={40}
                        height={40}
                        className="h-8 w-auto opacity-90 md:h-10"
                      />
                    </div>

                    <div className="mb-10 space-y-2 text-center md:mb-12">
                      <h2 className="font-heading text-2xl font-light uppercase italic leading-relaxed text-navy md:text-3xl lg:text-4xl">
                        Casa-Clube:
                      </h2>
                      <h2 className="font-heading text-2xl font-light uppercase italic leading-relaxed text-navy md:text-3xl lg:text-4xl">
                        o coração do projeto
                      </h2>
                    </div>

                    {/* Subtítulo terracota, como no book — em uma linha só */}
                    <p className="mb-10 text-center font-body text-base leading-relaxed text-[#D07748] md:mb-12 md:text-lg">
                      Mais do que um clube, uma casa para ser vivida.
                    </p>

                    <div className="mx-auto max-w-4xl space-y-6 text-center">
                      <p className="font-body text-base leading-relaxed text-gray-700 md:text-lg">
                        Um mirante voltado para a represa, onde o lazer assume o tom de lar.
                        Piscina, bangalôs, spa, capela, brinquedoteca, restaurante e bar, todos
                        voltados à vista da água.
                      </p>
                      <p className="font-body text-base leading-relaxed text-gray-700 md:text-lg">
                        Aqui, o bem-estar nasce da convivência. É o ponto de encontro entre quem
                        compartilha os mesmos valores e ritmo de vida. O privilégio de estar
                        juntos, sem pressa, em harmonia com o lugar.
                      </p>
                    </div>

                    {/* A casa clube logo abaixo do texto: imagem limpa, sem véu e
                        sem título. As margens negativas cancelam o padding do
                        conteúdo E o do cartão branco, então a imagem avança além
                        das linhas douradas e ocupa a largura inteira do container.
                        Único render dessa elevação frontal — vem da pasta de
                        abril, porque FINAIS MAIO não tem equivalente. */}
                    <div className="relative -mx-12 mt-12 h-[400px] md:-mx-24 md:mt-16 md:h-[500px] lg:-mx-32 lg:mt-20 lg:h-[600px]">
                      <Image
                        src="/images/casaclube/casa-clube-c14.jpg"
                        alt="A casa clube vista de frente: dois pavimentos, brises de madeira, muro de pedra e o espelho de água do wellness"
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 80vw"
                      />
                    </div>

                    {/* A metragem do produto — book p6. Faixa navy encostada na
                        foto, na mesma largura dela, com o texto claro. */}
                    <div className="relative -mx-12 bg-[#0a1929] px-8 py-14 text-center md:-mx-24 md:px-12 md:py-16 lg:-mx-32 lg:py-20">
                      <p className="font-body text-xs uppercase tracking-[0.35em] text-[#D07748] md:text-sm">
                        Náutica, Casa Clube e Reserva
                      </p>
                      <p className="mt-6 font-heading text-2xl font-light uppercase italic leading-tight text-gold md:text-3xl lg:text-4xl">
                        {TOTAL_LOTES} lotes de 2.000 a 4.554 m²
                      </p>
                    </div>
                  </div>

                  {/* Amenities — book p8/p22/p23 + programa p26 */}
                  <div className="px-4 py-16 md:px-12 md:py-20 lg:px-16 lg:py-24">
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
                      Amenities
                    </span>
                    <h3 className="mb-6 font-heading text-2xl font-light uppercase italic leading-snug text-navy md:text-3xl lg:text-4xl">
                      Tudo o que existe
                      <br />
                      na península
                    </h3>
                    <p className="mb-14 max-w-xl font-body text-sm leading-relaxed text-navy/80 md:mb-20 md:text-base">
                      Cada estrutura foi posicionada onde a península pedia.
                      <br />
                      Aqui, uma a uma, com o programa de cada uma.
                    </p>

                    <div className="space-y-10 md:space-y-14">
                      {amenities.map(({ overline, nome, lema, texto, programa, imagem, alt }, i) => {
                        const imagemEsquerda = i % 2 === 1;
                        return (
                          <div
                            key={nome}
                            className="relative grid w-full grid-cols-1 bg-[#EFEBE3] lg:grid-cols-2"
                          >
                            <div
                              className={`flex flex-col justify-center px-6 py-10 md:px-12 md:py-14 lg:px-16 ${
                                imagemEsquerda ? 'order-1 lg:order-2' : ''
                              }`}
                            >
                              <span className="mb-4 font-heading text-sm font-thin uppercase italic tracking-[0.3em] text-[#D07748] md:text-base">
                                {overline}
                              </span>
                              <h4 className="mb-5 font-heading text-2xl font-light uppercase italic text-navy md:text-3xl lg:text-4xl">
                                {nome}
                              </h4>
                              <p className="mb-5 font-heading text-lg font-light italic text-[#D07748] md:text-xl">
                                {lema}
                              </p>
                              <p className="max-w-md font-body text-sm leading-relaxed text-gray-700 md:text-base">
                                {texto}
                              </p>

                              <ul className="mt-7 grid gap-x-8 gap-y-1.5 border-t border-navy/15 pt-5 sm:grid-cols-2">
                                {programa.map((item) => (
                                  <li
                                    key={item}
                                    className="flex gap-2 font-body text-[11px] leading-snug text-navy/70 md:text-xs"
                                  >
                                    <span aria-hidden className="text-[#D07748]">
                                      ·
                                    </span>
                                    <span>{item}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            <div
                              className={`relative p-6 md:p-8 ${
                                imagemEsquerda ? 'order-2 lg:order-1' : ''
                              }`}
                            >
                              <div className="relative h-full min-h-[260px] w-full md:min-h-[340px]">
                                <Image
                                  src={imagem}
                                  alt={alt}
                                  fill
                                  className="object-cover"
                                  sizes="(max-width: 1024px) 100vw, 50vw"
                                />
                              </div>
                            </div>

                            <DecorativeGraphic
                              position={imagemEsquerda ? 'left' : 'right'}
                              className={
                                imagemEsquerda
                                  ? 'left-0 top-1/2 z-20 -translate-x-6 -translate-y-1/2 md:-translate-x-12 lg:-translate-x-16'
                                  : 'right-0 top-1/2 z-20 -translate-y-1/2 translate-x-6 md:translate-x-12 lg:translate-x-16'
                              }
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Faixa parallax que vira galeria. Alta de propósito: os dois containers
            avançam 112px sobre ela, e sem essa folga os dois apareceriam na tela
            ao mesmo tempo. */}
        <ParallaxGaleria imagens={imagensDoEmpreendimento} rotulo="Imagens do empreendimento" />

        {/* ================= ARQUITETURA E PAISAGISMO =================
            O container avança sobre a faixa da piscina, acima, e sobre a da
            portaria, abaixo — as mesmas margens negativas de quando o masterplan
            abria esta seção. O masterplan mudou para a página /lotes. */}
        <section className="relative z-10 -mb-16 -mt-16 overflow-hidden md:-mb-24 md:-mt-24 lg:-mb-28 lg:-mt-28">
          <div className="container mx-auto px-4 md:px-8">
            <div className="relative bg-white px-4 py-12 md:px-12 md:py-16 lg:px-16">
              <div className="relative z-10">
                <div className="relative">
                  <div className="pointer-events-none absolute inset-0 z-50 border-2 border-[#D07748]/50" />

                  {/* ===== OS ARQUITETOS — diagramação do book, p30 e p31 =====
                      Retrato à esquerda com o nome sobre a foto, e à direita o
                      emblema, o título em sans, a linha de disciplina e o nome
                      em serifada itálica. Os grafismos dourados atravessam as
                      bordas da foto e a linha do container, como no book. */}
                  <div id="arquitetura-paisagismo" className="scroll-mt-28">
                    {autores.map((autor, i) => {
                      // o segundo autor entra espelhado: texto à esquerda, foto à direita
                      const invertido = i % 2 === 1;
                      return (
                      <div
                        key={autor.cardNome}
                        className={`px-4 py-16 md:px-12 md:py-20 lg:px-16 lg:py-24 ${
                          i > 0 ? 'border-t border-navy/10' : ''
                        }`}
                      >
                        <div
                          className={`relative grid grid-cols-1 items-center gap-12 lg:gap-16 ${
                            invertido
                              ? 'lg:grid-cols-[1fr_minmax(0,0.8fr)]'
                              : 'lg:grid-cols-[minmax(0,0.8fr)_1fr]'
                          }`}
                        >
                          {/* O retrato */}
                          <div
                            className={`relative w-full max-w-[460px] ${
                              invertido ? 'lg:order-2 lg:justify-self-end' : ''
                            }`}
                          >
                            <div className="relative aspect-[4/5] w-full">
                              <Image
                                src={autor.retrato}
                                alt={autor.cardNome}
                                fill
                                className="object-cover"
                                sizes="(max-width: 1024px) 100vw, 460px"
                              />
                              {/* O nome sobre a foto, com o fio, como no book */}
                              <div className="absolute inset-x-0 bottom-0 flex items-center gap-4 bg-gradient-to-t from-black/55 to-transparent px-5 pb-4 pt-12">
                                <span className="shrink-0 font-body text-[11px] uppercase tracking-[0.2em] text-white">
                                  {autor.cardNome}
                                </span>
                                <span aria-hidden className="h-px flex-1 bg-white/50" />
                              </div>
                            </div>

                            {/* Um tracinho só, atravessando a borda externa do
                                retrato — o lado oposto ao texto */}
                            {invertido ? (
                              <DecorativeGraphic
                                position="right"
                                className="right-0 top-[45%] z-20 -translate-y-1/2 translate-x-[38%]"
                              />
                            ) : (
                              <DecorativeGraphic
                                position="left"
                                className="left-0 top-[58%] z-20 -translate-x-[38%] -translate-y-1/2"
                              />
                            )}
                          </div>

                          {/* O texto */}
                          <div className={invertido ? 'lg:order-1' : ''}>
                            <div className="mb-8">
                              <Image
                                src="/logos/Icone-VillaStradale escuro.svg"
                                alt="Villa Stradale"
                                width={64}
                                height={40}
                                className="h-9 w-auto md:h-10"
                              />
                            </div>

                            <h3 className="font-body text-2xl leading-snug text-navy md:text-3xl lg:text-4xl">
                              {autor.lema}
                            </h3>

                            <p className="mt-5 font-body text-xs uppercase tracking-[0.35em] text-[#D07748] md:text-sm">
                              {autor.tag}
                            </p>

                            <p className="mt-7 font-heading text-3xl font-light uppercase italic text-[#D07748] md:text-4xl lg:text-[2.6rem]">
                              {autor.cardNome}
                            </p>

                            <div className="mt-7 space-y-5">
                              {autor.paragrafos.map((p) => (
                                <p
                                  key={p.slice(0, 24)}
                                  className="text-justify font-body text-sm leading-relaxed text-gray-700 md:text-base"
                                >
                                  {p}
                                </p>
                              ))}
                            </div>
                          </div>

                        </div>
                      </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Faixa da portaria. Alta como a da piscina: os dois containers
            avançam 112px sobre ela, um de cada lado. */}
        <section
          aria-label="Portaria do Villa Stradale"
          className="relative h-[70vh] w-full bg-cover bg-center md:h-[100vh] lg:h-[130vh] lg:bg-fixed"
          style={{ backgroundImage: "url('/images/portaria/portaria-panoramica.jpg')" }}
        />

        {/* Infraestrutura — book p26 e p33 */}
        <section className="relative">
          <div className="container mx-auto px-4 md:px-8">
            <div className="relative z-10 -mt-16 bg-white px-8 py-16 md:-mt-24 md:px-12 md:py-20 lg:-mt-28 lg:px-16 lg:py-24">
              <DecorativeGraphic position="right" className="right-0 top-10" />

              <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-2 lg:gap-20">
                {/* A coluna da esquerda acompanha a rolagem enquanto a lista da
                    direita passa — o topo compensa a altura da navbar fixa */}
                <div className="lg:sticky lg:top-32">
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
                    Segurança e infraestrutura
                  </span>
                  <h2 className="mb-8 font-heading text-2xl font-light uppercase italic leading-snug text-navy md:text-3xl lg:text-4xl">
                    Diferenciais
                  </h2>
                  <div className="max-w-md space-y-5">
                    <p className="font-body text-sm leading-relaxed text-gray-700 md:text-base">
                      O invisível é o que sustenta o lugar. Nada disto aparece nos renders, e é o
                      que faz a diferença no dia em que chove forte, no dia em que falta luz e em
                      todos os outros.
                    </p>
                    <p className="font-body text-sm leading-relaxed text-gray-700 md:text-base">
                      Cada detalhe visível foi pensado para encantar. Cada detalhe invisível, para
                      durar.
                    </p>
                  </div>
                </div>

                <div className="lg:border-l lg:border-navy/15 lg:pl-12 xl:pl-16">
                  {/* Os diferenciais — book p33 */}
                  <span className="block font-body text-[11px] uppercase tracking-[0.3em] text-[#D07748] md:text-xs">
                    Segurança e operação
                  </span>
                  <ul className="mt-6">
                    {diferenciais.map((item) => (
                      <li
                        key={item}
                        className="flex gap-4 border-t border-navy/10 py-3.5 font-body text-sm leading-relaxed text-gray-700 md:text-base"
                      >
                        <span aria-hidden className="pt-0.5 text-[#D07748]">
                          ·
                        </span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>

                  {/* A imagem que separa os dois conteúdos */}
                  <div className="relative my-12 aspect-[16/9] w-full border border-[#D07748]/40 md:my-14">
                    <Image
                      src="/images/portaria/portaria-entrada.jpg"
                      alt="A portaria do Villa Stradale, em pedra e madeira, com o espelho de água"
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                  </div>

                  {/* A infraestrutura — book p26 */}
                  <span className="block font-body text-[11px] uppercase tracking-[0.3em] text-[#D07748] md:text-xs">
                    Infraestrutura
                  </span>
                  <div className="mt-8 space-y-9">
                    {infraestrutura.map(({ nome, texto }, i) => (
                      <div key={nome} className="flex gap-6">
                        <span className="pt-0.5 font-heading text-sm text-[#D07748] md:text-base">
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <div>
                          <span className="mb-2 block font-body text-base text-navy md:text-lg">
                            {nome}
                          </span>
                          <p className="max-w-sm font-body text-sm leading-relaxed text-gray-700 md:text-base">
                            {texto}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ================= STAKEHOLDERS ================= */}
        <DivisorCapitulo
          id="stakeholders"
          rotulo="Fundador"
          titulo={
            <>
              “Primeiro foi um sonho;
              <br />
              por acaso, virou empreendimento.”
            </>
          }
          frase="Pedro Costa · Fundador"
        />

        {/* O container avança bem mais sobre a faixa azul que os outros da
            página: 224px no desktop, contra os 112px das demais sobreposições */}
        <section className="relative z-10 -mt-20 overflow-hidden md:-mt-40 lg:-mt-56">
          <div className="container relative z-10 mx-auto px-4 md:px-8">
            <div className="relative bg-white px-4 py-12 md:px-12 md:py-16 lg:px-16">
              <div className="relative z-10">
                <div className="relative">
                  <div className="pointer-events-none absolute inset-0 z-50 border-2 border-[#D07748]/50" />

                  {/* Abertura do fundador na diagramação da p34 do book: o
                      retrato à esquerda, com o grafismo cruzando o canto
                      superior direito da foto, e o texto à direita. Sem emblema
                      e sem a identificação do fundador — os dois já vêm na
                      faixa azul, logo acima. */}
                  <div className="px-4 py-12 md:px-12 md:py-16 lg:px-16 lg:py-20">
                    <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[minmax(0,0.75fr)_1fr] lg:gap-20">
                      <div className="relative">
                        <div className="relative aspect-[4/5] w-full">
                          <Image
                            src="/images/pessoas/pedro-costa.jpg"
                            alt="Pedro Costa, fundador do Villa Stradale"
                            fill
                            className="object-cover"
                            sizes="(max-width: 1024px) 100vw, 35vw"
                          />
                        </div>
                        {/* Como na página do book: as linhas nascem sobre a foto
                            e avançam para fora dela */}
                        <DecorativeGraphic
                          position="right"
                          className="right-0 top-4 z-20 translate-x-5 md:top-6 md:translate-x-6"
                        />
                      </div>

                      <p className="font-body text-lg leading-relaxed text-gray-700 lg:text-xl">
                        Pedro Costa é o incorporador por trás do Villa Stradale Península. Através
                        de um desejo incansável de construir um projeto único, ele escolheu uma
                        península irreplicável às margens da represa de Piracaia, com um objetivo:
                        transformar um sonho entre amigos numa edição limitada de {TOTAL_LOTES}{' '}
                        lotes, curada por afinidade.
                      </p>
                    </div>
                  </div>

                  {/* Pedro Costa — bloco terracota */}
                  <div className="relative -mx-6 overflow-hidden md:-mx-12 lg:-mx-16">
                    <div className="absolute inset-0">
                      <Image
                        src="/images/bg-embaixadores.png"
                        alt=""
                        fill
                        className="object-cover"
                        sizes="100vw"
                        quality={90}
                      />
                    </div>

                    <div className="relative z-10 grid grid-cols-1 items-center gap-10 px-14 py-16 md:grid-cols-1 md:px-24 md:py-20 lg:grid-cols-2 lg:gap-16 lg:px-32 lg:py-24">
                      {/* Título e parágrafo direto: o emblema e a identificação
                          do fundador já vêm na faixa azul, logo acima */}
                      <div className="text-white">
                        <h3 className="mb-6 font-heading text-2xl font-light uppercase italic leading-relaxed md:text-3xl lg:text-4xl">
                          Guardião de um
                          <br />
                          território raro
                        </h3>
                        <p className="max-w-md font-body text-sm leading-relaxed text-white/90 md:text-base">
                          Seu papel é ser guardião de um território raro, garantindo que o tempo
                          vire memória e legado para as próximas gerações. Por isso, assumiu a
                          responsabilidade de preservar a cultura boutique, discreta e “pé na água”
                          que define o projeto.
                        </p>
                      </div>

                      <ul className="space-y-6">
                        {trajetoria.map(({ marco, texto }) => (
                          <li key={marco} className="border-t border-white/25 pt-4 text-white">
                            <span className="mb-1 block font-heading text-lg font-light italic md:text-xl">
                              {marco}
                            </span>
                            <p className="font-body text-xs leading-relaxed text-white/85 md:text-sm">
                              {texto}
                            </p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>


                  {/* Stradale Inc. e comercialização — book p35 */}
                  <div className="relative -mx-6 bg-[#0a1929] px-14 py-16 md:-mx-12 md:px-24 md:py-20 lg:-mx-16 lg:px-32">
                    <div className="mb-12 max-w-3xl text-white md:mb-16">
                      <div className="mb-6">
                        <Image
                          src="/logos/Icone-VillaStradale claro.svg"
                          alt="Villa Stradale"
                          width={64}
                          height={40}
                          className="h-9 w-auto md:h-10"
                        />
                      </div>
                      <span className="mb-6 block font-heading text-sm font-thin uppercase italic tracking-[0.35em] text-[#D07748] md:text-base">
                        Realização e incorporação
                      </span>
                      <h3 className="mb-8 font-heading text-2xl font-light uppercase italic leading-tight md:text-3xl lg:text-4xl">
                        Stradale Inc.
                      </h3>
                      <div className="space-y-5">
                        <p className="font-body text-sm leading-relaxed text-white/80 md:text-base">
                          A Stradale Inc. nasceu em 2019 para ocupar um espaço muito específico no
                          mercado imobiliário: criar projetos de segunda residência com a mesma
                          precisão, cuidado e sofisticação de uma marca de luxo. Cada
                          empreendimento nasce de um processo profundo de curadoria. Plantas,
                          percursos, paisagem, serviços e experiências seguem um único critério:
                          fazer sentido para quem escolhe viver ali e consolidar um legado familiar
                          que atravessa gerações.
                        </p>
                        <p className="font-body text-sm leading-relaxed text-white/80 md:text-base">
                          A lógica é boutique, guiada por escassez planejada, comunidade por
                          afinidade e pertencimento real. Cada projeto surge como edição limitada,
                          com número restrito de unidades e desenho arquitetônico integrado ao
                          território, para criar um círculo de proprietários que compartilham
                          valores, visão de mundo e estilo de vida, sempre em escala humana.
                        </p>
                        <p className="font-body text-sm leading-relaxed text-white/80 md:text-base">
                          Villa Stradale Península, em Piracaia, representa o primeiro manifesto
                          dessa visão.
                        </p>
                      </div>
                    </div>

                  </div>

                  {/* Marcello */}
                  <div className="px-6 pb-16 pt-16 md:px-12 md:pb-20 md:pt-20 lg:px-16 lg:pt-24">
                    <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
                      <div>
                        <span className="mb-6 block font-heading text-sm font-thin uppercase italic tracking-[0.3em] text-[#D07748] md:text-base">
                          Desenvolvimento e produto
                        </span>
                        <h3 className="mb-8 font-heading text-2xl font-light uppercase italic leading-snug text-navy md:text-3xl lg:text-4xl">
                          Marcello Romero
                        </h3>
                        <div className="max-w-md space-y-5">
                          <p className="font-body text-sm leading-relaxed text-gray-700 md:text-base">
                            Marcello responde pelo desenvolvimento do produto e pelo redesenho dos
                            lotes, com revisão atrás de revisão do masterplan.
                          </p>
                          <p className="font-body text-sm leading-relaxed text-gray-700 md:text-base">
                            Cada um dos {TOTAL_LOTES} terrenos precisava ter a sua vista, a sua
                            frente de água ou o seu recuo de mata. Nenhum lote sobra para fechar
                            conta.
                          </p>
                        </div>
                      </div>

                      <div className="relative w-full border border-[#D07748]/40 p-5">
                        <div className="relative h-[280px] md:h-[360px] lg:h-[400px]">
                          <Image
                            src="/images/pessoas/marcello-romero.jpg"
                            alt="Marcello Romero, responsável pelo desenvolvimento do produto"
                            fill
                            className="object-cover"
                            sizes="(max-width: 1024px) 100vw, 50vw"
                          />
                        </div>
                        <DecorativeGraphic
                          position="right"
                          className="right-0 top-1/2 z-20 -translate-y-1/2 translate-x-6 md:translate-x-12 lg:translate-x-16"
                        />
                      </div>
                    </div>
                  </div>

                  {/* BBZ */}
                  <div className="px-4 pb-16 md:px-12 md:pb-20 lg:px-16">
                    <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
                      <div className="relative w-full border border-[#D07748]/40 p-5 lg:order-1">
                        <div className="relative h-[280px] md:h-[360px] lg:h-[400px]">
                          <Image
                            src="/images/portaria/portaria-entrada.jpg"
                            alt="A portaria do Villa Stradale, em pedra, madeira e espelho de água"
                            fill
                            className="object-cover"
                            sizes="(max-width: 1024px) 100vw, 50vw"
                          />
                        </div>
                        <DecorativeGraphic
                          position="left"
                          className="left-0 top-1/2 z-20 -translate-x-6 -translate-y-1/2 md:-translate-x-12 lg:-translate-x-16"
                        />
                      </div>

                      <div className="lg:order-2">
                        <span className="mb-6 block font-heading text-sm font-thin uppercase italic tracking-[0.3em] text-[#D07748] md:text-base">
                          Obra e execução
                        </span>
                        <h3 className="mb-8 font-heading text-2xl font-light uppercase italic leading-snug text-navy md:text-3xl lg:text-4xl">
                          BBZ
                        </h3>
                        <div className="max-w-md space-y-5">
                          <p className="font-body text-sm leading-relaxed text-gray-700 md:text-base">
                            A BBZ responde pela obra: administração e execução do empreendimento, da
                            infraestrutura enterrada às vias, à portaria e à casa clube.
                          </p>
                          <p className="font-body text-sm leading-relaxed text-gray-700 md:text-base">
                            É também dela a administração e o protocolo operacional do condomínio,
                            a frente que transforma o desenho em terreno pisável.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
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
