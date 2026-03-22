import type { NewsAnalysis } from '@/types/analysis';
import { getClient } from './client';
import { newsAnalysisSchema } from './schemas';
import { ANALYSIS_SYSTEM_PROMPT } from './prompts';

const MODEL = 'claude-sonnet-4-5-20250514';

export async function analyzeArticle(
  title: string,
  description: string
): Promise<NewsAnalysis> {
  const client = getClient();

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 1024,
    system: ANALYSIS_SYSTEM_PROMPT,
    tools: [
      {
        name: 'analyze_news',
        description:
          'Submit a structured analysis of the news article for display on the world map.',
        input_schema: newsAnalysisSchema,
      },
    ],
    tool_choice: { type: 'tool', name: 'analyze_news' },
    messages: [
      {
        role: 'user',
        content: `Analyze this news article:\n\nTitle: ${title}\n\nDescription: ${description}`,
      },
    ],
  });

  const toolBlock = response.content.find(
    (block) => block.type === 'tool_use'
  );

  if (!toolBlock || toolBlock.type !== 'tool_use') {
    throw new Error('Claude did not return a tool_use block');
  }

  const analysis = toolBlock.input as NewsAnalysis;

  if (
    !analysis.location ||
    !analysis.category ||
    !analysis.summary ||
    typeof analysis.severity !== 'number'
  ) {
    throw new Error('Analysis response missing required fields');
  }

  return analysis;
}
