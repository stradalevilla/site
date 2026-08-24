import Image from 'next/image';
import { DecorativeGraphic } from '@/components/decorative-graphic';

/**
 * Hero das páginas internas — mesma gramática do hero da home:
 * imagem em tela cheia, gradiente preto de legibilidade, par de grafismos
 * dourados colados nas bordas, texto ancorado na base e scroll indicator.
 */
export function PaginaHero({
  titulo,
  frase,
  tagline,
  imagem,
  alt,
  posicao = 'object-center',
  avancoAbaixo = false,
}: {
  titulo: React.ReactNode;
  /** Parágrafo de apoio, branco 90% */
  frase?: string;
  /** Assinatura dourada com tracking largo, sempre por último */
  tagline?: string;
  imagem: string;
  alt: string;
  /** Ajuste fino do enquadramento (ex.: 'object-[50%_70%]') */
  posicao?: string;
  /**
   * Quando o container da seção seguinte avança sobre o hero: o texto sobe bem
   * acima da faixa de sobreposição e o indicador de rolagem sai, porque ficaria
   * coberto.
   */
  avancoAbaixo?: boolean;
}) {
  return (
    <section className="relative h-screen w-full overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src={imagem}
          alt={alt}
          fill
          priority
          quality={90}
          sizes="100vw"
          className={`object-cover ${posicao}`}
        />
      </div>

      {/* Gradiente de legibilidade: escurece topo e base, meio transparente */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />

      {/* Grafismos dourados colados nas bordas da viewport */}
      <DecorativeGraphic position="left" className="absolute bottom-32 left-0 hidden lg:block z-10" animated />
      <DecorativeGraphic position="right" className="absolute bottom-32 right-0 hidden lg:block z-10" animated />

      {/* Conteúdo ancorado na base */}
      <div
        className={`relative h-full flex flex-col items-center justify-end px-4 text-center ${
          avancoAbaixo ? 'pb-48 md:pb-56' : 'pb-24'
        }`}
      >
        <div className="max-w-5xl mx-auto space-y-6 md:space-y-8">
          <h1 className="font-heading font-light text-4xl md:text-4xl lg:text-5xl text-white tracking-wider italic uppercase">
            {titulo}
          </h1>

          {frase && (
            <p className="font-body font-light text-base md:text-lg lg:text-xl text-white/90 max-w-3xl mx-auto leading-relaxed px-4">
              {frase}
            </p>
          )}

          {tagline && (
            <p className="font-heading font-light text-xl md:text-2xl lg:text-3xl text-gold tracking-[0.3em] mt-8 uppercase">
              {tagline}
            </p>
          )}
        </div>

        {/* Scroll indicator — fora quando um container avança sobre o hero */}
        {!avancoAbaixo && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 animate-bounce">
            <div className="w-6 h-10 border-2 border-white/40 rounded-full flex items-start justify-center p-2">
              <div className="w-1 h-2 bg-white/60 rounded-full" />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
