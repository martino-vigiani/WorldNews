export const newsAnalysisSchema = {
  type: 'object' as const,
  properties: {
    location: {
      type: 'object' as const,
      properties: {
        latitude: {
          type: 'number' as const,
          description: 'Latitude of the primary event location',
        },
        longitude: {
          type: 'number' as const,
          description: 'Longitude of the primary event location',
        },
        locationName: {
          type: 'string' as const,
          description: 'Human-readable name of the location',
        },
        confidence: {
          type: 'number' as const,
          description:
            'Location confidence: 1.0 for cities, 0.7 for regions, 0.5 for countries, 0.3 for vague',
        },
      },
      required: ['latitude', 'longitude', 'locationName', 'confidence'],
    },
    category: {
      type: 'string' as const,
      enum: [
        'geopolitics',
        'technology',
        'ai',
        'war',
        'economy',
        'climate',
      ],
      description: 'Exactly one category for this article',
    },
    summary: {
      type: 'string' as const,
      description: '2-3 factual sentences summarizing the event in present tense',
    },
    context: {
      type: 'string' as const,
      description: 'One paragraph on broader implications and background',
    },
    severity: {
      type: 'number' as const,
      description: 'Severity from 1 (minor local event) to 10 (global crisis)',
      minimum: 1,
      maximum: 10,
    },
    relatedRegions: {
      type: 'array' as const,
      items: {
        type: 'object' as const,
        properties: {
          name: {
            type: 'string' as const,
            description: 'Name of the related region',
          },
          latitude: {
            type: 'number' as const,
          },
          longitude: {
            type: 'number' as const,
          },
          relation: {
            type: 'string' as const,
            description: 'How this region relates to the event',
          },
        },
        required: ['name', 'latitude', 'longitude', 'relation'],
      },
      description: '1-4 geographically connected regions',
    },
    mapAnnotation: {
      type: 'string' as const,
      description: '3-6 word label for the map marker',
    },
  },
  required: [
    'location',
    'category',
    'summary',
    'context',
    'severity',
    'relatedRegions',
    'mapAnnotation',
  ],
};
