const CACHE_NAME = 'tvri-pwa-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json'
];

// Instalasi Service Worker & Menyimpan Cache
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting(); // Memaksa update langsung tanpa restart browser
});

// Aktivasi & Bersihkan Cache Lama
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(name => name !== CACHE_NAME).map(name => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

// Strategi Pengambilan Data: Prioritaskan Jaringan, Jatuh ke Cache jika Offline
self.addEventListener('fetch', event => {
  // JANGAN cache request yang menembak API Google Script (Metode POST)
  if (event.request.method !== 'GET') return;
  
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});