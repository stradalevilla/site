import type { Metadata } from 'next';
import { Navbar } from '@/components/navbar';
import { MobileNav } from '@/components/mobile-nav';
import { FundadorSection } from '@/components/fundador-section';
import { FaixaParallax } from '@/components/faixa-parallax';
import { ArquitetosSection } from '@/components/arquitetos-section';
import { ContatoSection } from '@/components/contato-section';
import { Footer } from '@/components/footer';

export const metadata: Metadata = {
  title: 'Quem somos',
  description:
    'Pedro Costa, a Stradale Inc., Marcello Romero e os autores do projeto: quem está por trás do Villa Stradale Península, em Piracaia.',
};

/**
 * Quem somos — o bloco do fundador e dos stakeholders que abre o capítulo na
 * home, aqui com página própria, e em seguida os dois autores do projeto.
 *
 * São os mesmos componentes das outras páginas, não cópias do texto: mudou num
 * lugar, mudou em todos. As props do fundador acertam os avanços, porque aqui
 * não existe cartão descendo sobre a faixa azul.
 */
export default function QuemSomos() {
  return (
    <>
      <Navbar />
      <MobileNav />

      <main>
        <FundadorSection avancoAcima="nenhum" />

        {/* A faixa fecha o capítulo dos stakeholders e abre o dos autores: os
            dois containers avançam 112px sobre ela, um de cada lado. */}
        <FaixaParallax
          imagem="/images/galeria/patio-das-palmeiras.jpg"
          rotulo="O pátio das palmeiras da casa clube"
        />

        {/* ================= ARQUITETURA E PAISAGISMO ================= */}
        <section className="relative z-10 -mt-16 overflow-hidden md:-mt-24 lg:-mt-28">
          <div className="container relative z-10 mx-auto px-4 md:px-8">
            <div className="relative bg-white px-4 py-12 md:px-12 md:py-16 lg:px-16">
              <div className="relative z-10">
                <div className="relative">
                  {/* A moldura dourada */}
                  <div className="pointer-events-none absolute inset-0 z-50 border-2 border-[#D07748]/50" />

                  <ArquitetosSection />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Fecho padrão do site: o formulário de interesse */}
        <ContatoSection respiroNoTopo />
      </main>

      <Footer />
    </>
  );
}
