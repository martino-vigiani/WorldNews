'use client';

import { useNewsStore } from '@/stores/newsStore';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { CategoryFilter } from './CategoryFilter';
import { NewsCard } from './NewsCard';

interface NewsFeedProps {
  isLoading?: boolean;
  onArticleClick?: (id: string) => void;
}

function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-lg border border-white/5 bg-white/5 p-3">
      <div className="h-4 w-full rounded bg-white/10" />
      <div className="mt-1.5 h-4 w-3/4 rounded bg-white/10" />
      <div className="mt-2 flex gap-2">
        <div className="h-3 w-16 rounded bg-white/8" />
        <div className="h-3 w-12 rounded bg-white/8" />
      </div>
    </div>
  );
}

export function NewsFeed({ isLoading = false, onArticleClick }: NewsFeedProps) {
  const filteredArticles = useNewsStore((s) => s.getFilteredArticles());
  const selectedArticleId = useNewsStore((s) => s.selectedArticleId);

  return (
    <GlassPanel className="flex h-full flex-col">
      {/* Header */}
      <div className="border-b border-white/10 p-3">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-white">Live Feed</h2>
          <span className="text-xs text-gray-500">
            {filteredArticles.length} articles
          </span>
        </div>
        <CategoryFilter />
      </div>

      {/* Article list */}
      <div className="flex-1 space-y-1.5 overflow-y-auto p-2">
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
          : filteredArticles.map((article) => (
              <NewsCard
                key={article.id}
                article={article}
                selected={article.id === selectedArticleId}
                onClick={() => onArticleClick?.(article.id)}
              />
            ))}

        {!isLoading && filteredArticles.length === 0 && (
          <p className="py-8 text-center text-sm text-gray-500">
            No articles match the selected filters.
          </p>
        )}
      </div>
    </GlassPanel>
  );
}
