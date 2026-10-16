// Butterflight service worker: makes the site installable as a home-screen app.
// Pages always come from the network first (so updates show up right away);
// the last copy is kept only as a fallback when the phone is offline.
// Supabase requests (login, data, photos) are never cached.
const CACHE = 'butterflight-v1';
self.addEventListener('install', e => { self.skipWaiting(); });
self.addEventListener('activate', e => { e.waitUntil(self.clients.claim()); });
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || req.mode !== 'navigate' || new URL(req.url).origin !== location.origin) return;
  e.respondWith(
    fetch(req).then(res => { const copy = res.clone(); caches.open(CACHE).then(c => c.put('/', copy)); return res; })
      .catch(() => caches.match('/'))
  );
});
