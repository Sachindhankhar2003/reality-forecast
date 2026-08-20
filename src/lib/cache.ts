interface CacheEntry<T> {
  key: string;
  value: T;
  createdAt: number;
  expiresAt: number;
  provider: string;
}

class ProviderCache {
  private cache = new Map<string, CacheEntry<any>>();

  get<T>(key: string): { hit: boolean; value?: T; isExpired?: boolean } {
    const entry = this.cache.get(key);
    if (!entry) return { hit: false };

    const now = Date.now();
    if (now > entry.expiresAt) {
      this.cache.delete(key);
      return { hit: true, isExpired: true };
    }

    return { hit: true, value: entry.value as T, isExpired: false };
  }

  set<T>(key: string, value: T, ttlMs: number = 15 * 60 * 1000, provider: string = 'system') {
    const now = Date.now();
    this.cache.set(key, {
      key,
      value,
      createdAt: now,
      expiresAt: now + ttlMs,
      provider,
    });
  }

  clear() {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }
}

export const providerCache = new ProviderCache();
