'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { menuEsquerda, menuDireita, type ItemMenu } from '@/lib/menu';

/**
 * A página em que estamos: vale para a rota do item e para tudo abaixo dela,
 * então /lotes/07 mantém "Masterplan" aceso.
 */
export function rotaAtiva(caminho: string | null, href?: string) {
  if (!caminho || !href) return false;
  if (href === '/') return caminho === '/';
  return caminho === href || caminho.startsWith(`${href}/`);
}

/**
 * Item da barra: vira link quando a página existe; quando não existe ainda,
 * fica visível em tom mais baixo e sem clique, em vez de link quebrado.
 * O item da página em que estamos fica dourado.
 */
function ItemBarra({ item }: { item: ItemMenu }) {
  const caminho = usePathname();

  if (!item.href) {
    return (
      <span
        aria-disabled
        title="Em breve"
        className="cursor-default font-body text-sm text-white/35"
      >
        {item.label}
      </span>
    );
  }

  const ativo = rotaAtiva(caminho, item.href);

  return (
    <Link
      href={item.href}
      aria-current={ativo ? 'page' : undefined}
      className={`font-body text-sm transition-colors ${
        ativo ? 'text-gold' : 'text-white/80 hover:text-white'
      }`}
    >
      {item.label}
    </Link>
  );
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`hidden lg:block fixed top-0 left-0 right-0 z-50 backdrop-blur-sm transition-all duration-500 ease-out ${
        scrolled ? 'bg-[#0a1929]/95 shadow-lg shadow-black/20' : 'bg-[#0a1929]/95'
      }`}
    >
      {/* Linha dourada superior - com espaçamento do topo */}
      <div
        className={`absolute left-0 right-0 h-[1px] bg-gold transition-all duration-500 ease-out ${
          scrolled ? 'top-1 opacity-0' : 'top-2 opacity-100'
        }`}
      />

      <div className="container mx-auto px-4 lg:px-8">
        {/* Os dois grupos de links e o logo andam juntos, centralizados: cada
            lado ocupa metade da barra e encosta no logo, em vez de ir para a
            ponta. O flex-1 nos dois mantém o logo no centro exato, mesmo com
            um lado tendo mais itens que o outro. */}
        <div
          className={`flex items-center transition-all duration-500 ease-out ${
            scrolled ? 'h-24' : 'h-28'
          }`}
        >
          {/* Links Esquerda - Desktop */}
          <div className="hidden flex-1 items-center justify-end gap-8 pr-12 lg:flex">
            {menuEsquerda.map((item) => (
              <ItemBarra key={item.label} item={item} />
            ))}
          </div>

          {/* Logo Central - crossfade entre logotipo completo e ícone */}
          <Link href="/" className="flex shrink-0 items-center justify-center">
            <span
              className={`relative block transition-all duration-500 ease-out ${
                scrolled ? 'h-16 w-44' : 'h-16 w-[220px]'
              }`}
            >
              {/* Logotipo completo */}
              <Image
                src="/logos/Logotipo-VillaStradale branco.svg"
                alt="Villa Stradale"
                fill
                priority
                sizes="220px"
                className={`object-contain transition-opacity duration-500 ease-out ${
                  scrolled ? 'opacity-0' : 'opacity-100'
                }`}
              />
              {/* Ícone */}
              <Image
                src="/logos/Icone-VillaStradale claro.svg"
                alt="Villa Stradale"
                fill
                sizes="176px"
                className={`object-contain transition-opacity duration-500 ease-out ${
                  scrolled ? 'opacity-100' : 'opacity-0'
                }`}
              />
            </span>
          </Link>

          {/* Links Direita - Desktop */}
          <div className="hidden flex-1 items-center justify-start gap-8 pl-12 lg:flex">
            {menuDireita.map((item) => (
              <ItemBarra key={item.label} item={item} />
            ))}
          </div>
        </div>
      </div>

      {/* Linha dourada inferior - com espaçamento da base */}
      <div
        className={`absolute left-0 right-0 h-[1px] bg-gold transition-all duration-500 ease-out ${
          scrolled ? 'bottom-1 opacity-0' : 'bottom-2 opacity-100'
        }`}
      />
    </nav>
  );
}
