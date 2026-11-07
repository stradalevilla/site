'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Upload as Seta } from 'lucide-react';
import { Upload, type DetailedError } from 'tus-js-client';
import { BOTAO, BOTAO_SECUNDARIO, CAMPO, CARTAO } from '@/components/plataforma/estilos';
import { ARQUIVOS, BALDE, tamanhoLegivel, TAMANHO_MAXIMO, type TipoDeApresentacao } from '@/lib/apresentacoes';

/** Texto escrito por nós e que pode ir para a tela. Erro de rede e de JavaScript vira a frase padrão. */
class Recusa extends Error {}
class Cancelado extends Error {}

const FALHOU = 'O envio falhou. Confira a conexão e tente de novo.';
/** A autorização do Storage vale 2 horas: perto disso, melhor pedir outra */
const AUTORIZACAO_MS = 110 * 60 * 1000;
const SEM_SINAL_MS = 60 * 1000;

async function pedir(endereco: string, corpo: object) {
  const resposta = await fetch(endereco, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(corpo),
    signal: AbortSignal.timeout?.(30000),
  });
  const j = await resposta.json();
  if (!j.ok) throw new Recusa(j.error);
  return j;
}

/** Sem isto o celular apaga a tela no meio do envio e a página é suspensa */
function manterTelaAcesa() {
  let trava: WakeLockSentinel | undefined;
  let soltou = false;
  const travar = () => {
    if (document.hidden || soltou) return;
    navigator.wakeLock
      ?.request('screen')
      .then((nova) => {
        if (soltou) nova.release().catch(() => {});
        else trava = nova;
      })
      .catch(() => {
        // aparelho sem o recurso, ou com pouca bateria: o envio segue, e retoma se cair
      });
  };
  travar();
  document.addEventListener('visibilitychange', travar);
  return () => {
    soltou = true;
    document.removeEventListener('visibilitychange', travar);
    trava?.release().catch(() => {});
  };
}

/** O que foi autorizado a subir. Guardado para a nova tentativa continuar de onde parou. */
type Envio = {
  caminho: string;
  tipo: TipoDeApresentacao;
  tamanho: number;
  endereco: string;
  token: string;
  autorizadoEm: number;
  url: string | null;
  subiu: boolean;
};

export function NovaApresentacao() {
  const router = useRouter();
  const seletor = useRef<HTMLInputElement>(null);
  const envio = useRef<Envio | null>(null);
  const interromper = useRef<(() => void) | null>(null);
  const saiu = useRef(false);
  const ocupado = useRef(false);
  const registro = useRef('');
  const tituloGerado = useRef('');
  const [modo, setModo] = useState<'arquivo' | 'link'>('arquivo');
  const [titulo, setTitulo] = useState('');
  const [arquivo, setArquivo] = useState<File | null>(null);
  const [endereco, setEndereco] = useState('');
  const [andamento, setAndamento] = useState<number | null>(null);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState('');

  /** Arquivo que subiu e não vai ser usado não aparece em tela nenhuma: sai do balde na hora */
  const descartar = () => {
    const atual = envio.current;
    envio.current = null;
    registro.current = '';
    if (atual?.subiu) {
      fetch(`/api/plataforma/apresentacoes/envio?caminho=${atual.caminho}`, { method: 'DELETE', keepalive: true }).catch(() => {});
    }
  };

  // sair da tela é desistir: o envio para aqui, sem gastar dados nem publicar depois
  useEffect(() => {
    saiu.current = false;
    return () => {
      saiu.current = true;
      interromper.current?.();
      // com o registro a caminho, quem decide é o fim dele
      if (!ocupado.current) descartar();
    };
  }, []);

  const escolher = (e: React.ChangeEvent<HTMLInputElement>) => {
    const escolhido = e.target.files?.[0] ?? null;
    e.target.value = ''; // sem isto, escolher o mesmo arquivo de novo não faz nada
    setErro('');
    if (!escolhido) return;
    if (!ARQUIVOS[escolhido.type]) {
      setErro('Envie um PDF ou um vídeo MP4 ou MOV.');
      return;
    }
    if (escolhido.size > TAMANHO_MAXIMO) {
      setErro('O arquivo passa de 400 MB.');
      return;
    }
    descartar();
    setArquivo(escolhido);
    if (!titulo || titulo === tituloGerado.current) {
      tituloGerado.current = escolhido.name.replace(/\.[^.]+$/, '');
      setTitulo(tituloGerado.current);
    }
  };

  const trocarModo = (novo: 'arquivo' | 'link') => {
    if (novo !== modo) descartar();
    setErro('');
    setModo(novo);
  };

  /**
   * Sobe em partes, direto do aparelho para o Storage. Se a rede cair ou o sistema suspender
   * a página, continua de onde parou: num único envio, tudo recomeçaria do zero.
   */
  const subir = (alvo: File, atual: Envio) =>
    new Promise<void>((pronto, falhou) => {
      let sinal = Date.now();
      const upload = new Upload(alvo, {
        endpoint: atual.endereco,
        uploadUrl: atual.url,
        chunkSize: 6 * 1024 * 1024, // o tamanho que o Supabase exige
        retryDelays: [0, 1000, 3000, 5000, 10000, 20000, 30000, 60000],
        // o padrão desiste na hora quando o aparelho está sem rede, e queda rápida é o caso comum
        onShouldRetry: (motivo) => {
          const resposta = (motivo as DetailedError).originalResponse?.getStatus() ?? 0;
          return resposta === 0 || resposta >= 500 || resposta === 409 || resposta === 423;
        },
        storeFingerprintForResuming: false,
        headers: { 'x-signature': atual.token },
        metadata: { bucketName: BALDE, objectName: atual.caminho, contentType: alvo.type, cacheControl: '3600' },
        onProgress: (enviado, total) => {
          sinal = Date.now();
          setAndamento(enviado / total);
        },
        onSuccess: () => {
          parar();
          pronto();
        },
        onError: (motivo) => {
          atual.url = upload.url;
          parar();
          falhou(motivo);
        },
      });

      // rede que para de passar dados sem cair não gera erro: retoma do ponto que o servidor confirmar
      const vigia = setInterval(() => {
        if (Date.now() - sinal < SEM_SINAL_MS) return;
        sinal = Date.now();
        upload
          .abort()
          .then(() => upload.start())
          .catch(() => {});
      }, 10000);

      const parar = () => {
        clearInterval(vigia);
        interromper.current = null;
      };
      interromper.current = () => {
        parar();
        upload.abort(true).catch(() => {});
        envio.current = null;
        falhou(new Cancelado());
      };
      upload.start();
    });

  const salvar = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');
    if (!titulo.trim()) {
      setErro('Dê um título à apresentação.');
      return;
    }
    if (modo === 'arquivo' && !arquivo) {
      setErro('Escolha o arquivo.');
      return;
    }

    ocupado.current = true;
    setSalvando(true);
    const soltarTela = modo === 'arquivo' ? manterTelaAcesa() : null;
    // o mesmo id na nova tentativa: se a resposta se perdeu depois de gravar, não publica em dobro
    registro.current ||= crypto.randomUUID();
    const seguiu = () => {
      if (saiu.current) throw new Cancelado();
    };
    try {
      if (modo === 'link') {
        await pedir('/api/plataforma/apresentacoes', { id: registro.current, titulo, tipo: 'link', endereco });
      } else {
        if (envio.current && !envio.current.subiu && Date.now() - envio.current.autorizadoEm > AUTORIZACAO_MS) envio.current = null;
        if (!envio.current) {
          const j = await pedir('/api/plataforma/apresentacoes/envio', { mime: arquivo!.type, tamanho: arquivo!.size });
          seguiu();
          envio.current = { caminho: j.caminho, tipo: j.tipo, tamanho: arquivo!.size, endereco: j.endereco, token: j.token, autorizadoEm: Date.now(), url: null, subiu: false };
        }
        const atual = envio.current;
        if (!atual.subiu) {
          setAndamento(0);
          await subir(arquivo!, atual);
          atual.subiu = true;
          setAndamento(null);
          seguiu();
        }
        await pedir('/api/plataforma/apresentacoes', { id: registro.current, titulo, tipo: atual.tipo, caminho: atual.caminho, tamanho: atual.tamanho });
      }
      if (saiu.current) return;
      router.replace('/apresentacoes');
      router.refresh();
    } catch (falha) {
      interromper.current = null;
      if (saiu.current) {
        descartar();
        return;
      }
      if (!(falha instanceof Cancelado)) {
        setErro(falha instanceof Recusa ? falha.message : FALHOU);
        // o Storage recusou a autorização: o próximo toque pede outra, em vez de repetir a recusa
        const resposta = (falha as DetailedError).originalResponse?.getStatus() ?? 0;
        if (resposta >= 400 && resposta < 500 && resposta !== 409 && resposta !== 423) envio.current = null;
      }
      setAndamento(null);
      setSalvando(false);
    } finally {
      ocupado.current = false;
      soltarTela?.();
    }
  };

  const aba = (ativa: boolean) => `flex-1 rounded-xl py-3 text-sm transition disabled:opacity-60 ${ativa ? 'bg-white/15 font-medium' : 'text-white/70'}`;

  return (
    <form onSubmit={salvar} className="space-y-3">
      <div className={`${CARTAO} flex gap-1 p-1`}>
        <button type="button" disabled={salvando} onClick={() => trocarModo('arquivo')} aria-pressed={modo === 'arquivo'} className={aba(modo === 'arquivo')}>
          Arquivo
        </button>
        <button type="button" disabled={salvando} onClick={() => trocarModo('link')} aria-pressed={modo === 'link'} className={aba(modo === 'link')}>
          Link
        </button>
      </div>

      {modo === 'arquivo' ? (
        <>
          <input ref={seletor} type="file" accept="application/pdf,video/mp4,video/quicktime" onChange={escolher} className="hidden" aria-label="Arquivo" />
          <button
            type="button"
            disabled={salvando}
            onClick={() => seletor.current?.click()}
            className={`${CARTAO} flex w-full flex-col items-center gap-2 border-dashed px-4 py-8 text-center transition active:bg-white/[0.12]`}
          >
            <Seta size={26} strokeWidth={1.4} className="text-gold" aria-hidden />
            {arquivo ? (
              <span className="text-base">
                {arquivo.name}
                <span className="mt-1 block text-sm text-white/60">{tamanhoLegivel(arquivo.size)}</span>
              </span>
            ) : (
              <span className="text-base text-white/80">Escolher PDF ou vídeo (até 400 MB)</span>
            )}
          </button>
        </>
      ) : (
        <input type="url" required disabled={salvando} inputMode="url" placeholder="https://" aria-label="Link" value={endereco} onChange={(e) => setEndereco(e.target.value)} className={CAMPO} />
      )}

      <input required disabled={salvando} maxLength={160} placeholder="Título" aria-label="Título" value={titulo} onChange={(e) => setTitulo(e.target.value)} className={CAMPO} />

      {andamento !== null && (
        <div role="progressbar" aria-valuenow={Math.round(andamento * 100)} aria-valuemin={0} aria-valuemax={100} aria-label="Andamento do envio">
          <div className="h-2 overflow-hidden rounded-full bg-white/10">
            <div className="h-full rounded-full bg-gold transition-[width]" style={{ width: `${Math.round(andamento * 100)}%` }} />
          </div>
          <p className="mt-2 text-center text-sm text-white/70">Enviando {Math.round(andamento * 100)}%. Deixe esta tela aberta.</p>
        </div>
      )}

      {erro && (
        <p role="alert" className="text-center text-sm text-[#F2A06A]">
          {erro}
        </p>
      )}

      <button type="submit" disabled={salvando} className={`!mt-5 ${BOTAO}`}>
        {salvando ? 'Salvando…' : 'Salvar'}
      </button>
      {andamento !== null && (
        <button type="button" onClick={() => interromper.current?.()} className={BOTAO_SECUNDARIO}>
          Cancelar envio
        </button>
      )}
    </form>
  );
}
