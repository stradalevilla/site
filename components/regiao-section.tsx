import Image from 'next/image';
import { VideoFaixa } from '@/components/video-faixa';

/**
 * A faixa da represa, que fecha o capítulo do fundador: o filme do voo sobre a
 * represa, com o primeiro quadro por baixo segurando o lugar.
 *
 * O parallax das outras faixas vem do background-attachment fixed, que filme
 * não tem. Aqui a camada é que fica presa à janela, e o clip-path da seção a
 * recorta: dá o mesmo efeito, da imagem parada com a página rolando por cima.
 * Só do desktop para cima, como nas outras: no celular ela rola junto.
 *
 * O data-faixa-fixa diz ao filme para vigiar a seção. Presa à janela, a camada
 * está sempre "na tela", e ele baixaria assim que o site abrisse.
 */
export function RegiaoSection() {
  return (
    <section
      aria-label="Imagem da região"
      data-faixa-fixa
      data-surgir="cortina"
      className="relative h-[60vh] w-full [clip-path:inset(0)] md:h-[75vh] lg:h-[85vh]"
    >
      <div className="absolute inset-0 lg:fixed" data-miolo>
        <Image
          src="/images/renders/regiao-peninsula.jpg"
          alt="A represa vista do alto ao fim da tarde, com a serra ao fundo"
          fill
          className="object-cover"
          quality={90}
          sizes="100vw"
        />
        <VideoFaixa base="/videos/regiao-peninsula" />
      </div>
    </section>
  );
}
