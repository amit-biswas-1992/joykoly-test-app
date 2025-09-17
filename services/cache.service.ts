interface CacheItem<T> {
  data: T;
  timestamp: number;
  expiry: number;
}

class CacheService {
  private cache = new Map<string, CacheItem<any>>();
  private defaultTTL = 30 * 1000; // 30 seconds in milliseconds

  set<T>(key: string, data: T, ttl: number = this.defaultTTL): void {
    const timestamp = Date.now();
    const expiry = timestamp + ttl;
    
    this.cache.set(key, {
      data,
      timestamp,
      expiry
    });
  }

  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    
    if (!item) {
      return null;
    }

    // Check if item has expired
    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }

    return item.data as T;
  }

  has(key: string): boolean {
    const item = this.cache.get(key);
    
    if (!item) {
      return false;
    }

    // Check if item has expired
    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  // Get cache statistics
  getStats() {
    const now = Date.now();
    let validItems = 0;
    let expiredItems = 0;

    for (const [key, item] of this.cache.entries()) {
      if (now > item.expiry) {
        expiredItems++;
        this.cache.delete(key);
      } else {
        validItems++;
      }
    }

    return {
      total: validItems + expiredItems,
      valid: validItems,
      expired: expiredItems
    };
  }
}

export const cacheService = new CacheService();
