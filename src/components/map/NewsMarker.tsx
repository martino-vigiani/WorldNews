'use client';

import { useState, useCallback } from 'react';
import { Marker } from 'react-map-gl/maplibre';
import type { MapMarker } from '@/types/map';
import { CATEGORY_COLORS } from '@/lib/map/styles';

interface NewsMarkerProps {
  marker: MapMarker;
  selected?: boolean;
  onClick?: (id: string) => void;
}

export function NewsMarker({ marker, selected = false, onClick }: NewsMarkerProps) {
  const [hovered, setHovered] = useState(false);

  const color = CATEGORY_COLORS[marker.category] ?? '#ffffff';

  // Map severity 1-10 to pixel size 12-40
  const baseSize = 12 + ((marker.severity - 1) / 9) * 28;
  const size = selected ? baseSize * 1.35 : baseSize;

  const handleClick = useCallback(() => {
    onClick?.(marker.id);
  }, [onClick, marker.id]);

  return (
    <Marker
      longitude={marker.longitude}
      latitude={marker.latitude}
      anchor="center"
      onClick={handleClick}
    >
      <div
        className="relative cursor-pointer"
        style={{ width: size, height: size }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Outer pulse ring */}
        <span
          className="absolute inset-0 rounded-full"
          style={{
            backgroundColor: color,
            opacity: 0.15,
            animation: 'marker-pulse 2s ease-out infinite',
          }}
        />

        {/* Middle glow ring */}
        <span
          className="absolute rounded-full"
          style={{
            inset: '15%',
            backgroundColor: color,
            opacity: selected ? 0.45 : 0.3,
            animation: 'marker-pulse 2s ease-out 0.4s infinite',
          }}
        />

        {/* Core dot */}
        <span
          className="absolute rounded-full"
          style={{
            inset: '30%',
            backgroundColor: color,
            boxShadow: selected
              ? `0 0 12px 4px ${color}, 0 0 24px 8px ${color}60`
              : `0 0 8px 2px ${color}90`,
          }}
        />

        {/* Tooltip */}
        {hovered && (
          <div
            className="pointer-events-none absolute left-1/2 -translate-x-1/2 whitespace-nowrap rounded px-2 py-1 text-xs font-medium text-white"
            style={{
              bottom: size + 8,
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              backdropFilter: 'blur(8px)',
              border: `1px solid ${color}40`,
              boxShadow: `0 0 6px ${color}30`,
            }}
          >
            {marker.label}
          </div>
        )}
      </div>
    </Marker>
  );
}
