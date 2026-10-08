'use client';

import { useId, useState } from 'react';
import Image from 'next/image';
import { DecorativeGraphic } from '@/components/decorative-graphic';

/** Segurança e operação: a lista do book p33, na ordem do original */
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
  'Administração e protocolo operacional do condomínio',
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

/**
 * Uma linha do acordeão: o rótulo sempre visível e a lista descendo por baixo.
 * A altura anima pela linha da grade (0fr → 1fr), o mesmo recurso dos cartões
 * dos arquitetos, então ninguém precisa medir conteúdo.
 */
function LinhaDoAcordeao({
  rotulo,
  resumo,
  children,
}: {
  rotulo: string;
  resumo: string;
  children: React.ReactNode;
}) {
  const [aberta, setAberta] = useState(false);
  const idDoConteudo = useId();

  return (
    <div className="border-t border-navy/15">
      <button
        type="button"
        onClick={() => setAberta((estava) => !estava)}
        aria-expanded={aberta}
        aria-controls={idDoConteudo}
        className="group flex w-full items-center justify-between gap-6 py-6 text-left"
      >
        <span>
          <span className="block font-body text-[11px] uppercase tracking-[0.3em] text-[#D07748] md:text-xs">
            {rotulo}
          </span>
          <span className="mt-2 block font-body text-sm text-navy/70 md:text-base">{resumo}</span>
        </span>
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#D07748]/60 text-[#D07748] transition-all duration-300 ease-out group-hover:border-[#D07748] group-hover:bg-[#D07748] group-hover:text-white">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`transition-transform duration-300 ease-out ${aberta ? 'rotate-180' : ''}`}
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </span>
      </button>

      {/* fechado, o painel sai da árvore de acessibilidade: o

          overflow-hidden esconde dos olhos, não do leitor de tela */}

      <div
        id={idDoConteudo}
        aria-hidden={!aberta}
        inert={!aberta}
        className={`grid transition-[grid-template-rows] duration-500 ease-out ${
          aberta ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        }`}
      >
        <div className="overflow-hidden">
          <div
            className={`pb-8 transition-opacity duration-300 ${
              aberta ? 'opacity-100 delay-150' : 'opacity-0'
            }`}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Diferenciais — segurança, operação e infraestrutura (book p26 e p33).
 *
 * Veio da página /villa-stradale. As duas listas são longas e técnicas, então
 * entram fechadas, em acordeão: quem quer saber abre, e quem está passando o
 * olho não leva 18 itens na cara. A coluna da esquerda, que é o argumento,
 * fica sempre visível.
 */
export function DiferenciaisSection() {
  return (
    <div className="relative px-4 py-16 md:px-12 md:py-20 lg:px-16 lg:py-24">
      <DecorativeGraphic position="right" className="right-0 top-10" />

      <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-2 lg:gap-20">
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
            Segurança e infraestrutura
          </span>
          <h3 className="mb-8 font-heading text-2xl font-light uppercase italic leading-snug text-navy md:text-3xl lg:text-4xl">
            Diferenciais
          </h3>
          <div className="max-w-md space-y-5">
            <p className="font-body text-sm leading-relaxed text-gray-700 md:text-base">
              O invisível é o que sustenta o lugar. Nada disto aparece nos renders, e é o que faz a
              diferença no dia em que chove forte, no dia em que falta luz e em todos os outros.
            </p>
            <p className="font-body text-sm leading-relaxed text-gray-700 md:text-base">
              Cada detalhe visível foi pensado para encantar. Cada detalhe invisível, para durar.
            </p>
          </div>
        </div>

        <div className="lg:border-l lg:border-navy/15 lg:pl-12 xl:pl-16">
          {/* Os diferenciais — book p33 */}
          <LinhaDoAcordeao
            rotulo="Segurança e operação"
            resumo={`${diferenciais.length} itens de portaria, ronda e monitoramento`}
          >
            <ul>
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
          </LinhaDoAcordeao>

          {/* A infraestrutura — book p26 */}
          <LinhaDoAcordeao
            rotulo="Infraestrutura"
            resumo={`${infraestrutura.length} sistemas, da drenagem ao tratamento de efluentes`}
          >
            <div className="space-y-9 pt-2">
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
          </LinhaDoAcordeao>

          {/* A portaria, que fecha a coluna */}
          <div className="relative mt-12 aspect-[16/9] w-full border border-[#D07748]/40 md:mt-14">
            <Image
              src="/images/portaria/portaria-entrada.jpg"
              alt="A portaria do Villa Stradale, em pedra e madeira, com o espelho de água"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
