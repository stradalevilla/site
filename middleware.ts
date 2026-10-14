import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

/**
 * Mantém a sessão do Supabase renovada e protege a área /admin:
 * sem usuário logado, redireciona para /admin/login. A própria página de
 * login fica liberada.
 */
export async function middleware(request: NextRequest) {
  // O ícone do admin é público (aparece na aba mesmo deslogado).
  if (request.nextUrl.pathname === '/admin/icon.svg') {
    return NextResponse.next();
  }

  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const ehLogin = pathname === '/admin/login';
  /* Quem esqueceu a senha chega aqui deslogado por definição: mandar para o
     login seria um círculo. A tela da senha nova também entra, porque a sessão
     de recuperação só é aberta pelo navegador, depois que a página carrega. */
  const ehPublica =
    ehLogin || pathname === '/admin/recuperar' || pathname === '/admin/nova-senha';

  if (!user && !ehPublica) {
    const url = request.nextUrl.clone();
    url.pathname = '/admin/login';
    url.searchParams.set('proximo', pathname);
    return NextResponse.redirect(url);
  }

  if (user && ehLogin) {
    const url = request.nextUrl.clone();
    url.pathname = '/admin';
    url.search = '';
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: ['/admin/:path*'],
};
