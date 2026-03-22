export interface RawArticle {
  id: string;
  title: string;
  description: string;
  url: string;
  imageUrl: string | null;
  publishedAt: Date;
  source: string;
  fetchedFrom: 'google-rss' | 'gnews';
}

export interface NormalizedArticle extends RawArticle {
  // Extends RawArticle with a normalized id (hash of url)
}
