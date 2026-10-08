import { Navbar } from '@/components/navbar';
import { MobileNav } from '@/components/mobile-nav';
import { HeroSection } from '@/components/hero-section';
import { IntroSection } from '@/components/intro-section';
import { ParallaxGaleria } from '@/components/parallax-galeria';
import { ConceitoSection } from '@/components/conceito-section';
import { FaixaPortaria } from '@/components/faixa-portaria';
import { AutoresSection } from '@/components/autores-section';
import { EmbaixadoresSection } from '@/components/embaixadores-section';
import { FundadorSection } from '@/components/fundador-section';
import { RegiaoSection } from '@/components/regiao-section';
import { LocalizacaoSection } from '@/components/localizacao-section';
import { ContatoSection } from '@/components/contato-section';
import { Footer } from '@/components/footer';
import { imagensDoEmpreendimento } from '@/lib/galeria';

export default function Home() {
  return (
    <>
      {/* Navbar Desktop */}
      <Navbar />

      {/* Mobile Navigation */}
      <MobileNav />

      <main>
        <HeroSection />
        <IntroSection />
        {/* A faixa da galeria entra entre os dois containers brancos, e os
            dois avançam 112px sobre ela, um de cada lado. */}
        <ParallaxGaleria imagens={imagensDoEmpreendimento} rotulo="Imagens do empreendimento" />
        <ConceitoSection />
        {/* A faixa da portaria faz o mesmo corte da anterior: fecha o
            container das amenities e abre o dos autores. */}
        <FaixaPortaria />
        <AutoresSection />
        {/* O masterplan e a implantação saíram daqui: eles têm página própria,
            em /lotes, com o mapa animado dentro do container branco. */}
        <EmbaixadoresSection />
        {/* O fundador e os stakeholders, vindos de /villa-stradale: a faixa
            navy entra no lugar da faixa da represa, que passou para depois
            do container, fechando o capítulo. */}
        <FundadorSection />
        <RegiaoSection />
        <LocalizacaoSection />
        <ContatoSection />
      </main>
      <Footer />
    </>
  );
}
