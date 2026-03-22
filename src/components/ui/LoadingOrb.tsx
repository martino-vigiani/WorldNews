'use client';

export function LoadingOrb() {
  return (
    <div className="flex flex-col items-center gap-3 py-8">
      <div
        className="h-10 w-10 rounded-full"
        style={{
          background: 'radial-gradient(circle, #00d4ff 0%, #00d4ff40 50%, transparent 70%)',
          boxShadow: '0 0 20px #00d4ff60, 0 0 40px #00d4ff30',
          animation: 'orb-pulse 2s ease-in-out infinite',
        }}
      />
      <span className="text-sm text-gray-400">Analyzing...</span>
    </div>
  );
}
