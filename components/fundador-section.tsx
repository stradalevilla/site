import Image from 'next/image';
import { DecorativeGraphic } from '@/components/decorative-graphic';
import { DivisorCapitulo } from '@/components/divisor-capitulo';
import { BlocoPedroCosta } from '@/components/bloco-pedro-costa';
import { TOTAL_LOTES } from '@/lib/lotes';

/**
 * O fundador e os stakeholders: o divisor de capítulo navy e, logo abaixo, o
 * container branco com Pedro Costa, a Stradale Inc., Marcello Romero e a BBZ.
 *
 * Veio inteiro da página /villa-stradale. O divisor mora dentro deste
 * componente de propósito: os dois estão amarrados pelos avanços — a faixa
 * recebe 112px do bloco de cima e reserva 224px para este container descer
 * sobre ela, e separar um do outro quebraria a conta.
 *
 * Copy: book de vendas do cliente (V12), p34 e p35.
 */

export function FundadorSection() {
  return (
    <>
        {/* ================= STAKEHOLDERS ================= */}
        <DivisorCapitulo
          id="stakeholders"
          avancoAcima="normal"
          avancoDoProximo="grande"
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

        {/* O container avança bem mais sobre a faixa azul que os outros do
            site: 224px no desktop, contra os 112px das demais sobreposições.
            Embaixo ele desce os 112px de sempre, sobre a faixa da represa. */}
        <section className="relative z-10 -mb-16 -mt-20 overflow-hidden md:-mb-24 md:-mt-40 lg:-mb-28 lg:-mt-56">
          <div className="container relative z-10 mx-auto px-4 md:px-8">
            <div className="relative bg-white px-4 py-12 md:px-12 md:py-16 lg:px-16">
              <div className="relative z-10">
                <div className="relative">
                  <div className="pointer-events-none absolute inset-0 z-50 border-2 border-[#D07748]/50" />

                  <BlocoPedroCosta />

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
    </>
  );
}
