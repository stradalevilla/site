import Image from 'next/image';
import { DecorativeGraphic } from '@/components/decorative-graphic';

/**
 * Amenities — "Tudo o que existe na península".
 *
 * Veio da página /villa-stradale (book p8/p22/p23, programa p26) e passou a
 * viver na home, no lugar dos três cartões antigos de Racket Club, Garagem
 * Náutica e Heliponto. A Casa Clube ficou de fora da lista: o lema e o texto
 * dela já abrem a seção da casa clube, logo acima, palavra por palavra.
 *
 * Os paddings e os deslocamentos dos grafismos são os mesmos dos cartões que
 * este bloco substituiu, para o grafismo encostar na linha dourada do cartão
 * branco da home.
 */
const amenities = [
  {
    overline: 'Esporte e comunidade',
    nome: 'Racket Club',
    lema: 'É o lugar onde a comunidade se encontra em terra.',
    texto:
      'Tênis em quadra rápida, padel e beach tennis, no mesmo lugar. As quadras recebem jogos combinados entre vizinhos, aulas em família e finais de tarde que misturam crianças, jovens e adultos em torno do mesmo prazer de jogar.',
    programa: [
      '2 quadras rápidas de tênis',
      '1 quadra de padel',
      '2 quadras de beach tennis',
      'Campo de futebol society',
      'Trilha de 3 km para corrida, caminhada ou bicicleta',
      'Pista de cooper',
    ],
    imagem: '/images/galeria/racket-club.jpg',
    alt: 'As quadras do Racket Club vistas do alto, com a península e a represa ao fundo',
  },
  {
    overline: 'Náutica',
    nome: 'Garagem Náutica',
    lema: 'O acesso do Villa Stradale à represa.',
    texto:
      'Garagem náutica para aproximadamente 30 embarcações, conectando o dia a dia da comunidade à represa. Do píer, o caminho segue para a Casa Clube pela água.',
    programa: [
      'Garagem para aproximadamente 30 embarcações',
      'Apoio náutico',
      'Píer para acesso à Casa Clube',
    ],
    imagem: '/images/amenities/marina.jpg',
    alt: 'Enseada da marina com veleiro e píeres de madeira',
  },
  {
    overline: 'Acesso pelo ar',
    nome: 'Heliponto',
    lema: 'Para quem chega pelo ar.',
    texto:
      'Três spots de pouso integrados à paisagem, recuados em relação ao centro de convivência. A linha de silêncio mantém o heliponto afastado e resguarda as quadras.',
    programa: ['Três spots de pouso', 'Recuado do centro de convivência'],
    imagem: '/images/amenities/heliponto.jpg',
    alt: 'Heliponto na beira da represa com helicóptero pousado',
  },
];

export function AmenitiesSection() {
  return (
    <div className="px-4 py-16 md:px-12 md:py-20 lg:px-16 lg:py-24">
      <div className="mb-6">
        <Image
          src="/logos/Icone-VillaStradale escuro.svg"
          alt="Villa Stradale"
          width={64}
          height={40}
          className="h-9 w-auto md:h-10"
        />
      </div>
      <span className="mb-6 block font-heading text-sm font-thin uppercase italic tracking-[0.3em] text-[#D07748] md:text-base">
        Amenities
      </span>
      <h3 className="mb-6 font-heading text-2xl font-light uppercase italic leading-snug text-navy md:text-3xl lg:text-4xl">
        Tudo o que existe
        <br />
        na península
      </h3>
      <p className="mb-14 max-w-xl font-body text-sm leading-relaxed text-navy/80 md:mb-20 md:text-base">
        Cada estrutura foi posicionada onde a península pedia.
        <br />
        Aqui, uma a uma, com o programa de cada uma.
      </p>

      <div className="space-y-10 md:space-y-14">
        {amenities.map(({ overline, nome, lema, texto, programa, imagem, alt }, i) => {
          const imagemEsquerda = i % 2 === 1;
          return (
            <div key={nome} className="relative grid w-full grid-cols-1 bg-[#EFEBE3] lg:grid-cols-2">
              <div
                className={`flex flex-col justify-center px-6 py-10 md:px-12 md:py-14 lg:px-16 ${
                  imagemEsquerda ? 'order-1 lg:order-2' : ''
                }`}
              >
                <span className="mb-4 font-heading text-sm font-thin uppercase italic tracking-[0.3em] text-[#D07748] md:text-base">
                  {overline}
                </span>
                <h4 className="mb-5 font-heading text-2xl font-light uppercase italic text-navy md:text-3xl lg:text-4xl">
                  {nome}
                </h4>
                <p className="mb-5 font-heading text-lg font-light italic text-[#D07748] md:text-xl">
                  {lema}
                </p>
                <p className="max-w-md font-body text-sm leading-relaxed text-gray-700 md:text-base">
                  {texto}
                </p>

                <ul className="mt-7 grid gap-x-8 gap-y-1.5 border-t border-navy/15 pt-5 sm:grid-cols-2">
                  {programa.map((item) => (
                    <li
                      key={item}
                      className="flex gap-2 font-body text-[11px] leading-snug text-navy/70 md:text-xs"
                    >
                      <span aria-hidden className="text-[#D07748]">
                        ·
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className={`relative p-6 md:p-8 ${imagemEsquerda ? 'order-2 lg:order-1' : ''}`}>
                <div className="relative h-full min-h-[260px] w-full md:min-h-[340px]">
                  <Image
                    src={imagem}
                    alt={alt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>
              </div>

              <DecorativeGraphic
                position={imagemEsquerda ? 'left' : 'right'}
                className={
                  imagemEsquerda
                    ? 'left-0 top-1/2 z-20 -translate-x-6 -translate-y-1/2 md:-translate-x-12 lg:-translate-x-16'
                    : 'right-0 top-1/2 z-20 -translate-y-1/2 translate-x-6 md:translate-x-12 lg:translate-x-16'
                }
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
