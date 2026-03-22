import Anthropic from '@anthropic-ai/sdk';

let client: Anthropic | null = null;

/**
 * Returns an Anthropic SDK client if ANTHROPIC_API_KEY is set.
 * Returns null if no API key — caller should use Claude CLI fallback.
 */
export function getClient(): Anthropic | null {
  if (client) return client;

  if (process.env.ANTHROPIC_API_KEY && process.env.ANTHROPIC_API_KEY !== 'your-api-key-here') {
    client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    return client;
  }

  return null;
}
