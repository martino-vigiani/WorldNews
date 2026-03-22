/** CartoDB Dark Matter base style -- dark cyberpunk aesthetic */
export const MAP_STYLE_URL =
  'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json';

/** Initial camera when the map first loads */
export const INITIAL_VIEW = {
  longitude: 15,
  latitude: 30,
  zoom: 2.5,
} as const;

/** Category-to-color mapping for markers and UI accents */
export const CATEGORY_COLORS: Record<string, string> = {
  geopolitics: '#ffaa00',
  technology: '#00d4ff',
  ai: '#aa55ff',
  war: '#ff3366',
  economy: '#00ff88',
  climate: '#0088ff',
} as const;
