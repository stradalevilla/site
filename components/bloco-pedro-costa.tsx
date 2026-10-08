'use client';

import { useId, useState } from 'react';
import Image from 'next/image';
import { DecorativeGraphic } from '@/components/decorative-graphic';
import { TOTAL_LOTES } from '@/lib/lotes';

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
    texto: 'Campeão sul-americano em 2017. Pedro é também piloto profissional de automobilismo.',
  },
];

/**
 * A abertura do fundador, na diagramação da p34 do book: o retrato à esquerda,
 * com o grafismo cruzando o canto superior direito da foto, e o texto à
 * direita. Sem emblema e sem a identificação do fundador — os dois já vêm na
 * faixa azul, logo acima.
 *
 * O que era o bloco terracota ("Guardião de um território raro" e a
 * trajetória) virou o conteúdo de um "saiba mais" aqui embaixo do parágrafo.
 * Com ele aberto o retrato sobe para o topo, em vez de ficar centralizado numa
 * coluna que triplicou de altura.
 */
export function BlocoPedroCosta() {
  const [aberto, setAberto] = useState(false);
  const idDoTexto = useId();

  return (
    <div className="px-4 py-12 md:px-12 md:py-16 lg:px-16 lg:py-20">
      <div
        className={`grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,0.75fr)_1fr] lg:gap-20 ${
          aberto ? 'items-start' : 'items-center'
        }`}
      >
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
          {/* Como na página do book: as linhas nascem sobre a foto e avançam
              para fora dela */}
          <DecorativeGraphic
            position="right"
            className="right-0 top-4 z-20 translate-x-5 md:top-6 md:translate-x-6"
          />
        </div>

        <div>
          <p className="font-body text-lg leading-relaxed text-gray-700 lg:text-xl">
            Pedro Costa é o incorporador por trás do Villa Stradale Península. Através de um desejo
            incansável de construir um projeto único, ele escolheu uma península irreplicável às
            margens da represa de Piracaia, com um objetivo: transformar um sonho entre amigos numa
            edição limitada de {TOTAL_LOTES} lotes, curada por afinidade.
          </p>

          {/* O guardião e a trajetória, atrás do saiba mais */}
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
                className={`pt-10 transition-opacity duration-300 ${
                  aberto ? 'opacity-100 delay-150' : 'opacity-0'
                }`}
              >
                <h3 className="mb-6 font-heading text-2xl font-light uppercase italic leading-relaxed text-navy md:text-3xl">
                  Guardião de um
                  <br />
                  território raro
                </h3>
                <p className="max-w-xl font-body text-sm leading-relaxed text-gray-700 md:text-base">
                  Seu papel é ser guardião de um território raro, garantindo que o tempo vire
                  memória e legado para as próximas gerações. Por isso, assumiu a responsabilidade
                  de preservar a cultura boutique, discreta e “pé na água” que define o projeto.
                </p>

                <ul className="mt-10 space-y-6">
                  {trajetoria.map(({ marco, texto }) => (
                    <li key={marco} className="border-t border-navy/15 pt-4">
                      <span className="mb-1 block font-heading text-lg font-light italic text-[#D07748] md:text-xl">
                        {marco}
                      </span>
                      <p className="font-body text-sm leading-relaxed text-gray-700 md:text-base">
                        {texto}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setAberto((estava) => !estava)}
            aria-expanded={aberto}
            aria-controls={idDoTexto}
            aria-label={aberto ? 'fechar a trajetória de Pedro Costa' : 'saiba mais sobre Pedro Costa'}
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
                className={`transition-transform duration-300 ease-out ${aberto ? 'rotate-180' : ''}`}
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
