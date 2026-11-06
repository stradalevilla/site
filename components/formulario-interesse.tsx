'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { guardarOrigem, origemDoEnvio, TEXTO_DO_ACEITE } from '@/lib/contato';

const CAMPO =
  // 16px no celular: abaixo disso o iPhone amplia a página ao tocar no campo
  'w-full bg-transparent border border-white/30 text-white placeholder:text-white/50 font-body text-base px-5 py-4 outline-none focus:border-[#D07748] transition-colors';

/**
 * O formulário manda por fetch e fica na mesma página. method e action seguem no
 * <form> para o caso de o clique vir antes de o JavaScript carregar: sem eles, o
 * navegador colocaria nome, e-mail e telefone na URL.
 */
export function FormularioInteresse() {
  const [estado, setEstado] = useState<'parado' | 'enviando' | 'enviado' | 'corrigir' | 'erro'>('parado');

  useEffect(() => {
    guardarOrigem();
    // a volta do envio feito antes de o JavaScript carregar
    const volta = new URLSearchParams(window.location.search);
    if (volta.has('enviado')) setEstado('enviado');
    if (volta.has('erro')) setEstado('erro');
  }, []);

  async function enviar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const dados = new FormData(e.currentTarget);
    setEstado('enviando');
    try {
      const resposta = await fetch('/api/contato', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          nome: dados.get('nome'),
          email: dados.get('email'),
          telefone: dados.get('telefone'),
          aceite: dados.get('aceite') === 'on',
          site: dados.get('site'),
          pagina: window.location.pathname,
          origem: origemDoEnvio(),
          toques: navigator.maxTouchPoints,
        }),
      });
      if (resposta.status === 400) {
        setEstado('corrigir');
        return;
      }
      if (!resposta.ok) throw new Error();
      setEstado('enviado');
      // para o Tag Manager medir a conversão: nenhum dado da pessoa vai aqui
      (window as Window & { dataLayer?: object[] }).dataLayer?.push({ event: 'contato_enviado' });
    } catch {
      setEstado('erro');
    }
  }

  if (estado === 'enviado') {
    return (
      <p role="status" className="font-body text-base leading-relaxed text-white md:text-lg">
        Recebemos o seu interesse. O concierge da Bossa Nova Sotheby&apos;s entrará em contato.
      </p>
    );
  }

  return (
    <form data-surgir="subir" method="post" action="/api/contato" onSubmit={enviar} className="space-y-5">
      <input type="text" name="nome" placeholder="Nome" autoComplete="name" required maxLength={120} className={CAMPO} />
      <input
        type="email"
        name="email"
        placeholder="E-mail"
        autoComplete="email"
        required
        maxLength={160}
        pattern="[^@\s?&=%#]+@[^@\s?&=%#]+\.[^@\s?&=%#]+"
        title="Confira o e-mail: ele precisa terminar em algo como .com"
        className={CAMPO}
      />
      <input type="tel" name="telefone" placeholder="Telefone" autoComplete="tel" required minLength={8} maxLength={40} className={CAMPO} />

      {/* Isca para robôs: quem preenche isto não é gente */}
      <input type="text" name="site" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />

      {/* Consentimento */}
      <label className="flex items-start gap-3 cursor-pointer pt-1">
        <input type="checkbox" name="aceite" required className="mt-0.5 h-4 w-4 shrink-0 accent-[#D07748]" />
        <span className="font-body text-xs text-white/60 leading-relaxed">{TEXTO_DO_ACEITE}</span>
      </label>

      {(estado === 'erro' || estado === 'corrigir') && (
        <p role="alert" className="font-body text-sm text-[#F2A06A]">
          {estado === 'corrigir'
            ? 'Confira o e-mail e o telefone e envie de novo.'
            : 'Não foi possível enviar agora. Tente de novo em instantes.'}
        </p>
      )}

      {/* Botão */}
      <button
        type="submit"
        disabled={estado === 'enviando'}
        className="w-full bg-[#D07748] hover:bg-[#b8623a] disabled:opacity-60 text-white font-body text-base py-4 transition-colors"
      >
        {estado === 'enviando' ? 'Enviando' : 'Enviar'}
      </button>
    </form>
  );
}
