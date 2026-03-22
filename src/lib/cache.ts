import { LRUCache } from 'lru-cache';
import type { NewsAnalysis } from '@/types/analysis';

const cache = new LRUCache<string, NewsAnalysis>({
  max: 100,
  ttl: 3_600_000, // 1 hour
});

export function getCached(key: string): NewsAnalysis | undefined {
  return cache.get(key);
}

export function setCached(key: string, value: NewsAnalysis): void {
  cache.set(key, value);
}

export function createCacheKey(url: string): string {
  let hash = 0;
  for (let i = 0; i < url.length; i++) {
    const char = url.charCodeAt(i);
    hash = ((hash << 5) - hash + char) | 0;
  }
  return `analysis:${Math.abs(hash).toString(36)}`;
}
