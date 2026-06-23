'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export function MobileHeroLogo() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY < 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div 
      className={`lg:hidden fixed top-[20%] md:top-[23%] left-1/2 -translate-x-1/2 z-40 transition-opacity duration-500 ${
        isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      <Image
        src="/logos/Logotipo-VillaStradale branco.svg"
        alt="Villa Stradale"
        width={360}
        height={140}
        className="h-28 md:h-32 w-auto brightness-0 invert drop-shadow-2xl"
        priority
      />
    </div>
  );
}
