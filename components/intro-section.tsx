import Image from 'next/image';
import { GaleriaLightbox } from '@/components/galeria-lightbox';
import { imagensDoEmpreendimento } from '@/lib/galeria';

/**
 * O trio do wellness. Cada foto é um recorte retrato de um render que também
 * está na galeria: `naGaleria` é por onde a galeria abre quando a pessoa
 * clica nela.
 */
const trioDoWellness = [
  {
    src: '/images/casaclube/Frame Academia.jpg',
    alt: 'Academia com equipamentos Technogym e vista da represa',
    titulo: 'Academia',
    naGaleria: '/images/galeria/academia.jpg',
  },
  {
    src: '/images/casaclube/Frame Lounge.jpg',
    alt: 'Lounge da casa clube, com lareira, mesa de sinuca e vista da represa',
    titulo: 'Lounge',
    naGaleria: '/images/galeria/lounge.jpg',
  },
  {
    src: '/images/casaclube/Frame Wellness.jpg',
    alt: 'Área wellness com espreguiçadeiras, a piscina coberta e o jardim',
    titulo: 'Spa',
    naGaleria: '/images/galeria/spa.jpg',
  },
];

export function IntroSection() {
  return (
    <section className="relative z-10 -mb-16 overflow-hidden pt-20 md:-mb-24 md:pt-32 lg:-mb-28">
      <div className="container mx-auto px-4 md:px-8 relative z-10">
        {/* Container Branco com posição relativa */}
        <div className="bg-white relative px-4 md:px-12 lg:px-16 py-12 md:py-16">

          {/* ÁREA DE CONTEÚDO */}
          <div className="relative z-10">
            {/* CONTEÚDO CASA CLUBE - envolvido pela moldura dourada */}
            <div className="relative">
              {/* BORDA DOURADA - apenas sobre o conteúdo da Casa Clube */}
              <div className="absolute inset-0 border-2 border-[#D07748]/50 pointer-events-none z-50" />

            {/* Primeira seção de conteúdo */}
            <div className="px-4 md:px-12 lg:px-16 py-12 md:py-16 lg:py-20">
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

              {/* Lugar do filme (o vídeo ainda não existe). Ocupa a largura toda
                  do container, atrás das linhas douradas, para a seção já ler
                  como cinema — e não como um quadradinho de aviso. */}
              <div className="relative -mx-6 mb-12 md:-mx-12 md:mb-16 lg:-mx-16">
                <div className="group relative aspect-video w-full cursor-pointer overflow-hidden bg-navy">
                  {/* Brilho sutil */}
                  <div className="absolute inset-0 bg-gradient-to-br from-navy-light to-navy" />
                  {/* Botão play */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-6">
                    <span className="flex h-20 w-20 items-center justify-center rounded-full border border-white/70 bg-white/10 backdrop-blur-sm transition-all duration-300 ease-out group-hover:scale-105 group-hover:border-[#D07748] group-hover:bg-[#D07748] md:h-24 md:w-24">
                      <svg
                        width="30"
                        height="30"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="ml-1 text-white"
                      >
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </span>
                    <span className="font-heading text-xl font-light uppercase italic text-white/90 md:text-2xl lg:text-3xl">
                      O filme do Villa Stradale
                    </span>
                  </div>
                  {/* Legenda */}
                  <span className="absolute bottom-5 left-0 right-0 text-center font-body text-[10px] uppercase tracking-[0.3em] text-white/50 md:text-xs">
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
                  O Villa Stradale pertence a essa segunda linhagem. Um refúgio pé na água,
                  irreplicável. Uma península cercada por 270 graus de represa e a escolha de guardar
                  o que realmente importa: o tempo, a água, as pessoas certas ao lado.
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
                  Condomínio fechado, a 96 km de São Paulo*
                </p>
                {/* A nota do asterisco, que o site nunca teve */}
                <p className="font-body text-[11px] text-gray-500">
                  * Quilometragem aproximada, medida por rodovia a partir da capital.
                </p>
              </div>
            </div>

            {/* Seção Casa Clube - Estende até as bordas do container branco */}
            <div className="relative -mx-4 md:-mx-12 lg:-mx-16 h-[400px] md:h-[500px] lg:h-[600px]">
              <Image
                src="/images/galeria/casa-clube-chegada.jpg"
                alt="A casa clube vista do gramado, com o volume baixo apoiado no muro de pedra"
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
            <div className="grid grid-cols-1 lg:grid-cols-2 -mx-4 md:-mx-12 lg:-mx-16">
              {/* Imagem - 50% esquerda */}
              <div className="relative h-[400px] md:h-[500px] lg:h-[600px]">
                <Image
                  src="/images/casaclube/piscinas-2026.jpg"
                  alt="O deck da piscina da casa clube, com espreguiçadeiras e a represa ao fundo"
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
            <div className="relative -mx-4 md:-mx-12 lg:-mx-16 h-[400px] md:h-[500px] lg:h-[600px]">
              <Image
                src="/images/galeria/vao-para-a-agua.jpg"
                alt="O grande vão da casa clube enquadrando a represa e a serra ao fundo"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 80vw"
              />

              {/* Overlay escuro, leve — só o bastante para o título ler bem */}
              <div className="absolute inset-0 bg-black/15" />
              
              {/* Texto sobreposto */}
              <div className="absolute inset-0 flex flex-col items-start justify-end pb-8 md:pb-12 lg:pb-16 pr-8 md:pr-12 lg:pr-16 pl-14 md:pl-24 lg:pl-32">
                <h3 className="font-heading font-light text-2xl md:text-3xl lg:text-4xl text-white italic leading-tight uppercase">
                  Mais do que lazer,<br />tempo de qualidade
                </h3>
              </div>
            </div>

            {/* Seção Wellness - Academia, Restaurante e Wellness */}
            <div className="px-4 md:px-12 lg:px-16 py-16 md:py-20 lg:py-24">
              {/* Título */}
              <h3 className="font-heading font-light text-2xl md:text-3xl lg:text-4xl text-navy italic leading-relaxed uppercase text-center mb-12 md:mb-16 max-w-4xl mx-auto">
                Sauna, massagem e a vista da represa. O bem-estar como parte da rotina.
              </h3>

              {/* Grade de imagens (proporção 340x460), dentro da moldura. Cada
                  uma abre a galeria nela mesma, não na primeira foto. */}
              <div className="grid grid-cols-1 items-stretch gap-4 md:grid-cols-3 md:gap-6">
                {trioDoWellness.map((foto) => (
                  <GaleriaLightbox
                    key={foto.src}
                    itens={imagensDoEmpreendimento}
                    inicio={foto.naGaleria}
                    rotuloDoGatilho={`Ver na galeria: ${foto.titulo}`}
                    gatilho={
                      <div className="group relative aspect-[340/460] cursor-zoom-in overflow-hidden border border-[#D07748]/40">
                        <Image
                          src={foto.src}
                          alt={foto.alt}
                          fill
                          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />

                        {/* O convite, só no hover */}
                        <span className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-navy/45 opacity-0 backdrop-blur-[2px] transition-opacity duration-300 ease-out group-hover:opacity-100">
                          <span className="flex h-14 w-14 items-center justify-center rounded-full border border-white/80 text-white">
                            <svg
                              width="20"
                              height="20"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              aria-hidden
                            >
                              <polyline points="15 3 21 3 21 9" />
                              <polyline points="9 21 3 21 3 15" />
                              <line x1="21" y1="3" x2="14" y2="10" />
                              <line x1="3" y1="21" x2="10" y2="14" />
                            </svg>
                          </span>
                          <span className="font-body text-[11px] uppercase tracking-[0.3em] text-white">
                            Ver galeria
                          </span>
                        </span>
                      </div>
                    }
                  />
                ))}
              </div>

              {/* Parágrafo e, ao lado, a galeria: é por aqui que as imagens do
                  empreendimento se abrem grandes, em lightbox. */}
              <div className="mt-10 grid grid-cols-1 items-center gap-8 md:mt-12 md:gap-12 lg:grid-cols-[1.8fr_1fr]">
                <p className="font-body text-sm md:text-base text-gray-700 leading-relaxed">
                  Academia com equipamentos Technogym. Espaço ao ar livre para yoga e funcional.
                  Saunas seca e a vapor. Sala de massagem. Hot spa com vista. Cold spa. Área de
                  descanso. Cada espaço foi posicionado para que o bem-estar seja parte da rotina.
                  Acordar, treinar, suar, mergulhar, descansar. Tudo no mesmo percurso, tudo com a
                  represa como cenário.
                </p>

                <GaleriaLightbox
                  itens={imagensDoEmpreendimento}
                  gatilho={
                    <div className="group flex cursor-pointer items-center justify-start gap-4 lg:justify-end">
                      <span className="font-body text-sm text-gray-700 md:text-base">
                        Abrir galeria de imagens
                      </span>
                      <span className="flex h-10 w-16 items-center justify-center rounded-full border border-[#D07748]/60 text-[#D07748] transition-all duration-300 ease-out group-hover:border-[#D07748] group-hover:bg-[#D07748] group-hover:text-white">
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="transition-transform delay-150 duration-300 ease-out group-hover:translate-x-1"
                        >
                          <line x1="5" y1="12" x2="19" y2="12" />
                          <polyline points="12 5 19 12 12 19" />
                        </svg>
                      </span>
                    </div>
                  }
                />
              </div>
            </div>

            </div>
            {/* Fim do conteúdo da Casa Clube (moldura dourada). O container
                encerra aqui, com o respiro e a linha dourada fechando, para a
                faixa da galeria entrar logo abaixo. */}

          </div>
        </div>
      </div>
    </section>
  );
}
