// Service Worker para PWA - Aproxima
const CACHE_NAME = 'aproxima-v1.0.0';
const STATIC_CACHE = 'aproxima-static-v1';
const RUNTIME_CACHE = 'aproxima-runtime-v1';

// Assets estáticos para cache
const STATIC_ASSETS = [
  '/',
  '/gestante',
  '/area-do-profissional', 
  '/produtos-acessiveis',
  '/quem-somos',
  '/contato',
  '/favicon.ico',
  '/icon-192.png',
  '/icon-512.png',
  '/site.webmanifest'
];

// Assets críticos que devem ser sempre cached
const CRITICAL_ASSETS = [
  '/',
  '/offline.html'
];

// Instalação do Service Worker
self.addEventListener('install', (event) => {
  console.log('[SW] Installing Service Worker');
  
  event.waitUntil(
    (async () => {
      try {
        // Cache assets estáticos
        const staticCache = await caches.open(STATIC_CACHE);
        await staticCache.addAll(STATIC_ASSETS);
        
        // Cache assets críticos
        const mainCache = await caches.open(CACHE_NAME);
        await mainCache.addAll(CRITICAL_ASSETS);
        
        console.log('[SW] Assets cached successfully');
      } catch (error) {
        console.error('[SW] Failed to cache assets:', error);
      }
    })()
  );
  
  // Força ativação imediata
  self.skipWaiting();
});

// Ativação do Service Worker
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating Service Worker');
  
  event.waitUntil(
    (async () => {
      // Limpa caches antigos
      const cacheNames = await caches.keys();
      const oldCaches = cacheNames.filter(
        name => name !== CACHE_NAME && name !== STATIC_CACHE && name !== RUNTIME_CACHE
      );
      
      await Promise.all(
        oldCaches.map(name => {
          console.log('[SW] Deleting old cache:', name);
          return caches.delete(name);
        })
      );
      
      // Força controle de todos os clients
      await self.clients.claim();
      console.log('[SW] Service Worker activated');
    })()
  );
});

// Interceptação de requests (estratégia Cache First para assets, Network First para API)
self.addEventListener('fetch', (event) => {
  // Só intercepta requests GET
  if (event.request.method !== 'GET') return;
  
  // Ignora requests para outros domínios
  if (!event.request.url.startsWith(self.location.origin)) return;
  
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  const url = new URL(request.url);
  
  try {
    // Estratégia para diferentes tipos de resources
    if (isStaticAsset(url.pathname)) {
      return handleStaticAsset(request);
    } else if (isAPIRequest(url.pathname)) {
      return handleAPIRequest(request);
    } else {
      return handlePageRequest(request);
    }
  } catch (error) {
    console.error('[SW] Request failed:', error);
    return handleOffline(request);
  }
}

// Cache First para assets estáticos
async function handleStaticAsset(request) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.error('[SW] Static asset fetch failed:', error);
    throw error;
  }
}

// Network First para requests de API
async function handleAPIRequest(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(RUNTIME_CACHE);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.log('[SW] Network failed, trying cache for API request');
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    throw error;
  }
}

// Stale While Revalidate para páginas
async function handlePageRequest(request) {
  const cachedResponse = await caches.match(request);
  
  const fetchPromise = fetch(request).then(networkResponse => {
    if (networkResponse.ok) {
      const cache = caches.open(RUNTIME_CACHE);
      cache.then(c => c.put(request, networkResponse.clone()));
    }
    return networkResponse;
  }).catch(() => cachedResponse);
  
  return cachedResponse || await fetchPromise;
}

// Fallback offline
async function handleOffline(request) {
  // Para páginas HTML, retorna página offline
  if (request.destination === 'document') {
    return await caches.match('/offline.html') || new Response(
      '<html><body><h1>Offline</h1><p>Conecte-se à internet para acessar o Aproxima.</p></body></html>',
      { headers: { 'Content-Type': 'text/html' } }
    );
  }
  
  // Para imagens, retorna placeholder
  if (request.destination === 'image') {
    return new Response(
      '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" fill="#ccc"><rect width="100%" height="100%"/><text x="50%" y="50%" text-anchor="middle" dy=".3em">Offline</text></svg>',
      { headers: { 'Content-Type': 'image/svg+xml' } }
    );
  }
  
  return new Response('Offline', { status: 503 });
}

// Helpers
function isStaticAsset(pathname) {
  return pathname.includes('.') || // arquivos com extensão
         pathname.startsWith('/icon') ||
         pathname.startsWith('/favicon') ||
         pathname.includes('manifest');
}

function isAPIRequest(pathname) {
  return pathname.startsWith('/api/');
}

// Background sync para formulários offline
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(processOfflineActions());
  }
});

async function processOfflineActions() {
  // Processa ações offline salvas no IndexedDB
  console.log('[SW] Processing offline actions');
}

// Push notifications (preparado para futuro)
self.addEventListener('push', (event) => {
  if (!event.data) return;
  
  const data = event.data.json();
  const options = {
    body: data.body,
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    tag: 'aproxima-notification',
    requireInteraction: true,
    actions: [
      {
        action: 'open',
        title: 'Abrir',
        icon: '/icon-192.png'
      },
      {
        action: 'close', 
        title: 'Fechar'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Clique em notificação
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.action === 'open') {
    event.waitUntil(
      self.clients.openWindow('/')
    );
  }
});

console.log('[SW] Service Worker loaded successfully');