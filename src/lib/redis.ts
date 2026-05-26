import { Redis } from '@upstash/redis';

/**
 * Shared Redis client factory.
 * Accepts both Vercel KV naming (KV_REST_API_*) and Upstash naming (UPSTASH_REDIS_REST_*).
 */
export function getRedis(): Redis | null {
  try {
    const url =
      process.env.KV_REST_API_URL ||
      process.env.UPSTASH_REDIS_REST_URL;
    const token =
      process.env.KV_REST_API_TOKEN ||
      process.env.UPSTASH_REDIS_REST_TOKEN;

    if (!url || !token) {
      console.error(
        '[redis] Not configured. Set KV_REST_API_URL + KV_REST_API_TOKEN or UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN'
      );
      return null;
    }

    return new Redis({ url, token });
  } catch (error) {
    console.error('[redis] Failed to create client:', error);
    return null;
  }
}
