import { NextResponse } from 'next/server';
import { ORACLE_PERSONAS } from '@/lib/data/oracles';

type ChatMessage = { role: 'user' | 'assistant'; content: string };

const DEFAULT_MODELS = [
  'meta-llama/llama-3.3-70b-instruct:free',
  'qwen/qwen3-next-80b-a3b-instruct:free',
  'google/gemma-4-26b-a4b-it:free',
  'nvidia/nemotron-3-super-120b-a12b:free',
];

function getModelChain(): string[] {
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

export async function POST(request: Request) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'OPENROUTER_API_KEY is not configured' }, { status: 500 });
  }

  let body: { oracleId?: string; messages?: ChatMessage[] };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const oracle = ORACLE_PERSONAS.find(o => o.id === body.oracleId);
  if (!oracle) {
    return NextResponse.json({ error: `Unknown oracle: ${body.oracleId}` }, { status: 400 });
  }

  const history = (body.messages ?? [])
    .filter(m => (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
    .slice(-12); // keep context small for free-tier token limits

  if (history.length === 0 || history[history.length - 1].role !== 'user') {
    return NextResponse.json({ error: 'Last message must be from the user' }, { status: 400 });
  }

  const payloadMessages = [
    { role: 'system', content: oracle.systemPrompt },
    ...history,
  ];

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
          messages: payloadMessages,
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

      return NextResponse.json({ content, model });
    } catch (err) {
      errors.push(`${model}: ${err instanceof Error ? err.message : 'fetch failed'}`);
    }
  }

  return NextResponse.json(
    { error: 'All oracle channels are exhausted', details: errors },
    { status: 503 },
  );
}
