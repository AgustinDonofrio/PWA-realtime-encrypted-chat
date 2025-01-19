// Evento: Instalación
self.addEventListener("install", (event) => {
  console.log("[Service Worker] Instalado");
  event.waitUntil(
    caches.open("pwa-cache").then((cache) => {
      return cache.addAll([
        "/",
        "/manifest.json",
        "/favicon.ico",
        "/index.html",
        "/pages/main.tsx",
        "/pages/App.tsx",
        "/styles/index.css",
      ]);
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
          if (cache !== "pwa-cache") {
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
  console.log("The service worker is serving the asset.");
  event.respondWith(
    caches.match(event.request).then(function (response) {
      if (response) {
        return response; // if valid response is found in cache return it
      } else {
        return fetch(event.request) //fetch from internet
          .then(function (res) {
            return caches.open("pwa-cache").then(function (cache) {
              cache.put(event.request.url, res.clone()); //save the response for future
              return res; // return the fetched data
            });
          })
          .catch(function (err) {
            // fallback mechanism
            return caches.open(err.message).then(function (cache) {
              return cache.match("/offline.html");
            });
          });
      }
    })
  );
});
