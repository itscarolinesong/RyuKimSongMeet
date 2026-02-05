import Redis from 'ioredis';

let redis: Redis | null = null;

// Lazy-load Redis client
function getRedis(): Redis {
  // Skip Redis initialization during build
  if (process.env.NEXT_PHASE === 'phase-production-build') {
    // Return a mock client during build
    return {} as Redis;
  }

  if (redis) return redis;

  // Create Redis client
  // Checks UPSTASH_REDIS_URL first (manual), then falls back to Vercel-managed vars
  const redisUrl = process.env.UPSTASH_REDIS_URL || process.env.REDIS_URL || process.env.KV_REST_API_URL;

  if (!redisUrl) {
    throw new Error('Redis URL not found. Please set UPSTASH_REDIS_URL environment variable.');
  }

  redis = new Redis(redisUrl, {
    maxRetriesPerRequest: 3,
    retryStrategy(times) {
      const delay = Math.min(times * 50, 2000);
      return delay;
    },
  });

  redis.on('error', (err) => {
    console.error('Redis connection error:', err);
  });

  redis.on('connect', () => {
    console.log('Redis connected successfully');
  });

  return redis;
}

// Export singleton instance
const redisClient = getRedis();
export default redisClient;
