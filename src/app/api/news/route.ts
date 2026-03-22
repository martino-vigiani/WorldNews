import { NextResponse } from 'next/server';
import { aggregateNews } from '@/lib/news/aggregator';
import type { NormalizedArticle } from '@/lib/news/types';

const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

let cache: {
  articles: NormalizedArticle[];
  timestamp: number;
} | null = null;

function isCacheFresh(): boolean {
  return cache !== null && Date.now() - cache.timestamp < CACHE_TTL;
}

export async function GET() {
  try {
    if (isCacheFresh()) {
      return NextResponse.json(
        { articles: cache!.articles },
        {
          headers: {
            'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=60',
          },
        }
      );
    }

    const articles = await aggregateNews();

    cache = { articles, timestamp: Date.now() };

    return NextResponse.json(
      { articles },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=60',
        },
      }
    );
  } catch (error) {
    console.error('[api/news] Failed to fetch news:', error);

    // Serve stale cache if available
    if (cache) {
      return NextResponse.json(
        { articles: cache.articles },
        {
          headers: {
            'Cache-Control': 'public, s-maxage=60',
          },
        }
      );
    }

    return NextResponse.json(
      { articles: [], error: 'Failed to fetch news' },
      { status: 500 }
    );
  }
}
