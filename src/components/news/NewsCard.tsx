'use client';

import type { AnalyzedArticle } from '@/types/news';
import { CATEGORY_COLORS } from '@/lib/map/styles';
import { NeonBadge } from '@/components/ui/NeonBadge';

interface NewsCardProps {
  article: AnalyzedArticle;
  selected: boolean;
  onClick: () => void;
}

function timeAgo(date: Date): string {
  const now = Date.now();
  const diff = now - new Date(date).getTime();
  const minutes = Math.floor(diff / 60_000);

  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function NewsCard({ article, selected, onClick }: NewsCardProps) {
  const category = article.analysis?.category;
  const accentColor = category ? CATEGORY_COLORS[category] : undefined;

  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative w-full rounded-lg border border-white/5 bg-white/5 p-3 text-left transition-colors hover:border-white/15 hover:bg-white/8"
      style={{
        borderColor: selected ? `${accentColor ?? '#ffffff'}60` : undefined,
        boxShadow: selected ? `0 0 12px ${accentColor ?? '#ffffff'}20` : undefined,
      }}
    >
      {/* Selected accent bar */}
      {selected && accentColor && (
        <span
          className="absolute left-0 top-2 bottom-2 w-0.5 rounded-full"
          style={{ backgroundColor: accentColor }}
        />
      )}

      <div className={selected && accentColor ? 'pl-2' : ''}>
        {/* Title */}
        <h3 className="line-clamp-2 text-sm font-medium leading-snug text-white">
          {article.title}
        </h3>

        {/* Meta row */}
        <div className="mt-1.5 flex items-center gap-2">
          <span className="truncate text-xs text-gray-400">
            {article.source}
          </span>
          <span className="text-xs text-gray-600">|</span>
          <span className="shrink-0 text-xs text-gray-500">
            {timeAgo(article.publishedAt)}
          </span>
          {category && (
            <>
              <span className="text-xs text-gray-600">|</span>
              <NeonBadge category={category} />
            </>
          )}
        </div>
      </div>
    </button>
  );
}
