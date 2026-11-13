'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check, Copy, ExternalLink, Monitor, Send, Smartphone, Tablet, Tv, type LucideIcon } from 'lucide-react';
import { BOTAO, BOTAO_SECUNDARIO, CAMPO, CARTAO } from '@/components/plataforma/estilos';
import type { Aparelho, VisitaDoBook } from '@/lib/book-compartilhado';

export type AcessosDaEquipe = { id: string; nome: string; ativo: boolean; acessos: number; ultimo: string | null }[] | null;

const ICONE: Record<Aparelho, LucideIcon> = { celular: Smartphone, tablet: Tablet, computador: Monitor, tv: Tv };
const NOME_DO_APARELHO: Record<Aparelho, string> = { celular: 'Celular', tablet: 'Tablet', computador: 'Computador', tv: 'TV' };

const LETRAS_DA_SENHA = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
function sugerirSenha() {
  const sorteio = crypto.getRandomValues(new Uint32Array(6));
  return Array.from(sorteio, (n) => LETRAS_DA_SENHA[n % LETRAS_DA_SENHA.length]).join('');
}

const FUSO = 'America/Sao_Paulo';
const dia = (d: Date) => new Intl.DateTimeFormat('en-CA', { timeZone: FUSO }).format(d);
function quando(iso: string) {
  const d = new Date(iso);
  const hora = new Intl.DateTimeFormat('pt-BR', { timeZone: FUSO, hour: '2-digit', minute: '2-digit' }).format(d);
  const hoje = new Date();
  if (dia(d) === dia(hoje)) return `Hoje, ${hora}`;
  if (dia(d) === dia(new Date(hoje.getTime() - 864e5))) return `Ontem, ${hora}`;
  return `${new Intl.DateTimeFormat('pt-BR', { timeZone: FUSO, day: '2-digit', month: '2-digit' }).format(d)}, ${hora}`;
}

function duracao(segundos: number) {
  const minutos = Math.round(segundos / 60);
  if (minutos < 1) return 'menos de 1 min';
  if (minutos < 60) return `${minutos} min`;
  return `${Math.floor(minutos / 60)} h ${String(minutos % 60).padStart(2, '0')} min`;
}

const semProtocolo = (endereco: string) => endereco.replace(/^https?:\/\/(www\.)?/, '');

export function CompartilharBook({
  administrador,
  endereco,
  senhaInicial,
  ativoInicial,
  visitas,
  totalDeVisitas,
  totalDeTelas,
  equipe,
}: {
  administrador: boolean;
  endereco: string;
  senhaInicial: string;
  ativoInicial: boolean;
  visitas: VisitaDoBook[];
  totalDeVisitas: number;
  totalDeTelas: number;
  equipe: AcessosDaEquipe;
}) {
  const router = useRouter();
  const [senha, setSenha] = useState(senhaInicial);
  const [ativo, setAtivo] = useState(ativoInicial);
  const [copiado, setCopiado] = useState<'' | 'link' | 'mensagem'>('');
  const [trocando, setTrocando] = useState(false);
  const [novaSenha, setNovaSenha] = useState('');
  const [aviso, setAviso] = useState({ texto: '', ok: false });
  const [salvando, setSalvando] = useState(false);

  const mensagem = `Olá! Este é o Book Digital do Villa Stradale:\n${endereco}\n\nSenha: ${senha}`;

  // quem volta para o app depois de um tempo fora vê os acessos que chegaram nesse meio tempo.
  // Uma olhada rápida em outro app não recarrega a tela, e no máximo uma vez por minuto
  useEffect(() => {
    let saiuEm = 0;
    let recarregouEm = Date.now();
    const aoVoltar = () => {
      if (document.visibilityState === 'hidden') {
        saiuEm = Date.now();
        return;
      }
      const agora = Date.now();
      if (agora - saiuEm < 15_000 || agora - recarregouEm < 60_000) return;
      recarregouEm = agora;
      router.refresh();
    };
    document.addEventListener('visibilitychange', aoVoltar);
    return () => document.removeEventListener('visibilitychange', aoVoltar);
  }, [router]);

  const copiar = async (texto: string, qual: 'link' | 'mensagem') => {
    try {
      await navigator.clipboard.writeText(texto);
      setCopiado(qual);
      setTimeout(() => setCopiado(''), 2000);
    } catch {
      setAviso({ texto: 'Não foi possível copiar. Segure o texto para copiar à mão.', ok: false });
    }
  };

  const enviar = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ text: mensagem });
        return;
      } catch (e) {
        if ((e as Error).name === 'AbortError') return;
      }
    }
    window.open(`https://wa.me/?text=${encodeURIComponent(mensagem)}`, '_blank', 'noopener');
  };

  const pedir = async (corpo: Record<string, string>) => {
    setAviso({ texto: '', ok: false });
    setSalvando(true);
    const j = await fetch('/api/plataforma/book', {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(corpo),
    })
      .then((r) => r.json())
      .catch(() => ({ ok: false, error: 'Não foi possível falar com o servidor. Confira a sua conexão.' }));
    setSalvando(false);
    if (j.ok) {
      setSenha(j.senha);
      setAtivo(j.ativo);
    } else setAviso({ texto: j.error, ok: false });
    return j.ok as boolean;
  };

  const salvarSenha = async (e: React.FormEvent) => {
    e.preventDefault();
    if (await pedir({ acao: 'senha', senha: novaSenha })) {
      setTrocando(false);
      setAviso({ texto: 'Senha nova salva. Mande a mensagem de novo para quem ainda vai abrir.', ok: true });
    }
  };

  const ultima = visitas[0];

  return (
    <div className="space-y-6">
      <section className={`${CARTAO} p-5`}>
        <p className="text-[11px] uppercase tracking-[0.3em] text-white/60">Seu link</p>
        <div className="mt-2 flex items-center gap-2">
          <p className={`min-w-0 flex-1 break-all text-base ${ativo ? '' : 'text-white/40 line-through'}`}>{semProtocolo(endereco)}</p>
          <button type="button" onClick={() => copiar(endereco, 'link')} aria-label="Copiar o link" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/10 active:bg-white/20">
            {copiado === 'link' ? <Check size={19} className="text-gold" aria-hidden /> : <Copy size={19} aria-hidden />}
          </button>
        </div>

        <p className="mt-5 text-[11px] uppercase tracking-[0.3em] text-white/60">Senha</p>
        {trocando ? (
          <form onSubmit={salvarSenha} className="mt-2 space-y-3">
            <input
              value={novaSenha}
              onChange={(e) => setNovaSenha(e.target.value)}
              aria-label="Senha nova"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="characters"
              spellCheck={false}
              className={`${CAMPO} text-center text-xl tracking-[0.25em]`}
            />
            <p className="text-sm text-white/60">Quem já abriu o book com a senha antiga vai precisar da nova. Maiúsculas e minúsculas valem igual.</p>
            <div className="flex gap-2">
              <button type="button" onClick={() => setTrocando(false)} className={`${BOTAO_SECUNDARIO} flex-1`}>
                Cancelar
              </button>
              <button type="submit" disabled={salvando} className={`${BOTAO} flex-1`}>
                {salvando ? 'Salvando…' : 'Salvar'}
              </button>
            </div>
          </form>
        ) : (
          <div className="mt-2 flex items-center gap-2">
            <p className="min-w-0 flex-1 font-heading text-3xl tracking-[0.2em]">{senha}</p>
            <button
              type="button"
              onClick={() => {
                setNovaSenha(sugerirSenha());
                setAviso({ texto: '', ok: false });
                setTrocando(true);
              }}
              className="rounded-full bg-white/10 px-4 py-2.5 text-sm active:bg-white/20"
            >
              Trocar
            </button>
          </div>
        )}
      </section>

      {aviso.texto && (
        <p role={aviso.ok ? 'status' : 'alert'} className={`text-center text-sm ${aviso.ok ? 'text-white/80' : 'text-gold'}`}>
          {aviso.texto}
        </p>
      )}

      <div className="space-y-2">
        <button type="button" onClick={enviar} disabled={!ativo} className={`${BOTAO} flex items-center justify-center gap-2`}>
          <Send size={19} strokeWidth={1.6} aria-hidden />
          Enviar para um cliente
        </button>
        <div className="flex gap-2">
          <button type="button" onClick={() => copiar(mensagem, 'mensagem')} disabled={!ativo} className={`${BOTAO_SECUNDARIO} flex flex-1 items-center justify-center gap-2`}>
            {copiado === 'mensagem' ? <Check size={18} className="text-gold" aria-hidden /> : <Copy size={18} aria-hidden />}
            {copiado === 'mensagem' ? 'Copiada' : 'Copiar mensagem'}
          </button>
          {/* a prévia passa pela mesma senha, mas não conta como acesso */}
          {ativo ? (
            <a href={`${endereco}?previa=1`} target="_blank" rel="noopener" className={`${BOTAO_SECUNDARIO} flex flex-1 items-center justify-center gap-2`}>
              <ExternalLink size={18} aria-hidden />
              Ver como o cliente
            </a>
          ) : (
            <span aria-disabled="true" className={`${BOTAO_SECUNDARIO} flex flex-1 items-center justify-center gap-2 opacity-60`}>
              <ExternalLink size={18} aria-hidden />
              Ver como o cliente
            </span>
          )}
        </div>
      </div>

      <section className={`${CARTAO} flex items-center gap-4 p-4`}>
        <span className="min-w-0 flex-1">
          <span className="block text-base font-medium">{ativo ? 'Link ligado' : 'Link desligado'}</span>
          <span className="mt-0.5 block text-sm text-white/60">
            {ativo
              ? 'Desligue para ninguém mais abrir o book por ele.'
              : 'Ninguém abre o book por este link. Ao religar, a mesma senha volta a valer: para cortar o acesso de alguém, troque a senha.'}
          </span>
        </span>
        <button
          type="button"
          role="switch"
          aria-checked={ativo}
          aria-label="Link ligado"
          disabled={salvando}
          onClick={() => pedir({ acao: ativo ? 'desligar' : 'ligar' })}
          className={`relative h-8 w-14 shrink-0 rounded-full transition ${ativo ? 'bg-gold-dark' : 'bg-white/20'} disabled:opacity-60`}
        >
          <span className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow transition-all ${ativo ? 'left-7' : 'left-1'}`} />
        </button>
      </section>

      <section>
        <h2 className="font-heading text-2xl italic">Acessos</h2>
        <p className="mt-1 text-sm text-white/60">
          Cada acesso mostra quando o book foi aberto, em que aparelho e quanto dele foi visto. O nome de quem abriu não aparece.
          {administrador ? '' : ' A administração vê quantos acessos o seu link teve.'}
        </p>
        <p className="mt-3 text-sm text-white/80">
          {totalDeVisitas === 0
            ? 'Ninguém abriu o book por este link ainda.'
            : `${totalDeVisitas === 1 ? '1 acesso' : `${totalDeVisitas} acessos`} · último ${quando(ultima.criado_em).toLowerCase()}`}
        </p>
        <ul className="mt-3 space-y-2">
          {visitas.map((v) => {
            const Icone = ICONE[v.aparelho] ?? Monitor;
            return (
              <li key={v.id} className={`${CARTAO} flex items-center gap-4 p-4`}>
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-gold">
                  <Icone size={21} strokeWidth={1.5} aria-hidden />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-base font-medium">
                    {quando(v.criado_em)} · {NOME_DO_APARELHO[v.aparelho] ?? 'Aparelho'}
                  </span>
                  <span className="mt-0.5 block text-sm text-white/60">
                    {v.telas.length > 1 ? `Viu ${v.telas.length} de ${totalDeTelas} telas` : 'Só abriu a capa'} · {duracao(v.segundos)}
                  </span>
                </span>
              </li>
            );
          })}
        </ul>
        {totalDeVisitas > visitas.length && <p className="mt-3 text-center text-sm text-white/50">Mostrando os {visitas.length} mais recentes.</p>}
      </section>

      {equipe && (
        <section>
          <h2 className="font-heading text-2xl italic">Links da equipe</h2>
          <p className="mt-1 text-sm text-white/60">Quantas vezes o book foi aberto pelo link de cada pessoa.</p>
          {equipe.length === 0 ? (
            <p className="mt-3 text-sm text-white/50">Ninguém mais da equipe abriu a tela de compartilhar ainda.</p>
          ) : (
            <ul className="mt-3 space-y-2">
              {equipe.map((p) => (
                <li key={p.id} className={`${CARTAO} flex items-center gap-4 p-4`}>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-base font-medium">{p.nome}</span>
                    <span className="mt-0.5 block text-sm text-white/60">
                      {p.acessos === 0 ? 'Nenhum acesso' : `${p.acessos === 1 ? '1 acesso' : `${p.acessos} acessos`} · último ${quando(p.ultimo!).toLowerCase()}`}
                      {p.ativo ? '' : ' · link desligado'}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}
    </div>
  );
}
