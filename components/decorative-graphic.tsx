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
    // No celular o grafismo fica na metade: a foto ali é estreita, e no tamanho
    // cheio ele cobria quase metade dela
    <div className={`absolute h-[30px] w-[85px] md:h-[50px] md:w-[170px] ${className}`}>
      {lines.map((line, index) => (
        <div
          key={index}
          className={`absolute top-[calc(var(--topo)*0.6)] h-[1.5px] w-[calc(var(--largura)/2)] bg-gold md:top-[var(--topo)] md:h-[2px] md:w-[var(--largura)] ${
            animated ? 'animate-slide-in' : ''
          }`}
          style={{
            '--largura': `${line.width}px`,
            '--topo': `${line.top}px`,
            // ESQUERDA: linhas começam em left:0
            // DIREITA: linhas começam em right:0 (espelhado)
            ...(position === 'left' 
              ? { left: 0 } 
              : { right: 0 }
            ),
            animationDelay: animated ? `${line.delay}s` : undefined,
            opacity: animated ? 0 : 1,
          } as CSSProperties & Record<`--${string}`, string>}
        />
      ))}
    </div>
  );
}
