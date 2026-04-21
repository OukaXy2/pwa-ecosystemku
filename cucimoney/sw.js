// ============================================
// CuciMoney+ — Service Worker v4
// ============================================

const CACHE_NAME = 'cucimoney-v4';
const ASSETS = [
  './index.html',
  './manifest.json',
];

// Install — cache assets (tanpa /shared/ — di-handle terpisah)
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

// Activate — hapus cache lama
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch — network-first untuk /shared/, cache-first untuk yang lain
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);

  // /shared/ selalu ambil dari network dulu (jangan cache lama)
  if (url.pathname.startsWith('/shared/')) {
    e.respondWith(
      fetch(e.request).catch(() => caches.match(e.request))
    );
    return;
  }

  // File lain — cache first, fallback network
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});
