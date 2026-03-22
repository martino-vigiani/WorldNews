'use client';

import { twMerge } from 'tailwind-merge';

interface GlassPanelProps {
  children: React.ReactNode;
  className?: string;
}

export function GlassPanel({ children, className }: GlassPanelProps) {
  return (
    <div
      className={twMerge(
        'rounded-xl border border-white/10 bg-black/40 backdrop-blur-md',
        className,
      )}
    >
      {children}
    </div>
  );
}
