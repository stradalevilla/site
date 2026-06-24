import type { Metadata } from 'next';
import Image from 'next/image';
import { Navbar } from '@/components/navbar';
import { MobileNav } from '@/components/mobile-nav';
import { Footer } from '@/components/footer';
import { LoteSelector } from '@/components/lote-selector';

export const metadata: Metadata = {
  title: 'Escolha o lote',
  description: 'Selecione o número do lote que deseja visualizar no Villa Stradale.',
};

export default function LotesPage() {
  return (
    <>
      <Navbar />
      <MobileNav />

      <main className="relative overflow-hidden pt-28 pb-20 lg:pt-40 lg:pb-28">
        <div className="container mx-auto px-4 md:px-8">
          {/* Container branco (padrão das seções da home) */}
          <div className="relative overflow-hidden bg-white">
            {/* Imagem de fundo leve */}
            <div className="pointer-events-none absolute inset-0">
              <Image
                src="/images/casaclube/arquitetos/bg arquitetos.png"
                alt=""
                fill
                className="object-cover"
              />
            </div>

            {/* Moldura dourada sobre o conteúdo */}
            <div className="relative m-6 md:m-10 lg:m-12">
              <div className="pointer-events-none absolute inset-0 z-20 border-2 border-[#D07748]/50" />

              {/* Conteúdo */}
              <div className="relative z-10 flex flex-col items-center px-6 py-20 md:px-12 md:py-28 lg:py-32">
                {/* Emblema (tingido na cor terracota) */}
                <span
                  aria-hidden
                  className="mb-8 block h-16 w-28 bg-gold-dark"
                  style={{
                    WebkitMaskImage: "url('/logos/Icone-VillaStradale escuro.svg')",
                    maskImage: "url('/logos/Icone-VillaStradale escuro.svg')",
                    WebkitMaskRepeat: 'no-repeat',
                    maskRepeat: 'no-repeat',
                    WebkitMaskPosition: 'center',
                    maskPosition: 'center',
                    WebkitMaskSize: 'contain',
                    maskSize: 'contain',
                  }}
                />

                {/* Título */}
                <h1 className="mb-12 text-center font-heading text-2xl italic uppercase leading-snug text-gold-dark md:text-4xl">
                  Escolha o número
                  <br />
                  do lote que deseja ver
                </h1>

                <LoteSelector />
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
