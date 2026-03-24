/**
 * Cache Module Unit Tests
 */

import { cache, getLocationsCacheKey, getCatalogCacheKey, getCategoriesCacheKey } from '@/lib/cache';

describe('Cache Module', () => {
  beforeEach(() => {
    cache.clear();
  });

  describe('get and set', () => {
    it('should store and retrieve a value', () => {
      const testData = { id: '1', name: 'Test' };
      cache.set('test-key', testData);
      
      const result = cache.get<typeof testData>('test-key');
      expect(result).toEqual(testData);
    });

    it('should return undefined for non-existent key', () => {
      const result = cache.get('non-existent');
      expect(result).toBeUndefined();
    });

    it('should return undefined for expired entry', async () => {
      cache.set('expired-key', 'value', 1); // 1ms TTL
      
      await new Promise((resolve) => setTimeout(resolve, 10));
      
      const result = cache.get('expired-key');
      expect(result).toBeUndefined();
    });
  });

  describe('delete', () => {
    it('should delete a specific key', () => {
      cache.set('key1', 'value1');
      cache.set('key2', 'value2');
      
      cache.delete('key1');
      
      expect(cache.get('key1')).toBeUndefined();
      expect(cache.get('key2')).toBe('value2');
    });
  });

  describe('clear', () => {
    it('should clear all entries', () => {
      cache.set('key1', 'value1');
      cache.set('key2', 'value2');
      
      cache.clear();
      
      expect(cache.get('key1')).toBeUndefined();
      expect(cache.get('key2')).toBeUndefined();
    });
  });

  describe('deletePattern', () => {
    it('should delete entries matching pattern', () => {
      cache.set('catalog:loc1', 'data1');
      cache.set('catalog:loc2', 'data2');
      cache.set('locations:all', 'data3');
      
      const deleted = cache.deletePattern('catalog:');
      
      expect(deleted).toBe(2);
      expect(cache.get('catalog:loc1')).toBeUndefined();
      expect(cache.get('catalog:loc2')).toBeUndefined();
      expect(cache.get('locations:all')).toBe('data3');
    });
  });

  describe('getStats', () => {
    it('should return cache statistics', () => {
      cache.set('key1', 'value1');
      cache.set('key2', 'value2');
      
      const stats = cache.getStats();
      
      expect(stats.size).toBe(2);
      expect(stats.keys).toContain('key1');
      expect(stats.keys).toContain('key2');
    });
  });
});

describe('Cache Key Generators', () => {
  it('should generate locations cache key', () => {
    expect(getLocationsCacheKey()).toBe('locations:all');
  });

  it('should generate catalog cache key with location ID', () => {
    expect(getCatalogCacheKey('loc123')).toBe('catalog:loc123');
  });

  it('should generate categories cache key with location ID', () => {
    expect(getCategoriesCacheKey('loc123')).toBe('categories:loc123');
  });
});
