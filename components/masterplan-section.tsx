import Image from 'next/image';

export function MasterplanSection() {
  return (
    <section className="relative">
      <div className="container mx-auto px-4 md:px-8">
        <div className="relative w-full h-[640px] md:h-[820px] lg:h-[920px]">
        {/* Imagem aérea */}
        <Image
          src="/images/Masterplan.png"
          alt="Masterplan Villa Stradale"
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />

        {/* Moldura branca (bordas esquerda, direita e inferior contínuas; topo dividido) */}
        <div className="absolute inset-6 md:inset-10 lg:inset-12 border-l border-r border-b border-white/60">
          {/* Segmentos da borda superior, com vão central */}
          <div
            className="absolute top-0 left-0 h-px bg-white/60"
            style={{ width: 'calc(50% - 90px)' }}
          />
          <div
            className="absolute top-0 right-0 h-px bg-white/60"
            style={{ width: 'calc(50% - 90px)' }}
          />

          {/* Emblema + MASTERPLAN no vão central da borda superior */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-2">
            <Image
              src="/logos/Icone-VillaStradale claro.svg"
              alt="Villa Stradale"
              width={56}
              height={32}
              className="h-7 md:h-8 w-auto"
            />
            <span className="font-heading italic text-[10px] md:text-xs text-white/80 uppercase tracking-[0.35em]">
              Masterplan
            </span>
          </div>

          {/* Conteúdo - título e parágrafo (topo esquerdo) */}
          <div className="p-8 md:p-12 lg:p-16 pt-16 md:pt-20 lg:pt-24">
            <h2 className="font-heading font-light text-2xl md:text-3xl lg:text-4xl text-white italic leading-tight mb-6">
              Terreno<br />
              de 275.951 m²
            </h2>
            <p className="font-body text-xs md:text-sm text-white/80 leading-relaxed max-w-[240px]">
              São 54 lotes residenciais voltados à água, com casa-clube, marina, heliponto, quadras
              esportivas e infraestrutura subterrânea, em um território protegido por segurança 24h
              por terra e por água.
            </p>
          </div>
        </div>
        </div>
      </div>
    </section>
  );
}
