/**
 * Faixa de imagem entre dois containers brancos: a imagem fica presa à janela
 * (parallax) enquanto a página rola por cima.
 *
 * A altura padrão já conta com os avanços: os containers de cima e de baixo
 * comem 224px dela no desktop (112px cada um), então o que sobra à vista é uma
 * tira da imagem, e não um paredão.
 *
 * No celular não há bg-fixed: o background-attachment fixed quebra no Safari
 * do iPhone, então lá a imagem rola junto.
 */
export function FaixaParallax({
  imagem,
  rotulo,
  altura = 'h-[45vh] md:h-[55vh] lg:h-[70vh]',
}: {
  imagem: string;
  rotulo: string;
  /** classes de altura da faixa */
  altura?: string;
}) {
  return (
    <section
      aria-label={rotulo}
      className={`relative w-full bg-cover bg-center lg:bg-fixed ${altura}`}
      style={{ backgroundImage: `url('${imagem}')` }}
    />
  );
}
