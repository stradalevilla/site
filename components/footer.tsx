import Image from 'next/image';
import Link from 'next/link';
import { IconBrandInstagram, IconBrandLinkedin, IconLock } from '@tabler/icons-react';
import { INSTAGRAM } from '@/lib/menu';

export function Footer() {
  return (
    <footer className="w-full bg-[#0a1929] text-white">
      <div className="container mx-auto px-4 md:px-8 py-16 md:py-20">
        {/* Topo - redes sociais + logos */}
        <div className="flex flex-col gap-12 lg:flex-row lg:items-center lg:justify-between">
          {/* Redes sociais */}
          {/* centrados até o tablet; no computador, o recuo alinha o desenho do ícone,
              e não a caixa de toque, com o texto legal */}
          <div data-surgir="subir" className="flex items-center justify-center gap-2 text-white/80 lg:-ml-1.5 lg:justify-start">
            <a
              href={INSTAGRAM}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="inline-flex h-12 w-12 items-center justify-center transition-colors hover:text-white"
            >
              <IconBrandInstagram size={36} stroke={1.25} />
            </a>
            {/* Ainda sem página: visível, sem clique, como os itens do menu */}
            <span
              role="img"
              aria-label="LinkedIn, ainda sem página"
              className="inline-flex h-12 w-12 cursor-default items-center justify-center text-white/30"
            >
              <IconBrandLinkedin size={36} stroke={1.25} />
            </span>
          </div>

          {/* Grupos de logos */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-12 lg:gap-20">
            {/* Comercialização */}
            <div data-surgir="subir" className="flex flex-col items-center gap-4">
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
            <div data-surgir="subir" className="flex flex-col items-center gap-4">
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
        <p data-surgir="fade" className="mt-14 md:mt-16 font-body text-[11px] leading-relaxed text-white/50 w-full">
          VILLA STRADALE PENÍNSULA. Loteamento registrado sob o R.07 da matrícula nº 24.816 do
          Registro de Imóveis da Comarca de Piracaia – SP. Loteadora: Stradale Empreendimentos
          Imobiliários SPE Ltda. – CNPJ nº 41.344.921/0001-59. Intermediação: Bossa Nova
          Sotheby’s International Realty, nome fantasia de X3 Real Estate Imobiliária e
          Participação Ltda. – CNPJ nº 19.834.438/0001-01 – CRECI/SP nº 027212-J. Comercialização
          não exclusiva. Imagens meramente ilustrativas.
        </p>

        {/* Rodapé inferior */}
        <div data-surgir="fade" className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link
            href="/politica-de-privacidade"
            className="inline-flex min-h-[44px] items-center font-body text-xs text-white/60 transition-colors hover:text-white"
          >
            Política de Privacidade
          </Link>
          <div className="flex items-center gap-5">
            <span className="font-body text-xs text-white/60">Desenvolvido por rfill.co</span>
            {/* Acesso discreto ao painel de gestão. Recarrega de propósito: com
                <Link> o Tag Manager que já roda no site entraria junto no painel. */}
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a
              href="/admin"
              aria-label="Área restrita"
              title="Área restrita"
              className="-m-2.5 inline-flex h-11 w-11 items-center justify-center text-white/25 transition-colors hover:text-white/70"
            >
              <IconLock size={16} stroke={1.5} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
