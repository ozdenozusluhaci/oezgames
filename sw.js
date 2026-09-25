/* Ana sitenin çevrimdışı önbelleği. Oyun klasörleri (games/) kendi PWA'larına bırakılır. */
const CACHE = 'ozden-v2';
const CORE = ['./', 'index.html', 'blog.html', 'styles.css', 'app.js', 'content.js', 'i18n.js', 'en/', 'de/', 'manifest.webmanifest', 'icons/icon.svg'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(CORE)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET' || url.origin !== location.origin) return;
  if (url.pathname.includes('/games/') || url.pathname.endsWith('.pdf')) return;
  // Önce ağ (güncel içerik), ağ yoksa önbellek
  e.respondWith(
    fetch(e.request).then((res) => {
      const copy = res.clone();
      caches.open(CACHE).then((c) => c.put(e.request, copy));
      return res;
    }).catch(() => caches.match(e.request).then((r) => r || caches.match('index.html')))
  );
});
