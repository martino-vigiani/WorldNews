'use client';

import { CATEGORY_COLORS } from '@/lib/map/styles';
import { useNewsStore } from '@/stores/newsStore';

const CATEGORIES = Object.keys(CATEGORY_COLORS);

export function CategoryFilter() {
  const activeCategories = useNewsStore((s) => s.activeCategories);
  const toggleCategory = useNewsStore((s) => s.toggleCategory);

  return (
    <div className="flex flex-wrap gap-1.5">
      {CATEGORIES.map((category) => {
        const color = CATEGORY_COLORS[category];
        const active = activeCategories.has(category);

        return (
          <button
            key={category}
            type="button"
            onClick={() => toggleCategory(category)}
            className="rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize transition-opacity"
            style={{
              color,
              backgroundColor: `${color}33`,
              boxShadow: active ? `0 0 8px ${color}40` : 'none',
              opacity: active ? 1 : 0.4,
            }}
          >
            {category}
          </button>
        );
      })}
    </div>
  );
}
