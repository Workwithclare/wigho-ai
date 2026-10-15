/* DISABLED — emergency cache purge (2026-10-15).
   This worker unregisters itself and wipes every cache on install,
   so stale shells can never be served again. PWA offline support is
   paused until a fresh sw.js is shipped. */
self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.map((k) => caches.delete(k)));
      await self.registration.unregister();
      const clients = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
      for (const client of clients) {
        client.navigate(client.url);
      }
    })()
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.map((k) => caches.delete(k)));
      await self.registration.unregister();
    })()
  );
});

self.addEventListener('fetch', () => {
  // Pass through: never intercept while disabled.
});
