import { AmenitiesSection } from '@/components/amenities-section';

/**
 * O container branco que começa depois da faixa da galeria: as amenities,
 * dentro do traço dourado.
 *
 * A seção avança 112px sobre a faixa da galeria, acima, e outros 112px sobre
 * a faixa da portaria, abaixo.
 */
export function ConceitoSection() {
  return (
    <section className="relative z-10 -mb-16 -mt-16 overflow-hidden md:-mb-24 md:-mt-24 lg:-mb-28 lg:-mt-28">
      <div className="container relative z-10 mx-auto px-4 md:px-8">
        <div className="relative bg-white px-4 py-12 md:px-12 md:py-16 lg:px-16">
          <div className="relative z-10">
            <div className="relative">
              {/* A moldura dourada */}
              <div className="pointer-events-none absolute inset-0 z-50 border-2 border-[#D07748]/50" />

              {/* Amenities — veio da página /villa-stradale */}
              <AmenitiesSection />
            </div>
            {/* Fim da moldura dourada: o container encerra aqui, com o respiro
                e a linha fechando, para a faixa da portaria entrar abaixo. */}
          </div>
        </div>
      </div>
    </section>
  );
}
