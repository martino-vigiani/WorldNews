import type { RawArticle } from './types';

const FEEDS = [
  // World news
  'https://news.google.com/rss/topics/CAAqJggKIiBDQkFTRWdvSUwyMHZNRGx1YlY4U0FtVnVHZ0pWVXlnQVAB?hl=en-US&gl=US&ceid=US:en',
  // Technology
  'https://news.google.com/rss/topics/CAAqJggKIiBDQkFTRWdvSUwyMHZNRGRqTVhZU0FtVnVHZ0pWVXlnQVAB?hl=en-US&gl=US&ceid=US:en',
];

const MAX_PER_FEED = 30;

function hashString(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash + char) | 0;
  }
  return Math.abs(hash).toString(36);
}

function extractSource(title: string): string {
  // Google News titles often end with " - Source Name"
  const match = title.match(/\s-\s([^-]+)$/);
  return match ? match[1].trim() : 'Google News';
}

function cleanTitle(title: string): string {
  // Remove source suffix from title
  return title.replace(/\s-\s[^-]+$/, '').trim();
}

export async function fetchGoogleNews(): Promise<RawArticle[]> {
  try {
    const Parser = (await import('rss-parser')).default;
    const parser = new Parser({
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; WorldNews/1.0)',
      },
    });

    const results = await Promise.allSettled(
      FEEDS.map((url) => parser.parseURL(url))
    );

    const articles: RawArticle[] = [];

    for (const result of results) {
      if (result.status !== 'fulfilled') continue;

      const items = result.value.items.slice(0, MAX_PER_FEED);

      for (const item of items) {
        if (!item.title || !item.link) continue;

        articles.push({
          id: hashString(item.link),
          title: cleanTitle(item.title),
          description: item.contentSnippet || item.content || '',
          url: item.link,
          imageUrl: null, // Google News RSS does not include images
          publishedAt: item.pubDate ? new Date(item.pubDate) : new Date(),
          source: extractSource(item.title),
          fetchedFrom: 'google-rss',
        });
      }
    }

    return articles;
  } catch (error) {
    console.error('[google-rss] Failed to fetch news:', error);
    return [];
  }
}
