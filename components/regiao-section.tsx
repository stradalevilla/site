/**
 * A faixa parallax da represa, que fecha o capítulo do fundador. A imagem é a
 * versão tratada pelo cliente, reduzida para a web: o PNG de origem
 * ("imagem da regiao 2-alta.png", 3356px e 10 MB) não vai para o navegador.
 */
export function RegiaoSection() {
  return (
    <section
      aria-label="Imagem da região"
      className="relative w-full h-[60vh] md:h-[75vh] lg:h-[85vh] bg-cover bg-center bg-fixed"
      style={{ backgroundImage: "url('/images/imagem da regiao 2.jpg')" }}
    />
  );
}
