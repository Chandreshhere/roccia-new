// Service worker — caches frame sequences in Cache Storage so repeat
// visits are instant, even offline. Cache name is versioned so deploys
// can bump it to invalidate.

const CACHE_NAME = 'roccia-frames-v2';
const SAME_ORIGIN_FRAME_PREFIXES = [
  '/assets/frames-kling/',
  '/assets/frames-birds/',
  '/assets/frames-statue/',
];
// Also cache heavy assets pulled from jsDelivr
const JSDELIVR_PREFIX = 'https://cdn.jsdelivr.net/gh/Chandreshhere/roccia-new';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      // Drop older cache versions
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter((key) => key.startsWith('roccia-frames-') && key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      );
      await self.clients.claim();
    })()
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);

  const isSameOriginFrame =
    url.origin === self.location.origin &&
    SAME_ORIGIN_FRAME_PREFIXES.some((p) => url.pathname.startsWith(p));
  const isJsdelivrAsset = req.url.startsWith(JSDELIVR_PREFIX);

  if (!isSameOriginFrame && !isJsdelivrAsset) return;

  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      const cached = await cache.match(req);
      if (cached) return cached;

      try {
        const fresh = await fetch(req);
        // Only cache successful opaque/basic responses
        if (fresh && fresh.status === 200) {
          cache.put(req, fresh.clone());
        }
        return fresh;
      } catch (err) {
        // Network failure — fall back to whatever is in cache (might be stale
        // but better than nothing). If nothing, let the error bubble.
        const fallback = await cache.match(req);
        if (fallback) return fallback;
        throw err;
      }
    })()
  );
});
