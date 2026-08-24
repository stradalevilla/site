import Link from 'next/link';
import Image from 'next/image';

export interface AcaoCta {
  /** Título da ação. Fora quando o título da seção já diz a mesma coisa */
  label?: string;
  /** Linha de apoio, uma frase curta */
  nota?: string;
  href: string;
  /** Nome do link para leitores de tela, quando não há label visível */
  aria?: string;
}

/** A seta na pílula vazada, a mesma da linguagem do site */
function SetaPilula() {
  return (
    <span className="flex h-10 w-16 shrink-0 items-center justify-center rounded-full border border-white/70 text-white transition-all duration-300 ease-out group-hover:border-white group-hover:bg-white group-hover:text-navy">
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
        className="transition-transform delay-150 duration-300 ease-out group-hover:translate-x-1"
      >
        <line x1="5" y1="12" x2="19" y2="12" />
        <polyline points="12 5 19 12 12 19" />
      </svg>
    </span>
  );
}

/**
 * Rodapé de ação das páginas internas: bloco navy inset no container.
 *
 * Com um caminho só, o bloco inteiro é o link — emblema, título e a frase de
 * apoio empilhados à esquerda, e a seta ancorada no canto inferior direito.
 * Com mais de um, a esquerda guarda emblema/tag/título e os caminhos ficam
 * empilhados à direita, separados por um fio claro.
 */
export function PaginaCta({
  overline,
  titulo,
  acoes,
}: {
  overline?: string;
  titulo?: React.ReactNode;
  acoes: AcaoCta[];
}) {
  const unica = acoes.length === 1 ? acoes[0] : null;

  const emblema = (
    <Image
      src="/logos/Icone-VillaStradale claro.svg"
      alt="Villa Stradale"
      width={64}
      height={40}
      /* self-start: em coluna de flex, o w-auto deixaria o stretch esticar a
         imagem na largura toda do bloco */
      className="h-9 w-auto self-start md:h-10"
    />
  );

  const tag = overline ? (
    <span className="block font-heading text-sm font-thin uppercase italic tracking-[0.35em] text-[#D07748] md:text-base">
      {overline}
    </span>
  ) : null;

  return (
    <section className="relative pb-16 pt-16 md:pb-24 md:pt-24">
      <div className="container mx-auto px-4 md:px-8">
        <div className="bg-[#0a1929] px-8 py-16 md:px-12 md:py-20 lg:px-16">
          {unica ? (
            <Link
              href={unica.href}
              aria-label={unica.label ? undefined : unica.aria}
              className="group block"
            >
              {/* O emblema abre o bloco; título e frase descem e se alinham pela
                  base, na mesma linha da seta que fecha o canto direito. */}
              <div className="flex flex-col gap-16 md:gap-20">
                {emblema}

                <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between md:gap-12">
                  <div>
                    {tag}
                    {titulo && (
                      <h2
                        className={`font-heading text-2xl font-light uppercase italic leading-tight text-white transition-colors duration-300 group-hover:text-gold md:text-3xl lg:text-4xl ${
                          overline ? 'mt-6' : ''
                        }`}
                      >
                        {titulo}
                      </h2>
                    )}
                    {unica.label && (
                      <p className="mt-6 font-heading text-xl font-light uppercase italic text-white md:text-2xl">
                        {unica.label}
                      </p>
                    )}
                    {unica.nota && (
                      <p className="mt-5 max-w-xl font-body text-sm leading-relaxed text-white/70 md:text-base">
                        {unica.nota}
                      </p>
                    )}
                  </div>

                  <div className="self-end">
                    <SetaPilula />
                  </div>
                </div>
              </div>
            </Link>
          ) : (
            <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-20">
              {/* Esquerda: emblema, tag e título */}
              <div>
                <div className="mb-6">{emblema}</div>
                {tag}
                {titulo && (
                  <h2
                    className={`font-heading text-2xl font-light uppercase italic leading-tight text-white md:text-3xl lg:text-4xl ${
                      overline ? 'mt-6' : ''
                    }`}
                  >
                    {titulo}
                  </h2>
                )}
              </div>

              {/* Direita: os caminhos */}
              <div>
                {acoes.map((acao, i) => (
                  <Link
                    key={acao.href}
                    href={acao.href}
                    aria-label={acao.label ? undefined : acao.aria}
                    className={`group flex items-center justify-between gap-6 py-6 transition-colors duration-300 md:py-7 ${
                      i > 0 ? 'border-t border-white/15' : ''
                    }`}
                  >
                    <span>
                      {acao.label && (
                        <span className="block font-heading text-xl font-light uppercase italic text-white transition-colors duration-300 group-hover:text-gold md:text-2xl">
                          {acao.label}
                        </span>
                      )}
                      {acao.nota && (
                        <span
                          className={`block font-body leading-relaxed ${
                            acao.label
                              ? 'mt-2 text-xs text-white/60 md:text-sm'
                              : 'text-sm text-white/75 md:text-base'
                          }`}
                        >
                          {acao.nota}
                        </span>
                      )}
                    </span>

                    <SetaPilula />
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
