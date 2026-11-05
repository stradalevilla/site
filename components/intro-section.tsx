import Image from 'next/image';
import { GaleriaLightbox } from '@/components/galeria-lightbox';
import { imagensDoEmpreendimento } from '@/lib/galeria';
import { VideoFaixa } from '@/components/video-faixa';
import { FilmeCampanha } from '@/components/filme-campanha';

/**
 * O trio do wellness. Cada foto é um recorte retrato de um render que também
 * está na galeria: `naGaleria` é por onde a galeria abre quando a pessoa
 * clica nela.
 */
const trioDoWellness = [
  {
    src: '/images/renders/trio-academia.jpg',
    alt: 'Academia com equipamentos Technogym e vista da represa',
    titulo: 'Academia',
    naGaleria: '/images/renders/academia.jpg',
  },
  {
    src: '/images/renders/trio-lounge.jpg',
    alt: 'Lounge da casa-clube, com lareira, mesa de sinuca e vista da represa',
    titulo: 'Lounge',
    naGaleria: '/images/renders/lounge.jpg',
  },
  {
    src: '/images/renders/trio-spa.jpg',
    alt: 'Área wellness com espreguiçadeiras, a piscina coberta e o jardim',
    titulo: 'Spa',
    naGaleria: '/images/renders/spa.jpg',
  },
];

export function IntroSection() {
  return (
    <section className="relative z-10 -mb-16 overflow-hidden pt-4 md:-mb-24 md:pt-32 lg:-mb-28">
      <div className="container mx-auto px-4 md:px-8 relative z-10">
        {/* Container Branco com posição relativa */}
        <div className="bg-white relative px-4 md:px-12 lg:px-16 py-4 md:py-16">

          {/* ÁREA DE CONTEÚDO */}
          <div className="relative z-10">
            {/* CONTEÚDO CASA-CLUBE - envolvido pela moldura dourada */}
            <div className="relative">
              {/* BORDA DOURADA - apenas sobre o conteúdo da Casa-Clube */}
              <div className="absolute inset-0 border-2 border-[#D07748]/50 pointer-events-none z-50" />

            {/* Primeira seção de conteúdo */}
            <div className="px-4 md:px-12 lg:px-16 py-12 md:py-16 lg:py-20">
              {/* Ícone do Logo */}
              <div className="flex justify-center mb-12">
                <Image
                  src="/logos/Icone-VillaStradale escuro.svg"
                  alt="Villa Stradale"
                  data-surgir="subir"
                  width={40}
                  height={40}
                  className="h-8 md:h-10 w-auto opacity-90"
                />
              </div>

              {/* O filme da campanha. Do tablet para cima ocupa a largura toda do
                  container, atrás das linhas douradas, para a seção ler como
                  cinema; no celular fica rente às linhas, por dentro. */}
              <div className="relative -mx-4 mb-12 md:-mx-12 md:mb-16 lg:-mx-16">
                <FilmeCampanha />
              </div>

              {/* Título Principal */}
              <div className="text-center mb-12 md:mb-16 space-y-2">
                <h2 data-surgir="subir" className="font-heading font-light text-2xl md:text-3xl lg:text-4xl text-[#D07748] italic leading-relaxed uppercase">
                  Há lugares que precisam ser descobertos.
                </h2>
                <h2 data-surgir="subir" className="font-heading font-light text-2xl md:text-3xl lg:text-4xl text-[#D07748] italic leading-relaxed uppercase">
                  E há os que precisam ser guardados.
                </h2>
              </div>

              {/* Texto Descritivo */}
              <div className="max-w-4xl mx-auto space-y-6 text-center">
                <p data-surgir="subir" className="font-body text-base md:text-lg text-gray-700 leading-relaxed">
                  O Villa Stradale pertence a essa segunda linhagem. Um refúgio pé na água,
                  irreplicável. Uma península cercada por 270 graus de represa e a escolha de guardar
                  o que realmente importa: o tempo, a água, as pessoas certas ao lado.
                </p>
                
                <p data-surgir="subir" className="font-body text-base md:text-lg text-gray-700 leading-relaxed">
                  Quem entra aqui assume a custódia de um território raro, feito para quem escolheu o que 
                  realmente vale a pena.
                </p>
              </div>

              {/* Informações do Projeto */}
              <div className="mt-16 md:mt-20 text-center space-y-6 mb-16 md:mb-20">
                <p data-surgir="subir" className="font-body text-sm md:text-base text-gray-600 tracking-wider uppercase">
                  Náutica, Casa-Clube e Reserva
                </p>
                
                <h3 data-surgir="subir" className="font-heading font-light text-2xl md:text-3xl lg:text-4xl text-navy italic uppercase">
                  54 Lotes de 2.000 a 4.554 m²
                </h3>
                
                <p data-surgir="subir" className="font-body text-sm md:text-base text-gray-600">
                  Condomínio fechado, a 96 km de São Paulo*
                </p>
                {/* A nota do asterisco, que o site nunca teve */}
                <p data-surgir="fade" className="font-body text-[11px] text-gray-500">
                  * Quilometragem aproximada, medida por rodovia a partir da capital.
                </p>
              </div>
            </div>

            {/* Seção Casa-Clube - Estende até as bordas do container branco */}
            <div data-surgir="imagem" className="relative md:-mx-12 lg:-mx-16 h-[400px] md:h-[500px] lg:h-[600px]">
              <Image
                src="/images/renders/casa-clube-aerea.jpg"
                alt="A casa-clube vista do alto, ao fim do gramado, com a represa e a serra ao fundo"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 80vw"
              />
              <VideoFaixa base="/videos/casa-clube-aerea" />
              
              {/* Overlay escuro, leve, igual ao da faixa de baixo */}
              <div className="absolute inset-0 bg-black/15" />
              
              {/* Texto sobreposto */}
              <div className="absolute inset-0 flex flex-col items-start justify-end pb-8 md:pb-12 lg:pb-16 pr-4 md:pr-12 lg:pr-16 pl-4 md:pl-24 lg:pl-32">
                <h3 data-surgir="subir" className="font-heading font-light text-2xl md:text-3xl lg:text-4xl text-white italic leading-tight uppercase">
                  Casa-Clube,<br />O Coração do Projeto
                </h3>
              </div>
            </div>

            {/* Seção Piscinas - Imagem 50% + Texto 50% */}
            <div className="grid grid-cols-1 lg:grid-cols-2 md:-mx-12 lg:-mx-16">
              {/* Imagem - 50% esquerda */}
              <div data-surgir="imagem" className="relative h-[400px] md:h-[500px] lg:h-[600px]">
                <Image
                  src="/images/renders/casa-clube-perspectiva.jpg"
                  alt="O bar da casa-clube ao fim da tarde, sob a cobertura de madeira, com as palmeiras e a represa ao fundo"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <VideoFaixa base="/videos/casa-clube-perspectiva" />
              </div>

              {/* Conteúdo - 50% direita */}
              <div className="bg-white flex flex-col justify-center pl-4 md:pl-12 lg:pl-16 pr-4 md:pr-24 lg:pr-32 py-12 md:py-16 lg:py-20">
                {/* Título */}
                <h3 data-surgir="subir" className="font-heading font-light text-2xl md:text-3xl lg:text-4xl text-[#D07748] italic leading-relaxed uppercase mb-8 md:mb-12">
                  Mais do que um clube,<br />uma casa para ser vivida.
                </h3>

                {/* Parágrafo */}
                <div className="space-y-4">
                  <p data-surgir="subir" className="font-body text-base md:text-lg text-gray-700 leading-relaxed">
                    Piscina, bangalôs, spa, brinquedoteca, restaurante e bar, todos voltados à vista da água.
                  </p>
                  <p data-surgir="subir" className="font-body text-base md:text-lg text-gray-700 leading-relaxed">
                    Aqui, o bem-estar nasce da convivência.
                  </p>
                  <p data-surgir="subir" className="font-body text-base md:text-lg text-gray-700 leading-relaxed">
                    É o ponto de encontro entre quem compartilha os mesmos valores e ritmo de vida. O privilégio de estar juntos, sem pressa, em harmonia com o lugar.
                  </p>
                </div>

                {/* Grafismo decorativo */}
                <div data-surgir="subir" className="mt-12 flex flex-col gap-2">
                  <div className="w-16 h-[2px] bg-[#D07748]" />
                  <div className="w-12 h-[2px] bg-[#D07748]" />
                </div>
              </div>
            </div>

            {/* Seção Casa-Clube 2 - Imagem largura total com título */}
            <div data-surgir="imagem" className="relative md:-mx-12 lg:-mx-16 h-[400px] md:h-[500px] lg:h-[600px]">
              <Image
                src="/images/renders/vao-para-a-agua.jpg"
                alt="O grande vão da casa-clube enquadrando a represa e a margem oposta"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 80vw"
              />

              {/* Overlay escuro, leve — só o bastante para o título ler bem */}
              <div className="absolute inset-0 bg-black/15" />
              
              {/* Texto sobreposto */}
              <div className="absolute inset-0 flex flex-col items-start justify-end pb-8 md:pb-12 lg:pb-16 pr-4 md:pr-12 lg:pr-16 pl-4 md:pl-24 lg:pl-32">
                <h3 data-surgir="subir" className="font-heading font-light text-2xl md:text-3xl lg:text-4xl text-white italic leading-tight uppercase">
                  Mais do que lazer,<br />tempo de qualidade
                </h3>
              </div>
            </div>

            {/* Seção Wellness - Academia, Restaurante e Wellness */}
            <div className="px-4 md:px-12 lg:px-16 py-16 md:py-20 lg:py-24">
              {/* Título */}
              <h3 data-surgir="subir" className="font-heading font-light text-2xl md:text-3xl lg:text-4xl text-navy italic leading-relaxed uppercase text-center mb-12 md:mb-16 max-w-4xl mx-auto">
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
                      <div data-surgir="imagem" className="group relative aspect-[340/460] cursor-zoom-in overflow-hidden border border-[#D07748]/40">
                        <Image
                          src={foto.src}
                          alt={foto.alt}
                          fill
                          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />

                        {/* O convite inteiro, no hover. Do tablet para cima,
                            onde existe mouse. */}
                        <span className="absolute inset-0 hidden flex-col items-center justify-center gap-4 bg-navy/45 opacity-0 backdrop-blur-[2px] transition-opacity duration-300 ease-out group-hover:opacity-100 md:flex">
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

                        {/* No celular não existe hover: o selo fica sempre à
                            vista, no canto, sem véu cobrindo a foto. */}
                        <span className="absolute bottom-3 right-3 flex h-10 w-10 items-center justify-center rounded-full border border-white/70 bg-navy/45 text-white backdrop-blur-sm md:hidden">
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.6"
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
                      </div>
                    }
                  />
                ))}
              </div>

              {/* Parágrafo e, ao lado, a galeria: é por aqui que as imagens do
                  empreendimento se abrem grandes, em lightbox. */}
              <div className="mt-10 grid grid-cols-1 items-center gap-8 md:mt-12 md:gap-12 lg:grid-cols-[1.8fr_1fr]">
                <p data-surgir="subir" className="font-body text-sm md:text-base text-gray-700 leading-relaxed">
                  Academia com equipamentos Technogym. Espaço ao ar livre para yoga e funcional.
                  Saunas seca e a vapor. Sala de massagem. Hot spa com vista. Cold spa. Área de
                  descanso. Cada espaço foi posicionado para que o bem-estar seja parte da rotina.
                  Acordar, treinar, suar, mergulhar, descansar. Tudo no mesmo percurso, tudo com a
                  represa como cenário.
                </p>

                <GaleriaLightbox
                  itens={imagensDoEmpreendimento}
                  gatilho={
                    <div data-surgir="subir" className="group flex cursor-pointer items-center justify-start gap-4 lg:justify-end">
                      <span className="font-body text-sm text-gray-700 md:text-base">
                        Abrir galeria de imagens
                      </span>
                      <span className="flex h-11 w-16 items-center justify-center rounded-full border border-[#D07748]/60 text-[#D07748] transition-all duration-300 ease-out group-hover:border-[#D07748] group-hover:bg-[#D07748] group-hover:text-white">
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
            {/* Fim do conteúdo da Casa-Clube (moldura dourada). O container
                encerra aqui, com o respiro e a linha dourada fechando, para a
                faixa da galeria entrar logo abaixo. */}

          </div>
        </div>
      </div>
    </section>
  );
}
