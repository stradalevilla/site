'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { criarSupabaseNavegador } from '@/lib/supabase/client';

const links = [
  { href: '/admin', label: 'Início', exato: true },
  { href: '/admin/implantacao', label: 'Implantação' },
  { href: '/admin/lotes', label: 'Lotes' },
  { href: '/admin/usuarios', label: 'Usuários' },
  { href: '/admin/senha', label: 'Trocar senha' },
];

export function AdminShell({ email, children }: { email: string; children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const sair = async () => {
    await criarSupabaseNavegador().auth.signOut();
    router.replace('/admin/login');
    router.refresh();
  };

  return (
    // h-screen + overflow-hidden: o painel ocupa exatamente a janela e cada
    // área (menu, lista, conteúdo) rola por conta própria
    <div className="flex h-screen overflow-hidden bg-neutral-100 text-navy">
      <aside className="flex w-56 shrink-0 flex-col overflow-y-auto border-r border-neutral-200 bg-white">
        <div className="border-b border-neutral-200 px-5 py-5">
          <p className="font-heading text-lg uppercase tracking-wide text-navy">Villa Stradale</p>
          <p className="mt-0.5 font-body text-[10px] uppercase tracking-[0.2em] text-gray-400">
            Gestão do site
          </p>
        </div>

        <nav className="flex-1 p-3">
          {links.map((l) => {
            const ativo = l.exato ? pathname === l.href : pathname.startsWith(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`block rounded px-3 py-2 font-body text-sm transition-colors ${
                  ativo ? 'bg-navy text-white' : 'text-navy hover:bg-neutral-100'
                }`}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-neutral-200 p-3">
          <p className="truncate px-3 pb-2 font-body text-[11px] text-gray-500" title={email}>
            {email}
          </p>
          <button
            onClick={sair}
            className="w-full rounded px-3 py-2 text-left font-body text-sm text-red-600 transition-colors hover:bg-red-50"
          >
            Sair
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
