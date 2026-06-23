'use client';

import Image from 'next/image';
import Link from 'next/link';

export function Navbar() {
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
    <nav className="hidden lg:block fixed top-0 left-0 right-0 z-50 bg-[#0a1929]/95 backdrop-blur-sm">
      {/* Linha dourada superior - com espaçamento do topo */}
      <div className="absolute top-2 left-0 right-0 h-[1px] bg-gold" />
      
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-28">
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

          {/* Logo Central */}
          <Link href="/" className="flex items-center justify-center">
            <Image
              src="/logos/Logotipo-VillaStradale branco.svg"
              alt="Villa Stradale"
              width={220}
              height={80}
              className="h-16 w-auto"
              priority
            />
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
      <div className="absolute bottom-2 left-0 right-0 h-[1px] bg-gold" />
    </nav>
  );
}
