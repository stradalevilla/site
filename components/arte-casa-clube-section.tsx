import Image from 'next/image';

/**
 * O desenho a lápis da casa-clube, a arte da folha interna da caixa gift
 * (04_71). Ocupa o lugar do cartão dos primeiros proprietários, e por isso
 * repete o encaixe dele: encostado no bloco de cima e avançando sobre a faixa
 * azul de baixo.
 *
 * A imagem sai do PDF de arte final, e não do PSD da pasta Links: o PSD é uma
 * versão anterior do desenho, e o PDF já vem no enquadramento da folha.
 *
 * O emblema fica fora da imagem porque no PDF ele tem só 327px de largura.
 * Em vetor, com o degradê cobre medido na arte, fica nítido em qualquer tela;
 * na folha ele cai no centro exato e ocupa 27,7% da largura.
 */
export function ArteCasaClubeSection() {
  return (
    <section className="relative z-10 -mb-16 md:-mb-24 lg:-mb-28">
      <div className="container mx-auto px-4 md:px-8">
        <div data-surgir="imagem" className="relative aspect-[415/310] overflow-hidden">
          <Image
            src="/images/renders/desenho-casa-clube.jpg"
            alt="Desenho a lápis da casa-clube entre as árvores, com a represa e a serra ao fundo"
            fill
            className="object-cover"
            quality={90}
            sizes="(max-width: 768px) 100vw, 90vw"
          />
          <Image
            src="/logos/Icone-VillaStradale cobre.svg"
            alt="Villa Stradale"
            data-surgir="fade"
            data-fixo
            width={253}
            height={53}
            className="absolute left-1/2 top-1/2 h-auto w-[27.7%] -translate-x-1/2 -translate-y-1/2"
          />
        </div>
      </div>
    </section>
  );
}
