'use client';

import { create } from 'zustand';
import type { AnalyzedArticle } from '@/types/news';
import type { NewsAnalysis } from '@/types/analysis';
import type { MapMarker, ConnectionLine } from '@/types/map';
import { CATEGORY_COLORS } from '@/lib/map/styles';

const ALL_CATEGORIES = Object.keys(CATEGORY_COLORS);

interface NewsState {
  articles: AnalyzedArticle[];
  selectedArticleId: string | null;
  activeCategories: Set<string>;
  isAnalyzing: boolean;

  // Actions
  setArticles: (articles: AnalyzedArticle[]) => void;
  selectArticle: (id: string | null) => void;
  toggleCategory: (category: string) => void;
  setAnalyzing: (analyzing: boolean) => void;
  updateArticleAnalysis: (id: string, analysis: NewsAnalysis) => void;

  // Getters
  getFilteredArticles: () => AnalyzedArticle[];
  getSelectedArticle: () => AnalyzedArticle | undefined;
  getMapMarkers: () => MapMarker[];
  getConnectionLines: () => ConnectionLine[];
}

export const useNewsStore = create<NewsState>((set, get) => ({
  articles: [],
  selectedArticleId: null,
  activeCategories: new Set(ALL_CATEGORIES),
  isAnalyzing: false,

  setArticles: (articles) => set({ articles }),

  selectArticle: (id) => set({ selectedArticleId: id }),

  toggleCategory: (category) =>
    set((state) => {
      const next = new Set(state.activeCategories);
      if (next.has(category)) {
        next.delete(category);
      } else {
        next.add(category);
      }
      return { activeCategories: next };
    }),

  setAnalyzing: (isAnalyzing) => set({ isAnalyzing }),

  updateArticleAnalysis: (id, analysis) =>
    set((state) => ({
      articles: state.articles.map((article) =>
        article.id === id ? { ...article, analysis } : article,
      ),
    })),

  getFilteredArticles: () => {
    const { articles, activeCategories } = get();
    return articles.filter((article) => {
      if (!article.analysis) return true;
      return activeCategories.has(article.analysis.category);
    });
  },

  getSelectedArticle: () => {
    const { articles, selectedArticleId } = get();
    if (!selectedArticleId) return undefined;
    return articles.find((a) => a.id === selectedArticleId);
  },

  getMapMarkers: () => {
    const { articles, activeCategories } = get();
    const markers: MapMarker[] = [];

    for (const article of articles) {
      if (!article.analysis) continue;
      if (!activeCategories.has(article.analysis.category)) continue;

      markers.push({
        id: article.id,
        latitude: article.analysis.location.latitude,
        longitude: article.analysis.location.longitude,
        label: article.title,
        category: article.analysis.category,
        severity: article.analysis.severity,
      });
    }

    return markers;
  },

  getConnectionLines: () => {
    const { articles, selectedArticleId } = get();
    if (!selectedArticleId) return [];

    const selected = articles.find((a) => a.id === selectedArticleId);
    if (!selected?.analysis) return [];

    const origin: [number, number] = [
      selected.analysis.location.longitude,
      selected.analysis.location.latitude,
    ];

    return selected.analysis.relatedRegions.map((region) => ({
      from: origin,
      to: [region.longitude, region.latitude] as [number, number],
      label: region.relation,
    }));
  },
}));
