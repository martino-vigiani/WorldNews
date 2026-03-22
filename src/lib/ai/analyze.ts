import { execSync } from 'child_process';
import type { NewsAnalysis } from '@/types/analysis';
import { getClient } from './client';
import { newsAnalysisSchema } from './schemas';
import { ANALYSIS_SYSTEM_PROMPT } from './prompts';

const MODEL = 'claude-sonnet-4-5-20250514';

const JSON_INSTRUCTION = `Respond with ONLY a valid JSON object matching this schema (no markdown, no backticks, no explanation):
{
  "location": { "latitude": number, "longitude": number, "locationName": string, "confidence": number },
  "category": "geopolitics"|"technology"|"ai"|"war"|"economy"|"climate",
  "summary": string,
  "context": string,
  "severity": number (1-10),
  "relatedRegions": [{ "name": string, "latitude": number, "longitude": number, "relation": string }],
  "mapAnnotation": string (3-6 words)
}`;

/** Analyze via Anthropic SDK (requires ANTHROPIC_API_KEY) */
async function analyzeWithSDK(title: string, description: string): Promise<NewsAnalysis> {
  const client = getClient();
  if (!client) throw new Error('No SDK client');

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 1024,
    system: ANALYSIS_SYSTEM_PROMPT,
    tools: [
      {
        name: 'analyze_news',
        description: 'Submit structured analysis of a news article for the world map.',
        input_schema: newsAnalysisSchema,
      },
    ],
    tool_choice: { type: 'tool', name: 'analyze_news' },
    messages: [
      { role: 'user', content: `Analyze this news article:\n\nTitle: ${title}\n\nDescription: ${description}` },
    ],
  });

  const toolBlock = response.content.find((b) => b.type === 'tool_use');
  if (!toolBlock || toolBlock.type !== 'tool_use') {
    throw new Error('Claude did not return a tool_use block');
  }
  return toolBlock.input as NewsAnalysis;
}

/** Analyze via Claude Code CLI (uses Max plan OAuth) */
async function analyzeWithCLI(title: string, description: string): Promise<NewsAnalysis> {
  const prompt = `${ANALYSIS_SYSTEM_PROMPT}\n\n${JSON_INSTRUCTION}\n\nAnalyze this news article:\n\nTitle: ${title}\n\nDescription: ${description}`;

  const result = execSync(
    `claude -p ${shellEscape(prompt)} --max-turns 1 --model sonnet`,
    { encoding: 'utf-8', timeout: 60_000, stdio: ['pipe', 'pipe', 'pipe'] },
  ).trim();

  // Extract JSON from response (handle possible markdown wrapping)
  const jsonMatch = result.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('No JSON in Claude CLI response');

  const analysis = JSON.parse(jsonMatch[0]) as NewsAnalysis;
  if (!analysis.location || !analysis.category || !analysis.summary) {
    throw new Error('Analysis missing required fields');
  }
  return analysis;
}

function shellEscape(s: string): string {
  return `'${s.replace(/'/g, "'\\''")}'`;
}

/** Main entry: tries SDK first, falls back to CLI */
export async function analyzeArticle(title: string, description: string): Promise<NewsAnalysis> {
  // Try SDK if API key is available
  const client = getClient();
  if (client) {
    return analyzeWithSDK(title, description);
  }

  // Fallback: Claude Code CLI (uses Max plan)
  console.log('[ai/analyze] Using Claude Code CLI (Max plan)');
  return analyzeWithCLI(title, description);
}
