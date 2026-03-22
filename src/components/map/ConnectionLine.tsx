'use client';

import { useMemo } from 'react';
import { Source, Layer } from 'react-map-gl/maplibre';
import type { ConnectionLine as ConnectionLineType } from '@/types/map';

interface ConnectionLineProps {
  connection: ConnectionLineType;
  /** Unique index or id used to namespace the source/layer */
  index: number;
}

export function ConnectionLine({ connection, index }: ConnectionLineProps) {
  const sourceId = `connection-source-${index}`;
  const lineLayerId = `connection-line-${index}`;
  const glowLayerId = `connection-glow-${index}`;

  const geojson: GeoJSON.Feature<GeoJSON.LineString> = useMemo(
    () => ({
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'LineString',
        coordinates: [connection.from, connection.to],
      },
    }),
    [connection.from, connection.to],
  );

  return (
    <Source id={sourceId} type="geojson" data={geojson}>
      {/* Background glow layer */}
      <Layer
        id={glowLayerId}
        type="line"
        paint={{
          'line-color': '#00d4ff',
          'line-width': 4,
          'line-opacity': 0.15,
          'line-blur': 6,
        }}
      />

      {/* Foreground dashed line */}
      <Layer
        id={lineLayerId}
        type="line"
        paint={{
          'line-color': '#00d4ff',
          'line-width': 1.5,
          'line-opacity': 0.6,
          'line-dasharray': [2, 4],
        }}
      />
    </Source>
  );
}
