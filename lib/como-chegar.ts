/**
 * O ponto do Villa Stradale para quem chega de carro (Waze, Google Maps) e pelo ar. É o pino
 * provisório do Maps que o Pedro passou em 18/11/2026 (chamado 04.14): quando o definitivo
 * chegar, muda só aqui.
 */
export const PINO = { latitude: -22.977696, longitude: -46.377634 };

export const LINK_DO_WAZE = `https://waze.com/ul?ll=${PINO.latitude},${PINO.longitude}&navigate=yes`;
export const LINK_DO_GOOGLE_MAPS = 'https://maps.app.goo.gl/uWrp7sjZFwftPrLF9';

/** Graus, minutos e segundos, como o piloto lança no GPS do helicóptero */
function emGraus(valor: number, positivo: string, negativo: string) {
  const absoluto = Math.abs(valor);
  const graus = Math.floor(absoluto);
  const minutosInteiros = (absoluto - graus) * 60;
  const minutos = Math.floor(minutosInteiros);
  const segundos = ((minutosInteiros - minutos) * 60).toFixed(1);
  return `${graus}°${String(minutos).padStart(2, '0')}'${segundos.padStart(4, '0')}"${valor < 0 ? negativo : positivo}`;
}

export const COORDENADAS_EM_GRAUS = `${emGraus(PINO.latitude, 'N', 'S')} ${emGraus(PINO.longitude, 'E', 'W')}`;
export const COORDENADAS_DECIMAIS = `${PINO.latitude}, ${PINO.longitude}`;
