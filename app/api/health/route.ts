import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

export async function GET() {
  try {
    // Test KV connection
    const testKey = 'health-check';
    await kv.set(testKey, 'ok', { ex: 10 }); // expires in 10 seconds
    const result = await kv.get(testKey);

    return NextResponse.json({
      status: 'healthy',
      kv: 'connected',
      test: result === 'ok' ? 'passed' : 'failed',
      env: {
        hasKvUrl: !!process.env.KV_URL,
        hasRestApiUrl: !!process.env.KV_REST_API_URL,
        hasToken: !!process.env.KV_REST_API_TOKEN,
      }
    });
  } catch (error) {
    return NextResponse.json({
      status: 'unhealthy',
      kv: 'disconnected',
      error: error instanceof Error ? error.message : 'Unknown error',
      env: {
        hasKvUrl: !!process.env.KV_URL,
        hasRestApiUrl: !!process.env.KV_REST_API_URL,
        hasToken: !!process.env.KV_REST_API_TOKEN,
      }
    }, { status: 500 });
  }
}
