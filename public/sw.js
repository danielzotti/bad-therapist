// Bad Therapist - PWA Service Worker (Vanilla JS)
// Implements Stale-While-Revalidate for seamless offline play and background updates.

const CACHE_NAME = 'bad-therapist-cache-v2';

const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/data.json',
  '/manifest.json',
  '/icon.svg',
];

// Installation: Cache essential assets & skip waiting
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      // Cache all core assets
      try {
        await cache.addAll(PRECACHE_ASSETS);
      } catch (err) {
        console.warn('[SW] Core precache partial failure:', err);
      }
    }).then(() => self.skipWaiting())
  );
});

// Activation: Clean up older cache versions & claim active clients
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[SW] Removing old cache:', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch: Stale-While-Revalidate strategy
self.addEventListener('fetch', (event) => {
  // Only handle GET requests with HTTP/HTTPS
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (!url.protocol.startsWith('http')) return;

  event.respondWith(
    caches.open(CACHE_NAME).then(async (cache) => {
      const cachedResponse = await cache.match(event.request);

      // Launch network fetch in background to revalidate cache
      const fetchPromise = fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
            cache.put(event.request, networkResponse.clone());
          }
          return networkResponse;
        })
        .catch((err) => {
          // Network failure is expected when offline
          return null;
        });

      // If we have a cached version, return it immediately (stale) while revalidating
      if (cachedResponse) {
        return cachedResponse;
      }

      // If not cached, wait for network response
      const networkResponse = await fetchPromise;
      if (networkResponse) {
        return networkResponse;
      }

      // If offline and request is HTML navigation, fall back to cached root '/'
      if (event.request.mode === 'navigate') {
        const rootCache = await cache.match('/');
        if (rootCache) return rootCache;
        const indexCache = await cache.match('/index.html');
        if (indexCache) return indexCache;
      }

      return new Response('Offline: Content not cached yet', {
        status: 503,
        statusText: 'Service Unavailable',
        headers: new Headers({ 'Content-Type': 'text/plain' }),
      });
    })
  );
});
