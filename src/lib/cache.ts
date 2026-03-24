/**
 * In-Memory Cache Implementation
 * 
 * Provides a simple TTL-based caching mechanism for API responses.
 * This reduces load on the Square API and improves response times.
 */

import { CacheEntry } from '@/types';

// Default TTL: 5 minutes (in milliseconds)
const DEFAULT_TTL = 5 * 60 * 1000;

/**
 * Simple in-memory cache store
 */
class MemoryCache {
  private cache: Map<string, CacheEntry<unknown>> = new Map();
  private defaultTtl: number;

  constructor(ttlSeconds?: number) {
    this.defaultTtl = (ttlSeconds ?? 300) * 1000; // Convert to milliseconds
  }

  /**
   * Get a value from cache
   * @param key - Cache key
   * @returns Cached value or undefined if not found/expired
   */
  get<T>(key: string): T | undefined {
    const entry = this.cache.get(key) as CacheEntry<T> | undefined;
    
    if (!entry) {
      return undefined;
    }

    // Check if entry has expired
    const now = Date.now();
    if (now - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return undefined;
    }

    return entry.data;
  }

  /**
   * Set a value in cache
   * @param key - Cache key
   * @param data - Data to cache
   * @param ttlMs - Optional TTL in milliseconds
   */
  set<T>(key: string, data: T, ttlMs?: number): void {
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttl: ttlMs ?? this.defaultTtl,
    };
    this.cache.set(key, entry as CacheEntry<unknown>);
  }

  /**
   * Delete a specific key from cache
   * @param key - Cache key to delete
   */
  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  /**
   * Clear all cache entries
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Delete all entries matching a pattern
   * @param pattern - String pattern to match against keys
   */
  deletePattern(pattern: string): number {
    let deleted = 0;
    const keys = Array.from(this.cache.keys());
    for (const key of keys) {
      if (key.includes(pattern)) {
        this.cache.delete(key);
        deleted++;
      }
    }
    return deleted;
  }

  /**
   * Get cache statistics
   */
  getStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    };
  }
}

// Singleton cache instance
const cacheTtl = process.env.CACHE_TTL ? parseInt(process.env.CACHE_TTL, 10) : 300;
export const cache = new MemoryCache(cacheTtl);

/**
 * Generate cache key for locations
 */
export function getLocationsCacheKey(): string {
  return 'locations:all';
}

/**
 * Generate cache key for catalog items by location
 */
export function getCatalogCacheKey(locationId: string): string {
  return `catalog:${locationId}`;
}

/**
 * Generate cache key for categories by location
 */
export function getCategoriesCacheKey(locationId: string): string {
  return `categories:${locationId}`;
}

export default cache;
