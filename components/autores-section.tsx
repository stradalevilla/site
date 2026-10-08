import { ArquitetosSection } from '@/components/arquitetos-section';
import { DiferenciaisSection } from '@/components/diferenciais-section';

/**
 * O container branco que começa depois da faixa da portaria: os dois autores
 * do projeto e, abaixo deles, os diferenciais de segurança e infraestrutura.
 *
 * Os dois blocos usam o mesmo recuo a partir do traço dourado (16/48/64px),
 * para o emblema, o overline e os títulos de um ficarem na mesma coluna do
 * outro.
 *
 * A seção sobe 112px sobre a faixa da portaria, o mesmo gesto do container de
 * cima descendo sobre ela.
 */
export function AutoresSection() {
  return (
    <section className="relative z-10 -mt-16 overflow-hidden md:-mt-24 lg:-mt-28">
      <div className="container relative z-10 mx-auto px-4 md:px-8">
        <div className="relative bg-white px-4 py-12 md:px-12 md:py-16 lg:px-16">
          <div className="relative z-10">
            <div className="relative">
              {/* A moldura dourada */}
              <div className="pointer-events-none absolute inset-0 z-50 border-2 border-[#D07748]/50" />

              {/* Arquitetos, dentro da moldura. Sem invólucro próprio: o
                  recuo é o padding do bloco, o mesmo dos Diferenciais, senão
                  os dois emblemas começam em x diferentes no mesmo cartão. */}
              <ArquitetosSection />

              {/* Diferenciais — as duas listas longas em acordeão */}
              <DiferenciaisSection />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
