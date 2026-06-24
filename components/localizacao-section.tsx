import Image from 'next/image';
import { IconCar, IconHelicopter, IconBrandWaze } from '@tabler/icons-react';
import { DecorativeGraphic } from '@/components/decorative-graphic';

export function LocalizacaoSection() {
  return (
    <section className="relative">
      <div className="container mx-auto px-4 md:px-8">
        <div className="relative z-10 -mt-16 md:-mt-24 lg:-mt-28 bg-white px-8 md:px-12 lg:px-16 py-16 md:py-20 lg:py-24">
          {/* Grafismo decorativo - canto superior direito (colado na borda) */}
          <DecorativeGraphic position="right" className="top-10 right-0" />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Coluna esquerda */}
            <div>
              {/* Emblema */}
              <div className="mb-6">
                <Image
                  src="/logos/Icone-VillaStradale escuro.svg"
                  alt="Villa Stradale"
                  width={64}
                  height={40}
                  className="h-9 md:h-10 w-auto"
                />
              </div>

              {/* Overline */}
              <span className="block font-heading italic font-thin text-sm md:text-base text-[#D07748] uppercase tracking-[0.3em] mb-6">
                Localização
              </span>

              {/* Título */}
              <h2 className="font-heading font-light text-2xl md:text-3xl lg:text-4xl text-navy italic uppercase leading-snug mb-8">
                Piracaia, 96 km de São Paulo.<br />
                No encontro da serra com a água
              </h2>

              {/* Parágrafos */}
              <div className="space-y-5 max-w-md mb-12">
                <p className="font-body text-sm md:text-base text-gray-700 leading-relaxed">
                  O Villa Stradale fica em Piracaia, na região bragantina do interior paulista, onde
                  a Serra da Mantiqueira encontra as águas do Sistema Cantareira.
                </p>
                <p className="font-body text-sm md:text-base text-gray-700 leading-relaxed">
                  Atibaia está a 25 km. Bragança Paulista, Joanópolis e Bom Jesus dos Perdões são
                  vizinhas diretas. Monte Verde, em Minas Gerais, fica a 40 km.
                </p>
              </div>

              {/* Botão seta */}
              <button
                type="button"
                aria-label="Saiba mais"
                className="group flex items-center justify-center w-16 h-10 rounded-full border border-navy/50 text-navy transition-all duration-300 ease-out hover:border-navy hover:bg-navy hover:text-white"
              >
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="transition-transform duration-300 ease-out delay-150 group-hover:translate-x-1"
                >
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </button>
            </div>

            {/* Coluna direita - com divisória vertical */}
            <div className="lg:border-l lg:border-navy/15 lg:pl-12 xl:pl-16 space-y-10">
              {/* Por Terra */}
              <div>
                <div className="flex items-center gap-2 text-[#D07748] mb-4">
                  <IconCar size={22} stroke={1.5} />
                  <span className="font-body text-base md:text-lg">Por Terra</span>
                </div>
                <p className="font-body text-sm md:text-base text-gray-700 leading-relaxed max-w-sm">
                  96 km de São Paulo. Acesso pela Fernão Dias até Atibaia, depois pela SP 036 até
                  Piracaia. Alternativa pela Bandeirantes.
                </p>
              </div>

              {/* Waze */}
              <div>
                <span className="block font-body text-sm md:text-base text-navy mb-3">Waze</span>
                <div className="flex items-center gap-3">
                  <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-[#05c8f7] text-white">
                    <IconBrandWaze size={22} stroke={1.5} />
                  </span>
                  <span className="font-body text-sm md:text-base text-gray-700">Rota “Nome A”</span>
                </div>
              </div>

              {/* Pelo Ar */}
              <div>
                <div className="flex items-center gap-2 text-[#D07748] mb-4">
                  <IconHelicopter size={22} stroke={1.5} />
                  <span className="font-body text-base md:text-lg">Pelo Ar</span>
                </div>
                <p className="font-body text-sm md:text-base text-gray-700 leading-relaxed max-w-sm">
                  20 minutos de São Paulo. Direto na península. Do Helicidade, em São Paulo, direto
                  ao heliponto da península.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
