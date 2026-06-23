'use client';

import { CSSProperties } from 'react';

interface DecorativeGraphicProps {
  position: 'left' | 'right';
  className?: string;
  animated?: boolean;
}

export function DecorativeGraphic({ position, className = '', animated = false }: DecorativeGraphicProps) {
  // Elemento da ESQUERDA - linhas começam da esquerda (MENOR)
  const leftLines = [
    { width: 110, top: 0, delay: 0 },      // Linha 1
    { width: 110, top: 10, delay: 0.1 },   // Linha 2 - igual à linha 1
    { width: 160, top: 20, delay: 0.2 },   // Linha 3 - avança mais
    { width: 60, top: 30, delay: 0.3 },    // Linha 4 - recua mais que todas
    { width: 110, top: 40, delay: 0.4 },   // Linha 5 - igual à linha 1 e 2
  ];

  // Elemento da DIREITA - ESPELHADO (linhas começam da direita) (MENOR)
  const rightLines = [
    { width: 110, top: 0, delay: 0 },      // Linha 1
    { width: 110, top: 10, delay: 0.1 },   // Linha 2 - igual à linha 1
    { width: 160, top: 20, delay: 0.2 },   // Linha 3 - avança mais (para esquerda)
    { width: 60, top: 30, delay: 0.3 },    // Linha 4 - recua mais que todas
    { width: 110, top: 40, delay: 0.4 },   // Linha 5 - igual à linha 1 e 2
  ];

  const lines = position === 'left' ? leftLines : rightLines;

  return (
    <div className={`absolute ${className}`} style={{ width: '170px', height: '50px' }}>
      {lines.map((line, index) => (
        <div
          key={index}
          className={`absolute h-[2px] bg-gold ${
            animated ? 'animate-slide-in' : ''
          }`}
          style={{
            width: `${line.width}px`,
            top: `${line.top}px`,
            // ESQUERDA: linhas começam em left:0
            // DIREITA: linhas começam em right:0 (espelhado)
            ...(position === 'left' 
              ? { left: 0 } 
              : { right: 0 }
            ),
            animationDelay: animated ? `${line.delay}s` : undefined,
            opacity: animated ? 0 : 1,
          } as CSSProperties}
        />
      ))}
    </div>
  );
}
