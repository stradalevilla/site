'use client';

import { useRef, useState } from 'react';

/**
 * MOV gravado em formato profissional não toca em todo aparelho: sem aviso, sobraria uma caixa
 * preta. A posição é guardada porque renovar o link troca o endereço e recomeçaria o filme.
 */
export function VideoDaApresentacao({ src }: { src: string }) {
  const [falhou, setFalhou] = useState(false);
  const posicao = useRef(0);

  return (
    <>
      <video
        src={src}
        controls
        playsInline
        preload="metadata"
        onError={() => setFalhou(true)}
        onTimeUpdate={(e) => {
          if (e.currentTarget.currentTime > 0) posicao.current = e.currentTarget.currentTime;
        }}
        onLoadedMetadata={(e) => {
          if (posicao.current > 0) e.currentTarget.currentTime = posicao.current;
        }}
        className="w-full rounded-2xl bg-black"
      />
      {falhou && (
        <p role="alert" className="text-center text-base text-[#F2A06A]">
          Este aparelho não conseguiu tocar o vídeo. Tente em outro, ou reenvie em MP4.
        </p>
      )}
    </>
  );
}
