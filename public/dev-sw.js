const CACHE_NAME = "pwa-cache";

// Evento: Instalación
self.addEventListener("install", (event) => {
  console.log("[Service Worker Dev] Instalado");
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache
        .addAll([
          "/",
          "/manifest.json",
          "/favicon.ico",
          "/index.html",
          "/@vite/client",
          "/icon-192x192.png",
          "/screenshot_desktop.png",
          "/screenshot_mobile.png",
        ])
        .then(() => self.skipWaiting());
    })
  );
});

// Evento: Activación
self.addEventListener("activate", (event) => {
  console.log("[Service Worker] Activado");
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log("[Service Worker] Borrando caché antigua:", cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Evento: Fetch
self.addEventListener("fetch", (event) => {
  console.log("The dev service worker is serving the asset.");

  event.respondWith(
    caches.match(event.request).then(function (response) {
      if (response) {
        return response; // if valid response is found in cache return it
      } else {
        return fetch(event.request) //fetch from internet
          .then(function (res) {
            return caches.open(CACHE_NAME).then(function (cache) {
              cache.put(event.request.url, res.clone()); //save the response for future
              return res; // return the fetched data
            });
          })
          .catch(function (err) {
            if (event.request.destination === "document") {
              return caches.open(CACHE_NAME).then((cache) => cache.match("/"));
            }
            return Promise.reject(err);
          });
      }
    })
  );
});
