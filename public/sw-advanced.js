// 🚀 APROXIMA - Enterprise Service Worker
// FASE 3: Performance & Optimization
// Advanced PWA with intelligent caching strategies

const CACHE_VERSION = 'aproxima-v2.1.0';
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const DYNAMIC_CACHE = `${CACHE_VERSION}-dynamic`;
const API_CACHE = `${CACHE_VERSION}-api`;
const IMAGE_CACHE = `${CACHE_VERSION}-images`;

// Cache TTL Configuration (in milliseconds)
const CACHE_TTL = {
  static: 7 * 24 * 60 * 60 * 1000, // 7 days
  dynamic: 24 * 60 * 60 * 1000, // 1 day  
  api: 5 * 60 * 1000, // 5 minutes
  images: 30 * 24 * 60 * 60 * 1000, // 30 days
};

// Critical resources to cache immediately
const CRITICAL_RESOURCES = [
  '/',
  '/offline.html',
  '/_next/static/css/',
  '/_next/static/js/',
  '/favicon.png',
  '/site.webmanifest'
];

// API endpoints to cache with different strategies
const API_ENDPOINTS = {
  cacheable: [
    '/api/lgpd/consent',
    '/api/security/status'
  ],
  networkFirst: [
    '/api/lgpd/data-request',
    '/api/security/events'
  ],
  cacheFirst: [
    '/api/health'
  ]
};

// Network patterns that should bypass cache
const BYPASS_PATTERNS = [
  /\/api\/auth\//,
  /\/api\/admin\//,
  /\/__nextjs_original-stack-frame/,
  /\/_next\/webpack-hmr/
];

// Background sync configuration
const SYNC_TAGS = {
  analytics: 'analytics-sync',
  feedback: 'feedback-sync',
  lgpd: 'lgpd-sync',
  offline: 'offline-sync'
};

// Performance monitoring
let performanceMetrics = {
  cacheHits: 0,
  cacheMisses: 0,
  networkRequests: 0,
  offlineRequests: 0,
  avgResponseTime: 0
};

// Queue for background sync
let syncQueue = {
  analytics: [],
  feedback: [],
  lgpd: [],
  offline: []
};

class AdvancedServiceWorker {
  constructor() {
    this.initializeEventListeners();
    this.performanceMetrics = {
      cacheHits: 0,
      cacheMisses: 0,
      networkRequests: 0,
      offlineRequests: 0
    };
  }

  initializeEventListeners() {
    self.addEventListener('install', this.handleInstall.bind(this));
    self.addEventListener('activate', this.handleActivate.bind(this));
    self.addEventListener('fetch', this.handleFetch.bind(this));
    self.addEventListener('message', this.handleMessage.bind(this));
    self.addEventListener('sync', this.handleBackgroundSync.bind(this));
    self.addEventListener('push', this.handlePushNotification.bind(this));
    self.addEventListener('notificationclick', this.handleNotificationClick.bind(this));
    
    // Listen for online/offline events
    self.addEventListener('online', this.handleOnline.bind(this));
    self.addEventListener('offline', this.handleOffline.bind(this));
  }

  async handleInstall(event) {
    console.log('🚀 APROXIMA SW: Installing advanced service worker');
    
    event.waitUntil(
      this.preCacheResources()
        .then(() => {
          console.log('✅ APROXIMA SW: Pre-caching completed');
          return self.skipWaiting();
        })
        .catch(error => {
          console.error('❌ APROXIMA SW: Pre-caching failed:', error);
        })
    );
  }

  async preCacheResources() {
    const cache = await caches.open(STATIC_CACHE);
    
    // Fetch and cache critical resources
    const cachePromises = CRITICAL_RESOURCES.map(async (resource) => {
      try {
        const response = await fetch(resource);
        if (response.ok) {
          await cache.put(resource, response.clone());
          console.log(`✅ Cached: ${resource}`);
        }
      } catch (error) {
        console.warn(`⚠️ Failed to cache: ${resource}`, error);
      }
    });

    await Promise.allSettled(cachePromises);
  }

  async handleActivate(event) {
    console.log('🔄 APROXIMA SW: Activating service worker');
    
    event.waitUntil(
      Promise.all([
        this.cleanupOldCaches(),
        self.clients.claim()
      ])
    );
  }

  async cleanupOldCaches() {
    const cacheNames = await caches.keys();
    const currentCaches = [STATIC_CACHE, DYNAMIC_CACHE, API_CACHE, IMAGE_CACHE];
    
    const deletePromises = cacheNames
      .filter(cacheName => !currentCaches.includes(cacheName))
      .map(cacheName => {
        console.log(`🗑️ Deleting old cache: ${cacheName}`);
        return caches.delete(cacheName);
      });

    await Promise.all(deletePromises);
  }

  handleFetch(event) {
    const { request } = event;
    const url = new URL(request.url);

    // Skip non-GET requests and bypass patterns
    if (request.method !== 'GET' || this.shouldBypassCache(url)) {
      return;
    }

    // Route request based on type
    if (this.isAPIRequest(url)) {
      event.respondWith(this.handleAPIRequest(request));
    } else if (this.isImageRequest(url)) {
      event.respondWith(this.handleImageRequest(request));
    } else if (this.isStaticResource(url)) {
      event.respondWith(this.handleStaticResource(request));
    } else {
      event.respondWith(this.handlePageRequest(request));
    }
  }

  shouldBypassCache(url) {
    return BYPASS_PATTERNS.some(pattern => pattern.test(url.pathname));
  }

  isAPIRequest(url) {
    return url.pathname.startsWith('/api/');
  }

  isImageRequest(url) {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
    return imageExtensions.some(ext => url.pathname.toLowerCase().includes(ext));
  }

  isStaticResource(url) {
    return url.pathname.startsWith('/_next/static/') || 
           url.pathname.includes('.css') || 
           url.pathname.includes('.js');
  }

  async handleAPIRequest(request) {
    const url = new URL(request.url);
    const strategy = this.getAPIStrategy(url.pathname);

    switch (strategy) {
      case 'cacheFirst':
        return this.cacheFirstStrategy(request, API_CACHE);
      case 'networkFirst':
        return this.networkFirstStrategy(request, API_CACHE);
      default:
        return this.staleWhileRevalidateStrategy(request, API_CACHE);
    }
  }

  getAPIStrategy(pathname) {
    if (API_ENDPOINTS.cacheFirst.some(endpoint => pathname.includes(endpoint))) {
      return 'cacheFirst';
    }
    if (API_ENDPOINTS.networkFirst.some(endpoint => pathname.includes(endpoint))) {
      return 'networkFirst';
    }
    return 'staleWhileRevalidate';
  }

  async handleImageRequest(request) {
    return this.cacheFirstStrategy(request, IMAGE_CACHE);
  }

  async handleStaticResource(request) {
    return this.cacheFirstStrategy(request, STATIC_CACHE);
  }

  async handlePageRequest(request) {
    return this.networkFirstStrategy(request, DYNAMIC_CACHE);
  }

  // Caching Strategies
  async cacheFirstStrategy(request, cacheName) {
    try {
      const cache = await caches.open(cacheName);
      const cachedResponse = await cache.match(request);

      if (cachedResponse && !this.isCacheExpired(cachedResponse)) {
        this.performanceMetrics.cacheHits++;
        return cachedResponse;
      }

      const networkResponse = await fetch(request);
      if (networkResponse.ok) {
        await this.putInCacheWithTTL(cache, request, networkResponse.clone(), cacheName);
      }
      
      this.performanceMetrics.networkRequests++;
      return networkResponse;
    } catch (error) {
      console.warn('Cache-first strategy failed:', error);
      this.performanceMetrics.cacheMisses++;
      return this.getOfflineFallback(request);
    }
  }

  async networkFirstStrategy(request, cacheName) {
    try {
      const networkResponse = await fetch(request);
      
      if (networkResponse.ok) {
        const cache = await caches.open(cacheName);
        await this.putInCacheWithTTL(cache, request, networkResponse.clone(), cacheName);
        this.performanceMetrics.networkRequests++;
        return networkResponse;
      }
    } catch (error) {
      console.warn('Network request failed, falling back to cache:', error);
    }

    // Fallback to cache
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      this.performanceMetrics.cacheHits++;
      return cachedResponse;
    }

    this.performanceMetrics.offlineRequests++;
    return this.getOfflineFallback(request);
  }

  async staleWhileRevalidateStrategy(request, cacheName) {
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(request);

    // Background update
    const fetchPromise = fetch(request)
      .then(response => {
        if (response.ok) {
          this.putInCacheWithTTL(cache, request, response.clone(), cacheName);
        }
        return response;
      })
      .catch(error => {
        console.warn('Background fetch failed:', error);
      });

    if (cachedResponse) {
      this.performanceMetrics.cacheHits++;
      return cachedResponse;
    }

    this.performanceMetrics.networkRequests++;
    return fetchPromise;
  }

  async putInCacheWithTTL(cache, request, response, cacheName) {
    const responseToCache = response.clone();
    const headers = new Headers(responseToCache.headers);
    headers.set('sw-cache-timestamp', Date.now().toString());
    headers.set('sw-cache-type', cacheName);
    
    const modifiedResponse = new Response(responseToCache.body, {
      status: responseToCache.status,
      statusText: responseToCache.statusText,
      headers: headers
    });

    await cache.put(request, modifiedResponse);
  }

  isCacheExpired(response) {
    const cacheTimestamp = response.headers.get('sw-cache-timestamp');
    const cacheType = response.headers.get('sw-cache-type');
    
    if (!cacheTimestamp || !cacheType) return false;

    const now = Date.now();
    const cacheAge = now - parseInt(cacheTimestamp);
    const ttl = this.getTTLForCacheType(cacheType);

    return cacheAge > ttl;
  }

  getTTLForCacheType(cacheType) {
    if (cacheType.includes('static')) return CACHE_TTL.static;
    if (cacheType.includes('api')) return CACHE_TTL.api;
    if (cacheType.includes('images')) return CACHE_TTL.images;
    return CACHE_TTL.dynamic;
  }

  async getOfflineFallback(request) {
    const url = new URL(request.url);
    
    if (this.isImageRequest(url)) {
      return new Response(`
        <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
          <rect width="200" height="200" fill="#f0f0f0"/>
          <text x="100" y="100" text-anchor="middle" fill="#666">Offline</text>
        </svg>
      `, {
        headers: { 'Content-Type': 'image/svg+xml' }
      });
    }

    if (request.destination === 'document') {
      const cache = await caches.open(STATIC_CACHE);
      const offlinePage = await cache.match('/offline.html');
      if (offlinePage) {
        return offlinePage;
      }
      
      // Generate dynamic offline page
      return new Response(`
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <title>APROXIMA - Offline</title>
          <style>
            body { 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              text-align: center; 
              padding: 2rem; 
              background: linear-gradient(135deg, #2A1B5D 0%, #5B3F99 100%);
              color: white;
              min-height: 100vh;
              display: flex;
              align-items: center;
              justify-content: center;
              flex-direction: column;
            }
            h1 { color: #fff; margin-bottom: 1rem; }
            p { opacity: 0.9; margin-bottom: 2rem; }
            .icon { font-size: 4rem; margin-bottom: 2rem; }
            .retry-btn {
              background: #fff;
              color: #2A1B5D;
              border: none;
              padding: 12px 24px;
              border-radius: 6px;
              cursor: pointer;
              font-weight: 600;
              transition: transform 0.2s;
            }
            .retry-btn:hover { transform: translateY(-2px); }
          </style>
        </head>
        <body>
          <div class="icon">📱</div>
          <h1>APROXIMA - Modo Offline</h1>
          <p>Você está sem conexão. Algumas funcionalidades podem estar limitadas.</p>
          <button class="retry-btn" onclick="window.location.reload()">Tentar Novamente</button>
          <script>
            window.addEventListener('online', () => {
              window.location.reload();
            });
          </script>
        </body>
        </html>
      `, { 
        status: 503,
        headers: { 'Content-Type': 'text/html; charset=utf-8' }
      });
    }

    return new Response('Offline', { 
      status: 503,
      headers: { 'Content-Type': 'text/plain' }
    });
  }

  handleMessage(event) {
    const { type, payload } = event.data;

    switch (type) {
      case 'SKIP_WAITING':
        self.skipWaiting();
        break;
      case 'GET_CACHE_STATUS':
        event.ports[0].postMessage({
          cacheStatus: this.performanceMetrics,
          version: CACHE_VERSION
        });
        break;
      case 'CLEAR_CACHE':
        this.clearAllCaches().then(() => {
          event.ports[0].postMessage({ success: true });
        });
        break;
      case 'WARM_CACHE':
        this.warmCache(payload.urls).then(() => {
          event.ports[0].postMessage({ success: true });
        });
        break;
    }
  }

  async clearAllCaches() {
    const cacheNames = await caches.keys();
    await Promise.all(cacheNames.map(name => caches.delete(name)));
    console.log('🗑️ All caches cleared');
  }

  async warmCache(urls) {
    const cache = await caches.open(DYNAMIC_CACHE);
    const promises = urls.map(url => 
      fetch(url)
        .then(response => response.ok ? cache.put(url, response) : null)
        .catch(error => console.warn(`Failed to warm cache for ${url}:`, error))
    );
    await Promise.allSettled(promises);
    console.log('🔥 Cache warmed for', urls.length, 'URLs');
  }

  handleBackgroundSync(event) {
    if (event.tag === 'lgpd-consent-sync') {
      event.waitUntil(this.syncLGPDConsent());
    } else if (event.tag === 'analytics-sync') {
      event.waitUntil(this.syncAnalyticsData());
    }
  }

  async syncLGPDConsent() {
    // Sync pending LGPD consent data when back online
    try {
      const pendingConsents = await this.getPendingConsents();
      for (const consent of pendingConsents) {
        await fetch('/api/lgpd/consent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(consent)
        });
      }
      await this.clearPendingConsents();
      console.log('✅ LGPD consent data synced');
    } catch (error) {
      console.error('❌ LGPD sync failed:', error);
    }
  }

  async syncAnalyticsData() {
    // Sync pending analytics data
    try {
      const pendingAnalytics = await this.getPendingAnalytics();
      for (const data of pendingAnalytics) {
        await fetch('/api/analytics/performance', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
      }
      await this.clearPendingAnalytics();
      console.log('✅ Analytics data synced');
    } catch (error) {
      console.error('❌ Analytics sync failed:', error);
    }
  }

  async getPendingConsents() {
    return await this.getFromIndexedDB('pendingConsents') || [];
  }

  async clearPendingConsents() {
    await this.clearFromIndexedDB('pendingConsents');
  }

  async getPendingAnalytics() {
    return await this.getFromIndexedDB('pendingAnalytics') || [];
  }

  async clearPendingAnalytics() {
    await this.clearFromIndexedDB('pendingAnalytics');
  }

  // IndexedDB operations for offline data storage
  async getFromIndexedDB(storeName) {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('aproxima-offline', 1);
      
      request.onerror = () => reject(request.error);
      
      request.onsuccess = () => {
        const db = request.result;
        const transaction = db.transaction([storeName], 'readonly');
        const store = transaction.objectStore(storeName);
        const getRequest = store.getAll();
        
        getRequest.onsuccess = () => resolve(getRequest.result);
        getRequest.onerror = () => reject(getRequest.error);
      };

      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(storeName)) {
          db.createObjectStore(storeName, { keyPath: 'id', autoIncrement: true });
        }
      };
    });
  }

  async saveToIndexedDB(storeName, data) {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('aproxima-offline', 1);
      
      request.onerror = () => reject(request.error);
      
      request.onsuccess = () => {
        const db = request.result;
        const transaction = db.transaction([storeName], 'readwrite');
        const store = transaction.objectStore(storeName);
        const saveRequest = store.add({ ...data, timestamp: Date.now() });
        
        saveRequest.onsuccess = () => resolve(saveRequest.result);
        saveRequest.onerror = () => reject(saveRequest.error);
      };

      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(storeName)) {
          db.createObjectStore(storeName, { keyPath: 'id', autoIncrement: true });
        }
      };
    });
  }

  async clearFromIndexedDB(storeName) {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('aproxima-offline', 1);
      
      request.onsuccess = () => {
        const db = request.result;
        const transaction = db.transaction([storeName], 'readwrite');
        const store = transaction.objectStore(storeName);
        const clearRequest = store.clear();
        
        clearRequest.onsuccess = () => resolve();
        clearRequest.onerror = () => reject(clearRequest.error);
      };
    });
  }

  // Advanced offline request queuing
  async queueOfflineRequest(request, type = 'general') {
    const requestData = {
      url: request.url,
      method: request.method,
      headers: Object.fromEntries(request.headers.entries()),
      body: request.method !== 'GET' ? await request.text() : null,
      type: type,
      timestamp: Date.now()
    };

    await this.saveToIndexedDB('offlineRequests', requestData);
    console.log(`📥 Queued offline ${type} request: ${request.url}`);
  }

  // Process offline queue when back online
  async processOfflineQueue() {
    const offlineRequests = await this.getFromIndexedDB('offlineRequests') || [];
    
    for (const requestData of offlineRequests) {
      try {
        const request = new Request(requestData.url, {
          method: requestData.method,
          headers: requestData.headers,
          body: requestData.body
        });

        const response = await fetch(request);
        if (response.ok) {
          console.log(`✅ Processed offline ${requestData.type} request: ${requestData.url}`);
        }
      } catch (error) {
        console.error(`❌ Failed to process offline request: ${requestData.url}`, error);
      }
    }

    await this.clearFromIndexedDB('offlineRequests');
  }

  // Smart cache warming for critical resources
  async warmCriticalCaches() {
    const criticalResources = [
      '/',
      '/gestante',
      '/area-do-profissional',
      '/contato',
      '/_next/static/css/app.css',
      '/_next/static/js/app.js'
    ];

    for (const resource of criticalResources) {
      try {
        const response = await fetch(resource);
        if (response.ok) {
          const cache = await caches.open(STATIC_CACHE);
          await cache.put(resource, response);
          console.log(`🔥 Warmed cache for: ${resource}`);
        }
      } catch (error) {
        console.warn(`⚠️ Failed to warm cache for: ${resource}`, error);
      }
    }
  }

  handlePushNotification(event) {
    if (!event.data) return;

    const data = event.data.json();
    const options = {
      body: data.body || 'Nova notificação da APROXIMA',
      icon: '/favicon.png',
      badge: '/favicon.png',
      vibrate: [100, 50, 100],
      data: data.data || {},
      actions: [
        {
          action: 'view',
          title: 'Ver',
          icon: '/icons/view.png'
        },
        {
          action: 'dismiss',
          title: 'Dispensar',
          icon: '/icons/dismiss.png'
        }
      ],
      requireInteraction: true,
      silent: false,
      tag: data.tag || 'default'
    };

    event.waitUntil(
      self.registration.showNotification(data.title || 'APROXIMA', options)
    );
  }

  handleNotificationClick(event) {
    event.notification.close();

    if (event.action === 'view') {
      event.waitUntil(
        clients.openWindow(event.notification.data.url || '/')
      );
    } else if (event.action === 'dismiss') {
      // Just close the notification (already done above)
    } else {
      // Default action - open the app
      event.waitUntil(
        clients.openWindow('/')
      );
    }
  }

  async handleOnline() {
    console.log('🌐 Back online - processing offline queue');
    await this.processOfflineQueue();
    await this.syncLGPDConsent();
    await this.syncAnalyticsData();
  }

  handleOffline() {
    console.log('📵 Gone offline - enabling offline mode');
    this.performanceMetrics.offlineRequests++;
  }
}

// Initialize the advanced service worker
const advancedSW = new AdvancedServiceWorker();

// Log performance metrics periodically
setInterval(() => {
  console.log('📊 APROXIMA SW Performance:', advancedSW.performanceMetrics);
}, 60000); // Every minute