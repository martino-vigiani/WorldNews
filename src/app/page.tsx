'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useNews } from '@/hooks/useNews';
import { useAnalysis } from '@/hooks/useAnalysis';
import { useNewsStore } from '@/stores/newsStore';
import { WorldMap, type WorldMapHandle } from '@/components/map/WorldMap';
import { NewsFeed } from '@/components/news/NewsFeed';
import { NewsDetail } from '@/components/news/NewsDetail';
import type { AnalyzedArticle } from '@/types/news';

export default function Home() {
  const mapRef = useRef<WorldMapHandle>(null);
  const { articles, isLoading } = useNews();
  const { analyze, isAnalyzing } = useAnalysis();

  const setArticles = useNewsStore((s) => s.setArticles);
  const selectArticle = useNewsStore((s) => s.selectArticle);
  const selectedArticleId = useNewsStore((s) => s.selectedArticleId);
  const setAnalyzing = useNewsStore((s) => s.setAnalyzing);
  const updateArticleAnalysis = useNewsStore((s) => s.updateArticleAnalysis);
  const mapMarkers = useNewsStore((s) => s.getMapMarkers());
  const connectionLines = useNewsStore((s) => s.getConnectionLines());
  const selectedArticle = useNewsStore((s) => s.getSelectedArticle());

  // Sync fetched articles into store
  useEffect(() => {
    if (articles.length > 0) {
      setArticles(articles as AnalyzedArticle[]);
    }
  }, [articles, setArticles]);

  // Sync analyzing state
  useEffect(() => {
    setAnalyzing(isAnalyzing);
  }, [isAnalyzing, setAnalyzing]);

  // Handle article click: select, analyze if needed, fly to location
  const handleArticleClick = useCallback(
    async (id: string) => {
      selectArticle(id);
      const article = useNewsStore.getState().articles.find((a) => a.id === id);
      if (!article) return;

      if (article.analysis) {
        mapRef.current?.flyTo(
          article.analysis.location.latitude,
          article.analysis.location.longitude,
          5,
          1500,
        );
        return;
      }

      const result = await analyze(article.title, article.description, article.url);
      if (result) {
        updateArticleAnalysis(id, result);
        mapRef.current?.flyTo(
          result.location.latitude,
          result.location.longitude,
          5,
          1500,
        );
      }
    },
    [analyze, selectArticle, updateArticleAnalysis],
  );

  // Handle marker click on map
  const handleMarkerClick = useCallback(
    (id: string) => {
      selectArticle(id);
      const article = useNewsStore.getState().articles.find((a) => a.id === id);
      if (article?.analysis) {
        mapRef.current?.flyTo(
          article.analysis.location.latitude,
          article.analysis.location.longitude,
          6,
          1500,
        );
      }
    },
    [selectArticle],
  );

  const handleClose = useCallback(() => {
    selectArticle(null);
  }, [selectArticle]);

  // Escape to close detail
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') selectArticle(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selectArticle]);

  return (
    <div className="relative h-full w-full">
      {/* Full-screen map */}
      <WorldMap
        ref={mapRef}
        markers={mapMarkers}
        connections={connectionLines}
        selectedMarkerId={selectedArticleId}
        onMarkerClick={handleMarkerClick}
      />

      {/* Header */}
      <div className="pointer-events-none absolute left-0 top-0 z-10 p-4">
        <h1 className="text-lg font-bold tracking-tight text-white">
          WORLD<span style={{ color: '#00d4ff' }}>NEWS</span>
        </h1>
        <p className="text-xs text-gray-500">AI-Powered Global Intelligence</p>
      </div>

      {/* Sidebar */}
      <div className="absolute right-0 top-0 z-10 flex h-full w-80 flex-col p-3">
        {selectedArticle ? (
          <NewsDetail
            article={selectedArticle}
            isAnalyzing={isAnalyzing}
            onClose={handleClose}
          />
        ) : (
          <NewsFeed isLoading={isLoading} onArticleClick={handleArticleClick} />
        )}
      </div>
    </div>
  );
}
