'use client';

import { CATEGORY_COLORS } from '@/lib/map/styles';

interface NeonBadgeProps {
  category: string;
}

export function NeonBadge({ category }: NeonBadgeProps) {
  const color = CATEGORY_COLORS[category] ?? '#ffffff';

  return (
    <span
      className="inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize"
      style={{
        color,
        backgroundColor: `${color}33`,
        boxShadow: `0 0 8px ${color}40`,
      }}
    >
      {category}
    </span>
  );
}
