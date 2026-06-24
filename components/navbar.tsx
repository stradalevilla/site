'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

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

  const navLinks = [
    { href: '#villa-stradale', label: 'Villa Stradale' },
    { href: '#masterplan', label: 'Masterplan' },
    { href: '#lifestyle', label: 'Lifestyle' },
  ];

  const rightLinks = [
    { href: '#localizacao', label: 'Localização' },
    { href: '#obra', label: 'Obra ao vivo' },
    { href: '#contato', label: 'Contato' },
  ];

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
        <div
          className={`flex items-center justify-between transition-all duration-500 ease-out ${
            scrolled ? 'h-24' : 'h-28'
          }`}
        >
          {/* Links Esquerda - Desktop */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-body text-sm text-white/80 hover:text-white transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Logo Central - crossfade entre logotipo completo e ícone */}
          <Link href="/" className="flex items-center justify-center">
            <span
              className={`relative block transition-all duration-500 ease-out ${
                scrolled ? 'h-20 w-20' : 'h-16 w-[220px]'
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
                sizes="80px"
                className={`object-contain transition-opacity duration-500 ease-out ${
                  scrolled ? 'opacity-100' : 'opacity-0'
                }`}
              />
            </span>
          </Link>

          {/* Links Direita - Desktop */}
          <div className="hidden lg:flex items-center gap-8">
            {rightLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-body text-sm text-white/80 hover:text-white transition-colors"
              >
                {link.label}
              </Link>
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
