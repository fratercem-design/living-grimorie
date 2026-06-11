import { NextResponse } from 'next/server';
import { ORACLE_PERSONAS } from '@/lib/data/oracles';
import { completeWithFallback } from '@/lib/openrouter';
import { awardPoints } from '@/lib/points';

type ChatMessage = { role: 'user' | 'assistant'; content: string };

export async function POST(request: Request) {
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

  const result = await completeWithFallback([
    { role: 'system', content: oracle.systemPrompt },
    ...history,
  ]);

  if (!result.ok) {
    return NextResponse.json(
      { error: 'All oracle channels are exhausted', details: result.errors },
      { status: 503 },
    );
  }

  // award only on the first exchange of a conversation, not every message
  if (history.length <= 1) {
    await awardPoints(request.headers, 'Consult an Oracle persona', 15);
  }

  return NextResponse.json({ content: result.content, model: result.model });
}
