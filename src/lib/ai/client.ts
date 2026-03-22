import Anthropic from '@anthropic-ai/sdk';
import { execSync } from 'child_process';

let client: Anthropic | null = null;
let cachedToken: string | null = null;
let tokenExpiresAt = 0;

interface KeychainCredentials {
  claudeAiOauth?: {
    accessToken: string;
    refreshToken: string;
    expiresAt: number;
  };
}

function getOAuthToken(): string | null {
  // Return cached token if still valid (with 60s buffer)
  if (cachedToken && tokenExpiresAt > Date.now() + 60_000) {
    return cachedToken;
  }

  try {
    const raw = execSync(
      'security find-generic-password -s "Claude Code-credentials" -w 2>/dev/null',
      { encoding: 'utf-8', timeout: 5000 },
    ).trim();

    const creds: KeychainCredentials = JSON.parse(raw);
    const oauth = creds.claudeAiOauth;

    if (!oauth?.accessToken) return null;

    if (oauth.expiresAt <= Date.now()) {
      console.warn('[ai/client] OAuth token expired, will retry on next call');
      cachedToken = null;
      tokenExpiresAt = 0;
      return null;
    }

    cachedToken = oauth.accessToken;
    tokenExpiresAt = oauth.expiresAt;
    console.log('[ai/client] Using Claude Code OAuth token (Max plan)');
    return cachedToken;
  } catch {
    return null;
  }
}

export function getClient(): Anthropic {
  // Try OAuth token first (uses Max plan limits)
  const oauthToken = getOAuthToken();

  if (oauthToken) {
    // Recreate client if token changed
    if (!client || (client as unknown as Record<string, unknown>)._authToken !== oauthToken) {
      client = new Anthropic({
        authToken: oauthToken,
        apiKey: null,
      });
      (client as unknown as Record<string, unknown>)._authToken = oauthToken;
    }
    return client;
  }

  // Fallback: API key
  if (process.env.ANTHROPIC_API_KEY) {
    if (!client) {
      client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    }
    return client;
  }

  throw new Error(
    'No authentication available. Either log in to Claude Code (OAuth) or set ANTHROPIC_API_KEY.',
  );
}
