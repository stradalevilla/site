/**
 * As telas de abertura do iPhone e do iPad. O iOS só mostra a imagem cujo tamanho bate
 * exatamente com o aparelho: modelo novo fora da lista abre no azul do app, sem imagem.
 * Os arquivos saem de scripts/gerar-aberturas.mjs.
 */
const APARELHOS: [largura: number, altura: number, densidade: number][] = [
  [440, 956, 3],
  [430, 932, 3],
  [428, 926, 3],
  [420, 912, 3],
  [414, 896, 3],
  [414, 896, 2],
  [402, 874, 3],
  [393, 852, 3],
  [390, 844, 3],
  [375, 812, 3],
  [375, 667, 2],
  [1032, 1376, 2],
  [1024, 1366, 2],
  [834, 1210, 2],
  [834, 1194, 2],
  [820, 1180, 2],
  [810, 1080, 2],
  [768, 1024, 2],
  [744, 1133, 2],
];

export const TELAS_DE_ABERTURA = APARELHOS.map(([largura, altura, densidade]) => ({
  url: `/aplicativo/abertura/${largura * densidade}x${altura * densidade}.png`,
  media: `(device-width: ${largura}px) and (device-height: ${altura}px) and (-webkit-device-pixel-ratio: ${densidade}) and (orientation: portrait)`,
}));
