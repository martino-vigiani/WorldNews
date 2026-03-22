'use client';

import { useRef, useCallback, forwardRef, useImperativeHandle } from 'react';
import Map, { type MapRef } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';

import type { MapMarker, ConnectionLine as ConnectionLineType } from '@/types/map';
import { MAP_STYLE_URL, INITIAL_VIEW } from '@/lib/map/styles';
import { useMapNavigation } from '@/hooks/useMapNavigation';
import { NewsMarker } from './NewsMarker';
import { ConnectionLine } from './ConnectionLine';
import { MapControls } from './MapControls';

export interface WorldMapHandle {
  flyTo: (lat: number, lng: number, zoom?: number, duration?: number) => void;
  resetView: () => void;
}

interface WorldMapProps {
  markers?: MapMarker[];
  connections?: ConnectionLineType[];
  selectedMarkerId?: string | null;
  onMarkerClick?: (id: string) => void;
}

export const WorldMap = forwardRef<WorldMapHandle, WorldMapProps>(
  function WorldMap(
    { markers = [], connections = [], selectedMarkerId = null, onMarkerClick },
    ref,
  ) {
    const mapRef = useRef<MapRef>(null);
    const { flyTo, resetView } = useMapNavigation(mapRef);

    // Expose navigation methods to parent via ref
    useImperativeHandle(ref, () => ({ flyTo, resetView }), [flyTo, resetView]);

    const handleMarkerClick = useCallback(
      (id: string) => {
        onMarkerClick?.(id);

        const marker = markers.find((m) => m.id === id);
        if (marker) {
          flyTo(marker.latitude, marker.longitude, 5, 1500);
        }
      },
      [onMarkerClick, markers, flyTo],
    );

    return (
      <div className="relative h-full w-full" style={{ background: '#0a0a0f' }}>
        <Map
          ref={mapRef}
          initialViewState={{
            longitude: INITIAL_VIEW.longitude,
            latitude: INITIAL_VIEW.latitude,
            zoom: INITIAL_VIEW.zoom,
          }}
          mapStyle={MAP_STYLE_URL}
          style={{ width: '100%', height: '100%' }}
          attributionControl={false}
        >
          {/* Connection lines rendered first (below markers) */}
          {connections.map((conn, i) => (
            <ConnectionLine key={i} connection={conn} index={i} />
          ))}

          {/* News markers */}
          {markers.map((marker) => (
            <NewsMarker
              key={marker.id}
              marker={marker}
              selected={marker.id === selectedMarkerId}
              onClick={handleMarkerClick}
            />
          ))}
        </Map>

        <MapControls onResetView={resetView} />
      </div>
    );
  },
);
