const CACHE_NAME = 'ciar-cache-v1';
const assets = ['index.html', 'index_listaciar.html', 'js/ciar_app.js', 'manifest.json'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(assets)));
});

self.addEventListener('fetch', e => {
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));
});
