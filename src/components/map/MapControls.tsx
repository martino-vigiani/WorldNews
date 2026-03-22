'use client';

interface MapControlsProps {
  onResetView: () => void;
}

export function MapControls({ onResetView }: MapControlsProps) {
  return (
    <div className="absolute bottom-6 right-6 z-10 flex flex-col gap-2">
      <button
        type="button"
        onClick={onResetView}
        className="flex h-10 w-10 items-center justify-center rounded-lg bg-black/40 text-white/70 backdrop-blur-md transition-colors hover:bg-white/10 hover:text-white"
        style={{
          border: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: '0 0 12px rgba(0, 0, 0, 0.4)',
        }}
        aria-label="Reset map view"
      >
        {/* Simple crosshair / recenter icon via inline SVG */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="3" />
          <line x1="12" y1="2" x2="12" y2="6" />
          <line x1="12" y1="18" x2="12" y2="22" />
          <line x1="2" y1="12" x2="6" y2="12" />
          <line x1="18" y1="12" x2="22" y2="12" />
        </svg>
      </button>
    </div>
  );
}
