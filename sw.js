const CACHE = "zood-shell-v1";
const SHELL_FILES = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png",
];
const CDN_FILES = [
  "https://unpkg.com/react@18.3.1/umd/react.production.min.js",
  "https://unpkg.com/react-dom@18.3.1/umd/react-dom.production.min.js",
  "https://unpkg.com/prop-types@15.8.1/prop-types.min.js",
  "https://unpkg.com/recharts@2.12.7/umd/Recharts.js",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) =>
      cache.addAll(SHELL_FILES).catch(() => {})
    )
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  const isShell = url.origin === self.location.origin;
  const isCdn = CDN_FILES.includes(request.url);

  // Live data (geocoding, routing) — always go to the network, never cache.
  if (
    url.hostname.includes("nominatim.openstreetmap.org") ||
    url.hostname.includes("router.project-osrm.org")
  ) {
    return;
  }

  if (isShell || isCdn) {
    event.respondWith(
      caches.match(request).then((cached) => {
        const network = fetch(request)
          .then((res) => {
            if (res && res.ok) {
              caches.open(CACHE).then((cache) => cache.put(request, res.clone()));
            }
            return res;
          })
          .catch(() => cached);
        return cached || network;
      })
    );
  }
});
