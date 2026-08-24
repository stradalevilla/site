import { MapaImplantacao } from '@/components/mapa-implantacao';
import type { LoteContorno } from '@/lib/implantacao';
import type { PontoInteresse } from '@/lib/pontos-interesse';

/**
 * Seção Implantação da home: cabeçalho e o mapa da implantação com os lotes
 * interativos. O mapa em si vive em MapaImplantacao, para poder ser reusado
 * dentro da moldura do Masterplan nas páginas internas.
 */
export function ImplantacaoSection({
  contornos,
  pontos,
}: {
  contornos?: LoteContorno[];
  pontos?: PontoInteresse[];
}) {
  return (
    <section aria-label="Implantação" className="relative bg-white py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-8">
        {/* Cabeçalho no padrão das seções internas */}
        <div className="mb-8 text-center md:mb-12">
          <p className="font-body text-sm uppercase tracking-wider text-gray-600 md:text-base">
            Masterplan
          </p>
          <h2 className="mt-2 font-heading text-2xl font-light uppercase italic text-navy md:text-4xl">
            Implantação
          </h2>
        </div>

        <MapaImplantacao contornos={contornos} pontos={pontos} />
      </div>
    </section>
  );
}
