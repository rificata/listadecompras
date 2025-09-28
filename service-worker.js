const CACHE_NAME = 'lista-compras-v1';
const urlsToCache = [
    '/',
    '/index.html',
    // Caminhos relativos para os ícones
    '/images/icon-192x192.png', 
    '/images/icon-512x512.png',
    // Adicione aqui todos os ficheiros da sua app se os tiver separado (ex: /app.css, /app.js)
];

// Instalação: Guarda todos os ficheiros essenciais na cache
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Cache aberta com sucesso. A pré-armazenar recursos...');
        return cache.addAll(urlsToCache);
      })
  );
  self.skipWaiting(); // Garante que o novo service worker assume o controlo imediatamente
});

// Busca (Fetch): Serve recursos a partir da cache primeiro
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Retorna o recurso da cache se estiver lá
        if (response) {
          return response;
        }
        // Caso contrário, tenta obter da rede
        return fetch(event.request);
      })
  );
});

// Ativação: Limpa caches antigas para libertar espaço
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            // Elimina qualquer cache não listada na cacheWhitelist
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});