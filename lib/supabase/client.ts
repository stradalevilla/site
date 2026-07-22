import { createBrowserClient } from '@supabase/ssr';

/** Cliente Supabase para o navegador (formulário de login, logout). */
export function criarSupabaseNavegador() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
