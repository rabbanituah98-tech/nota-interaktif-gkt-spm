/* Nota Kilat GKT: simpan salinan untuk dibaca tanpa Internet.
   Rangkaian dahulu, jadi kemas kini di GitHub terus sampai kepada pelajar. */
var CACHE = 'gkt-kilat-v1';
var FAIL = ['./', 'index.html', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png', 'icon-180.png'];
self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(FAIL); }).then(function () { return self.skipWaiting(); }));
});
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (k) {
    return Promise.all(k.filter(function (n) { return n !== CACHE; }).map(function (n) { return caches.delete(n); }));
  }).then(function () { return self.clients.claim(); }));
});
self.addEventListener('fetch', function (e) {
  if (e.request.method !== 'GET' || new URL(e.request.url).origin !== location.origin) return;
  e.respondWith(
    fetch(e.request).then(function (r) {
      if (r && r.ok) { var s = r.clone(); caches.open(CACHE).then(function (c) { c.put(e.request, s); }); }
      return r;
    }).catch(function () {
      return caches.match(e.request).then(function (r) { return r || caches.match('index.html'); });
    })
  );
});
