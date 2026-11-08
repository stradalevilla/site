// Prepara para tela as imagens do Book Digital que não existem no site. Elas saem do PDF
// digital do book (Z:\04_Villa_Stradale\04_79_Book_Digital), já em RGB, extraídas por número
// de objeto com PyMuPDF numa pasta à parte. O que o site já tem não passa por aqui: a
// apresentação usa a imagem do site.
//
//   node scripts/book-digital-imagens.mjs <pasta com as imagens extraídas>
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const ORIGEM = process.argv[2];
if (!ORIGEM || !fs.existsSync(ORIGEM)) {
  console.error('uso: node scripts/book-digital-imagens.mjs <pasta com as imagens extraídas>');
  process.exit(1);
}
const DESTINO = path.join('public', 'midia', 'book-digital');
fs.mkdirSync(DESTINO, { recursive: true });

// nome no site <- objeto no PDF, com o lado maior em pixels e a qualidade
const IMAGENS = {
  'capa': ['x675', 2400, 80],
  'papel-creme': ['x561', 2200, 72],
  'papel-claro': ['x579', 2200, 72],
  'estrada-aerea': ['x14', 2400, 80],
  'casal-no-carro': ['x18', 1600, 80],
  'portaria-chegada': ['x23', 2752, 80],
  'leme-pai-e-filha': ['x42', 2400, 80],
  'leme-veleiro': ['x44', 1400, 80],
  'veleiro-entardecer': ['x49', 2752, 80],
  'wakeboard-pier': ['x56', 2200, 80],
  'lancha-wake': ['x58', 1600, 80],
  'wake-represa': ['x60', 1600, 80],
  'kitesurf-margem': ['x74', 2752, 80],
  'kitesurf': ['x81', 1400, 80],
  'jet-ski-casal': ['x83', 1600, 80],
  'jet-ski': ['x85', 1600, 80],
  'piscina-descanso': ['x90', 2752, 80],
  'mao-na-agua': ['x102', 2752, 80],
  'spa-vapor': ['x109', 2752, 80],
  'academia-corredor': ['x116', 2200, 80],
  'academia-alongamento': ['x120', 1600, 80],
  'academia-bike': ['x122', 1600, 80],
  'corrida-margem': ['x127', 2752, 80],
  'quadras-aerea': ['x134', 2752, 80],
  'tenis-casal': ['x143', 1800, 80],
  'raquete': ['x139', 1600, 80],
  'saque': ['x141', 1600, 80],
  'horta-aerea': ['x148', 2752, 80],
  'horta-mae-e-filha': ['x152', 2752, 80],
  'whisky': ['x162', 2200, 80],
  'bar-restaurante': ['x164', 1800, 80],
  'pes-na-grama': ['x169', 2752, 80],
  'menino-bola': ['x181', 2400, 80],
  'playground-familia': ['x179', 1800, 80],
  'heliponto': ['x197', 2752, 80],
  'lancha-cachoeira': ['x204', 2752, 80],
  'cachoeira-aerea': ['x209', 2752, 80],
  'bike-trilha': ['x216', 2752, 80],
  'cavalgada': ['x221', 2000, 80],
  'botas': ['x223', 1200, 80],
  'casal-a-cavalo': ['x225', 1200, 80],
  'reserva-campo': ['x238', 1800, 80],
  'utv-por-do-sol': ['x236', 1800, 80],
  'utv-casal': ['x240', 1800, 80],
  'fogueira': ['x245', 2752, 80],
  'veleiro-crepusculo': ['x250', 2752, 80],
  'papel-azul': ['x627', 2200, 74],
  'desenho-projeto': ['x258', 2400, 80],
  'aerea-lotes': ['x264', 2752, 80],
  'papel-branco': ['x275', 2200, 72],
  'peninsula-vertical': ['x277', 2400, 80],
  'cartao': ['x632', 2200, 72],
  'masterplan': ['x302', 2752, 82],
  'papel-diferenciais': ['x643', 2200, 72],
  'desenho-diferenciais': ['x461', 2752, 80],
  'papel-pedro': ['x488', 2200, 72],
  'croqui-regiao': ['x537', 2752, 82],
  'piracaia-1': ['x554', 900, 80],
  'piracaia-2': ['x550', 900, 80],
  'piracaia-3': ['x552', 900, 80],
};

for (const [nome, [objeto, lado, qualidade]] of Object.entries(IMAGENS)) {
  const arquivo = fs.readdirSync(ORIGEM).find((f) => f.startsWith(`${objeto}.`));
  if (!arquivo) throw new Error(`não achei ${objeto} em ${ORIGEM}`);
  const saida = path.join(DESTINO, `${nome}.jpg`);
  const info = await sharp(path.join(ORIGEM, arquivo))
    .resize({ width: lado, height: lado, fit: 'inside', withoutEnlargement: true, kernel: 'lanczos3' })
    .toColourspace('srgb')
    .jpeg({ quality: qualidade, mozjpeg: true, progressive: true })
    .toFile(saida);
  console.log(nome.padEnd(20), `${info.width}x${info.height}`, `${Math.round(info.size / 1024)} KB`);
}
