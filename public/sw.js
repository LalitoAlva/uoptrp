const CACHE_NAME = 'nyc-usopen-2026-v3';
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

  // Same-origin only. The background-refresh branch below re-caches whatever
  // it already holds without checking `response.type`, so letting third-party
  // requests in here would mean this worker storing and then replaying other
  // origins' responses — including Google's auth endpoints and any
  // credentialed response they return — from our cache, indefinitely. Those
  // requests go straight to the network instead.
  if (new URL(request.url).origin !== self.location.origin) return;

  // Never cache the Google Identity script or anything auth-shaped, even if
  // it were same-origin: a stale copy of an auth flow is its own hazard.
  if (request.url.includes('/gsi/') || request.url.includes('accounts.google')) return;

  const isNavigation = request.mode === 'navigate';

  // The HTML shell (and anything requested by exact path rather than a
  // content-hashed filename) decides which JS/CSS bundle a client loads.
  // Serving a cached copy of *that* first is what made every deploy invisible
  // until a second reload: the first load kept getting yesterday's index.html,
  // which points at yesterday's still-cached bundle. Bundles under
  // /assets/ are hashed by Vite (a new build = a new filename), so those stay
  // cache-first for speed; the shell goes network-first so a new deploy is
  // visible on the very next load, with the cache only as an offline fallback.
  const isAppShell = isNavigation || request.url.endsWith('/index.html');

  if (isAppShell) {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, responseToCache));
          }
          return networkResponse;
        })
        .catch(() => caches.match(request).then((cached) => cached || caches.match('/index.html')))
    );
    return;
  }

  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        // Serve from cache immediately, refresh in the background. The
        // `type === 'basic'` check matches the cold path below: only plain
        // same-origin responses are worth storing, never opaque or redirected ones.
        fetch(request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
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
        .catch(() => Response.error());
    })
  );
});
