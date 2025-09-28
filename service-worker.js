const CACHE_NAME = 'lista-compras-v1';
const urlsToCache = [
    // Caminhos Absolutos
    '/listadecompras/',
    '/listadecompras/index.html',
    '/listadecompras/manifest.json', // Adicionar o Manifest
    '/listadecompras/service-worker.js', // Adicionar o próprio SW
    '/listadecompras/images/icon-192x192.png', 
    '/listadecompras/images/icon-512x512.png',
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
  self.skipWaiting(); 
});

// Busca (Fetch): Serve recursos a partir da cache primeiro
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }
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
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});