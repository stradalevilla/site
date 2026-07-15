import { Navbar } from '@/components/navbar';
import { MobileNav } from '@/components/mobile-nav';
import { HeroSection } from '@/components/hero-section';
import { IntroSection } from '@/components/intro-section';
import { MasterplanSection } from '@/components/masterplan-section';
import { ImplantacaoSection } from '@/components/implantacao-section';
import { EmbaixadoresSection } from '@/components/embaixadores-section';
import { RegiaoSection } from '@/components/regiao-section';
import { LocalizacaoSection } from '@/components/localizacao-section';
import { ContatoSection } from '@/components/contato-section';
import { Footer } from '@/components/footer';
import { getContornos } from '@/lib/getContornos';

export default async function Home() {
  const contornos = await getContornos();
  return (
    <>
      {/* Navbar Desktop */}
      <Navbar />
      
      {/* Mobile Navigation */}
      <MobileNav />
      
      <main>
        <HeroSection />
        <IntroSection />
        <MasterplanSection />
        <ImplantacaoSection contornos={contornos} />
        <EmbaixadoresSection />
        <RegiaoSection />
        <LocalizacaoSection />
        <ContatoSection />
      </main>
      <Footer />
    </>
  );
}
