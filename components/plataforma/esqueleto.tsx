import Image from 'next/image';
import { CARTAO } from '@/components/plataforma/estilos';
import { Marca } from '@/components/plataforma/marca';
import { TelaInterna } from '@/components/plataforma/tela-interna';

/**
 * O que aparece no instante do toque, enquanto o servidor monta a tela: o cabeçalho de verdade e
 * cartões apagados no lugar do conteúdo. Nenhum dado do banco entra aqui.
 */
export function Esqueleto({ titulo, voltar = '/', cartoes = 5, destaque = false }: { titulo: string; voltar?: string; cartoes?: number; destaque?: boolean }) {
  return (
    <TelaInterna titulo={titulo} voltar={voltar}>
      <div className="space-y-2" aria-busy="true" aria-label="Carregando">
        {destaque && <div className="mb-2 aspect-[16/9] animate-pulse rounded-2xl bg-white/[0.06] md:aspect-[21/9]" />}
        {Array.from({ length: cartoes }, (_, i) => (
          <div key={i} className={`${CARTAO} flex items-center gap-4 p-4`}>
            <span className="h-11 w-11 shrink-0 animate-pulse rounded-xl bg-white/10" />
            <span className="flex-1 space-y-2">
              <span className="block h-4 w-2/3 animate-pulse rounded bg-white/10" />
              <span className="block h-3 w-1/3 animate-pulse rounded bg-white/[0.07]" />
            </span>
          </div>
        ))}
      </div>
    </TelaInterna>
  );
}

/** A casca da tela inicial: a foto e o logotipo, sem os filmes, que entram com a tela de verdade */
export function EsqueletoDaInicial() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-3xl flex-col items-center px-6 pt-[max(2.5rem,env(safe-area-inset-top))]">
      <div aria-hidden className="fixed inset-0 -z-10 overflow-hidden bg-navy">
        <Image src="/images/renders/hero-peninsula-v2-retrato.jpg" alt="" fill priority sizes="(max-width: 767px) 100vw, 1px" quality={75} className="object-cover object-top md:hidden" />
        <Image src="/images/renders/hero-peninsula-v2.jpg" alt="" fill sizes="(min-width: 768px) 100vw, 1px" quality={75} className="hidden object-cover md:block" />
        <div className="absolute inset-0 bg-gradient-to-b from-navy/55 via-navy/70 to-navy" />
      </div>
      <Marca />
    </main>
  );
}

/** O book: o mesmo azul do leitor, para o toque já levar à tela da apresentação */
export function EsqueletoDoBook() {
  return <div className="fixed inset-0 z-50 bg-navy" aria-busy="true" aria-label="Carregando o Book Digital" />;
}
