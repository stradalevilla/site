import type { Metadata } from 'next';
import { Navbar } from '@/components/navbar';
import { MobileNav } from '@/components/mobile-nav';
import { Footer } from '@/components/footer';
import { cartaoDoLink } from '@/lib/seo';
import { POLITICA, SUBTITULO_DA_POLITICA, TITULO_DA_POLITICA, type Bloco } from '@/lib/politica-de-privacidade';

const DESCRICAO = 'Como os dados pessoais são coletados, usados, guardados e protegidos nas plataformas do Villa Stradale, conforme a LGPD.';

export const metadata: Metadata = {
  title: 'Política de Privacidade',
  description: DESCRICAO,
  ...cartaoDoLink('Política de Privacidade | Villa Stradale', DESCRICAO),
};

/** O endereço de cada seção, para o índice do alto: "1. Dados coletados" vira "dados-coletados" */
const ancora = (texto: string) =>
  texto
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/^[a-z0-9]+\.\s*/, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

function Trecho({ bloco }: { bloco: Bloco }) {
  switch (bloco.tipo) {
    case 'secao':
      return (
        <h2 id={ancora(bloco.texto)} className="mb-5 mt-14 scroll-mt-28 border-b border-[#D07748]/30 pb-3 font-heading text-2xl font-light uppercase italic tracking-wide text-[#0a1929] first:mt-0 md:text-[28px]">
          {bloco.texto}
        </h2>
      );
    case 'subsecao':
      return (
        <h3 id={ancora(bloco.texto)} className="mb-4 mt-10 scroll-mt-28 font-body text-base font-semibold uppercase tracking-[0.08em] text-[#0a1929]">
          {bloco.texto}
        </h3>
      );
    case 'item':
      return <h4 className="mb-3 mt-7 font-body text-[15px] font-semibold text-[#0a1929]">{bloco.texto}</h4>;
    case 'rotulo':
      return <p className="mb-2 mt-5 font-semibold text-[#0a1929]">{bloco.texto}</p>;
    case 'paragrafo':
      return (
        <p className="mb-4">
          {bloco.rotulo && <strong className="font-semibold text-[#0a1929]">{bloco.rotulo} </strong>}
          {bloco.texto}
        </p>
      );
    case 'lista':
      return (
        <ul className="mb-5 list-disc space-y-1.5 pl-5 marker:text-[#D07748]">
          {bloco.itens.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      );
    case 'termos':
      return (
        <dl className="mb-5 space-y-3">
          {bloco.itens.map(([termo, definicao]) => (
            <div key={termo}>
              <dt className="inline font-semibold text-[#0a1929]">{termo}: </dt>
              <dd className="inline">{definicao}</dd>
            </div>
          ))}
        </dl>
      );
  }
}

/**
 * Política de Privacidade e Termos de Uso, com o texto do documento do cliente (ver
 * lib/politica-de-privacidade.ts). Página de leitura: sem foto no alto e sem animação no texto.
 */
export default function PoliticaDePrivacidade() {
  const indice = POLITICA.filter((b): b is Extract<Bloco, { tipo: 'secao' | 'subsecao' }> => b.tipo === 'secao' || b.tipo === 'subsecao');

  return (
    <>
      <Navbar />
      <MobileNav />

      <main>
        <section className="bg-[#0a1929] px-4 pb-16 pt-32 text-center text-white md:pb-20 md:pt-44">
          <span className="block font-heading text-sm font-thin uppercase italic tracking-[0.35em] text-[#D07748] md:text-base">Villa Stradale</span>
          <h1 className="mx-auto mt-5 max-w-3xl font-heading text-3xl font-light uppercase italic leading-tight tracking-wider md:text-5xl">{TITULO_DA_POLITICA}</h1>
          <p className="mx-auto mt-5 max-w-xl font-body text-base text-white/80 md:text-lg">{SUBTITULO_DA_POLITICA}</p>
        </section>

        <section className="container mx-auto px-4 py-12 md:px-8 md:py-20">
          <article className="mx-auto max-w-3xl bg-white px-6 py-10 font-body text-[15px] leading-relaxed text-[#0a1929]/85 shadow-[0_20px_60px_rgba(10,25,41,0.08)] md:px-14 md:py-16 md:text-base">
            <nav aria-label="Nesta página" className="border border-[#D07748]/30 px-5 py-5 md:px-7">
              <p className="mb-3 font-heading text-sm uppercase italic tracking-[0.25em] text-[#D07748]">Nesta página</p>
              <ol className="grid gap-x-8 gap-y-1.5 text-sm sm:grid-cols-2">
                {indice.map((b) => (
                  <li key={b.texto} className={b.tipo === 'subsecao' ? 'sm:pl-0' : ''}>
                    <a href={`#${ancora(b.texto)}`} className="inline-flex min-h-[32px] items-center text-[#0a1929]/80 underline-offset-4 transition-colors hover:text-[#D07748] hover:underline">
                      {b.texto}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>

            {POLITICA.map((bloco, i) => (
              <Trecho key={i} bloco={bloco} />
            ))}
          </article>
        </section>
      </main>

      <Footer />
    </>
  );
}
