import { NextResponse } from 'next/server';
import { analyzeArticle } from '@/lib/ai/analyze';
import { getCached, setCached, createCacheKey } from '@/lib/cache';

export async function POST(request: Request) {
  let body: { title?: string; description?: string; url?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: 'Invalid JSON body' },
      { status: 400 }
    );
  }

  const { title, description, url } = body;

  if (!title || !description || !url) {
    return NextResponse.json(
      { error: 'Missing required fields: title, description, url' },
      { status: 400 }
    );
  }

  const cacheKey = createCacheKey(url);
  const cached = getCached(cacheKey);

  if (cached) {
    return NextResponse.json({ analysis: cached, cached: true });
  }

  try {
    const analysis = await analyzeArticle(title, description);
    setCached(cacheKey, analysis);
    return NextResponse.json({ analysis, cached: false });
  } catch (error) {
    console.error('[api/analyze] Analysis failed:', error);

    const message =
      error instanceof Error ? error.message : 'Analysis failed';

    return NextResponse.json({ error: message }, { status: 502 });
  }
}
