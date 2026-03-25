const CACHE_NAME = 'ciar-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/index_listaciar.html',
  '/js/ciar_app.js',
  '/manifest.json',
  '/icon-192.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});
