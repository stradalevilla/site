import Image from 'next/image';
import { DecorativeGraphic } from './decorative-graphic';
import { MobileHeroLogo } from './mobile-hero-logo';

export function HeroSection() {
  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Logo branco no hero - Mobile/Tablet */}
      <MobileHeroLogo />
      {/* Background Images - Responsive */}
      <div className="absolute inset-0">
        {/* Desktop */}
        <Image
          src="/images/hero/hero-peninsula-desk.png"
          alt="Villa Stradale - Uma península irreplicável"
          fill
          priority
          quality={90}
          className="object-cover hidden lg:block"
          sizes="100vw"
        />
        
        {/* Tablet */}
        <Image
          src="/images/hero/hero-peninsula-tablet.png"
          alt="Villa Stradale - Uma península irreplicável"
          fill
          priority
          quality={90}
          className="object-cover hidden md:block lg:hidden"
          sizes="100vw"
        />
        
        {/* Mobile */}
        <Image
          src="/images/hero/hero-peninsula-mobile.png"
          alt="Villa Stradale - Uma península irreplicável"
          fill
          priority
          quality={90}
          className="object-cover block md:hidden"
          sizes="100vw"
        />
      </div>

      {/* Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />

      {/* Decorative Graphics - FORA do container com padding */}
      <DecorativeGraphic 
        position="left" 
        className="absolute bottom-32 left-0 hidden lg:block z-10" 
        animated 
      />
      
      <DecorativeGraphic 
        position="right" 
        className="absolute bottom-32 right-0 hidden lg:block z-10" 
        animated 
      />

      {/* Content */}
      <div className="relative h-full flex flex-col items-center justify-end pb-24 px-4 text-center">

        {/* Main Content */}
        <div className="max-w-5xl mx-auto space-y-6 md:space-y-8">
          {/* Main Title */}
          <h1 className="font-heading font-light text-4xl md:text-4xl lg:text-5xl text-white tracking-wider italic">
            UMA PENÍNSULA<br className="md:hidden" /> IRREPLICÁVEL
          </h1>

          {/* Description */}
          <p className="font-body font-light text-base md:text-lg lg:text-xl text-white/90 max-w-3xl mx-auto leading-relaxed px-4">
            Cercado pela Serra da Mantiqueira, o Villa Stradale ocupa um dos pontos mais singulares de represa, onde a geografia desenhou, por acaso, o cenário perfeito.
          </p>

          {/* Subtitle */}
          <p className="font-heading font-light text-xl md:text-2xl lg:text-3xl text-gold tracking-[0.3em] mt-8">
            RARO POR NATUREZA
          </p>
        </div>

        {/* Scroll Indicator - Ajustado para ficar abaixo do conteúdo */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/40 rounded-full flex items-start justify-center p-2">
            <div className="w-1 h-2 bg-white/60 rounded-full" />
          </div>
        </div>
      </div>
    </section>
  );
}
