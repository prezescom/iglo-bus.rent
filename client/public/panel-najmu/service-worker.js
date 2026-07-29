const CACHE = "car-rental-shell-v1";
const SHELL_FILES = [
  "/panel-najmu/",
  "/panel-najmu/index.html",
  "/panel-najmu/css/style.css",
  "/panel-najmu/js/app.js",
  "/panel-najmu/js/signature.js",
  "/panel-najmu/js/pdf.js",
  "/panel-najmu/js/firebase-config.js",
  "/panel-najmu/manifest.json"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(SHELL_FILES))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
});

// App shell only — Firebase calls always go to the network, never cached.
self.addEventListener("fetch", (event) => {
  if (event.request.url.includes("firestore") || event.request.url.includes("googleapis")) {
    return;
  }
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  );
});
