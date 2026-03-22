import type { RawArticle } from './types';

interface GNewsArticle {
  title: string;
  description: string;
  url: string;
  image: string | null;
  publishedAt: string;
  source: {
    name: string;
    url: string;
  };
}

interface GNewsResponse {
  totalArticles: number;
  articles: GNewsArticle[];
}

function hashString(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash + char) | 0;
  }
  return Math.abs(hash).toString(36);
}

export async function fetchGNews(): Promise<RawArticle[]> {
  const apiKey = process.env.GNEWS_API_KEY;
  if (!apiKey) {
    return [];
  }

  try {
    const url = `https://gnews.io/api/v4/top-headlines?category=world&lang=en&max=10&token=${apiKey}`;
    const res = await fetch(url, { signal: AbortSignal.timeout(10000) });

    if (!res.ok) {
      console.error(`[gnews] API returned ${res.status}`);
      return [];
    }

    const data: GNewsResponse = await res.json();

    return data.articles.map((article) => ({
      id: hashString(article.url),
      title: article.title,
      description: article.description || '',
      url: article.url,
      imageUrl: article.image,
      publishedAt: new Date(article.publishedAt),
      source: article.source.name,
      fetchedFrom: 'gnews' as const,
    }));
  } catch (error) {
    console.error('[gnews] Failed to fetch news:', error);
    return [];
  }
}
