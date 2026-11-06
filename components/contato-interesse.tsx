import Image from 'next/image';
import { FormularioInteresse } from '@/components/formulario-interesse';

export function ContatoInteresse() {
  return (
    <div className="bg-[#0a1929] px-8 md:px-12 lg:px-16 py-20 md:py-28">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        {/* Coluna esquerda - texto */}
        <div className="text-white">
          {/* Emblema */}
          <div data-surgir="subir" className="mb-6 flex justify-center md:justify-start">
            <Image
              src="/logos/Icone-VillaStradale claro.svg"
              alt="Villa Stradale"
              width={64}
              height={40}
              className="h-9 md:h-10 w-auto"
            />
          </div>

          {/* Overline */}
          <span data-surgir="subir" className="block font-heading italic font-thin text-sm md:text-base text-[#D07748] uppercase tracking-[0.35em] mb-6">
            Contato
          </span>

          {/* Título */}
          <h2 data-surgir="subir" className="font-heading font-light text-2xl md:text-3xl lg:text-4xl italic uppercase leading-tight mb-6">
            Registre<br />
            o seu interesse
          </h2>

          {/* Parágrafo */}
          <p data-surgir="subir" className="font-body text-sm md:text-base text-white/80 leading-relaxed max-w-xs">
            Cadastre-se e receba o contato do concierge da Bossa Nova Sotheby&apos;s
          </p>
        </div>

        {/* Coluna direita - formulário */}
        <FormularioInteresse />
      </div>
    </div>
  );
}
