'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { IconBrandInstagram, IconBrandLinkedin } from '@tabler/icons-react';

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

  // Trava o scroll do fundo enquanto o menu está aberto
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

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
                src="/logos/Icone-VillaStradale escuro.svg"
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

      {/* Botão hamburguer / fechar */}
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className={`lg:hidden fixed z-[110] p-3 rounded-full transition-all duration-500 ${
          isMenuOpen
            ? 'top-5 right-6 text-white'
            : isScrolled
            ? 'top-3 right-6 bg-transparent'
            : 'top-6 right-6 bg-navy/80 backdrop-blur-sm'
        }`}
        style={{
          color: isMenuOpen ? '#ffffff' : isScrolled ? '#F2A06A' : '#ffffff',
        }}
        aria-label={isMenuOpen ? 'Fechar menu' : 'Abrir menu'}
      >
        {isMenuOpen ? <X size={26} /> : <Menu size={24} />}
      </button>

      {/* Menu em tela cheia */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="lg:hidden fixed inset-0 z-[100] bg-navy"
          >
            {/* Linhas douradas decorativas */}
            <div className="absolute top-6 left-6 right-6 h-[1px] bg-gold/30" />
            <div className="absolute bottom-6 left-6 right-6 h-[1px] bg-gold/30" />

            <div className="flex h-full flex-col items-center justify-center px-8">
              {/* Emblema */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.5 }}
                className="mb-12"
              >
                <Image
                  src="/logos/Icone-VillaStradale claro.svg"
                  alt="Villa Stradale"
                  width={72}
                  height={44}
                  className="h-10 w-auto opacity-90"
                />
              </motion.div>

              {/* Links */}
              <nav className="flex flex-col items-center gap-7">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ delay: 0.2 + i * 0.07, duration: 0.5, ease: 'easeOut' }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setIsMenuOpen(false)}
                      className="font-body text-2xl md:text-3xl uppercase tracking-[0.15em] text-white/85 transition-colors duration-300 hover:text-gold"
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </nav>

              {/* Redes sociais */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 + navLinks.length * 0.07 + 0.1, duration: 0.5 }}
                className="mt-14 flex items-center gap-6 text-white/70"
              >
                <a href="#" aria-label="Instagram" className="transition-colors hover:text-gold">
                  <IconBrandInstagram size={24} stroke={1.5} />
                </a>
                <a href="#" aria-label="LinkedIn" className="transition-colors hover:text-gold">
                  <IconBrandLinkedin size={24} stroke={1.5} />
                </a>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
