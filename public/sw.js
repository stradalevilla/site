// O service worker do app. Guarda só o que é igual para todo mundo: a tela de sem conexão e os
// arquivos do próprio site. Páginas e dados nunca entram aqui, porque são informação de clientes
// e ficariam no aparelho depois de sair da conta. Mudou este arquivo, suba a versão.
const VERSAO = 'v1';
const CACHE = `villa-stradale-${VERSAO}`;
const BASICO = ['/offline.html', '/aplicativo/icone-192.png'];

self.addEventListener('install', (evento) => {
  evento.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(BASICO)));
  self.skipWaiting();
});

self.addEventListener('activate', (evento) => {
  evento.waitUntil(
    caches
      .keys()
      .then((nomes) => Promise.all(nomes.filter((nome) => nome !== CACHE).map((nome) => caches.delete(nome))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (evento) => {
  const { request } = evento;
  const endereco = new URL(request.url);
  if (request.method !== 'GET' || endereco.origin !== self.location.origin) return;

  // os arquivos do build têm o conteúdo no nome: nunca mudam
  if (endereco.pathname.startsWith('/_next/static/')) {
    evento.respondWith(
      caches.match(request).then(
        (guardado) =>
          guardado ||
          fetch(request).then((resposta) => {
            if (resposta.ok) {
              const copia = resposta.clone();
              caches.open(CACHE).then((cache) => cache.put(request, copia));
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
    evento.respondWith(fetch(request).catch(() => caches.match('/offline.html')));
  }
});
