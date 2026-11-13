// O service worker do app. Guarda só o que é igual para todo mundo: a tela de sem conexão e os
// arquivos do próprio site. Páginas e dados nunca entram aqui, porque são informação de clientes
// e ficariam no aparelho depois de sair da conta. Mudou este arquivo, suba a versão.
const VERSAO = 'v2';
const CACHE = `villa-stradale-${VERSAO}`;
const BASICO = ['/offline.html', '/aplicativo/icone-192.png'];
// arquivos do build guardados: a cada publicação entram os novos, e os mais antigos saem
const LIMITE_DO_BUILD = 300;

self.addEventListener('install', (evento) => {
  evento.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(BASICO)));
  self.skipWaiting();
});

self.addEventListener('activate', (evento) => {
  evento.waitUntil(
    Promise.all([
      caches.keys().then((nomes) => Promise.all(nomes.filter((nome) => nome !== CACHE).map((nome) => caches.delete(nome)))),
      // o pedido da página sai junto com o acordar do service worker, e não depois dele
      self.registration.navigationPreload ? self.registration.navigationPreload.enable() : Promise.resolve(),
    ]).then(() => self.clients.claim())
  );
});

/** Tira os arquivos do build mais antigos quando passam do limite. O cache guarda na ordem em que entraram. */
async function aparar(cache) {
  const doBuild = (await cache.keys()).filter((pedido) => new URL(pedido.url).pathname.startsWith('/_next/static/'));
  await Promise.all(doBuild.slice(0, Math.max(0, doBuild.length - LIMITE_DO_BUILD)).map((pedido) => cache.delete(pedido)));
}

self.addEventListener('fetch', (evento) => {
  const { request } = evento;
  const endereco = new URL(request.url);
  if (request.method !== 'GET' || endereco.origin !== self.location.origin) return;

  // os arquivos do build têm o conteúdo no nome: nunca mudam. O ?dpl= da Vercel muda a cada
  // publicação sem mudar o arquivo, então ele não conta na hora de achar o guardado
  if (endereco.pathname.startsWith('/_next/static/')) {
    evento.respondWith(
      caches.match(request, { ignoreSearch: true }).then(
        (guardado) =>
          guardado ||
          fetch(request).then((resposta) => {
            if (resposta.ok) {
              const copia = resposta.clone();
              evento.waitUntil(caches.open(CACHE).then((cache) => cache.put(request, copia).then(() => aparar(cache))));
            }
            return resposta;
          })
      )
    );
    return;
  }

  // o que a tela de sem conexão usa precisa sair daqui: nessa hora a rede não responde
  if (BASICO.includes(endereco.pathname)) {
    evento.respondWith(caches.match(request).then((guardado) => guardado || fetch(request)));
    return;
  }

  if (request.mode === 'navigate') {
    evento.respondWith(
      (async () => {
        try {
          // a resposta que já saiu enquanto o service worker acordava, ou um pedido novo
          return (await evento.preloadResponse) || (await fetch(request));
        } catch {
          return (await caches.match('/offline.html')) || Response.error();
        }
      })()
    );
  }
});
