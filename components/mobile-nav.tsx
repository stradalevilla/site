'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

export function MobileNav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const navLinks = [
    { href: '#villa-stradale', label: 'Villa Stradale' },
    { href: '#masterplan', label: 'Masterplan' },
    { href: '#lifestyle', label: 'Lifestyle' },
    { href: '#localizacao', label: 'Localização' },
    { href: '#obra', label: 'Obra ao vivo' },
    { href: '#contato', label: 'Contato' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Navbar com transição suave */}
      <nav 
        className={`lg:hidden fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="bg-[#0a1929]/90 backdrop-blur-md">
          <div className="absolute top-1 left-0 right-0 h-[1px] bg-gold/60" />
          
          <div className="flex items-center justify-between h-16 px-6">
            <div className="flex-1" />
            
            <Link href="/">
              <Image
                src="/logos/Icone-VillaStradale.svg"
                alt="Villa Stradale"
                width={24}
                height={24}
                className="h-6 w-auto opacity-90"
                style={{ filter: 'brightness(0) saturate(100%) invert(72%) sepia(18%) saturate(1276%) hue-rotate(336deg) brightness(96%) contrast(93%)' }}
              />
            </Link>
            
            <div className="flex-1" />
          </div>
          
          <div className="absolute bottom-1 left-0 right-0 h-[1px] bg-gold/60" />
        </div>
      </nav>

      {/* Menu hamburguer único com transição suave de posição e cor */}
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className={`lg:hidden fixed z-[100] p-3 rounded-full shadow-lg transition-all duration-500 ${
          isScrolled 
            ? 'top-3 right-6 bg-transparent shadow-none' 
            : 'top-6 right-6 bg-navy/80 backdrop-blur-sm'
        }`}
        style={{
          color: isScrolled ? '#F2A06A' : '#ffffff',
        }}
        aria-label="Menu"
      >
        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Menu Lateral */}
      <div
        className={`lg:hidden fixed inset-0 z-[90] transition-opacity duration-300 ${
          isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Overlay */}
        <div 
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={() => setIsMenuOpen(false)}
        />
        
        {/* Menu Content */}
        <div 
          className={`absolute right-0 top-0 bottom-0 w-80 bg-navy shadow-2xl transition-transform duration-300 ${
            isMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="flex flex-col h-full pt-24 px-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className="font-body text-lg text-white/80 hover:text-white py-4 border-b border-white/10 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
