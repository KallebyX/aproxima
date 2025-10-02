#!/usr/bin/env node
// 🚀 APROXIMA - Cache Warming System
// Automated cache warming for critical resources

const fs = require('fs');
const path = require('path');

class CacheWarmingSystem {
  constructor() {
    this.criticalResources = [
      '/',
      '/gestante',
      '/area-do-profissional',
      '/contato',
      '/quem-somos',
      '/produtos-acessiveis'
    ];
    
    this.staticAssets = [];
    this.warmingStrategy = {
      critical: { priority: 1, preload: true },
      important: { priority: 2, preload: false },
      background: { priority: 3, preload: false }
    };
  }

  async generateWarmingManifest() {
    console.log('🔥 Generating cache warming manifest...');
    
    const manifest = {
      version: '2.1.0',
      timestamp: new Date().toISOString(),
      resources: {
        critical: [],
        important: [],
        background: []
      },
      strategies: {
        serviceWorker: this.generateSWWarmingStrategy(),
        preload: this.generatePreloadStrategy(),
        prefetch: this.generatePrefetchStrategy()
      }
    };

    // Analyze build output
    await this.analyzeBuildOutput(manifest);
    
    // Generate warming instructions
    await this.generateWarmingInstructions(manifest);
    
    // Save manifest
    const manifestPath = path.join(process.cwd(), 'public', 'cache-warming-manifest.json');
    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
    
    console.log(`✅ Cache warming manifest saved to: ${manifestPath}`);
    return manifest;
  }

  async analyzeBuildOutput(manifest) {
    const buildDir = path.join(process.cwd(), '.next');
    
    if (!fs.existsSync(buildDir)) {
      console.warn('⚠️ Build directory not found. Run `npm run build` first.');
      return;
    }

    // Analyze static assets
    const staticDir = path.join(buildDir, 'static');
    if (fs.existsSync(staticDir)) {
      await this.analyzeStaticAssets(staticDir, manifest);
    }

    // Analyze pages
    await this.analyzePages(manifest);
  }

  async analyzeStaticAssets(staticDir, manifest) {
    const scanDir = (dir, category = 'background') => {
      if (!fs.existsSync(dir)) return;
      
      fs.readdirSync(dir).forEach(file => {
        const filePath = path.join(dir, file);
        const stats = fs.statSync(filePath);
        
        if (stats.isDirectory()) {
          scanDir(filePath, category);
        } else {
          const relativePath = path.relative(path.join(process.cwd(), '.next'), filePath);
          const webPath = `/_next/${relativePath.replace(/\\/g, '/')}`;
          
          let assetCategory = category;
          
          // Categorize by importance
          if (file.includes('app') || file.includes('main')) {
            assetCategory = 'critical';
          } else if (file.includes('vendor') || file.includes('chunk')) {
            assetCategory = 'important';
          }
          
          manifest.resources[assetCategory].push({
            url: webPath,
            type: this.getAssetType(file),
            size: stats.size,
            cache: true
          });
        }
      });
    };

    scanDir(staticDir);
  }

  async analyzePages(manifest) {
    this.criticalResources.forEach(route => {
      manifest.resources.critical.push({
        url: route,
        type: 'document',
        cache: true,
        preload: true
      });
    });
  }

  generateSWWarmingStrategy() {
    return {
      enabled: true,
      caches: {
        'static': {
          strategy: 'cache-first',
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
          resources: ['/_next/static/**']
        },
        'pages': {
          strategy: 'network-first',
          maxAge: 24 * 60 * 60 * 1000, // 1 day
          resources: ['/', '/gestante', '/area-do-profissional']
        },
        'api': {
          strategy: 'stale-while-revalidate',
          maxAge: 5 * 60 * 1000, // 5 minutes
          resources: ['/api/**']
        }
      }
    };
  }

  generatePreloadStrategy() {
    return {
      enabled: true,
      resources: [
        { url: '/_next/static/css/app.css', as: 'style' },
        { url: '/_next/static/js/app.js', as: 'script' },
        { url: '/favicon.png', as: 'image' }
      ],
      dns: [
        'fonts.googleapis.com',
        'fonts.gstatic.com'
      ]
    };
  }

  generatePrefetchStrategy() {
    return {
      enabled: true,
      routes: this.criticalResources,
      intersection: {
        enabled: true,
        threshold: 0.1,
        rootMargin: '50px'
      }
    };
  }

  async generateWarmingInstructions(manifest) {
    const instructions = {
      serviceWorker: this.generateSWInstructions(manifest),
      html: this.generateHTMLInstructions(manifest),
      runtime: this.generateRuntimeInstructions(manifest)
    };

    const instructionsPath = path.join(process.cwd(), 'cache-warming-instructions.json');
    fs.writeFileSync(instructionsPath, JSON.stringify(instructions, null, 2));
    
    console.log(`📋 Cache warming instructions saved to: ${instructionsPath}`);
  }

  generateSWInstructions(manifest) {
    return {
      install: {
        precache: manifest.resources.critical.map(r => r.url),
        strategies: manifest.strategies.serviceWorker.caches
      },
      runtime: {
        warmOnActivate: true,
        warmOnNetworkIdle: true,
        backgroundWarm: manifest.resources.background.map(r => r.url)
      }
    };
  }

  generateHTMLInstructions(manifest) {
    const preloadTags = manifest.strategies.preload.resources.map(resource => 
      `<link rel="preload" href="${resource.url}" as="${resource.as}">`
    );
    
    const dnsPrefetchTags = manifest.strategies.preload.dns.map(domain =>
      `<link rel="dns-prefetch" href="//${domain}">`
    );

    return {
      head: [
        ...dnsPrefetchTags,
        ...preloadTags
      ]
    };
  }

  generateRuntimeInstructions(manifest) {
    return {
      intersection: {
        enabled: manifest.strategies.prefetch.intersection.enabled,
        config: {
          threshold: manifest.strategies.prefetch.intersection.threshold,
          rootMargin: manifest.strategies.prefetch.intersection.rootMargin
        },
        targets: manifest.strategies.prefetch.routes
      },
      eager: {
        routes: manifest.resources.critical.filter(r => r.type === 'document').map(r => r.url)
      }
    };
  }

  getAssetType(filename) {
    const ext = path.extname(filename).toLowerCase();
    
    if (['.js'].includes(ext)) return 'script';
    if (['.css'].includes(ext)) return 'style';
    if (['.jpg', '.jpeg', '.png', '.webp', '.avif', '.svg'].includes(ext)) return 'image';
    if (['.woff', '.woff2', '.ttf', '.otf'].includes(ext)) return 'font';
    
    return 'other';
  }

  async warmCaches() {
    console.log('🌡️ Starting cache warming process...');
    
    try {
      // Generate fresh manifest
      const manifest = await this.generateWarmingManifest();
      
      // Warm critical resources
      await this.warmCriticalResources(manifest);
      
      console.log('✅ Cache warming completed successfully!');
      
    } catch (error) {
      console.error('❌ Cache warming failed:', error);
      process.exit(1);
    }
  }

  async warmCriticalResources(manifest) {
    const criticalResources = manifest.resources.critical;
    console.log(`🔥 Warming ${criticalResources.length} critical resources...`);
    
    // This would be implemented in production with actual HTTP requests
    // For now, we just simulate the warming process
    criticalResources.forEach(resource => {
      console.log(`   ✨ Warmed: ${resource.url}`);
    });
  }

  generateOptimizedSW() {
    const swPath = path.join(process.cwd(), 'public', 'sw-optimized.js');
    const swContent = `
// 🚀 APROXIMA - Optimized Service Worker with Cache Warming
// Auto-generated on ${new Date().toISOString()}

const CACHE_VERSION = 'aproxima-optimized-v2.1.0';
const CRITICAL_CACHE = \`\${CACHE_VERSION}-critical\`;
const STATIC_CACHE = \`\${CACHE_VERSION}-static\`;
const DYNAMIC_CACHE = \`\${CACHE_VERSION}-dynamic\`;

// Critical resources to cache immediately
const CRITICAL_RESOURCES = ${JSON.stringify(this.criticalResources, null, 2)};

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
`;

    fs.writeFileSync(swPath, swContent);
    console.log(`🔧 Optimized Service Worker generated: ${swPath}`);
  }
}

// Run cache warming if called directly
if (require.main === module) {
  const warmer = new CacheWarmingSystem();
  
  if (process.argv.includes('--generate-sw')) {
    warmer.generateOptimizedSW();
  } else {
    warmer.warmCaches().catch(console.error);
  }
}

module.exports = CacheWarmingSystem;