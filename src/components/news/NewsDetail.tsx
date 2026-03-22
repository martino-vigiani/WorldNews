'use client';

import type { AnalyzedArticle } from '@/types/news';
import { CATEGORY_COLORS } from '@/lib/map/styles';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { NeonBadge } from '@/components/ui/NeonBadge';
import { LoadingOrb } from '@/components/ui/LoadingOrb';

interface NewsDetailProps {
  article: AnalyzedArticle;
  isAnalyzing: boolean;
  onClose: () => void;
}

export function NewsDetail({ article, isAnalyzing, onClose }: NewsDetailProps) {
  const analysis = article.analysis;
  const color = analysis ? CATEGORY_COLORS[analysis.category] ?? '#ffffff' : '#ffffff';

  return (
    <GlassPanel className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-start gap-2 border-b border-white/10 p-4">
        <div className="min-w-0 flex-1">
          <h2 className="text-sm font-semibold leading-snug text-white">
            {article.title}
          </h2>
          {analysis && (
            <div className="mt-1.5">
              <NeonBadge category={analysis.category} />
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={onClose}
          className="shrink-0 rounded-lg p-1 text-gray-400 transition-colors hover:bg-white/10 hover:text-white"
          aria-label="Close detail panel"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="h-5 w-5"
          >
            <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
          </svg>
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-4">
        {isAnalyzing && <LoadingOrb />}

        {!isAnalyzing && !analysis && (
          <p className="py-8 text-center text-sm text-gray-500">
            Click to analyze this article with AI.
          </p>
        )}

        {!isAnalyzing && analysis && (
          <div className="space-y-5">
            {/* AI Summary */}
            <section>
              <h3 className="mb-1 text-xs font-semibold uppercase tracking-wider text-gray-400">
                Summary
              </h3>
              <p className="text-sm leading-relaxed text-gray-300">
                {analysis.summary}
              </p>
            </section>

            {/* Context */}
            <section>
              <h3 className="mb-1 text-xs font-semibold uppercase tracking-wider text-gray-400">
                Why it matters
              </h3>
              <p className="text-sm leading-relaxed text-gray-300">
                {analysis.context}
              </p>
            </section>

            {/* Severity */}
            <section>
              <h3 className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-gray-400">
                Severity
              </h3>
              <div className="flex items-center gap-2">
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${(analysis.severity / 10) * 100}%`,
                      backgroundColor: color,
                      boxShadow: `0 0 8px ${color}60`,
                    }}
                  />
                </div>
                <span
                  className="text-xs font-semibold"
                  style={{ color }}
                >
                  {analysis.severity}/10
                </span>
              </div>
            </section>

            {/* Location */}
            <section>
              <h3 className="mb-1 text-xs font-semibold uppercase tracking-wider text-gray-400">
                Location
              </h3>
              <p className="text-sm text-gray-300">
                {analysis.location.locationName}
              </p>
              <p className="text-xs text-gray-500">
                {analysis.location.latitude.toFixed(2)}, {analysis.location.longitude.toFixed(2)}
              </p>
            </section>

            {/* Related Regions */}
            {analysis.relatedRegions.length > 0 && (
              <section>
                <h3 className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Related regions
                </h3>
                <ul className="space-y-1">
                  {analysis.relatedRegions.map((region) => (
                    <li
                      key={region.name}
                      className="flex items-baseline gap-2 text-sm"
                    >
                      <span className="text-gray-300">{region.name}</span>
                      <span className="text-xs text-gray-500">
                        {region.relation}
                      </span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Read original */}
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-xs font-medium text-gray-300 transition-colors hover:border-white/20 hover:text-white"
            >
              Read original
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="h-3 w-3"
              >
                <path
                  fillRule="evenodd"
                  d="M4.22 11.78a.75.75 0 010-1.06L9.44 5.5H5.75a.75.75 0 010-1.5h5.5a.75.75 0 01.75.75v5.5a.75.75 0 01-1.5 0V6.56l-5.22 5.22a.75.75 0 01-1.06 0z"
                  clipRule="evenodd"
                />
              </svg>
            </a>
          </div>
        )}
      </div>
    </GlassPanel>
  );
}
