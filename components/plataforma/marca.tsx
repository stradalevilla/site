import Image from 'next/image';

/** O logotipo no topo das telas do app */
export function Marca({ largura = 150 }: { largura?: number }) {
  return (
    <Image
      src="/logos/Logotipo-VillaStradale branco.svg"
      alt="Villa Stradale"
      width={largura}
      height={Math.round((largura * 129.46) / 258.69)}
      priority
    />
  );
}
