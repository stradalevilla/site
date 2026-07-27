import Link from 'next/link';

const cards = [
  {
    href: '/admin/implantacao',
    titulo: 'Implantação',
    desc: 'Ajustar as marcações dos lotes sobre a imagem aérea.',
    ativo: true,
  },
  {
    href: '/admin/usuarios',
    titulo: 'Usuários',
    desc: 'Gerenciar quem tem acesso ao painel.',
    ativo: true,
  },
  {
    href: '/admin/lotes',
    titulo: 'Lotes',
    desc: 'Área e parâmetros urbanísticos de cada lote.',
    ativo: true,
  },
  {
    href: '#',
    titulo: 'Conteúdo',
    desc: 'Textos e imagens das seções do site. (Em breve)',
    ativo: false,
  },
];

export default function AdminInicio() {
  return (
    <div className="p-8 md:p-10">
      <h1 className="font-heading text-2xl uppercase tracking-wide text-navy md:text-3xl">
        Gestão do site
      </h1>
      <p className="mt-1 font-body text-sm text-gray-500">
        Escolha uma área para gerenciar.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) =>
          c.ativo ? (
            <Link
              key={c.titulo}
              href={c.href}
              className="group rounded-lg border border-neutral-200 bg-white p-5 transition-all hover:border-gold-dark hover:shadow-sm"
            >
              <p className="font-heading text-lg uppercase tracking-wide text-navy group-hover:text-gold-dark">
                {c.titulo}
              </p>
              <p className="mt-1 font-body text-sm text-gray-500">{c.desc}</p>
            </Link>
          ) : (
            <div
              key={c.titulo}
              className="rounded-lg border border-dashed border-neutral-300 bg-neutral-50 p-5"
            >
              <p className="font-heading text-lg uppercase tracking-wide text-gray-400">
                {c.titulo}
              </p>
              <p className="mt-1 font-body text-sm text-gray-400">{c.desc}</p>
            </div>
          )
        )}
      </div>
    </div>
  );
}
