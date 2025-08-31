const CACHE_NAME = 'campuscompass-v1';
const STATIC_CACHE = 'campuscompass-static-v1';
const DYNAMIC_CACHE = 'campuscompass-dynamic-v1';

// Static assets to cache immediately
const STATIC_ASSETS = [
  '/app',
  '/manifest.json',
  // Add your critical CSS and JS files here after build
];

// Dynamic assets patterns (URLs that should be cached as they're requested)
const DYNAMIC_PATTERNS = [
  /^\/app/,
  /\.(?:js|css|woff2?|png|jpg|jpeg|svg)$/,
];

// Network-first patterns (always try network first, fallback to cache)
const NETWORK_FIRST_PATTERNS = [
  /api\.mapbox\.com/,
  /^https:\/\/api\./,
];

// Install event - cache static resources
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        return self.skipWaiting();
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        return self.clients.claim();
      })
  );
});

// Fetch event - handle requests with different strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle GET requests for app routes
  if (request.method !== 'GET' || !shouldHandle(request)) {
    return;
  }

  // Network-first strategy for API calls and map data
  if (NETWORK_FIRST_PATTERNS.some(pattern => pattern.test(request.url))) {
    event.respondWith(networkFirst(request));
    return;
  }

  // Cache-first strategy for static assets
  if (DYNAMIC_PATTERNS.some(pattern => pattern.test(request.url))) {
    event.respondWith(cacheFirst(request));
    return;
  }

  // Stale-while-revalidate for app routes
  if (url.pathname.startsWith('/app')) {
    event.respondWith(staleWhileRevalidate(request));
    return;
  }
});

// Helper function to determine if request should be handled
function shouldHandle(request) {
  const url = new URL(request.url);
  
  // Handle same-origin requests and app routes
  return url.origin === self.location.origin || url.pathname.startsWith('/app');
}

// Network-first strategy
async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    
    // Cache successful responses
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('Network failed, trying cache:', request.url);
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline page for navigation requests
    if (request.destination === 'document') {
      return caches.match('/app');
    }
    
    throw error;
  }
}

// Cache-first strategy
async function cacheFirst(request) {
  const cachedResponse = await caches.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('Cache and network failed for:', request.url);
    throw error;
  }
}

// Stale-while-revalidate strategy
async function staleWhileRevalidate(request) {
  const cache = await caches.open(DYNAMIC_CACHE);
  const cachedResponse = await cache.match(request);
  
  // Fetch in background
  const fetchPromise = fetch(request)
    .then(response => {
      if (response.ok) {
        cache.put(request, response.clone());
      }
      return response;
    })
    .catch(() => {
      // Network failed, but we might have cache
      return cachedResponse;
    });
  
  // Return cache immediately if available, otherwise wait for network
  return cachedResponse || fetchPromise;
}
