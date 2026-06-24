import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Navbar } from '@/components/navbar';
import { MobileNav } from '@/components/mobile-nav';
import { Footer } from '@/components/footer';
import { LoteVistas } from '@/components/lote-vistas';
import { ContatoInteresse } from '@/components/contato-interesse';
import { getLote, TOTAL_LOTES } from '@/lib/lotes';

function parseLote(numero: string): number | null {
  if (!/^\d+$/.test(numero)) return null;
  const n = Number(numero);
  if (n < 1 || n > TOTAL_LOTES) return null;
  return n;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ numero: string }>;
}): Promise<Metadata> {
  const { numero } = await params;
  const n = parseLote(numero);
  return {
    title: n ? `Lote ${String(n).padStart(2, '0')}` : 'Lote não encontrado',
  };
}

const emblemMaskStyle = {
  WebkitMaskImage: "url('/logos/Icone-VillaStradale escuro.svg')",
  maskImage: "url('/logos/Icone-VillaStradale escuro.svg')",
  WebkitMaskRepeat: 'no-repeat',
  maskRepeat: 'no-repeat',
  WebkitMaskPosition: 'center',
  maskPosition: 'center',
  WebkitMaskSize: 'contain',
  maskSize: 'contain',
} as const;

function SectionLabel({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="mb-5">
      <p className="font-body text-sm font-semibold uppercase tracking-wide text-navy">{title}</p>
      <p className="font-body text-xs uppercase tracking-wide text-gray-500">{subtitle}</p>
    </div>
  );
}

export default async function LotePage({
  params,
}: {
  params: Promise<{ numero: string }>;
}) {
  const { numero } = await params;
  const n = parseLote(numero);

  if (!n) {
    notFound();
  }

  const pad = String(n).padStart(2, '0');
  const data = getLote(n);

  return (
    <>
      <Navbar />
      <MobileNav />

      <main className="relative overflow-hidden pt-28 pb-20 lg:pt-40 lg:pb-28">
        <div className="container mx-auto px-4 md:px-8">
          {/* Container branco (padrão das seções) */}
          <div className="relative bg-white p-6 md:p-10 lg:p-12">
            <div className="relative">
              {/* Moldura dourada */}
              <div className="pointer-events-none absolute inset-0 z-20 border-2 border-[#D07748]/50" />

              <div className="relative z-10 px-6 py-12 md:px-14 md:py-16">
                {/* Cabeçalho: emblema + título do lote */}
                <div className="flex items-center justify-between gap-4 border-b border-[#D07748]/40 pb-6">
                  <span aria-hidden className="block h-14 w-28 bg-gold-dark md:h-16 md:w-32" style={emblemMaskStyle} />
                  <h1 className="font-heading text-xl italic uppercase text-gold-dark md:text-3xl">
                    Lote {pad} {data ? `- ${data.area}M²` : ''}
                  </h1>
                </div>

                {data ? (
                  <>
                    {/* Seção 1 - Masterplan */}
                    <section className="pt-8 md:pt-10">
                      <SectionLabel title="Masterplan" subtitle="54 lotes de 2.000 a 4.554 m²" />
                      <Image
                        src={data.masterplan.src}
                        width={data.masterplan.width}
                        height={data.masterplan.height}
                        alt={`Masterplan com o lote ${pad} sinalizado`}
                        className="h-auto w-full"
                        sizes="(max-width: 1024px) 100vw, 900px"
                        priority
                      />
                    </section>

                    {/* Seção 2 - Detalhe do lote */}
                    <section className="mt-10 border-t border-[#D07748]/40 pt-10 md:mt-14 md:pt-14">
                      <SectionLabel title={`Lote ${pad}`} subtitle={`${data.area}M²`} />
                      <Image
                        src={data.detalhe.src}
                        width={data.detalhe.width}
                        height={data.detalhe.height}
                        alt={`Detalhe e medidas do lote ${pad}`}
                        className="h-auto w-full"
                        sizes="(max-width: 1024px) 100vw, 900px"
                      />
                    </section>

                    {/* Seção 3 - Vistas */}
                    <section className="mt-10 border-t border-[#D07748]/40 pt-10 md:mt-14 md:pt-14">
                      <SectionLabel title="Vistas" subtitle="Imagens do local" />
                      <LoteVistas vistas={data.vistas} numero={pad} />
                    </section>
                  </>
                ) : (
                  <div className="py-16 text-center md:py-24">
                    <p className="mx-auto max-w-md font-body text-sm leading-relaxed text-gray-600 md:text-base">
                      As informações deste lote estão sendo preparadas e estarão disponíveis em breve.
                    </p>
                    <Link
                      href="/lotes"
                      className="group mt-10 inline-flex h-12 items-center justify-center gap-3 rounded-sm border border-navy/50 px-6 text-navy transition-all duration-300 ease-out hover:border-navy hover:bg-navy hover:text-white"
                    >
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="rotate-180 transition-transform duration-300 ease-out delay-150 group-hover:-translate-x-1"
                      >
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                      </svg>
                      <span className="font-body text-sm uppercase tracking-widest">
                        Escolher outro lote
                      </span>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Contato - colado no container branco */}
          <ContatoInteresse />
        </div>
      </main>

      <Footer />
    </>
  );
}
