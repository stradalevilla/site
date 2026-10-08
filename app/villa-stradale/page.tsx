import type { Metadata } from 'next';
import Image from 'next/image';
import { Navbar } from '@/components/navbar';
import { MobileNav } from '@/components/mobile-nav';
import { PaginaHero } from '@/components/pagina-hero';
import { ContatoSection } from '@/components/contato-section';
import { Footer } from '@/components/footer';
import { TOTAL_LOTES } from '@/lib/lotes';

export const metadata: Metadata = {
  title: 'Villa Stradale',
  description:
    'Um condomínio pé na água de edição limitada: 54 lotes de 2.000 a 4.554 m² numa península irreplicável em Piracaia, assinado por Greg Bousquet (AO) e Luiz Carlos Orsini.',
};

/**
 * Página da categoria Villa Stradale — item "Villa Stradale" do menu do topo.
 * As três seções são os guias de conteúdo do mapa do menu, e cada uma tem id
 * para servir de âncora: #o-projeto, #arquitetura-paisagismo, #stakeholders.
 *
 * Copy: book de vendas do cliente (V12) — p2, p5, p6, p8, p22, p23, p26, p30,
 * p31, p33, p34 e p35. Ver DOSSIE-COPY-BOOK.md.
 * Lotes: TOTAL_LOTES, de lib/lotes.ts, hoje 54 — o número do book V12, que o
 * cliente decidiu publicar. A planta topográfica fecha em 52 contornos e o
 * mapa desenha 52; a diferença está registrada e é conhecida.
 */

export default function VillaStradale() {
  return (
    <>
      <Navbar />
      <MobileNav />

      <main>
        {/* HERO — book p6, com a assinatura da marca (p3) */}
        <PaginaHero
          titulo={
            <>
              Um condomínio pé na água
              <br />
              de edição limitada
            </>
          }
          frase="São 54 lotes voltados à água, com casa-clube, marina, heliponto, quadras esportivas e infraestrutura subterrânea, em um território protegido por segurança 24h por terra e por água."
          tagline="Raro por natureza"
          imagem="/images/aereas/peninsula-aerea.jpg"
          alt="Vista aérea da península do Villa Stradale, cercada pela represa"
        />

        {/* ================= O PROJETO ================= */}
        <section
          id="o-projeto"
          className="relative z-10 scroll-mt-28 overflow-hidden pt-20 md:pt-32"
        >
          <div className="container relative z-10 mx-auto px-4 md:px-8">
            <div className="relative bg-white px-4 py-12 md:px-12 md:py-16 lg:px-16">
              <div className="relative z-10">
                <div className="relative">
                  <div className="pointer-events-none absolute inset-0 z-50 border-2 border-[#D07748]/50" />

                  {/* Casa-Clube — book p8. Mesma formatação da abertura que já
                      existia aqui: emblema centralizado, título terracota em
                      duas linhas e os parágrafos centralizados. */}
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

                    <div className="mb-10 space-y-2 text-center md:mb-12">
                      <h2 className="font-heading text-2xl font-light uppercase italic leading-relaxed text-navy md:text-3xl lg:text-4xl">
                        Casa-Clube:
                      </h2>
                      <h2 className="font-heading text-2xl font-light uppercase italic leading-relaxed text-navy md:text-3xl lg:text-4xl">
                        o coração do projeto
                      </h2>
                    </div>

                    {/* Subtítulo terracota, como no book — em uma linha só */}
                    <p className="mb-10 text-center font-body text-base leading-relaxed text-[#D07748] md:mb-12 md:text-lg">
                      Mais do que um clube, uma casa para ser vivida.
                    </p>

                    <div className="mx-auto max-w-4xl space-y-6 text-center">
                      <p className="font-body text-base leading-relaxed text-gray-700 md:text-lg">
                        Um mirante voltado para a represa, onde o lazer assume o tom de lar.
                        Piscina, bangalôs, spa, capela, brinquedoteca, restaurante e bar, todos
                        voltados à vista da água.
                      </p>
                      <p className="font-body text-base leading-relaxed text-gray-700 md:text-lg">
                        Aqui, o bem-estar nasce da convivência. É o ponto de encontro entre quem
                        compartilha os mesmos valores e ritmo de vida. O privilégio de estar
                        juntos, sem pressa, em harmonia com o lugar.
                      </p>
                    </div>

                    {/* A casa clube logo abaixo do texto: imagem limpa, sem véu e
                        sem título. As margens negativas cancelam o padding do
                        conteúdo E o do cartão branco, então a imagem avança além
                        das linhas douradas e ocupa a largura inteira do container.
                        Único render dessa elevação frontal — vem da pasta de
                        abril, porque FINAIS MAIO não tem equivalente. */}
                    <div className="relative -mx-12 mt-12 h-[400px] md:-mx-24 md:mt-16 md:h-[500px] lg:-mx-32 lg:mt-20 lg:h-[600px]">
                      <Image
                        src="/images/casaclube/casa-clube-c14.jpg"
                        alt="A casa clube vista de frente: dois pavimentos, brises de madeira, muro de pedra e o espelho de água do wellness"
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 80vw"
                      />
                    </div>

                    {/* A metragem do produto — book p6. Faixa navy encostada na
                        foto, na mesma largura dela, com o texto claro. */}
                    <div className="relative -mx-12 bg-[#0a1929] px-8 py-14 text-center md:-mx-24 md:px-12 md:py-16 lg:-mx-32 lg:py-20">
                      <p className="font-body text-xs uppercase tracking-[0.35em] text-[#D07748] md:text-sm">
                        Náutica, Casa Clube e Reserva
                      </p>
                      <p className="mt-6 font-heading text-2xl font-light uppercase italic leading-tight text-gold md:text-3xl lg:text-4xl">
                        {TOTAL_LOTES} lotes de 2.000 a 4.554 m²
                      </p>
                    </div>
                  </div>
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
