import { createClient } from '@supabase/supabase-js';

/**
 * Cliente Supabase com a chave de serviço — acesso total, SÓ no servidor.
 * Usado para operações administrativas (gerenciar usuários, gravar marcações).
 * Nunca importar em componentes de cliente.
 */
export function criarSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}
