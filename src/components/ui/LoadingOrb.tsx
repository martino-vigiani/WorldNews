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

      <style>{`
        @keyframes orb-pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 0.8;
            box-shadow: 0 0 20px #00d4ff60, 0 0 40px #00d4ff30;
          }
          50% {
            transform: scale(1.2);
            opacity: 1;
            box-shadow: 0 0 30px #00d4ff80, 0 0 60px #00d4ff50;
          }
        }
      `}</style>
    </div>
  );
}
