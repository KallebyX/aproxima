// 🚀 APROXIMA - Enterprise Cache System with LRU Memory Management
// FASE 3: Performance & Optimization - Ultra-optimized cache with multi-strategy support

interface CacheConfig {
  ttl: number;
  strategy: 'stale-while-revalidate' | 'cache-first' | 'network-first' | 'multi-strategy';
  warmup?: boolean;
  tags?: string[];
  fallbackStrategy?: 'cache-first' | 'network-first';
  networkTimeout?: number;
  maxStaleAge?: number;
}

interface CacheEntry<T = any> {
  data: T;
  timestamp: number;
  ttl: number;
  tags: string[];
  hits: number;
  lastAccess: number;
}

class EnterpriseCache {
  private cache: Map<string, CacheEntry> = new Map();
  private warmupQueue: Set<string> = new Set();
  private maxSize: number = 1000;
  private maxMemory: number = 100 * 1024 * 1024; // 100MB
  private currentMemoryUsage: number = 0;
  private analyticsData = {
    hits: 0,
    misses: 0,
    evictions: 0,
    warmups: 0,
    memoryUsage: 0
  };

  // LRU (Least Recently Used) tracking for memory management
  private accessOrder: string[] = [];
  private memoryStrategy: 'lru' | 'lfu' | 'ttl' = 'lru';

  // Default configurations with multi-strategy caching
  private defaultConfigs: Record<string, CacheConfig> = {
    'api:health': {
      ttl: 60000,
      strategy: 'stale-while-revalidate',
      warmup: true,
      tags: ['health', 'api']
    },
    'api:lgpd': {
      ttl: 300000,
      strategy: 'network-first',
      warmup: false,
      tags: ['lgpd', 'compliance', 'api']
    },
    'static:pages': {
      ttl: 3600000,
      strategy: 'cache-first',
      warmup: true,
      tags: ['static', 'pages']
    },
    'dynamic:user': {
      ttl: 900000,
      strategy: 'multi-strategy',
      warmup: false,
      tags: ['user', 'dynamic'],
      fallbackStrategy: 'cache-first',
      networkTimeout: 3000
    }
  };

  constructor() {
    this.startCleanupInterval();
    this.startWarmupProcess();
    console.log('🚀 Enterprise Cache System initialized with LRU memory management');
  }

  async get<T>(
    key: string,
    fetcher: () => Promise<T>,
    config?: Partial<CacheConfig>
  ): Promise<T> {
    const cacheKey = this.normalizeKey(key);
    const cacheConfig = this.getCacheConfig(key, config);
    const entry = this.cache.get(cacheKey);

    if (entry) {
      entry.lastAccess = Date.now();
      this.updateAccessOrder(cacheKey);
    }

    switch (cacheConfig.strategy) {
      case 'cache-first':
        return this.cacheFirstStrategy(cacheKey, fetcher, cacheConfig, entry);
      case 'network-first':
        return this.networkFirstStrategy(cacheKey, fetcher, cacheConfig, entry);
      case 'multi-strategy':
        return this.multiStrategyCache(cacheKey, fetcher, cacheConfig, entry);
      case 'stale-while-revalidate':
      default:
        return this.staleWhileRevalidateStrategy(cacheKey, fetcher, cacheConfig, entry);
    }
  }

  set<T>(key: string, data: T, config?: Partial<CacheConfig>): void {
    const cacheKey = this.normalizeKey(key);
    const cacheConfig = this.getCacheConfig(key, config);
    
    const dataSize = this.estimateMemoryUsage(data);
    this.ensureMemoryLimits(dataSize);
    
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttl: cacheConfig.ttl,
      tags: cacheConfig.tags || [],
      hits: 0,
      lastAccess: Date.now()
    };

    this.cache.set(cacheKey, entry);
    this.currentMemoryUsage += dataSize;
    this.analyticsData.memoryUsage = this.currentMemoryUsage;
    this.updateAccessOrder(cacheKey);
    
    if (cacheConfig.warmup) {
      this.warmupQueue.add(cacheKey);
    }
  }

  // LRU Memory Management Implementation
  private ensureMemoryLimits(newDataSize: number): void {
    while (this.cache.size >= this.maxSize) {
      this.evictLRU();
    }
    
    while (this.currentMemoryUsage + newDataSize > this.maxMemory && this.cache.size > 0) {
      this.evictLRU();
    }
  }

  private evictLRU(): void {
    if (this.accessOrder.length === 0) return;
    
    const lruKey = this.accessOrder[0];
    const entry = this.cache.get(lruKey);
    
    if (entry) {
      this.currentMemoryUsage -= this.estimateMemoryUsage(entry.data);
      this.cache.delete(lruKey);
      this.accessOrder = this.accessOrder.filter(key => key !== lruKey);
      this.analyticsData.evictions++;
      this.analyticsData.memoryUsage = this.currentMemoryUsage;
    }
  }

  private updateAccessOrder(key: string): void {
    this.accessOrder = this.accessOrder.filter(k => k !== key);
    this.accessOrder.push(key);
  }

  private estimateMemoryUsage(data: any): number {
    const jsonString = JSON.stringify(data);
    return jsonString.length * 2;
  }

  invalidate(keyOrTags: string | string[]): number {
    let invalidatedCount = 0;

    if (typeof keyOrTags === 'string') {
      if (this.cache.has(keyOrTags)) {
        const entry = this.cache.get(keyOrTags);
        if (entry) {
          this.currentMemoryUsage -= this.estimateMemoryUsage(entry.data);
        }
        this.cache.delete(keyOrTags);
        this.accessOrder = this.accessOrder.filter(key => key !== keyOrTags);
        invalidatedCount = 1;
      }
    } else {
      const tagsToInvalidate = new Set(keyOrTags);
      
      for (const [key, entry] of this.cache.entries()) {
        const hasMatchingTag = entry.tags.some(tag => tagsToInvalidate.has(tag));
        if (hasMatchingTag) {
          this.currentMemoryUsage -= this.estimateMemoryUsage(entry.data);
          this.cache.delete(key);
          this.accessOrder = this.accessOrder.filter(k => k !== key);
          invalidatedCount++;
        }
      }
    }

    this.analyticsData.memoryUsage = this.currentMemoryUsage;
    console.log(`🗑️ Cache invalidated: ${invalidatedCount} entries`);
    return invalidatedCount;
  }

  async warmup(keys: string[], fetchers: Record<string, () => Promise<any>>): Promise<void> {
    console.log('🔥 Starting cache warmup for', keys.length, 'keys');
    
    const warmupPromises = keys.map(async (key) => {
      try {
        if (fetchers[key]) {
          const data = await fetchers[key]();
          this.set(key, data);
          this.analyticsData.warmups++;
          console.log(`✅ Warmed up: ${key}`);
        }
      } catch (error) {
        console.warn(`⚠️ Warmup failed for ${key}:`, error);
      }
    });

    await Promise.allSettled(warmupPromises);
    console.log('🎯 Cache warmup completed');
  }

  getStats() {
    const totalRequests = this.analyticsData.hits + this.analyticsData.misses;
    const hitRate = totalRequests > 0 ? (this.analyticsData.hits / totalRequests) * 100 : 0;

    return {
      size: this.cache.size,
      memoryUsage: this.formatBytes(this.currentMemoryUsage),
      memoryLimit: this.formatBytes(this.maxMemory),
      hitRate: Math.round(hitRate * 100) / 100,
      analytics: { ...this.analyticsData },
      lruOrder: [...this.accessOrder]
    };
  }

  private formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // Multi-Strategy Cache Implementation
  private async cacheFirstStrategy<T>(
    key: string,
    fetcher: () => Promise<T>,
    config: CacheConfig,
    entry?: CacheEntry<T>
  ): Promise<T> {
    if (entry && !this.isExpired(entry)) {
      this.analyticsData.hits++;
      entry.hits++;
      return entry.data;
    }

    try {
      const data = await fetcher();
      this.set(key, data, config);
      this.analyticsData.misses++;
      return data;
    } catch (error) {
      if (entry) {
        console.warn(`Using stale cache for ${key} due to fetch error:`, error);
        this.analyticsData.hits++;
        return entry.data;
      }
      throw error;
    }
  }

  private async networkFirstStrategy<T>(
    key: string,
    fetcher: () => Promise<T>,
    config: CacheConfig,
    entry?: CacheEntry<T>
  ): Promise<T> {
    try {
      const data = await fetcher();
      this.set(key, data, config);
      this.analyticsData.misses++;
      return data;
    } catch (error) {
      if (entry && !this.isExpired(entry)) {
        console.warn(`Using cache fallback for ${key} due to network error:`, error);
        this.analyticsData.hits++;
        entry.hits++;
        return entry.data;
      }
      throw error;
    }
  }

  private async staleWhileRevalidateStrategy<T>(
    key: string,
    fetcher: () => Promise<T>,
    config: CacheConfig,
    entry?: CacheEntry<T>
  ): Promise<T> {
    if (entry && !this.isExpired(entry)) {
      this.analyticsData.hits++;
      entry.hits++;
      
      setTimeout(async () => {
        try {
          const data = await fetcher();
          this.set(key, data, config);
        } catch (error) {
          console.warn(`Background revalidation failed for ${key}:`, error);
        }
      }, 0);
      
      return entry.data;
    }

    try {
      const data = await fetcher();
      this.set(key, data, config);
      this.analyticsData.misses++;
      return data;
    } catch (error) {
      if (entry) {
        console.warn(`Using stale cache for ${key} due to fetch error:`, error);
        this.analyticsData.hits++;
        return entry.data;
      }
      throw error;
    }
  }

  private async multiStrategyCache<T>(
    key: string,
    fetcher: () => Promise<T>,
    config: CacheConfig,
    entry?: CacheEntry<T>
  ): Promise<T> {
    const networkTimeout = config.networkTimeout || 5000;
    const maxStaleAge = config.maxStaleAge || config.ttl * 2;
    const fallbackStrategy = config.fallbackStrategy || 'cache-first';

    const hasValidCache = entry && !this.isExpired(entry);
    const hasStaleCache = entry && (Date.now() - entry.timestamp < maxStaleAge);

    const networkPromise = Promise.race([
      fetcher(),
      new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error('Network timeout')), networkTimeout)
      )
    ]);

    try {
      const data = await networkPromise;
      this.set(key, data, config);
      this.analyticsData.misses++;
      return data;
    } catch (networkError) {
      if (fallbackStrategy === 'cache-first' && hasValidCache) {
        console.warn(`Network failed, using cache for ${key}:`, networkError);
        this.analyticsData.hits++;
        entry!.hits++;
        return entry!.data;
      }

      if (hasStaleCache) {
        console.warn(`Using stale cache for ${key}:`, networkError);
        this.analyticsData.hits++;
        return entry!.data;
      }

      throw networkError;
    }
  }

  private normalizeKey(key: string): string {
    return key.toLowerCase().trim();
  }

  private getCacheConfig(key: string, override?: Partial<CacheConfig>): CacheConfig {
    const matchingConfig = Object.entries(this.defaultConfigs)
      .find(([pattern]) => key.startsWith(pattern));

    const baseConfig = matchingConfig 
      ? matchingConfig[1]
      : {
          ttl: 300000,
          strategy: 'stale-while-revalidate' as const,
          warmup: false,
          tags: ['default']
        };

    return { ...baseConfig, ...override };
  }

  private isExpired(entry: CacheEntry): boolean {
    return Date.now() - entry.timestamp > entry.ttl;
  }

  private startCleanupInterval(): void {
    setInterval(() => {
      this.cleanup();
    }, 300000);
  }

  private cleanup(): void {
    let cleanedCount = 0;
    const now = Date.now();
    const maxIdleTime = 3600000;

    for (const [key, entry] of this.cache.entries()) {
      const isExpired = this.isExpired(entry);
      const isIdle = now - entry.lastAccess > maxIdleTime;
      
      if (isExpired || isIdle) {
        this.currentMemoryUsage -= this.estimateMemoryUsage(entry.data);
        this.cache.delete(key);
        this.accessOrder = this.accessOrder.filter(k => k !== key);
        cleanedCount++;
      }
    }

    if (cleanedCount > 0) {
      this.analyticsData.evictions += cleanedCount;
      this.analyticsData.memoryUsage = this.currentMemoryUsage;
      console.log(`🧹 Cache cleanup: ${cleanedCount} entries removed`);
    }
  }

  private startWarmupProcess(): void {
    setInterval(() => {
      if (this.warmupQueue.size > 0) {
        console.log(`🔥 Processing warmup queue: ${this.warmupQueue.size} items`);
      }
    }, 60000);
  }

  private enableAnalytics(): void {
    // Track cache performance analytics
    setInterval(() => {
      const stats = this.getStats();
      if (stats.analytics.hits > 0 || stats.analytics.misses > 0) {
        console.log('📊 Cache Analytics:', {
          hitRate: stats.hitRate,
          memoryUsage: stats.memoryUsage,
          size: stats.size
        });
      }
    }, 60000); // Every minute
  }
}

export const enterpriseCache = new EnterpriseCache();
export default enterpriseCache;
