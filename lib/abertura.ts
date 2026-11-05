import type { CSSProperties } from 'react';

/** A vez do elemento na abertura da página: ver [data-abertura] em globals.css */
export const vez = (ordem: number) => ({ '--ordem': ordem }) as CSSProperties;
