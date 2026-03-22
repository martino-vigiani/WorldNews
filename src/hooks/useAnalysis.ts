'use client';

import { useState, useCallback } from 'react';
import type { NewsAnalysis } from '@/types/analysis';

interface UseAnalysisReturn {
  analyze: (
    title: string,
    description: string,
    url: string
  ) => Promise<NewsAnalysis | null>;
  isAnalyzing: boolean;
  error: string | null;
}

export function useAnalysis(): UseAnalysisReturn {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyze = useCallback(
    async (
      title: string,
      description: string,
      url: string
    ): Promise<NewsAnalysis | null> => {
      setIsAnalyzing(true);
      setError(null);

      try {
        const res = await fetch('/api/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title, description, url }),
        });

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || `Request failed with status ${res.status}`);
        }

        const data = await res.json();
        return data.analysis as NewsAnalysis;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Analysis failed';
        setError(message);
        return null;
      } finally {
        setIsAnalyzing(false);
      }
    },
    []
  );

  return { analyze, isAnalyzing, error };
}
