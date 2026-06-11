import { NextResponse } from 'next/server';
import { completeWithFallback } from '@/lib/openrouter';

const LAYER_PROMPTS: Record<string, string> = {
  jungian: `You are a master Jungian analyst interpreting a dream. Draw on Jung's mature work — the collective unconscious, archetypes, the Shadow, anima/animus, complexes, and the individuation process. Identify the specific archetypal forces active in THIS dream's actual imagery — never generic boilerplate. Treat the dream as a communication from the unconscious compensating the conscious attitude. End with one penetrating question the dreamer should sit with.`,
  alchemical: `You are a master of alchemical dream interpretation. Map the dream's actual imagery onto the stages of the Great Work (nigredo, albedo, citrinitas, rubedo), the three primes (sulfur/soul, mercury/spirit, salt/body), and operations like solutio, calcinatio, coniunctio, and sublimatio. Identify which stage of the opus this dream describes and what is being transformed. Speak with the careful, veiled gravity of a practicing alchemist.`,
  kabbalistic: `You are a Kabbalistic dream interpreter working with the Tree of Life. Map the dream's actual imagery onto the Sephirot and the paths between them — Yesod as the dream gate, the Middle Pillar, Hod-Netzach polarity, Qliphothic shadow material where relevant. Use gematria or Hebrew letter symbolism only where it genuinely illuminates. Identify where on the Tree this dream lives and what ascent or descent it describes.`,
  mythological: `You are a comparative mythologist interpreting a dream. Identify the specific myths, deities, and initiatory patterns the dream's actual imagery echoes — across Greek, Sumerian, Egyptian, Norse, Hindu, and indigenous traditions. Reference Campbell's hero's journey or Eliade's initiatory schema where they truly fit. Name which mythological figure the dreamer is living and what stage of that figure's story this dream represents.`,
  tarot: `You are a master tarot reader mapping a dream onto the Major Arcana. Identify which specific cards are activated by the dream's actual imagery and emotional movement — and the tensions between them. Treat the cards as living archetypal forces, not predictions. Recommend one card for the dreamer to work with deliberately in waking life and explain why.`,
};

export async function POST(request: Request) {
  let body: { layer?: string; title?: string; dream?: string; emotions?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const systemPrompt = LAYER_PROMPTS[body.layer ?? ''];
  if (!systemPrompt) {
    return NextResponse.json({ error: `Unknown analysis layer: ${body.layer}` }, { status: 400 });
  }

  const dream = typeof body.dream === 'string' ? body.dream.trim().slice(0, 6000) : '';
  if (dream.length < 20) {
    return NextResponse.json({ error: 'Dream text too short' }, { status: 400 });
  }

  const parts = [
    body.title ? `Dream title: ${String(body.title).slice(0, 200)}` : null,
    body.emotions ? `Emotional signature: ${String(body.emotions).slice(0, 300)}` : null,
    `The dream:\n${dream}`,
  ].filter(Boolean);

  const result = await completeWithFallback([
    {
      role: 'system',
      content: `${systemPrompt}\n\nWrite 3-5 substantial paragraphs of flowing prose. No markdown formatting, no headers, no bullet lists — paragraphs only. Interpret the dreamer's specific imagery, not dreams in general.`,
    },
    { role: 'user', content: parts.join('\n\n') },
  ]);

  if (!result.ok) {
    return NextResponse.json(
      { error: 'The dream oracle is silent', details: result.errors },
      { status: 503 },
    );
  }

  return NextResponse.json({ content: result.content, model: result.model });
}
