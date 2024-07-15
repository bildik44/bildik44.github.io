const CACHE_NAME = 'v2'; // Cache versiyonunu artırdık
const urlsToCache = [
    '/',
    '/index.html',
    'icon-192x192.png',
    'icon-512x512.png',
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
    self.skipWaiting(); // Yeni service worker'ın hemen aktif olmasını sağlıyoruz
});

self.addEventListener('activate', (event) => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (!cacheWhitelist.includes(cacheName)) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    self.clients.claim(); // Yeni service worker'ı hemen kullanmaya başlamak için
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                if (response) {
                    return response; // Cache'de varsa cache'den dönüyoruz
                }
                return fetch(event.request); // Cache'de yoksa network'ten alıyoruz
            })
    );
});
