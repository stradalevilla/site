import Image from 'next/image';
import { FilmesDeFundo } from '@/components/plataforma/filmes-de-fundo';

/** A foto da península abre a tela na hora, os filmes entram por cima, e tudo some no azul para o texto ficar legível */
export function FundoDoApp() {
  return (
    <div aria-hidden className="fixed inset-0 -z-10 overflow-hidden bg-navy">
      <Image
        src="/images/renders/hero-peninsula-v2-retrato.jpg"
        alt=""
        fill
        priority
        sizes="(max-width: 767px) 100vw, 1px"
        quality={75}
        className="object-cover object-top md:hidden"
      />
      <Image
        src="/images/renders/hero-peninsula-v2.jpg"
        alt=""
        fill
        sizes="(min-width: 768px) 100vw, 1px"
        quality={75}
        className="hidden object-cover md:block"
      />
      <FilmesDeFundo />
      <div className="absolute inset-0 bg-gradient-to-b from-navy/55 via-navy/70 to-navy" />
    </div>
  );
}
