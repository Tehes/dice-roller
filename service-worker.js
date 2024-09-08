const CACHE_NAME = 'dice-roller-cache-v1'; // Clear and specific to the app and version
const urlsToCache = [
  '/',              // The home page
  '/css/style.css', // Your CSS file
  '/js/app.js',     // Your JavaScript file
  '/icons/180x180.png', // Icon for the PWA
  '/index.html'     // The main page
];

// Install Event
self.addEventListener('install', installEvent);

// Fetch Event
self.addEventListener('fetch', fetchEvent);

// Activate Event
self.addEventListener('activate', activateEvent);

// Install function to cache resources
function installEvent(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting();
}

// Fetch function with Stale-While-Revalidate strategy
function fetchEvent(event) {
    // Check if the request method is GET
    if (event.request.method !== 'GET') {
      return; // Ignore non-GET requests like POST, PUT, DELETE, etc.
    }

    // Log which URLs are being fetched
    // console.log('Fetching:', event.request.url);
  
    event.respondWith(
      caches.match(event.request).then(function(cachedResponse) {
        if (cachedResponse) {
          // Fetch from network in the background to update the cache
          event.waitUntil(
            fetch(event.request).then(function(networkResponse) {
              caches.open(CACHE_NAME).then(function(cache) {
                cache.put(event.request, networkResponse.clone()); // Clone the response before caching it
              });
            })
          );
          // Return cached response immediately
          return cachedResponse;
        }
        // If not in cache, fetch from network
        return fetch(event.request).then(function(networkResponse) {
          const clonedResponse = networkResponse.clone(); // Clone the response before caching it
          caches.open(CACHE_NAME).then(function(cache) {
            cache.put(event.request, clonedResponse);
          });
          return networkResponse; // Return the original response to the client
        });
      })
    );
  }

// Activate function to clean up old caches
function activateEvent(event) {
  const cacheWhitelist = [CACHE_NAME]; // Keep only the current cache
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName); // Delete old caches
          }
        })
      );
    })
  );
  self.clients.claim(); // Ensure the service worker takes control of the page immediately
}