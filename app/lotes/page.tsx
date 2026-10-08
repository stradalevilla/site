import type { Metadata } from 'next';
import Image from 'next/image';
import { Navbar } from '@/components/navbar';
import { MobileNav } from '@/components/mobile-nav';
import { PaginaHero } from '@/components/pagina-hero';
import { ContatoSection } from '@/components/contato-section';
import { MapaImplantacao } from '@/components/mapa-implantacao';
import { Footer } from '@/components/footer';
import { TOTAL_LOTES } from '@/lib/lotes';
import { getContornos } from '@/lib/getContornos';

export const metadata: Metadata = {
  title: 'Masterplan',
  description: `O masterplan do Villa Stradale: terreno de 275.951 m² e ${TOTAL_LOTES} lotes voltados à água, com casa-clube, marina, heliponto e quadras.`,
};

export default async function MasterplanPage() {
  // os contornos dos lotes vêm do banco (mesma fonte da home)
  const contornos = await getContornos();

  return (
    <>
      <Navbar />
      <MobileNav />

      <main>
        {/* Título de uma palavra e bem acima da faixa que o container de baixo
            cobre, para nunca correr o risco de ser encoberto */}
        <PaginaHero
          titulo="Masterplan"
          imagem="/images/aereas/peninsula-aerea-hero.jpg"
          alt="Vista aérea da península do Villa Stradale, com os lotes desenhados entre a mata e a represa"
          avancoAbaixo
        />

        {/* ================= MASTERPLAN =================
            O container branco veio da página Villa Stradale: título e subtítulo
            na parte branca, e o mapa animado na largura inteira do container,
            passando atrás das linhas douradas. A margem negativa no topo faz o
            container avançar sobre o hero. */}
        <section
          id="masterplan"
          className="relative z-10 -mt-16 scroll-mt-28 overflow-hidden md:-mt-24 lg:-mt-28"
        >
          <div className="container mx-auto px-4 md:px-8">
            {/* Sem folga embaixo: o mapa fecha o container encostado na base, e a
                moldura dourada termina mais acima, emoldurando por cima da
                imagem — o respiro de baixo é a faixa de mapa que sobra sob o fio
                dourado, em vez de uma barra branca. */}
            <div className="relative bg-white px-4 pt-12 md:px-12 md:pt-16 lg:px-16">
              <div className="relative z-10">
                <div className="relative">
                  <div className="pointer-events-none absolute bottom-12 left-0 right-0 top-0 z-50 border-2 border-[#D07748]/50 md:bottom-16" />

                  {/* Título e subtítulo, na parte branca, fora do mapa */}
                  <div className="px-4 py-12 md:px-12 md:py-16 lg:px-16 lg:py-20">
                    <div className="mb-12 flex justify-center">
                      <Image
                        src="/logos/Icone-VillaStradale escuro.svg"
                        alt="Villa Stradale"
                        width={40}
                        height={40}
                        className="h-8 w-auto opacity-90 md:h-10"
                      />
                    </div>

                    {/* Sem a palavra Masterplan: ela é o título do hero */}
                    <div className="mb-10 text-center md:mb-12">
                      <h2 className="font-heading text-2xl font-light uppercase italic leading-relaxed text-navy md:text-3xl lg:text-4xl">
                        Terreno de 275.951 m²
                      </h2>
                    </div>

                    <p className="mb-10 text-center font-body text-base leading-relaxed text-[#D07748] md:mb-12 md:text-lg">
                      São {TOTAL_LOTES} lotes voltados à água.
                    </p>

                    <div className="mx-auto max-w-4xl text-center">
                      <p className="font-body text-base leading-relaxed text-gray-700 md:text-lg">
                        Com casa-clube, marina, heliponto, quadras esportivas e infraestrutura
                        subterrânea, em um território protegido por segurança 24h por terra e por
                        água. Passe o mouse sobre um lote para ver o número e abrir a página dele.
                      </p>
                    </div>
                  </div>

                  {/* O mapa animado, na largura do container branco. Aqui ele é
                      irmão do bloco de título, então a margem negativa só precisa
                      cancelar o padding do cartão. */}
                  {/* No celular o mapa inteiro caberia em 190px de altura, e
                      cada lote viraria um risco impossível de tocar. Então ele
                      mantém tamanho de leitura e a faixa rola para o lado. */}
                  <div className="relative -mx-4 overflow-x-auto md:-mx-12 lg:-mx-16 lg:overflow-x-visible">
                    <div className="min-w-[760px] lg:min-w-0">
                      <MapaImplantacao contornos={contornos} />
                    </div>
                  </div>
                  <p className="px-4 pt-4 text-center font-body text-[11px] uppercase tracking-[0.25em] text-navy/50 md:px-12 lg:hidden">
                    Arraste para o lado para percorrer a península
                  </p>
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
