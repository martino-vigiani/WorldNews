'use client';

import { useCallback } from 'react';
import type { MapRef } from 'react-map-gl/maplibre';
import { INITIAL_VIEW } from '@/lib/map/styles';

/**
 * Camera-control helpers for a react-map-gl MapRef.
 *
 * Usage:
 *   const mapRef = useRef<MapRef>(null);
 *   const { flyTo, resetView } = useMapNavigation(mapRef);
 */
export function useMapNavigation(
  mapRef: React.RefObject<MapRef | null>,
) {
  const flyTo = useCallback(
    (
      latitude: number,
      longitude: number,
      zoom: number = 5,
      duration: number = 2000,
    ) => {
      mapRef.current?.flyTo({
        center: [longitude, latitude],
        zoom,
        duration,
      });
    },
    [mapRef],
  );

  const resetView = useCallback(() => {
    mapRef.current?.flyTo({
      center: [INITIAL_VIEW.longitude, INITIAL_VIEW.latitude],
      zoom: INITIAL_VIEW.zoom,
      duration: 1500,
    });
  }, [mapRef]);

  return { flyTo, resetView } as const;
}
