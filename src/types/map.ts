export interface MapMarker {
  id: string;
  latitude: number;
  longitude: number;
  label: string;
  category: 'geopolitics' | 'technology' | 'ai' | 'war' | 'economy' | 'climate';
  severity: number; // 1-10
}

export interface CameraPosition {
  latitude: number;
  longitude: number;
  zoom: number;
}

export interface ConnectionLine {
  from: [number, number]; // [lng, lat]
  to: [number, number];
  label?: string;
}
