import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { ExternalLink, FileText } from 'lucide-react';
import { BOTAO, CARTAO } from '@/components/plataforma/estilos';
import { RemoverApresentacao } from '@/components/plataforma/remover-apresentacao';
import { RenovarLinks } from '@/components/plataforma/renovar-links';
import { TelaInterna } from '@/components/plataforma/tela-interna';
import { VideoDaApresentacao } from '@/components/plataforma/video-da-apresentacao';
import { usuarioLogado } from '@/lib/acesso';
import { BALDE, dataDaApresentacao, ROTULO_DO_TIPO, tamanhoLegivel, type Apresentacao } from '@/lib/apresentacoes';
import { criarSupabaseAdmin } from '@/lib/supabase/admin';
import { papelDe } from '@/lib/usuarios';

export const metadata: Metadata = { title: 'Apresentação' };
export const dynamic = 'force-dynamic';

/** Dura o bastante para ver um vídeo longo com a tela aberta */
const VALIDADE_S = 60 * 60 * 3;

export default async function ApresentacaoPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await usuarioLogado();
  if (!user) redirect('/entrar');

  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();

  const banco = criarSupabaseAdmin();
  const { data, error } = await banco.from('apresentacoes').select('*').eq('id', id).maybeSingle();
  if (error) {
    return (
      <TelaInterna titulo="Apresentação" voltar="/apresentacoes">
        <p className="pt-8 text-center text-base text-white/70">Não foi possível carregar. Tente de novo em instantes.</p>
      </TelaInterna>
    );
  }
  if (!data) notFound();
  const a = data as Apresentacao;

  // o link sai pronto do servidor: no iPhone, buscar o endereço depois do toque perde a permissão de abrir
  const assinado = a.caminho ? (await banco.storage.from(BALDE).createSignedUrl(a.caminho, VALIDADE_S)).data?.signedUrl : null;
  const destino = a.tipo === 'link' ? a.endereco : assinado;

  return (
    <TelaInterna titulo={a.titulo} voltar="/apresentacoes">
      <div className="space-y-4">
        {a.tipo === 'video' && assinado ? (
          <VideoDaApresentacao src={assinado} />
        ) : (
          <div className={`${CARTAO} flex flex-col items-center gap-3 px-4 py-10 text-center`}>
            <FileText size={40} strokeWidth={1.2} className="text-gold" aria-hidden />
            <p className="text-lg font-medium">{a.titulo}</p>
          </div>
        )}

        <p className="text-center text-sm text-white/60">
          {[ROTULO_DO_TIPO[a.tipo], tamanhoLegivel(a.tamanho), dataDaApresentacao(a.criado_em)].filter(Boolean).join(' · ')}
        </p>

        {destino ? (
          a.tipo !== 'video' && (
            // fora do endereço do app: no iPhone abre com botão de fechar, e a pessoa volta para cá
            <a href={destino} target="_blank" rel="noopener" className={`${BOTAO} flex items-center justify-center gap-2`}>
              <ExternalLink size={20} strokeWidth={1.6} aria-hidden />
              Abrir
            </a>
          )
        ) : (
          <p className="text-center text-base text-[#F2A06A]">Não foi possível abrir o arquivo. Tente de novo em instantes.</p>
        )}

        {papelDe(user) === 'administrador' && <RemoverApresentacao id={a.id} titulo={a.titulo} />}
      </div>
      {a.caminho && <RenovarLinks geradoEm={Date.now()} />}
    </TelaInterna>
  );
}
