import Image from 'next/image';

export function ContatoInteresse() {
  return (
    <div className="bg-[#0a1929] px-8 md:px-12 lg:px-16 py-20 md:py-28">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        {/* Coluna esquerda - texto */}
        <div className="text-white">
          {/* Emblema */}
          <div className="mb-6">
            <Image
              src="/logos/Icone-VillaStradale claro.svg"
              alt="Villa Stradale"
              width={64}
              height={40}
              className="h-9 md:h-10 w-auto"
            />
          </div>

          {/* Overline */}
          <span className="block font-heading italic font-thin text-sm md:text-base text-[#D07748] uppercase tracking-[0.35em] mb-6">
            Contato
          </span>

          {/* Título */}
          <h2 className="font-heading font-light text-2xl md:text-3xl lg:text-4xl italic uppercase leading-tight mb-6">
            Registre<br />
            o seu interesse
          </h2>

          {/* Parágrafo */}
          <p className="font-body text-sm md:text-base text-white/80 leading-relaxed max-w-xs">
            Cadastre-se e receba o contato do concierge da Bossa Nova Sotheby&apos;s
          </p>
        </div>

        {/* Coluna direita - formulário */}
        <form className="space-y-5">
          <input
            type="text"
            name="nome"
            placeholder="Nome"
            className="w-full bg-transparent border border-white/30 text-white placeholder:text-white/50 font-body text-sm md:text-base px-5 py-4 outline-none focus:border-[#D07748] transition-colors"
          />
          <input
            type="email"
            name="email"
            placeholder="E-mail"
            className="w-full bg-transparent border border-white/30 text-white placeholder:text-white/50 font-body text-sm md:text-base px-5 py-4 outline-none focus:border-[#D07748] transition-colors"
          />
          <input
            type="tel"
            name="telefone"
            placeholder="Telefone"
            className="w-full bg-transparent border border-white/30 text-white placeholder:text-white/50 font-body text-sm md:text-base px-5 py-4 outline-none focus:border-[#D07748] transition-colors"
          />

          {/* Consentimento */}
          <label className="flex items-start gap-3 cursor-pointer pt-1">
            <input
              type="checkbox"
              name="consentimento"
              className="mt-0.5 h-4 w-4 shrink-0 accent-[#D07748]"
            />
            <span className="font-body text-xs text-white/60 leading-relaxed">
              Declaro que li e concordo com a Política de privacidade e e Termos de Usos, incluindo
              consulta ao SCR.
            </span>
          </label>

          {/* Botão */}
          <button
            type="submit"
            className="w-full bg-[#D07748] hover:bg-[#b8623a] text-white font-body text-base py-4 transition-colors"
          >
            Enviar
          </button>
        </form>
      </div>
    </div>
  );
}
