const CACHE_NAME = "my-app-cache-v1";
const urlsToCache = [
  "/", // Caches the root URL (typically the main HTML file)
  "/App.css",
  "/favicon.ico",
  "/manifest.json",
  "/logo192.png",
  "/logo512.png",
  "/panda.jpg",
  // Add other assets you want to cache
];
const currentUser = null;
const heartbeatInterval = 10 * 60 * 1000; // 10 minutes

// Install event - cache assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

// check if the user network connectivity
const isOnline = () => {
  // if the browser is online add a push message so i confirm
  if (navigator.onLine) {
    console.log("online");
    self.registration.showNotification("You are online", {
      body: "You are online",
      icon: "https://avatar.iran.liara.run/public/boy",
    });
  }
};

// Fetch event - serve cached assets
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

// Push event - handle push notifications
self.addEventListener("push", (event) => {
  console.log("🚀 ~ self.addEventListener ~ event:", event);
  let data = {};
  if (event.data) {
    try {
      data = event.data.json();
      console.log("🚀 ~ self.addEventListener ~ data:", data);
    } catch (e) {
      console.error("Error parsing push event data:", e);
    }
  }
  self.registration.showNotification(data.title || "Default Title", {
    body: data.body || "notified by Praise",
    icon: data.icon || "https://avatar.iran.liara.run/public/boy",
    data: {
      url: data.link || "https://example.com",
    },
  });
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
