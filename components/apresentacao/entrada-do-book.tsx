'use client';

import { useState } from 'react';
import Image from 'next/image';

const CAMPO =
  'w-full rounded-2xl border border-white/20 bg-white/[0.08] px-4 py-4 text-center text-lg tracking-[0.2em] text-white outline-none backdrop-blur-sm placeholder:tracking-normal placeholder:text-white/50 focus:border-gold';
const BOTAO = 'block w-full rounded-2xl bg-gold-dark py-4 text-center text-base font-medium text-white transition active:scale-[0.98] disabled:opacity-60';

/** A foto da península ao pôr do sol atrás de tudo, e o azul por cima para o texto ficar legível */
function Fundo() {
  return (
    <div aria-hidden className="fixed inset-0 -z-10 overflow-hidden bg-navy">
      <Image src="/images/renders/hero-por-do-sol-retrato.jpg" alt="" fill priority sizes="(max-width: 767px) 100vw, 1px" quality={75} className="object-cover md:hidden" />
      <Image src="/images/renders/hero-por-do-sol.jpg" alt="" fill priority sizes="(min-width: 768px) 100vw, 1px" quality={75} className="hidden object-cover md:block" />
      <div className="absolute inset-0 bg-gradient-to-b from-navy/50 via-navy/70 to-navy" />
    </div>
  );
}

function Tela({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex min-h-dvh flex-col items-center px-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-[max(3rem,env(safe-area-inset-top))]">
      <Fundo />
      <Image src="/logos/Logotipo-VillaStradale branco.svg" alt="Villa Stradale" width={170} height={Math.round((170 * 129.46) / 258.69)} priority />
      <div className="flex w-full flex-1 items-center justify-center py-10">{children}</div>
    </main>
  );
}

const AVISO = {
  expirou: 'Seu acesso anterior terminou. Digite a senha de novo; se ela não funcionar, peça a nova a quem enviou o link.',
  cookies: 'Seu navegador não guardou o acesso. Libere os cookies deste site, ou abra o link em outro navegador, e digite a senha de novo.',
};

/** Quem copia a mensagem do WhatsApp cola o texto inteiro: no campo fica só o que vem depois de "Senha:" */
const soASenha = (texto: string) => texto.match(/senha\s*:\s*(.+?)\s*$/i)?.[1] ?? texto;

/** A senha que o usuário do app mandou junto com o link */
export function EntradaDoBook({
  codigo,
  enviadoPor,
  consulta,
  aviso,
}: {
  codigo: string;
  enviadoPor: string;
  /** a tela pedida no endereço, que segue para o book */
  consulta: string;
  aviso?: keyof typeof AVISO;
}) {
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [abrindo, setAbrindo] = useState(false);

  const abrir = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');
    setAbrindo(true);
    try {
      const resposta = await fetch('/api/book/entrar', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ codigo, senha }),
      });
      const j = await resposta.json();
      if (j.ok) {
        // navegação de verdade: o servidor só entrega o book com o cookie novo. A marca "entrou"
        // diz à página do book que, se o cookie não chegou, foi o navegador que recusou
        window.location.replace(`/book/${codigo}/ver${consulta ? `${consulta}&` : '?'}entrou=1`);
        return;
      }
      setErro(j.error);
    } catch {
      setErro('Não foi possível falar com o servidor. Confira a sua conexão.');
    }
    setAbrindo(false);
  };

  return (
    <Tela>
      <form onSubmit={abrir} className="w-full max-w-sm text-center">
        <p className="text-[11px] uppercase tracking-[0.35em] text-white/80">Apresentação</p>
        <h1 className="mt-2 font-heading text-4xl italic md:text-5xl">Book Digital</h1>
        {enviadoPor && <p className="mt-3 text-base text-white/75">Enviado por {enviadoPor}</p>}

        {aviso && (
          <p role="status" className="mt-8 rounded-2xl border border-white/15 bg-white/[0.08] px-4 py-3 text-sm text-white/85 backdrop-blur-sm">
            {AVISO[aviso]}
          </p>
        )}

        <label htmlFor="senha-do-book" className="mt-10 block text-sm text-white/80">
          Digite a senha que veio com o link
        </label>
        <input
          id="senha-do-book"
          type="text"
          required
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="none"
          spellCheck={false}
          enterKeyHint="go"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          onPaste={(e) => {
            const colado = e.clipboardData.getData('text');
            if (soASenha(colado) === colado) return;
            e.preventDefault();
            setSenha(soASenha(colado));
          }}
          className={`mt-3 ${CAMPO}`}
        />

        {erro && (
          <p role="alert" className="mt-3 text-sm text-gold">
            {erro}
          </p>
        )}

        <button type="submit" disabled={abrindo} className={`mt-5 ${BOTAO}`}>
          {abrindo ? 'Abrindo…' : 'Abrir o book'}
        </button>

        <p className="mt-8 text-xs leading-relaxed text-white/55">
          Quem enviou o link vê quando o book foi aberto, em que tipo de aparelho e quantas telas foram vistas. Não pedimos nem guardamos seu nome ou seu e-mail.
        </p>
      </form>
    </Tela>
  );
}

const MENSAGEM = {
  'nao-existe': { titulo: 'Link não encontrado', texto: 'Confira se o endereço chegou inteiro, ou peça o link de novo a quem enviou.' },
  desligado: { titulo: 'Este link foi desligado', texto: 'Fale com quem enviou o Book Digital para abrir de novo.' },
  'fora-do-ar': { titulo: 'Não foi possível abrir agora', texto: 'Tente de novo em instantes.' },
};

export function LinkIndisponivel({ motivo }: { motivo: keyof typeof MENSAGEM }) {
  const { titulo, texto } = MENSAGEM[motivo];
  return (
    <Tela>
      <div className="max-w-sm text-center">
        <h1 className="font-heading text-3xl italic">{titulo}</h1>
        <p className="mt-3 text-base text-white/75">{texto}</p>
        <a href="https://www.villastradale.com.br" className="mt-8 inline-block text-base text-gold underline underline-offset-4">
          Conheça o Villa Stradale
        </a>
      </div>
    </Tela>
  );
}
