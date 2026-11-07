import Link from 'next/link';
import { Globe, Presentation, Settings, UsersRound, type LucideIcon } from 'lucide-react';

const CARTAO =
  'flex aspect-square flex-col items-center justify-center gap-3 rounded-[28px] border border-white/10 bg-white/[0.07] p-3 text-center backdrop-blur-md transition duration-150 active:scale-[0.96] active:bg-white/[0.14] md:hover:bg-white/[0.12] [-webkit-touch-callout:none] select-none';

function Conteudo({ Icone, titulo, detalhe }: { Icone: LucideIcon; titulo: string; detalhe?: string }) {
  return (
    <>
      <Icone size={34} strokeWidth={1.3} className="text-gold" aria-hidden />
      <span>
        <span className="block text-base font-medium">{titulo}</span>
        {detalhe && <span className="mt-0.5 block text-xs text-white/60">{detalhe}</span>}
      </span>
    </>
  );
}

/** Contagem que não veio fica de fora: "0 contatos" numa falha do banco pareceria perda de dados */
const quantos = (n: number | null, um: string, varios: string) => (n === null ? undefined : n === 1 ? `1 ${um}` : `${n} ${varios}`);

export function GradeDeIcones({ contatos, apresentacoes }: { contatos: number | null; apresentacoes: number | null }) {
  return (
    <nav aria-label="Áreas da plataforma" className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {/* fora do app: abre o navegador, com botão de fechar para voltar */}
      <a href="https://www.villastradale.com.br" target="_blank" rel="noopener" className={CARTAO}>
        <Conteudo Icone={Globe} titulo="Site" />
      </a>
      <Link href="/contatos" className={CARTAO}>
        <Conteudo Icone={UsersRound} titulo="Contatos" detalhe={quantos(contatos, 'contato', 'contatos')} />
      </Link>
      <Link href="/apresentacoes" className={CARTAO}>
        <Conteudo Icone={Presentation} titulo="Apresentações" detalhe={quantos(apresentacoes, 'arquivo', 'arquivos')} />
      </Link>
      <Link href="/configuracoes" className={CARTAO}>
        <Conteudo Icone={Settings} titulo="Configurações" />
      </Link>
    </nav>
  );
}
