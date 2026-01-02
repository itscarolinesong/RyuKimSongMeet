import { NextResponse } from 'next/server';
import redis from '@/lib/redis';

export async function GET() {
  try {
    // Test Redis connection
    const testKey = 'health-check';
    await redis.set(testKey, 'ok', 'EX', 10); // expires in 10 seconds
    const result = await redis.get(testKey);

    return NextResponse.json({
      status: 'healthy',
      redis: 'connected',
      test: result === 'ok' ? 'passed' : 'failed',
      env: {
        hasRedisUrl: !!process.env.REDIS_URL,
        hasKvUrl: !!process.env.KV_URL,
        usingUrl: process.env.REDIS_URL ? 'REDIS_URL' : 'KV_URL'
      }
    });
  } catch (error) {
    return NextResponse.json({
      status: 'unhealthy',
      redis: 'disconnected',
      error: error instanceof Error ? error.message : 'Unknown error',
      env: {
        hasRedisUrl: !!process.env.REDIS_URL,
        hasKvUrl: !!process.env.KV_URL,
      }
    }, { status: 500 });
  }
}
