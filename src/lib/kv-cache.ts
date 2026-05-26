import { getRedis } from '@/lib/redis';
import type { NewsArticle } from '@/types/news';

const CACHE_KEY = 'voto_informado:news';
const CACHE_TTL = 48 * 60 * 60; // 48 hours in seconds

export async function getCachedNews(): Promise<NewsArticle[]> {
  const redis = getRedis();
  if (!redis) return [];

  try {
    const data = await redis.get<NewsArticle[]>(CACHE_KEY);
    return data || [];
  } catch (error) {
    console.error('[kv-cache] Failed to get cached news:', error);
    return [];
  }
}

export async function setCachedNews(articles: NewsArticle[]): Promise<void> {
  const redis = getRedis();
  if (!redis) return;

  try {
    // Keep max 50 articles
    const trimmed = articles.slice(0, 50);
    await redis.set(CACHE_KEY, trimmed, { ex: CACHE_TTL });
  } catch (error) {
    console.error('[kv-cache] Failed to set cached news:', error);
  }
}
