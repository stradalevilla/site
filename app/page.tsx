import { Navbar } from '@/components/navbar';
import { MobileNav } from '@/components/mobile-nav';
import { HeroSection } from '@/components/hero-section';
import { IntroSection } from '@/components/intro-section';
import { EmbaixadoresSection } from '@/components/embaixadores-section';
import { RegiaoSection } from '@/components/regiao-section';
import { LocalizacaoSection } from '@/components/localizacao-section';
import { ContatoSection } from '@/components/contato-section';
import { Footer } from '@/components/footer';

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
        {/* O masterplan e a implantação saíram daqui: eles têm página própria,
            em /lotes, com o mapa animado dentro do container branco. */}
        <EmbaixadoresSection />
        <RegiaoSection />
        <LocalizacaoSection />
        <ContatoSection />
      </main>
      <Footer />
    </>
  );
}
