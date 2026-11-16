import { CircleDashed, DoorOpen, Heart, Link2, Megaphone, Search, Sparkles, Users, X, type LucideIcon } from 'lucide-react';
import type { Origem } from '@/lib/origem';

/**
 * As origens dos contatos explicadas para quem nunca ouviu falar de UTM: o ícone de cada uma
 * e uma frase do tamanho de uma criança de 10 anos entender. A regra que decide a origem
 * fica em lib/origem.ts; aqui é só como ela aparece no app.
 */

export const ICONE_DA_ORIGEM: Record<Origem, LucideIcon> = {
  direto: DoorOpen,
  social: Heart,
  pago: Megaphone,
  organico: Search,
  IA: Sparkles,
  referencia: Link2,
};

/** Para o filtro "Todos" e para contato sem origem gravada */
export const ICONE_DE_TODOS = Users;
export const ICONE_SEM_ORIGEM = CircleDashed;

export const EXPLICACAO_DA_ORIGEM: Record<Origem, { titulo: string; texto: string; lembrete?: string }> = {
  direto: {
    titulo: 'Direto',
    texto:
      'A pessoa entrou no site sem deixar pista de onde veio. Ela pode ter digitado o endereço, usado um favorito ou aberto um link que alguém mandou pelo WhatsApp, que não conta de onde a pessoa veio.',
  },
  social: {
    titulo: 'Social',
    texto: 'A pessoa estava numa rede social, como o Instagram, viu o perfil ou um post do Villa Stradale e tocou no link. Não foi anúncio.',
  },
  pago: {
    titulo: 'Pago',
    texto: 'A pessoa viu um anúncio, uma propaganda que o Villa Stradale paga para aparecer no Google, no Instagram ou no Facebook. Ela tocou no anúncio e chegou ao site.',
    lembrete: 'Quem tocou num anúncio continua contando como Pago por 30 dias naquele celular ou computador, mesmo se voltar depois por outro caminho.',
  },
  organico: {
    titulo: 'Orgânico',
    texto: 'A pessoa procurou alguma coisa no Google, ou em outro site de busca, e achou o Villa Stradale nos resultados comuns, sem ser anúncio.',
  },
  IA: {
    titulo: 'IA',
    texto: 'A pessoa conversou com um assistente de inteligência artificial, como o ChatGPT ou o Gemini, e ele mostrou o link do site.',
  },
  referencia: {
    titulo: 'Referência',
    texto: 'A pessoa tocou num link que estava em outro lugar: outro site, um e-mail ou um QR code.',
  },
};

export const EXPLICACAO_DE_TODOS =
  'Cada pessoa que deixou o contato chegou ao site por um caminho. O desenho ao lado do nome mostra qual foi:';

/** A ordem em que as origens aparecem na explicação geral: das mais comuns às mais raras */
export const ORDEM_DAS_ORIGENS: Origem[] = ['social', 'pago', 'direto', 'organico', 'IA', 'referencia'];

export const quantosContatos = (n: number) => (n === 1 ? '1 contato' : `${n} contatos`);

const CORES = {
  escuro: {
    caixa: 'rounded-2xl border border-white/10 bg-white/[0.06]',
    selo: 'bg-white/10 text-gold',
    titulo: '',
    texto: 'text-white/80',
    apoio: 'text-white/60',
    fraco: 'text-white/50',
    fechar: 'text-white/60 active:bg-white/10',
  },
  claro: {
    caixa: 'rounded border border-neutral-200 bg-white',
    selo: 'bg-[#D07748]/10 text-[#b9653a]',
    titulo: 'text-navy',
    texto: 'text-navy/80',
    apoio: 'text-gray-500',
    fraco: 'text-gray-400',
    fechar: 'text-gray-500 hover:bg-neutral-100',
  },
};

/**
 * O que cada origem quer dizer, em palavras simples. Com uma origem escolhida, a explicação
 * dela; em "Todos", a de todas, com quantos contatos cada uma tem. O mesmo texto no app
 * (tema escuro) e no painel do site (tema claro).
 */
export function ExplicacaoDaOrigem({
  origem,
  contagem,
  fechar,
  tema = 'escuro',
}: {
  origem: Origem | null;
  contagem: Partial<Record<Origem, number>>;
  fechar: () => void;
  tema?: keyof typeof CORES;
}) {
  const cor = CORES[tema];
  const Icone = origem ? ICONE_DA_ORIGEM[origem] : ICONE_DE_TODOS;
  const explicacao = origem ? EXPLICACAO_DA_ORIGEM[origem] : null;
  return (
    <section id="explicacao-da-origem" aria-live="polite" className={`${cor.caixa} relative p-5`}>
      <button type="button" onClick={fechar} aria-label="Fechar a explicação" className={`absolute right-2 top-2 flex h-10 w-10 items-center justify-center rounded-full ${cor.fechar}`}>
        <X size={18} aria-hidden />
      </button>
      <div className="flex items-center gap-3 pr-10">
        <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${cor.selo}`}>
          <Icone size={20} strokeWidth={1.6} aria-hidden />
        </span>
        <h2 className={`text-base font-medium ${cor.titulo}`}>{explicacao ? explicacao.titulo : 'De onde as pessoas vieram'}</h2>
      </div>

      {explicacao ? (
        <>
          <p className={`mt-3 text-[15px] leading-relaxed ${cor.texto}`}>{explicacao.texto}</p>
          {explicacao.lembrete && <p className={`mt-3 text-sm leading-relaxed ${cor.apoio}`}>{explicacao.lembrete}</p>}
        </>
      ) : (
        <>
          <p className={`mt-3 text-[15px] leading-relaxed ${cor.texto}`}>{EXPLICACAO_DE_TODOS}</p>
          <ul className="mt-4 grid gap-4 md:grid-cols-2">
            {ORDEM_DAS_ORIGENS.map((o) => {
              const IconeDaVez = ICONE_DA_ORIGEM[o];
              const n = contagem[o] ?? 0;
              return (
                <li key={o} className="flex gap-3">
                  <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${cor.selo}`}>
                    <IconeDaVez size={18} strokeWidth={1.6} aria-hidden />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className={`block text-sm font-medium ${cor.titulo}`}>
                      {EXPLICACAO_DA_ORIGEM[o].titulo}
                      <span className={`font-normal ${cor.fraco}`}> · {n ? quantosContatos(n) : 'ninguém ainda'}</span>
                    </span>
                    <span className={`mt-0.5 block text-sm leading-relaxed ${cor.apoio}`}>{EXPLICACAO_DA_ORIGEM[o].texto}</span>
                  </span>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </section>
  );
}
