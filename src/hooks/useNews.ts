'use client';

import useSWR from 'swr';
import type { NormalizedArticle } from '@/lib/news/types';

interface NewsResponse {
  articles: NormalizedArticle[];
  error?: string;
}

const fetcher = (url: string): Promise<NewsResponse> =>
  fetch(url).then((res) => {
    if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);
    return res.json();
  });

export function useNews() {
  const { data, error, isLoading, mutate } = useSWR<NewsResponse>(
    '/api/news',
    fetcher,
    {
      refreshInterval: 300000, // 5 minutes
      revalidateOnFocus: false,
      dedupingInterval: 60000, // 1 minute
    }
  );

  return {
    articles: data?.articles ?? [],
    isLoading,
    error: error ?? (data?.error ? new Error(data.error) : undefined),
    mutate,
  };
}
