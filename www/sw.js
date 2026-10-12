// Service worker for the web version (PWA). It is not used inside the Android app.
// It keeps a copy of the game on the phone, so the game opens fast and works without data.
// Each time the game is opened, the copy is refreshed in the background, so players get your
// changes the next time they open it. Nothing here needs editing when you change the game.
const CACHE = 'zambia-quiz-v1';
const FILES = ['./', 'ads-config.js', 'manifest.webmanifest', 'icons/icon-192.png'];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE)
      .then(cache => Promise.all(FILES.map(file => fetch(file).then(res => save(cache, file, res)))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  // Delete copies made by older versions of this file. Other apps on the same website keep theirs.
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k.startsWith('zambia-quiz-') && k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const req = event.request;
  const url = new URL(req.url);
  // Only the game's own files. The online leaderboard (Firebase) always goes to the network.
  if (req.method !== 'GET' || url.origin !== self.location.origin) return;
  // Every link to the game page (with or without "index.html" or "?..." on the end) shares one copy.
  const key = req.mode === 'navigate' ? new URL(url.pathname.replace(/index\.html$/, ''), url).href : req;
  const fresh = caches.open(CACHE).then(cache => fetch(req).then(res => save(cache, key, res)));
  event.waitUntil(fresh.catch(() => {}));
  event.respondWith(caches.match(key).then(saved => saved || fresh));
});

// Keep a copy of a good response and return it. A redirected response can't be used to open
// a page, so a clean copy is kept instead.
async function save(cache, key, res) {
  if (!res.ok) return res;
  if (res.redirected) res = new Response(await res.blob(), res);
  await cache.put(key, res.clone());
  return res;
}
