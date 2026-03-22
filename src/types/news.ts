import type { NormalizedArticle } from '@/lib/news/types';

export interface AnalyzedArticle extends NormalizedArticle {
  analysis?: {
    location: {
      latitude: number;
      longitude: number;
      locationName: string;
      confidence: number;
    };
    category:
      | 'geopolitics'
      | 'technology'
      | 'ai'
      | 'war'
      | 'economy'
      | 'climate';
    summary: string;
    context: string;
    severity: number;
    relatedRegions: Array<{
      name: string;
      latitude: number;
      longitude: number;
      relation: string;
    }>;
    mapAnnotation: string;
  };
}
