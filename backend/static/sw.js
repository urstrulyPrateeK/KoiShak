const CACHE_NAME = "koishak-v3";
const STATIC_ASSETS = ["/manifest.json", "/favicon.svg"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.url.includes("/api/")) {
    event.respondWith(
      fetch(request).catch(() => caches.match(request))
    );
  } else if (request.mode === "navigate") {
    // Network-first for page navigations — never serve stale HTML
    event.respondWith(
      fetch(request).catch(() => caches.match("/"))
    );
  } else {
    // Cache-first for static assets (JS, CSS, images)
    event.respondWith(
      caches.match(request).then((cached) => cached || fetch(request))
    );
  }
});
