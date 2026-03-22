import type { NormalizedArticle } from './types';
import { fetchGoogleNews } from './google-rss';
import { fetchGNews } from './gnews';

const MAX_ARTICLES = 50;
const SIMILARITY_THRESHOLD = 0.7;

function tokenize(text: string): Set<string> {
  return new Set(
    text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .split(/\s+/)
      .filter((w) => w.length > 2)
  );
}

function titleSimilarity(a: string, b: string): number {
  const tokensA = tokenize(a);
  const tokensB = tokenize(b);

  if (tokensA.size === 0 || tokensB.size === 0) return 0;

  let overlap = 0;
  for (const token of tokensA) {
    if (tokensB.has(token)) overlap++;
  }

  const minSize = Math.min(tokensA.size, tokensB.size);
  return overlap / minSize;
}

function deduplicate(articles: NormalizedArticle[]): NormalizedArticle[] {
  const kept: NormalizedArticle[] = [];

  for (const article of articles) {
    const isDuplicate = kept.some(
      (existing) =>
        titleSimilarity(existing.title, article.title) >= SIMILARITY_THRESHOLD
    );
    if (!isDuplicate) {
      kept.push(article);
    }
  }

  return kept;
}

export async function aggregateNews(): Promise<NormalizedArticle[]> {
  const [googleArticles, gnewsArticles] = await Promise.all([
    fetchGoogleNews(),
    fetchGNews(),
  ]);

  const all: NormalizedArticle[] = [...googleArticles, ...gnewsArticles];

  const deduplicated = deduplicate(all);

  deduplicated.sort(
    (a, b) => b.publishedAt.getTime() - a.publishedAt.getTime()
  );

  return deduplicated.slice(0, MAX_ARTICLES);
}
