import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { HOST_DO_APP } from '@/lib/aplicativo';

/** No app, o que abre sem login */
const PUBLICAS_DO_APP = ['/entrar', '/recuperar', '/nova-senha', '/instalar'];

/**
 * Mantém a sessão do Supabase renovada e protege as áreas logadas: /admin no site e
 * tudo no app. Sem usuário, redireciona para a tela de entrada de cada um.
 *
 * O app mora em /plataforma, mas quem usa vê /contatos, e o Next recebe aqui o endereço
 * antes de qualquer reescrita. A reescrita tem de sair também na renovação do token,
 * porque a resposta é recriada ali.
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // O ícone do admin é público (aparece na aba mesmo deslogado).
  if (pathname.startsWith('/admin/icon')) {
    return NextResponse.next();
  }

  const noApp = HOST_DO_APP.test(request.headers.get('host') ?? '');

  const seguir = () => {
    if (!noApp) return NextResponse.next({ request });
    const destino = request.nextUrl.clone();
    destino.pathname = `/plataforma${pathname === '/' ? '' : pathname}`;
    return NextResponse.rewrite(destino, { request });
  };

  let response = seguir();

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
          response = seguir();
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

  /** Redireciona sem perder o cookie que a renovação acabou de gravar */
  const irPara = (caminho: string, proximo?: string) => {
    const url = request.nextUrl.clone();
    url.pathname = caminho;
    url.search = '';
    if (proximo) url.searchParams.set('proximo', proximo);
    const destino = NextResponse.redirect(url);
    response.cookies.getAll().forEach((cookie) => destino.cookies.set(cookie));
    return destino;
  };

  if (noApp) {
    if (!user && !PUBLICAS_DO_APP.includes(pathname)) return irPara('/entrar', pathname === '/' ? undefined : pathname);
    if (user && pathname === '/entrar') return irPara('/');
    return response;
  }

  const ehLogin = pathname === '/admin/login';
  /* Quem esqueceu a senha chega aqui deslogado por definição: mandar para o
     login seria um círculo. A tela da senha nova também entra, porque a sessão
     de recuperação só é aberta pelo navegador, depois que a página carrega. */
  const ehPublica =
    ehLogin || pathname === '/admin/recuperar' || pathname === '/admin/nova-senha';

  if (!user && !ehPublica) return irPara('/admin/login', pathname);
  if (user && ehLogin) return irPara('/admin');

  return response;
}

export const config = {
  matcher: [
    '/admin/:path*',
    // no www o middleware continua só em /admin: as páginas do site não pagam por isto
    {
      source: '/((?!_next/static|_next/image|api/|sw\\.js$|app\\.webmanifest$|offline\\.html$|aplicativo/|images/|videos/|logos/).*)',
      has: [{ type: 'host', value: 'app\\.(villastradale\\.com\\.br|localhost)' }],
    },
  ],
};
