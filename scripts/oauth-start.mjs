#!/usr/bin/env node
/**
 * Reads Claude Code OAuth token from macOS Keychain,
 * exchanges it for an ephemeral API key, then starts Next.js dev server.
 */
import { execSync, spawn } from 'child_process';

const API_KEY_URL = 'https://api.anthropic.com/api/oauth/claude_cli/create_api_key';

function readOAuthToken() {
  try {
    const raw = execSync(
      '/usr/bin/security find-generic-password -s "Claude Code-credentials" -w',
      { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'pipe'] },
    ).trim();
    const creds = JSON.parse(raw);
    const oauth = creds.claudeAiOauth;
    if (!oauth?.accessToken) throw new Error('No accessToken found');
    if (oauth.expiresAt <= Date.now()) throw new Error('Token expired');
    console.log(`✓ OAuth token read (plan: ${oauth.subscriptionType}, tier: ${oauth.rateLimitTier})`);
    return oauth.accessToken;
  } catch (err) {
    console.error('✗ Failed to read OAuth token from Keychain:', err.message);
    return null;
  }
}

async function exchangeForApiKey(oauthToken) {
  console.log('  Exchanging OAuth token for ephemeral API key...');
  const res = await fetch(API_KEY_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${oauthToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name: 'worldnews-ephemeral' }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Exchange failed (${res.status}): ${text}`);
  }

  const data = await res.json();
  const key = data.api_key ?? data.key ?? data.apiKey;
  if (!key) throw new Error(`No key in response: ${JSON.stringify(data)}`);
  console.log(`✓ Got ephemeral API key (${key.substring(0, 12)}...)`);
  return key;
}

async function main() {
  console.log('\n🔑 WorldNews OAuth Startup\n');

  let apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey || apiKey === 'your-api-key-here') {
    const token = readOAuthToken();
    if (token) {
      try {
        apiKey = await exchangeForApiKey(token);
      } catch (err) {
        console.error('✗ Key exchange failed:', err.message);
      }
    }
  }

  if (!apiKey || apiKey === 'your-api-key-here') {
    console.error('\n✗ No API key available. Either:');
    console.error('  1. Log in to Claude Code (claude login)');
    console.error('  2. Set ANTHROPIC_API_KEY in .env.local');
    process.exit(1);
  }

  console.log('\n🚀 Starting Next.js on port 5001...\n');

  const child = spawn('npx', ['next', 'dev', '--port', '5001'], {
    env: { ...process.env, ANTHROPIC_API_KEY: apiKey },
    stdio: 'inherit',
    shell: true,
  });

  child.on('exit', (code) => process.exit(code ?? 0));
  process.on('SIGINT', () => child.kill('SIGINT'));
  process.on('SIGTERM', () => child.kill('SIGTERM'));
}

main();
