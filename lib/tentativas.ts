import { createHash } from 'node:crypto';
import { criarSupabaseAdmin } from '@/lib/supabase/admin';

const POR_PESSOA = 8;
const POR_ENDERECO = 30;

/**
 * O login do app passa pelo servidor, então o limite do Supabase enxerga o IP da Vercel, e não
 * o de quem tenta. A conta é feita aqui, em 15 minutos, por pessoa e por endereço de rede, e
 * repõe o limite por IP que essa passagem perdeu: não protege a conta sozinha, porque a chave
 * pública do Supabase também alcança o login direto. A vaga é reservada antes de testar a senha,
 * senão pedidos simultâneos leriam zero e passariam todos. Quem erra de outro IP não tranca o
 * dono da conta; quem divide a rede com ele pode, por 15 minutos, e aí "Esqueci minha senha"
 * resolve. Guarda só o resumo, nunca o e-mail ou o IP.
 */
export async function reservarTentativa(req: Request, email: string) {
  const ip = req.headers.get('x-real-ip') ?? req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'local';
  const resumo = (texto: string) => createHash('sha256').update(texto).digest('hex');
  const pessoa = `p:${resumo(`${email}|${ip}`)}`;

  const { data, error } = await criarSupabaseAdmin().rpc('reservar_tentativa', {
    pessoa,
    endereco: `e:${resumo(ip)}`,
    limite_pessoa: POR_PESSOA,
    limite_endereco: POR_ENDERECO,
  });
  // se o banco falhar, deixa passar: o limite não pode virar um jeito de ninguém mais entrar
  if (error) console.error('tentativa nao reservada:', error.message);
  return { liberada: Boolean(error) || data !== null, ids: (data ?? []) as number[], pessoa };
}

type Tentativa = Awaited<ReturnType<typeof reservarTentativa>>;

/** O serviço de login não respondeu: não houve senha errada */
export async function devolverTentativa({ ids }: Tentativa) {
  if (ids.length) await criarSupabaseAdmin().from('tentativas_de_entrada').delete().in('id', ids);
}

/** Senha certa: a pessoa recomeça do zero, mas a conta do endereço de rede segue valendo */
export async function esquecerTentativas(tentativa: Tentativa) {
  await devolverTentativa(tentativa);
  await criarSupabaseAdmin().from('tentativas_de_entrada').delete().eq('chave', tentativa.pessoa);
}
