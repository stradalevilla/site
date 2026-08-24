import Image from 'next/image';

/**
 * Seção Masterplan da home: a foto aérea com a moldura branca, o emblema
 * interrompendo a borda superior e o texto no canto.
 *
 * O recuo da moldura acompanha o padding do container branco das seções
 * (px-6 md:px-12 lg:px-16), para ela ficar alinhada com a moldura dourada da
 * seção de cima.
 */
export function MasterplanSection() {
  return (
    <section className="relative">
      <div className="container mx-auto px-4 md:px-8">
        <div className="relative h-[640px] w-full md:h-[820px] lg:h-[920px]">
          <Image
            src="/images/Masterplan.png"
            alt="Masterplan Villa Stradale"
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />

          {/* Moldura branca (bordas esquerda, direita e inferior contínuas; topo
              dividido) */}
          <div className="absolute inset-6 border-b border-l border-r border-white/60 md:inset-12 lg:inset-16">
            {/* Segmentos da borda superior, com vão central */}
            <div
              className="absolute left-0 top-0 h-px bg-white/60"
              style={{ width: 'calc(50% - 90px)' }}
            />
            <div
              className="absolute right-0 top-0 h-px bg-white/60"
              style={{ width: 'calc(50% - 90px)' }}
            />

            {/* Emblema + MASTERPLAN no vão central da borda superior */}
            <div className="absolute left-1/2 top-0 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-2">
              <Image
                src="/logos/Icone-VillaStradale claro.svg"
                alt="Villa Stradale"
                width={56}
                height={32}
                className="h-7 w-auto md:h-8"
              />
              <span className="font-heading text-[10px] uppercase italic tracking-[0.35em] text-white/80 md:text-xs">
                Masterplan
              </span>
            </div>

            {/* Conteúdo - título e parágrafo (topo esquerdo). Recuo curto, com o
                topo só o bastante para não encostar no rótulo. */}
            <div className="p-6 pt-8 md:p-8 md:pt-10 lg:p-10">
              <h2 className="mb-6 font-heading text-2xl font-light italic leading-tight text-white md:text-3xl lg:text-4xl">
                Terreno
                <br />
                de 275.951 m²
              </h2>
              <p className="max-w-[240px] font-body text-xs leading-relaxed text-white/80 md:text-sm">
                São 54 lotes residenciais voltados à água, com casa-clube, marina, heliponto,
                quadras esportivas e infraestrutura subterrânea, em um território protegido por
                segurança 24h por terra e por água.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
