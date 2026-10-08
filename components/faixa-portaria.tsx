/**
 * A faixa parallax da portaria, no render de JUN 2026. Baixa: os containers
 * brancos de cima e de baixo comem 224px dela no desktop (112px cada um),
 * então o que sobra à vista é só uma tira da imagem, e não um paredão.
 */
export function FaixaPortaria() {
  return (
    <section
      aria-label="Portaria do Villa Stradale"
      className="relative h-[45vh] w-full bg-cover bg-center md:h-[55vh] lg:h-[70vh] lg:bg-fixed"
      style={{ backgroundImage: "url('/images/portaria/portaria-2026.jpg')" }}
    />
  );
}
