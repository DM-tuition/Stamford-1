/* Stamford House — service worker (offline support for the installed app) */
var CACHE = "stamford-v11";
var CORE = [
  "./", "index.html", "about.html", "leadership.html", "events.html",
  "gallery.html", "get-involved.html", "404.html", "stamford.html", "parliament.html", "reps.html",
  "css/style.css", "js/main.js", "js/events.js", "js/config.js",
  "data/events.json", "data/reps.json", "data/parliament.json", "data/calendar.json", "js/reps.js", "assets/crest.png", "assets/houses/bradbury.webp", "assets/houses/massey.webp", "assets/houses/stamford.webp", "assets/houses/tatton.webp", "manifest.webmanifest",
  "assets/icons/icon-192.png", "assets/icons/icon-512.png"
];

self.addEventListener("install", function (e) {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(function (c) {
    return Promise.all(CORE.map(function (u) { return c.add(u).catch(function () {}); }));
  }));
});

self.addEventListener("activate", function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});

// Network-first (fresh when online), fall back to cache (works offline).
self.addEventListener("fetch", function (e) {
  if (e.request.method !== "GET") return;
  e.respondWith(
    fetch(e.request).then(function (res) {
      var copy = res.clone();
      caches.open(CACHE).then(function (c) { c.put(e.request, copy).catch(function () {}); });
      return res;
    }).catch(function () {
      return caches.match(e.request).then(function (m) { return m || caches.match("index.html"); });
    })
  );
});
