import Image from 'next/image';
import Link from 'next/link';
import { IconBrandInstagram, IconBrandLinkedin, IconLock } from '@tabler/icons-react';

export function Footer() {
  return (
    <footer className="w-full bg-[#0a1929] text-white">
      <div className="container mx-auto px-4 md:px-8 py-16 md:py-20">
        {/* Topo - redes sociais + logos */}
        <div className="flex flex-col gap-12 lg:flex-row lg:items-center lg:justify-between">
          {/* Redes sociais */}
          <div className="flex items-center gap-4 text-white/80">
            <a href="#" aria-label="Instagram" className="hover:text-white transition-colors">
              <IconBrandInstagram size={24} stroke={1.5} />
            </a>
            <a href="#" aria-label="LinkedIn" className="hover:text-white transition-colors">
              <IconBrandLinkedin size={24} stroke={1.5} />
            </a>
          </div>

          {/* Grupos de logos */}
          <div className="flex flex-col sm:flex-row items-center gap-12 lg:gap-20">
            {/* Comercialização */}
            <div className="flex flex-col items-center gap-4">
              <span className="font-body text-xs text-white/60 tracking-wide">Comercialização</span>
              <Image
                src="/images/footer/logo sothebys.png"
                alt="Bossa Nova Sotheby's International Realty"
                width={670}
                height={139}
                className="h-12 md:h-14 w-auto"
              />
            </div>

            {/* Realização e Incorporação */}
            <div className="flex flex-col items-center gap-4">
              <span className="font-body text-xs text-white/60 tracking-wide">
                Realização e Incorporação
              </span>
              <Image
                src="/images/footer/logo stradale.png"
                alt="Villa Stradale Península"
                width={400}
                height={206}
                className="h-16 md:h-20 w-auto"
              />
            </div>
          </div>
        </div>

        {/* Texto legal */}
        <p className="mt-14 md:mt-16 font-body text-[11px] leading-relaxed text-white/50 w-full">
          O Empreendimento Condomínio Villavista Falésia, constituído na forma da Lei 6766/79,
          encontra-se registrado sob o R.5 na matrícula n. 3899 do Ofício de Registro de Imóveis da
          Comarca de Porto Seguro – BA, sob regime de incorporação de Condomínio de Lotes, acompanha
          de Licença de Implantação nº 00489/2024 Processo 567/2024 e Licença Ambiental – LI
          0175/2024, ambas expedidas pela Prefeitura de Porto Seguro – BA, das plantas
          arquitetônicas, do ART nº BA20240869, quadros da Norma Técnica da ABNT NBR 12721, Parecer
          técnico nº 121/2024/ETPS-BA/PHAN-BA. Imóvel de propriedade do Real Estate Bosso Fundo de
          Investimento Imobiliário. (CNPJ nº 43.565.147/0001-31). Intermediação e Comercialização:
          Bossa Nova Sotheby&apos;s International Realty. Alameda Gabriel Monteiro da Silva, 827 -
          Jardim Europa - CEP 0144-001 - Tel.: 3061-0000 - São Paulo (SP). Creci: 27212. Todas as
          imagens são meramente ilustrativas.
        </p>

        {/* Rodapé inferior */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <a href="#" className="font-body text-xs text-white/60 hover:text-white transition-colors">
            Política de Privacidade
          </a>
          <div className="flex items-center gap-5">
            <span className="font-body text-xs text-white/60">Desenvolvido por rfill.co</span>
            {/* Acesso discreto ao painel de gestão */}
            <Link
              href="/admin"
              aria-label="Área restrita"
              title="Área restrita"
              className="text-white/25 transition-colors hover:text-white/70"
            >
              <IconLock size={16} stroke={1.5} />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
