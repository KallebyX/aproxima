
// 🚀 APROXIMA - Optimized Service Worker with Cache Warming
// Auto-generated on 2025-10-01T21:50:49.670Z

const CACHE_VERSION = 'aproxima-optimized-v2.1.0';
const CRITICAL_CACHE = `${CACHE_VERSION}-critical`;
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const DYNAMIC_CACHE = `${CACHE_VERSION}-dynamic`;

// Critical resources to cache immediately
const CRITICAL_RESOURCES = [
  "/",
  "/gestante",
  "/area-do-profissional",
  "/contato",
  "/quem-somos",
  "/produtos-acessiveis"
];

// Install event with aggressive caching
self.addEventListener('install', (event) => {
  event.waitUntil(
    Promise.all([
      caches.open(CRITICAL_CACHE).then(cache => {
        console.log('🔥 Warming critical cache...');
        return cache.addAll(CRITICAL_RESOURCES);
      }),
      self.skipWaiting()
    ])
  );
});

// Activate event with cleanup
self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      // Clean old caches
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames
            .filter(cacheName => !cacheName.startsWith(CACHE_VERSION))
            .map(cacheName => caches.delete(cacheName))
        );
      }),
      // Claim clients
      self.clients.claim(),
      // Warm additional caches
      warmAdditionalResources()
    ])
  );
});

// Advanced fetch handler with intelligent caching
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  
  const url = new URL(event.request.url);
  
  if (url.pathname.startsWith('/_next/static/')) {
    event.respondWith(staticAssetStrategy(event.request));
  } else if (url.pathname.startsWith('/api/')) {
    event.respondWith(apiStrategy(event.request));
  } else {
    event.respondWith(pageStrategy(event.request));
  }
});

async function staticAssetStrategy(request) {
  const cache = await caches.open(STATIC_CACHE);
  const cached = await cache.match(request);
  
  if (cached) return cached;
  
  try {
    const response = await fetch(request);
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    return new Response('Static asset unavailable', { status: 503 });
  }
}

async function apiStrategy(request) {
  try {
    const response = await fetch(request);
    
    if (response.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, response.clone());
    }
    
    return response;
  } catch {
    const cache = await caches.open(DYNAMIC_CACHE);
    const cached = await cache.match(request);
    return cached || new Response('API unavailable', { status: 503 });
  }
}

async function pageStrategy(request) {
  const cache = await caches.open(CRITICAL_CACHE);
  
  try {
    const response = await fetch(request);
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await cache.match(request);
    return cached || caches.match('/offline.html');
  }
}

async function warmAdditionalResources() {
  const additionalResources = [
    '/_next/static/css/app.css',
    '/_next/static/js/app.js',
    '/favicon.png'
  ];
  
  const cache = await caches.open(STATIC_CACHE);
  
  try {
    await cache.addAll(additionalResources);
    console.log('✅ Additional resources warmed');
  } catch (error) {
    console.warn('⚠️ Some additional resources failed to warm:', error);
  }
}

// Performance monitoring
let performanceMetrics = {
  cacheHits: 0,
  cacheMisses: 0,
  networkRequests: 0
};

setInterval(() => {
  console.log('📊 SW Performance:', performanceMetrics);
}, 60000);
