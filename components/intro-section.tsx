import Image from 'next/image';
import { DecorativeGraphic } from '@/components/decorative-graphic';
import { ArquitetosSection } from '@/components/arquitetos-section';

export function IntroSection() {
  return (
    <section className="pt-20 md:pt-32 relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-8 relative z-10">
        {/* Container Branco com posição relativa */}
        <div className="bg-white relative px-6 md:px-12 lg:px-16 py-12 md:py-16">

          {/* ÁREA DE CONTEÚDO */}
          <div className="relative z-10">
            {/* CONTEÚDO CASA CLUBE - envolvido pela moldura dourada */}
            <div className="relative">
              {/* BORDA DOURADA - apenas sobre o conteúdo da Casa Clube */}
              <div className="absolute inset-0 border-2 border-[#D07748]/50 pointer-events-none z-50" />

            {/* Primeira seção de conteúdo */}
            <div className="px-6 md:px-12 lg:px-16 py-12 md:py-16 lg:py-20">
              {/* Ícone do Logo */}
              <div className="flex justify-center mb-12">
                <Image
                  src="/logos/Icone-VillaStradale escuro.svg"
                  alt="Villa Stradale"
                  width={40}
                  height={40}
                  className="h-8 md:h-10 w-auto opacity-90"
                />
              </div>

              {/* Placeholder de vídeo (simulação - vídeo futuro) */}
              <div className="flex justify-center mb-12 md:mb-16">
                <div className="group relative w-full max-w-md aspect-video cursor-pointer overflow-hidden bg-navy">
                  {/* Brilho sutil */}
                  <div className="absolute inset-0 bg-gradient-to-br from-navy-light to-navy" />
                  {/* Moldura dourada fina */}
                  <div className="pointer-events-none absolute inset-0 border border-gold/30" />
                  {/* Botão play */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="flex h-14 w-14 items-center justify-center rounded-full border border-white/70 bg-white/10 backdrop-blur-sm transition-all duration-300 ease-out group-hover:scale-105 group-hover:border-[#D07748] group-hover:bg-[#D07748]">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="ml-0.5 text-white">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </span>
                  </div>
                  {/* Legenda */}
                  <span className="absolute bottom-3 left-0 right-0 text-center font-body text-[10px] uppercase tracking-[0.3em] text-white/60">
                    Vídeo em breve
                  </span>
                </div>
              </div>

              {/* Título Principal */}
              <div className="text-center mb-12 md:mb-16 space-y-2">
                <h2 className="font-heading font-light text-2xl md:text-3xl lg:text-4xl text-[#D07748] italic leading-relaxed uppercase">
                  Há lugares que precisam ser descobertos.
                </h2>
                <h2 className="font-heading font-light text-2xl md:text-3xl lg:text-4xl text-[#D07748] italic leading-relaxed uppercase">
                  E há os que precisam ser guardados.
                </h2>
              </div>

              {/* Texto Descritivo */}
              <div className="max-w-4xl mx-auto space-y-6 text-center">
                <p className="font-body text-base md:text-lg text-gray-700 leading-relaxed">
                  O Villa Stradale pertence a essa segunda linhagem. Um refúgio pé na água, irreplicável. 
                  54 famílias, uma península cercada por 270 graus de represa e a escolha de guardar o que 
                  realmente importa: o tempo, a água, as pessoas certas ao lado.
                </p>
                
                <p className="font-body text-base md:text-lg text-gray-700 leading-relaxed">
                  Quem entra aqui assume a custódia de um território raro, feito para quem escolheu o que 
                  realmente vale a pena.
                </p>
              </div>

              {/* Informações do Projeto */}
              <div className="mt-16 md:mt-20 text-center space-y-6 mb-16 md:mb-20">
                <p className="font-body text-sm md:text-base text-gray-600 tracking-wider uppercase">
                  Náutica, Casa Clube e Reserva
                </p>
                
                <h3 className="font-heading font-light text-2xl md:text-3xl lg:text-4xl text-navy italic uppercase">
                  54 Lotes de 2.000 a 4.554 m²
                </h3>
                
                <p className="font-body text-sm md:text-base text-gray-600">
                  Condomínio fechado, a 90km de São Paulo*
                </p>
              </div>
            </div>

            {/* Seção Casa Clube - Estende até as bordas do container branco */}
            <div className="relative -mx-6 md:-mx-12 lg:-mx-16 h-[400px] md:h-[500px] lg:h-[600px]">
              <Image
                src="/images/casaclube/casa-clube-desk.png"
                alt="Casa Clube Villa Stradale"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 80vw"
              />
              
              {/* Overlay escuro */}
              <div className="absolute inset-0 bg-black/30" />
              
              {/* Texto sobreposto */}
              <div className="absolute inset-0 flex flex-col items-start justify-end pb-8 md:pb-12 lg:pb-16 pr-8 md:pr-12 lg:pr-16 pl-14 md:pl-24 lg:pl-32">
                <h3 className="font-heading font-light text-2xl md:text-3xl lg:text-4xl text-white italic leading-tight uppercase">
                  Casa Clube,<br />O Coração do Projeto
                </h3>
              </div>
            </div>

            {/* Seção Piscinas - Imagem 50% + Texto 50% */}
            <div className="grid grid-cols-1 lg:grid-cols-2 -mx-6 md:-mx-12 lg:-mx-16">
              {/* Imagem - 50% esquerda */}
              <div className="relative h-[400px] md:h-[500px] lg:h-[600px]">
                <Image
                  src="/images/casaclube/piscinas.png"
                  alt="Piscinas Villa Stradale"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>

              {/* Conteúdo - 50% direita */}
              <div className="bg-white flex flex-col justify-center pl-8 md:pl-12 lg:pl-16 pr-14 md:pr-24 lg:pr-32 py-12 md:py-16 lg:py-20">
                {/* Título */}
                <h3 className="font-heading font-light text-2xl md:text-3xl lg:text-4xl text-[#D07748] italic leading-relaxed uppercase mb-8 md:mb-12">
                  Mais do que um clube,<br />uma casa para ser vivida.
                </h3>

                {/* Parágrafo */}
                <div className="space-y-4">
                  <p className="font-body text-base md:text-lg text-gray-700 leading-relaxed">
                    Piscina, bangalôs, spa, capela, brinquedoteca, restaurante e bar, todos voltados à vista da água.
                  </p>
                  <p className="font-body text-base md:text-lg text-gray-700 leading-relaxed">
                    Aqui, o bem-estar nasce da convivência.
                  </p>
                  <p className="font-body text-base md:text-lg text-gray-700 leading-relaxed">
                    É o ponto de encontro entre quem compartilha os mesmos valores e ritmo de vida. O privilégio de estar juntos, sem pressa, em harmonia com o lugar.
                  </p>
                </div>

                {/* Grafismo decorativo */}
                <div className="mt-12 flex flex-col gap-2">
                  <div className="w-16 h-[2px] bg-[#D07748]" />
                  <div className="w-12 h-[2px] bg-[#D07748]" />
                </div>
              </div>
            </div>

            {/* Seção Casa Clube 2 - Imagem largura total com título */}
            <div className="relative -mx-6 md:-mx-12 lg:-mx-16 h-[400px] md:h-[500px] lg:h-[600px]">
              <Image
                src="/images/casaclube/casaclube2.png"
                alt="Casa Clube Villa Stradale - Lazer"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 80vw"
              />
              
              {/* Overlay escuro */}
              <div className="absolute inset-0 bg-black/30" />
              
              {/* Texto sobreposto */}
              <div className="absolute inset-0 flex flex-col items-start justify-end pb-8 md:pb-12 lg:pb-16 pr-8 md:pr-12 lg:pr-16 pl-14 md:pl-24 lg:pl-32">
                <h3 className="font-heading font-light text-2xl md:text-3xl lg:text-4xl text-white italic leading-tight uppercase">
                  Mais do que lazer,<br />tempo de qualidade
                </h3>
              </div>
            </div>

            {/* Seção Wellness - Academia, Restaurante e Wellness */}
            <div className="px-6 md:px-12 lg:px-16 py-16 md:py-20 lg:py-24">
              {/* Título */}
              <h3 className="font-heading font-light text-2xl md:text-3xl lg:text-4xl text-navy italic leading-relaxed uppercase text-center mb-12 md:mb-16 max-w-4xl mx-auto">
                Sauna, massagem e a vista da represa. O bem estar como parte da rotina.
              </h3>

              {/* Grade de Imagens - todas do mesmo tamanho (proporção 340x460), dentro da moldura */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 items-stretch">
                {/* Academia */}
                <div className="relative aspect-[340/460] border border-[#D07748]/40">
                  <Image
                    src="/images/casaclube/Frame Academia.png"
                    alt="Academia com equipamentos TecnoGym"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>

                {/* Restaurante */}
                <div className="relative aspect-[340/460] border border-[#D07748]/40">
                  <Image
                    src="/images/casaclube/Frame Restaurante.png"
                    alt="Restaurante com vista da represa"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>

                {/* Wellness */}
                <div className="relative aspect-[340/460] border border-[#D07748]/40">
                  <Image
                    src="/images/casaclube/Frame Wellness.png"
                    alt="Área wellness com spa e descanso"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
              </div>

              {/* Parágrafo + Link Galeria */}
              <div className="grid grid-cols-1 lg:grid-cols-[1.8fr_1fr] gap-8 md:gap-12 items-center mt-10 md:mt-12">
                <p className="font-body text-sm md:text-base text-gray-700 leading-relaxed">
                  Academia com equipamentos TecnoGym. Espaço ao ar livre para yoga e funcional.
                  Saunas seca e a vapor. Sala de massagem. Hot spa com vista. Cold spa. Área de
                  descanso. Cada espaço foi posicionado para que o bem estar seja parte da rotina.
                  Acordar, treinar, suar, mergulhar, descansar. Tudo no mesmo percurso, tudo com a
                  represa como cenário.
                </p>

                <div className="group flex items-center justify-start lg:justify-end gap-4 cursor-pointer">
                  <span className="font-body text-sm md:text-base text-gray-700">
                    Abrir galeria de imagens
                  </span>
                  <span className="flex items-center justify-center w-16 h-10 rounded-full border border-[#D07748]/60 text-[#D07748] transition-all duration-300 ease-out group-hover:border-[#D07748] group-hover:bg-[#D07748] group-hover:text-white">
                    <svg
                      width="20"
                      height="20"
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
                  </span>
                </div>
              </div>
            </div>

            {/* Tira de Imagens - largura total, passa por trás das linhas douradas */}
            <div className="grid grid-cols-3 md:grid-cols-6 -mx-6 md:-mx-12 lg:-mx-16">
              {[
                { src: '/images/casaclube/tira de imagens/Pes na agua.png', alt: 'Pés na água' },
                { src: '/images/casaclube/tira de imagens/jet.png', alt: 'Jet ski' },
                { src: '/images/casaclube/tira de imagens/Caminhada.png', alt: 'Caminhada na praia' },
                { src: '/images/casaclube/tira de imagens/Raquetes.png', alt: 'Raquetes' },
                { src: '/images/casaclube/tira de imagens/wakeboard.png', alt: 'Wakeboard' },
                { src: '/images/casaclube/tira de imagens/Firepit.png', alt: 'Firepit' },
              ].map((img) => (
                <div
                  key={img.src}
                  className="relative h-[260px] md:h-[340px] lg:h-[420px]"
                >
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 33vw, 16vw"
                  />
                </div>
              ))}
            </div>

            {/* Seção Cards - Racket Club e Marina Stradale */}
            <div className="px-6 md:px-12 lg:px-16 py-16 md:py-20 lg:py-24 space-y-10 md:space-y-14">
              {/* Card 1 - Racket Club (texto à esquerda, imagem à direita) */}
              <div className="relative bg-[#EFEBE3] h-[420px] w-full grid grid-cols-1 lg:grid-cols-2">
                {/* Texto */}
                <div className="flex flex-col justify-center px-8 md:px-12 lg:px-16">
                  <span className="font-heading italic font-thin text-sm md:text-base text-[#D07748] uppercase tracking-[0.3em] mb-4">
                    Lazer ao ar livre
                  </span>
                  <h3 className="font-heading font-light text-2xl md:text-3xl lg:text-4xl text-navy italic uppercase mb-6">
                    Racket Club
                  </h3>
                  <p className="font-body text-sm md:text-base text-gray-700 leading-relaxed max-w-md">
                    O Villa Stradale é o condomínio das raquetes. Duas quadras de tênis em piso
                    rápido, uma quadra de padel, duas de beach tennis e um campo de futebol society.
                  </p>
                </div>

                {/* Imagem */}
                <div className="relative p-6 md:p-8">
                  <div className="relative w-full h-full">
                    <Image
                      src="/images/casaclube/Quadras.png"
                      alt="Quadras do Racket Club"
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                  </div>
                </div>

                {/* Grafismo decorativo - lado direito (colado na linha dourada) */}
                <DecorativeGraphic
                  position="right"
                  className="right-0 top-1/2 -translate-y-1/2 translate-x-6 md:translate-x-12 lg:translate-x-16 z-20"
                />
              </div>

              {/* Card 2 - Marina Stradale (imagem à esquerda, texto à direita) */}
              <div className="relative bg-[#EFEBE3] h-[420px] w-full grid grid-cols-1 lg:grid-cols-2">
                {/* Imagem */}
                <div className="relative p-6 md:p-8 order-1">
                  <div className="relative w-full h-full">
                    <Image
                      src="/images/casaclube/Marina.png"
                      alt="Marina Stradale"
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                  </div>
                </div>

                {/* Texto */}
                <div className="flex flex-col justify-center px-8 md:px-12 lg:px-16 order-2">
                  <span className="font-heading italic font-thin text-sm md:text-base text-[#D07748] uppercase tracking-[0.3em] mb-4">
                    Esportes aquáticos
                  </span>
                  <h3 className="font-heading font-light text-2xl md:text-3xl lg:text-4xl text-navy italic uppercase mb-6">
                    Garagem Náutica
                  </h3>
                  <p className="font-body text-sm md:text-base text-gray-700 leading-relaxed max-w-md">
                    O acesso do Villa Stradale à represa. Garagem náutica com capacidade para até 30
                    jet skis e lanchas de wakeboard. Rampa de acesso à água. Píer privativo para
                    embarque e desembarque.
                  </p>
                </div>

                {/* Grafismo decorativo - lado esquerdo (colado na linha dourada) */}
                <DecorativeGraphic
                  position="left"
                  className="left-0 top-1/2 -translate-y-1/2 -translate-x-6 md:-translate-x-12 lg:-translate-x-16 z-20"
                />
              </div>

              {/* Card 3 - Heliponto (texto à esquerda, imagem à direita) */}
              <div className="relative bg-[#EFEBE3] h-[420px] w-full grid grid-cols-1 lg:grid-cols-2">
                {/* Texto */}
                <div className="flex flex-col justify-center px-8 md:px-12 lg:px-16">
                  <span className="font-heading italic font-thin text-sm md:text-base text-[#D07748] uppercase tracking-[0.3em] mb-4">
                    Acesso pelo ar
                  </span>
                  <h3 className="font-heading font-light text-2xl md:text-3xl lg:text-4xl text-navy italic uppercase mb-6">
                    Heliponto
                  </h3>
                  <p className="font-body text-sm md:text-base text-gray-700 leading-relaxed max-w-md">
                    Do Helicidade, em São Paulo, direto ao heliponto da península. Três spots
                    privativos, integrados à paisagem, recuados junto à marina.
                  </p>
                </div>

                {/* Imagem */}
                <div className="relative p-6 md:p-8">
                  <div className="relative w-full h-full">
                    <Image
                      src="/images/casaclube/Heliponto.png"
                      alt="Heliponto da península"
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                  </div>
                </div>

                {/* Grafismo decorativo - lado direito (colado na linha dourada) */}
                <DecorativeGraphic
                  position="right"
                  className="right-0 top-1/2 -translate-y-1/2 translate-x-6 md:translate-x-12 lg:translate-x-16 z-20"
                />
              </div>
            </div>
            </div>
            {/* Fim do conteúdo Casa Clube (moldura dourada) */}

            {/* SEÇÃO ARQUITETOS - dentro do container branco, sem moldura */}
            <ArquitetosSection />

          </div>
        </div>
      </div>
    </section>
  );
}
