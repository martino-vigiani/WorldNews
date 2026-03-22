# WorldNews

AI-powered global intelligence dashboard. Real-time world news visualized on an interactive cyberpunk map with Claude AI analysis.

## Features

- Interactive 2D dark map (MapLibre GL JS + CartoDB Dark Matter)
- Real-time news aggregation from Google News RSS + GNews API
- Claude AI analysis: geolocation, categorization, severity, context
- Pulsing neon markers with fly-to animation
- Category filters: geopolitics, technology, AI, war, economy, climate
- Glassmorphism dark UI

## Setup

```bash
npm install
```

Create `.env.local`:

```
ANTHROPIC_API_KEY=your-key-here
GNEWS_API_KEY=your-gnews-key-here  # optional
```

Get your Anthropic API key at [console.anthropic.com](https://console.anthropic.com).

## Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Tech Stack

Next.js 15 | MapLibre GL JS | Claude AI | Tailwind CSS v4 | Zustand | SWR
