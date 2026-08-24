import Image from 'next/image';
import { DecorativeGraphic } from '@/components/decorative-graphic';

/**
 * Divisor de capítulo dentro da página, no gesto das páginas 3, 29 e 35 do
 * book: faixa navy com o padrão de curvas de nível, emblema e título.
 * Separa as grandes seções de uma página de categoria — e serve de âncora
 * para o menu do topo (o id vira /pagina#secao).
 */
export function DivisorCapitulo({
  id,
  rotulo,
  titulo,
  frase,
}: {
  id: string;
  rotulo: string;
  titulo: React.ReactNode;
  frase?: string;
}) {
  return (
    <section
      id={id}
      className="relative flex w-full scroll-mt-28 items-center overflow-hidden bg-[#0a1929] py-20 md:min-h-[70vh] md:py-28 lg:min-h-[80vh] lg:py-32"
    >
      {/* As curvas de nível ficam fixas na tela enquanto a faixa passa: é o
          parallax do fundo navy. No celular rolam junto, porque o
          background-attachment fixed quebra no Safari do iPhone. */}
      <div
        aria-hidden
        className="absolute inset-0 bg-center opacity-[0.18] lg:bg-fixed"
        style={{
          backgroundImage: "url('/images/grafismos/Grafismo linhas.svg')",
          backgroundRepeat: 'repeat',
          backgroundSize: '950px',
        }}
      />

      {/* Na altura do texto, e não no rodapé: o container da seção seguinte
          avança sobre a base da faixa e cobriria os grafismos ali */}
      <DecorativeGraphic
        position="left"
        className="absolute left-0 top-1/2 z-10 hidden -translate-y-1/2 lg:block"
      />
      <DecorativeGraphic
        position="right"
        className="absolute right-0 top-1/2 z-10 hidden -translate-y-1/2 lg:block"
      />

      <div className="container relative z-10 mx-auto px-4 text-center md:px-8">
        <div className="mb-6 flex justify-center">
          <Image
            src="/logos/Icone-VillaStradale claro.svg"
            alt="Villa Stradale"
            width={64}
            height={40}
            className="h-9 w-auto md:h-10"
          />
        </div>

        <p className="font-heading text-sm font-thin uppercase italic tracking-[0.35em] text-[#D07748] md:text-base">
          {rotulo}
        </p>

        <h2 className="mx-auto mt-6 max-w-4xl font-heading text-3xl font-light uppercase italic leading-tight tracking-wider text-white md:text-4xl lg:text-5xl">
          {titulo}
        </h2>

        {frase && (
          <p className="mx-auto mt-6 max-w-2xl font-body text-base font-light leading-relaxed text-white/85 md:text-lg">
            {frase}
          </p>
        )}
      </div>
    </section>
  );
}
