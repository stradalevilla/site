import { getImageProps } from 'next/image';
import ReactDOM from 'react-dom';
import type { Tela } from '@/lib/book-digital';

/**
 * A capa do book começa a baixar junto com a página, e não só depois que o JavaScript acorda.
 * Pede exatamente a mesma imagem que a capa vai mostrar (mesma qualidade e mesmas larguras):
 * metade da tela com ela deitada, a tela toda com o celular em pé.
 */
export function preCarregarCapa(telas: Tela[], tela: string | string[] | undefined) {
  const capa = telas[0]?.imagens[0];
  if (!capa || (typeof tela === 'string' && tela !== '1')) return;
  const { props } = getImageProps({ src: capa.src, alt: '', fill: true, sizes: '(max-aspect-ratio: 19/20) 100vw, 50vw', quality: 90 });
  ReactDOM.preload(props.src, { as: 'image', imageSrcSet: props.srcSet, imageSizes: props.sizes, fetchPriority: 'high' });
}
