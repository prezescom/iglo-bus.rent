const CACHE = "car-rental-shell-v2";
const SHELL_FILES = [
  "/panel-najmu/",
  "/panel-najmu/index.html",
  "/panel-najmu/css/style.css",
  "/panel-najmu/js/app.js",
  "/panel-najmu/js/signature.js",
  "/panel-najmu/js/damage-map.js",
  "/panel-najmu/js/pdf.js",
  "/panel-najmu/js/firebase-config.js",
  "/panel-najmu/img/van-diagram.png",
  "/panel-najmu/img/logo.png",
  "/panel-najmu/fonts/Roboto-Regular.ttf",
  "/panel-najmu/fonts/Roboto-Bold.ttf",
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
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// App shell: sięgaj najpierw do sieci, żeby po każdym wdrożeniu od razu
// był widoczny najnowszy kod — cache służy tylko jako zapasowy tryb offline,
// a nie jako główne źródło (inaczej stare wersje js/css/html potrafią
// "zamrozić się" w przeglądarce na długo po ich poprawieniu na serwerze).
self.addEventListener("fetch", (event) => {
  if (event.request.url.includes("firestore") || event.request.url.includes("googleapis")) {
    return;
  }
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const copy = response.clone();
        caches.open(CACHE).then((cache) => cache.put(event.request, copy));
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
