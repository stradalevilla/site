import { ContatoInteresse } from '@/components/contato-interesse';

/**
 * Seção de contato — o mesmo bloco em toda parte: é ele que fecha a home e
 * também as páginas internas, no lugar de um CTA que só levava para cá.
 *
 * `respiroNoTopo` entra nas páginas internas, onde a seção anterior termina
 * rente ao bloco navy. Na home, a seção de cima já traz o próprio recuo.
 */
export function ContatoSection({ respiroNoTopo = false }: { respiroNoTopo?: boolean }) {
  return (
    <section
      id="contato"
      className={`relative scroll-mt-28 pb-16 md:pb-24 ${
        respiroNoTopo ? 'pt-16 md:pt-24' : ''
      }`}
    >
      <div className="container mx-auto px-4 md:px-8">
        <ContatoInteresse />
      </div>
    </section>
  );
}
