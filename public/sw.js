const CACHE_NAME = 'nyc-usopen-2026-v2';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/favicon.svg',
  '/icon-192.png',
  '/icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Only handle plain GET http(s) requests. Browser extensions, devtools,
  // and other schemes (chrome-extension://, etc.) aren't cacheable — trying
  // to cache.put() them throws and was crashing every fetch that touched one.
  if (request.method !== 'GET' || !request.url.startsWith('http')) return;

  const isNavigation = request.mode === 'navigate';

  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        // Serve from cache immediately, refresh in the background.
        fetch(request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              caches.open(CACHE_NAME).then((cache) => cache.put(request, networkResponse));
            }
          })
          .catch(() => {});
        return cachedResponse;
      }

      return fetch(request)
        .then((response) => {
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, responseToCache));
          return response;
        })
        .catch(() => {
          // Only fall back to the cached app shell for page navigations —
          // never for JS/CSS/asset requests, or the browser ends up trying
          // to execute index.html as a module script (wrong MIME type).
          if (isNavigation) {
            return caches.match('/index.html');
          }
          return Response.error();
        });
    })
  );
});
