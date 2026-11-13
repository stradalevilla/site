import { redirect } from 'next/navigation';
import { AvisoDeInstalacao } from '@/components/plataforma/aviso-de-instalacao';
import { FundoDoApp } from '@/components/plataforma/fundo-do-app';
import { Marca } from '@/components/plataforma/marca';
import { GradeDeIcones } from '@/components/plataforma/grade-de-icones';
import { usuarioLogado } from '@/lib/acesso';
import { criarSupabaseAdmin } from '@/lib/supabase/admin';
import { comoChamar, nomeDe } from '@/lib/usuarios';

export const dynamic = 'force-dynamic';

export default async function TelaInicial() {
  // o login e as contagens saem juntos: nada é mostrado antes de o login ser conferido
  const banco = criarSupabaseAdmin();
  const [user, { count }, { count: apresentacoes }] = await Promise.all([
    usuarioLogado(),
    banco.from('contatos').select('id', { count: 'exact', head: true }),
    banco.from('apresentacoes').select('id', { count: 'exact', head: true }),
  ]);
  if (!user) redirect('/entrar');
  const nome = comoChamar(nomeDe(user));

  return (
    <main className="mx-auto flex min-h-dvh max-w-3xl flex-col px-6 pb-[max(2rem,env(safe-area-inset-bottom))] pt-[max(2.5rem,env(safe-area-inset-top))]">
      <FundoDoApp />
      <header className="flex flex-col items-center text-center">
        <Marca />
        <h1 className="mt-8 font-heading text-3xl italic md:text-4xl">{nome ? `Olá, ${nome}` : 'Olá'}</h1>
        <p className="mt-2 text-base text-white/75">Sua plataforma Villa Stradale</p>
      </header>

      <div className="mt-auto space-y-4 pt-10">
        <AvisoDeInstalacao />
        <GradeDeIcones contatos={count} apresentacoes={apresentacoes} />
      </div>
    </main>
  );
}
