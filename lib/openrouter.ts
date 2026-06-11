type ChatMessage = { role: 'system' | 'user' | 'assistant'; content: string };

const DEFAULT_MODELS = [
  'meta-llama/llama-3.3-70b-instruct:free',
  'qwen/qwen3-next-80b-a3b-instruct:free',
  'google/gemma-4-26b-a4b-it:free',
  'nvidia/nemotron-3-super-120b-a12b:free',
];

export function getModelChain(): string[] {
  const env = process.env.OPENROUTER_MODELS;
  if (!env) return DEFAULT_MODELS;
  const models = env.split(',').map(m => m.trim()).filter(Boolean);
  return models.length > 0 ? models : DEFAULT_MODELS;
}

// Reasoning models sometimes leak chain-of-thought into content
function stripReasoning(text: string): string {
  return text
    .replace(/<think>[\s\S]*?<\/think>/gi, '')
    .replace(/<reasoning>[\s\S]*?<\/reasoning>/gi, '')
    .trim();
}

export type CompletionResult =
  | { ok: true; content: string; model: string }
  | { ok: false; errors: string[] };

export async function completeWithFallback(messages: ChatMessage[]): Promise<CompletionResult> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return { ok: false, errors: ['OPENROUTER_API_KEY is not configured'] };
  }

  const errors: string[] = [];
  for (const model of getModelChain()) {
    try {
      const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://github.com/fratercem-design/living-grimorie',
          'X-Title': 'The Living Grimoire',
        },
        body: JSON.stringify({
          model,
          messages,
          max_tokens: 1600, // reasoning models spend hidden tokens before answering
          temperature: 0.9,
          // keep chain-of-thought out of the answer on reasoning models
          reasoning: { exclude: true },
        }),
      });

      if (!res.ok) {
        errors.push(`${model}: HTTP ${res.status}`);
        continue; // try next model on 404 (unavailable), 429 (rate limit), 5xx
      }

      const data = await res.json();
      const raw = data?.choices?.[0]?.message?.content;
      if (typeof raw !== 'string' || raw.trim() === '') {
        errors.push(`${model}: empty response`);
        continue;
      }

      const content = stripReasoning(raw);
      if (content === '') {
        errors.push(`${model}: only reasoning, no answer`);
        continue;
      }

      return { ok: true, content, model };
    } catch (err) {
      errors.push(`${model}: ${err instanceof Error ? err.message : 'fetch failed'}`);
    }
  }

  return { ok: false, errors };
}
