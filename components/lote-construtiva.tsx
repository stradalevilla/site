import type { JanelaClose } from '@/components/lote-close';
import type { AreaConstrutivaLote } from '@/lib/lotes';

/** Cor padrão dos volumes sugeridos (o lilás das artes do arquiteto) */
export const COR_VOLUME_PADRAO = '#d9a8dc';

const pad = (n: number) => String(n).padStart(2, '0');

/**
 * Modo "Área construtiva": o lote com contorno navy vazado (a grama aparece),
 * o limite dos recuos em tracejado branco e os volumes sugeridos de
 * implantação — o mesmo desenho das artes do arquiteto, gerado ao vivo.
 */
export function LoteConstrutiva({
  numero,
  pontos,
  janela,
  desenho,
}: {
  numero: number;
  pontos: string;
  janela: JanelaClose;
  desenho: AreaConstrutivaLote;
}) {
  const u = janela.w / 400; // escala visual (mesma do LoteClose)

  return (
    <svg
      viewBox={`${janela.x} ${janela.y} ${janela.w} ${janela.h}`}
      className="h-auto w-full"
      role="img"
      aria-label={`Área construtiva permitida no lote ${pad(numero)}`}
    >
      <image
        href={janela.imagem}
        x={janela.x}
        y={janela.y}
        width={janela.w}
        height={janela.h}
        preserveAspectRatio="none"
      />

      {/* Divisa do lote: contorno navy, sem preenchimento */}
      <polygon
        points={pontos}
        fill="none"
        stroke="#023764"
        strokeWidth={1.6 * u}
        strokeLinejoin="round"
      />

      {/* Limite dos recuos (área onde se pode construir) */}
      {desenho.recuo && (
        <polygon
          points={desenho.recuo}
          fill="none"
          stroke="#ffffff"
          strokeWidth={1.4 * u}
          strokeDasharray={`${3.2 * u} ${2.4 * u}`}
          strokeLinejoin="round"
        />
      )}

      {/* Volumes sugeridos (casa, piscina, etc.) */}
      {desenho.volumes?.map((v, i) => (
        <polygon
          key={i}
          points={v.pontos}
          fill={v.cor || COR_VOLUME_PADRAO}
          fillOpacity={0.85}
          stroke="#ffffff"
          strokeWidth={0.8 * u}
          strokeLinejoin="round"
        />
      ))}
    </svg>
  );
}
