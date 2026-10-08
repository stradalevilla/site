'use client';

import { useId, useState } from 'react';
import Image from 'next/image';
import { DecorativeGraphic } from '@/components/decorative-graphic';

/**
 * Arquitetos — os dois autores do projeto.
 *
 * O cabeçalho (emblema, overline, título e subtítulo) é o que a home já tinha.
 * Os cartões vieram da página /villa-stradale, na diagramação do book (p30 e
 * p31): retrato à esquerda com o nome sobre a foto, texto à direita, grafismo
 * dourado atravessando a borda externa do retrato, e o segundo autor
 * espelhado.
 *
 * Cada cartão abre fechado: só a apresentação do autor. O resto da biografia
 * fica atrás de "saiba mais" e desce sem empurrão, animando a altura da linha
 * da grade. Assim a seção ocupa duas telas em vez de quatro, e quem quiser a
 * história inteira a tem no mesmo lugar.
 *
 * Os cartões não repetem o lema ("Arquitetura em estado de pouso" e
 * "Paisagismo como moldura viva"): as duas frases são, juntas, o título da
 * seção aqui na home.
 */
const autores = [
  {
    tag: 'Arquitetura',
    nome: 'AO / Greg Bousquet',
    retrato: '/images/casaclube/arquitetos/AO-Greg Bousquet.png',
    apresentacao:
      'Arquiteto formado na École de Paris, com mestrados pela ENSA Paris-La Villette e pela Sorbonne. Co-fundador da Triptyque, acumulou 23 anos de trajetória internacional antes de fundar, em 2021, a Architects Office (AO).',
    paragrafos: [
      'A AO é uma agência de arquitetura, urbanismo e interiores com sedes em São Paulo e Lisboa. Atua em 14 estados no Brasil e em países como Peru, Chile e Portugal, sempre com foco em urbanismo virtuoso e arquitetura ética.',
      'No Villa Stradale, Greg parte do princípio de que a natureza é protagonista; a resposta formal é arquitetura em estado de pouso: volumes baixos, pedra e madeira que assumem a pátina do tempo, vãos que enquadram a água e clube-casa voltado ao poente.',
      'A “linha de silêncio” resguarda as quadras e mantém o heliponto recuado do centro de convivência. O quiet luxury é percebido no conforto, na luz e na honestidade dos materiais.',
    ],
  },
  {
    tag: 'Paisagismo',
    nome: 'Orsini',
    retrato: '/images/casaclube/arquitetos/orsini.png',
    apresentacao:
      'Luiz Carlos Orsini é paisagista mineiro, de Belo Horizonte, formado em 1984 na Escuela de Jardinería y Paisajismo “Castillo de Batres” (Madri). Atua desde 1979 e se tornou um dos nomes centrais do paisagismo brasileiro contemporâneo.',
    paragrafos: [
      'Entre 2000 e 2004, foi responsável por 25 ha do Instituto Inhotim, referência mundial em paisagismo tropical. Autor de Luiz Carlos Orsini: 30 Anos de Paisagismo (2008) e Orsini (2017), mantém escritórios em São Paulo e Belo Horizonte.',
      'No Villa Stradale, o escritório Orsini define o conceito de moldura viva: o verde não decora, prolonga o horizonte: bosque nativo nas encostas, faixa-praia minimalista na orla e pista de cooper que costura decks, mirantes e nichos de pausa.',
      'Predominam espécies nativas (Mata Atlântica com inserções de Cerrado), drenagem e irrigação passivas e manutenção quase silenciosa, numa atmosfera descrita como “270 graus de paz”.',
    ],
  },
];

type Autor = (typeof autores)[number];

function CardAutor({ autor, invertido }: { autor: Autor; invertido: boolean }) {
  const [aberto, setAberto] = useState(false);
  const idDoTexto = useId();

  return (
    <div
      className={`relative grid grid-cols-1 items-center gap-12 lg:gap-16 ${
        invertido ? 'lg:grid-cols-[1fr_minmax(0,0.8fr)]' : 'lg:grid-cols-[minmax(0,0.8fr)_1fr]'
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
            alt={autor.nome}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 460px"
          />
          {/* O nome sobre a foto, com o fio, como no book */}
          <div className="absolute inset-x-0 bottom-0 flex items-center gap-4 bg-gradient-to-t from-black/55 to-transparent px-5 pb-4 pt-12">
            <span className="shrink-0 font-body text-[11px] uppercase tracking-[0.2em] text-white">
              {autor.nome}
            </span>
            <span aria-hidden className="h-px flex-1 bg-white/50" />
          </div>
        </div>

        {/* Um tracinho só, atravessando a borda externa do retrato — o lado
            oposto ao texto */}
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
        <p className="font-body text-xs uppercase tracking-[0.35em] text-[#D07748] md:text-sm">
          {autor.tag}
        </p>

        <h3 className="mt-6 font-heading text-3xl font-light uppercase italic text-[#D07748] md:text-4xl lg:text-[2.6rem]">
          {autor.nome}
        </h3>

        <p className="mt-7 text-left font-body text-sm leading-relaxed text-gray-700 md:text-base md:text-justify">
          {autor.apresentacao}
        </p>

        {/* O resto da biografia: a linha da grade cresce de 0fr a 1fr, então a
            altura anima sem ninguém precisar medir nada */}
        {/* fechado, o painel sai da árvore de acessibilidade: o
            overflow-hidden esconde dos olhos, não do leitor de tela */}
        <div
          id={idDoTexto}
          aria-hidden={!aberto}
          inert={!aberto}
          className={`grid transition-[grid-template-rows] duration-500 ease-out ${
            aberto ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
          }`}
        >
          <div className="overflow-hidden">
            <div
              className={`space-y-5 pt-5 transition-opacity duration-300 ${
                aberto ? 'opacity-100 delay-150' : 'opacity-0'
              }`}
            >
              {autor.paragrafos.map((p) => (
                <p
                  key={p.slice(0, 24)}
                  className="text-left font-body text-sm leading-relaxed text-gray-700 md:text-base md:text-justify"
                >
                  {p}
                </p>
              ))}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setAberto((estava) => !estava)}
          aria-expanded={aberto}
          aria-controls={idDoTexto}
          aria-label={aberto ? `fechar ${autor.nome}` : `saiba mais sobre ${autor.nome}`}
          className="group mt-8 flex items-center gap-4"
        >
          <span className="font-body text-sm text-navy md:text-base">
            {aberto ? 'fechar' : 'saiba mais'}
          </span>
          <span className="flex h-10 w-16 items-center justify-center rounded-full border border-navy/60 text-navy transition-all duration-300 ease-out group-hover:border-navy group-hover:bg-navy group-hover:text-white">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`transition-transform duration-300 ease-out ${
                aberto ? 'rotate-180' : ''
              }`}
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </span>
        </button>
      </div>
    </div>
  );
}

export function ArquitetosSection() {
  return (
    <div
      id="arquitetura-paisagismo"
      className="relative scroll-mt-28"
    >
      {/* Imagem de fundo leve */}
      <div className="absolute inset-0 pointer-events-none">
        <Image
          src="/images/casaclube/arquitetos/bg arquitetos.png"
          alt=""
          fill
          className="object-cover"
        />
      </div>

      <div className="relative z-10 px-4 md:px-12 lg:px-16 py-16 md:py-20 lg:py-24">
        {/* Emblema */}
        <div className="mb-6">
          <Image
            src="/logos/Icone-VillaStradale escuro.svg"
            alt="Villa Stradale"
            width={64}
            height={40}
            className="h-10 w-auto"
          />
        </div>

        {/* Overline */}
        <span className="block font-heading italic font-thin text-sm md:text-base text-[#D07748] uppercase tracking-[0.3em] mb-6">
          Arquitetos
        </span>

        {/* Título */}
        <h2 className="font-heading font-light text-2xl md:text-3xl lg:text-4xl text-navy italic uppercase leading-snug mb-6">
          Arquitetura em estado de pouso.<br />
          Paisagismo como moldura viva
        </h2>

        {/* Subtítulo */}
        <p className="font-body text-sm md:text-base text-navy/80 leading-relaxed mb-14 md:mb-20">
          Cada detalhe visível foi pensado para encantar.<br />
          Cada detalhe invisível foi pensado para durar.
        </p>

        {/* Os dois autores, na diagramação do book */}
        {autores.map((autor, i) => (
          <div
            key={autor.nome}
            className={
              i > 0 ? 'mt-14 border-t border-navy/10 pt-14 md:mt-20 md:pt-20 lg:mt-24 lg:pt-24' : ''
            }
          >
            {/* o segundo autor entra espelhado: texto à esquerda, foto à direita */}
            <CardAutor autor={autor} invertido={i % 2 === 1} />
          </div>
        ))}
      </div>
    </div>
  );
}
