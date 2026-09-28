/* Apna Kirana service worker.
 * - Pages: network-first (always get the latest deploy), fall back to cache offline.
 * - Hashed Next.js assets & icons: cache-first (immutable).
 * - Remote images: stale-while-revalidate.
 */
const VERSION = 'v3';
const PAGE_CACHE = `pages-${VERSION}`;
const ASSET_CACHE = `assets-${VERSION}`;
const IMAGE_CACHE = `images-${VERSION}`;
const OFFLINE_URLS = ['/', '/manifest.json', '/icons/icon-192x192.png'];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(PAGE_CACHE).then((c) => c.addAll(OFFLINE_URLS)));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  const keep = [PAGE_CACHE, ASSET_CACHE, IMAGE_CACHE];
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => !keep.includes(k)).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

async function trimCache(name, max) {
  const cache = await caches.open(name);
  const keys = await cache.keys();
  for (let i = 0; i < keys.length - max; i++) await cache.delete(keys[i]);
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);

  // Never cache the owner console or API calls.
  if (url.origin === self.location.origin && (url.pathname.startsWith('/admin') || url.pathname.startsWith('/api'))) return;

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((res) => {
          const copy = res.clone();
          caches.open(PAGE_CACHE).then((c) => c.put(request, copy)).then(() => trimCache(PAGE_CACHE, 40));
          return res;
        })
        .catch(async () => (await caches.match(request)) || caches.match('/'))
    );
    return;
  }

  if (url.origin === self.location.origin && (url.pathname.startsWith('/_next/static/') || url.pathname.startsWith('/icons/'))) {
    event.respondWith(
      caches.match(request).then(
        (hit) =>
          hit ||
          fetch(request).then((res) => {
            const copy = res.clone();
            caches.open(ASSET_CACHE).then((c) => c.put(request, copy));
            return res;
          })
      )
    );
    return;
  }

  if (request.destination === 'image') {
    event.respondWith(
      caches.open(IMAGE_CACHE).then(async (cache) => {
        const hit = await cache.match(request);
        const network = fetch(request)
          .then((res) => {
            if (res.ok || res.type === 'opaque') {
              cache.put(request, res.clone()).then(() => trimCache(IMAGE_CACHE, 150));
            }
            return res;
          })
          .catch(() => hit);
        return hit || network;
      })
    );
  }
});
