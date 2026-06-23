import Image from 'next/image';
import { DecorativeGraphic } from '@/components/decorative-graphic';

const arquitetos = [
  {
    image: '/images/casaclube/arquitetos/AO-Greg Bousquet.png',
    tag: 'Arquitetura',
    title: 'AO / Greg Bousquet',
    text: 'O francês Greg Bousquet é arquiteto formado na École de Paris, com mestrados pela ENSA Paris-La Villette e pela Sorbonne. Co-fundador da Triptyque, acumulou 23 anos de',
  },
  {
    image: '/images/casaclube/arquitetos/orsini.png',
    tag: 'Paisagismo',
    title: 'Orsini',
    text: 'O mineiro Luiz Carlos Orsini é paisagista mineiro (BH), formado em 1984 na Escuela de Jardinería y Paisajismo “Castillo de Batres” (Madri). Atua desde 1979 e se',
  },
];

export function ArquitetosSection() {
  return (
    <div className="relative -mx-6 md:-mx-12 lg:-mx-16 -mb-12 md:-mb-16">
      {/* Imagem de fundo leve */}
      <div className="absolute inset-0 pointer-events-none">
        <Image
          src="/images/casaclube/arquitetos/bg arquitetos.png"
          alt=""
          fill
          className="object-cover"
        />
      </div>

      <div className="relative z-10 px-12 md:px-24 lg:px-32 py-16 md:py-24 lg:py-28">
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

        {/* Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 justify-items-center">
          {arquitetos.map((arq) => (
            <div
              key={arq.title}
              className="relative w-full max-w-[550px] h-[336px] border border-[#D07748]/40 p-5 grid grid-cols-2 gap-5"
            >
              {/* Imagem */}
              <div className="relative h-full">
                <Image
                  src={arq.image}
                  alt={arq.title}
                  fill
                  className="object-cover"
                  sizes="275px"
                />
              </div>

              {/* Texto */}
              <div className="flex flex-col justify-center pr-2">
                <span className="font-body text-sm text-navy mb-2">{arq.tag}</span>
                <h3 className="font-heading font-light text-2xl md:text-3xl lg:text-4xl text-navy italic uppercase mb-4">
                  {arq.title}
                </h3>
                <p className="font-body text-xs md:text-sm text-gray-600 leading-relaxed">
                  {arq.text}
                </p>
              </div>

              {/* Grafismo decorativo - canto superior direito (colado na borda direita, menor) */}
              <DecorativeGraphic
                position="right"
                className="top-7 right-0 scale-[0.6] origin-top-right"
              />
            </div>
          ))}
        </div>

        {/* Veja mais */}
        <div className="mt-12 md:mt-16 flex items-center gap-4">
          <span className="font-body text-sm md:text-base text-navy">veja mais</span>
          <span className="flex items-center justify-center w-10 h-10 rounded-full border border-navy/60 text-navy">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </span>
        </div>
      </div>
    </div>
  );
}
