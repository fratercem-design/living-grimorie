'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import Link from 'next/link';

type AnalysisLayer = 'jungian' | 'alchemical' | 'kabbalistic' | 'mythological' | 'tarot';

type AtlasCard = {
  id: number;
  title: string;
  date: string;
  symbols: string[];
  archetype: string;
  emotion: string;
  connections: number;
};

type AtlasStats = { total: number; archetypes: number; symbols: number };

function formatRelative(iso: string): string {
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
  if (days <= 0) return 'today';
  if (days === 1) return 'yesterday';
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)} week${days >= 14 ? 's' : ''} ago`;
  return `${Math.floor(days / 30)} month${days >= 60 ? 's' : ''} ago`;
}

const DREAM_ATLAS_SAMPLES = [
  { id: 1, title: 'The Tower of Glass', date: '3 days ago', symbols: ['Glass', 'Height', 'Falling'], archetype: 'The Tower', emotion: 'Terror → Liberation', connections: 12 },
  { id: 2, title: 'The Black Dog at the Crossroads', date: '5 days ago', symbols: ['Dog', 'Crossroads', 'Darkness'], archetype: 'The Threshold', emotion: 'Dread → Curiosity', connections: 18 },
  { id: 3, title: 'Underwater Temple', date: '1 week ago', symbols: ['Water', 'Temple', 'Light Below'], archetype: 'The High Priestess', emotion: 'Peace → Overwhelm', connections: 23 },
  { id: 4, title: 'The Red Thread', date: '1 week ago', symbols: ['Thread', 'Labyrinth', 'Crimson'], archetype: 'Ariadne', emotion: 'Purpose', connections: 9 },
  { id: 5, title: 'Father with No Face', date: '2 weeks ago', symbols: ['Father', 'Absence', 'Void'], archetype: 'The Emperor (Shadow)', emotion: 'Grief → Anger', connections: 31 },
  { id: 6, title: 'City of Mirrors', date: '2 weeks ago', symbols: ['Mirror', 'City', 'Doppelganger'], archetype: 'The Shadow', emotion: 'Disorientation', connections: 15 },
];

const ANALYSIS_TEMPLATES: Record<AnalysisLayer, (dream: string) => string> = {
  jungian: (dream) => `Through the Jungian lens, this dream appears to engage the **collective unconscious** at a deep level. The imagery you describe activates several archetypal layers simultaneously.

The central motifs resonate with what Jung called the **individuation process** — the psyche's drive toward wholeness. The figures and environments you encountered are not random; they represent **autonomous complexes** within your own psyche, projected outward into the dream space.

The emotional tone of ${dream.length > 50 ? 'anxiety and disorientation' : 'transition'} suggests your **ego** is encountering the **Shadow** — the repository of everything the conscious personality has denied, repressed, or never developed. This confrontation is not pathological; it is initiatory.

The symbolic geography of your dream — its architecture, its lighting, its temperature — maps to the **feeling-toned complexes** that currently hold the most psychic energy. These deserve careful attention in waking life. What am I refusing to integrate?`,

  alchemical: (dream) => `In alchemical terms, this dream describes a **nigredo phase** — the initial stage of the Great Work in which the prima materia undergoes dissolution. The darkening, the confusion, the dissolution of familiar forms: these are not failures but preparations.

The medieval alchemists would have recognized your dream imagery immediately. The **vas hermeticum** — the sealed vessel in which transformation occurs — corresponds to the dream space itself. You cannot escape it mid-operation.

Look carefully at what is being **calcinated** (burned to ash) in your dream. What established form or identity is being reduced? The alchemists insisted: only after complete dissolution can the new form crystallize.

If water appears, it represents **solutio** — the liquid dissolution of the fixed. If fire, **calcinatio** — the burning away of attachment. If a union of opposites (male/female, sun/moon, king/queen), you are witnessing the **coniunctio** — the central mystery of the Art.`,

  kabbalistic: (dream) => `Through the Kabbalistic framework of the **Tree of Life**, your dream can be mapped across the Sephirot — the ten divine emanations that constitute all reality, including the reality of the inner world.

The **Yesod** sphere (Foundation, Moon, Dreams) is the primary gateway of dream work. It is the membrane between Malkuth (the material world) and the higher Sephirot. What arrives in dreams arrives via Yesod.

The emotional quality of your dream suggests activation at the level of **Hod-Netzach** — the polarity between intellect (Hod/Mercury) and feeling (Netzach/Venus). This axis governs much of our psychological life.

If the dream contained imagery of **ascent** or descent, note the direction: ascending dreams often correspond to activations along the **Middle Pillar** toward Tiphareth (the Self, the Sun, the Heart Center). Descending dreams may point toward **Qliphothic** material — shadow content from the underside of the Tree.`,

  mythological: (dream) => `The mythological layer of this dream reveals a **primordial narrative structure** — one of the recurring story-patterns that the collective unconscious has been generating across cultures for tens of thousands of years.

Your dream appears to encode what Joseph Campbell called the **Hero's Journey** or what Mircea Eliade called the **initiatory schema**: a separation from the familiar world, a descent into chaos or the underworld, and (if the dream completes) an emergence transformed.

The specific mythological **parallels** are significant. Cultures as different as ancient Sumer, classical Greece, and indigenous America have generated nearly identical dream-myths around the central motifs you describe. This universality is not coincidence — it reflects the **invariant deep structure** of the human psyche.

Ask yourself: which mythological figure am I in this dream? Am I **Persephone** descending? **Orpheus** looking back? **Inanna** stripped at each gate? The myth that fits is the myth that is currently *living through you*.`,

  tarot: (dream) => `Mapping your dream onto the **Major Arcana** reveals the archetypal forces presently active in your unconscious. The Tarot is not a predictive system — it is a map of the psyche's own symbolic vocabulary.

The **threshold quality** of your dream corresponds strongly to **The Moon** (XVIII) — the card of dreams themselves, of the unconscious, of the paths that are only visible by uncertain light. The Moon governs the passage through illusion toward deeper reality.

But notice the **forces in tension**: if your dream contains upward movement, lightning, or sudden revelation, **The Tower** (XVI) is also activated — the shattering of the false structure that had to fall. If dissolution or flowing water predominates, look to **The High Priestess** (II) — the keeper of what is veiled.

The **Akashic resonance** between your dream and the Major Arcana suggests: the card currently most alive in your life is not merely symbolic. It is a **living force** moving through your psychic reality. Work with its imagery deliberately in waking life.`,
};

export default function DreamsPage() {
  const [dreamText, setDreamText] = useState('');
  const [title, setTitle] = useState('');
  const [emotions, setEmotions] = useState('');
  const [analysisState, setAnalysisState] = useState<'idle' | 'analyzing' | 'complete'>('idle');
  const [activeLayer, setActiveLayer] = useState<AnalysisLayer>('jungian');
  const [activeAtlasId, setActiveAtlasId] = useState<number | null>(null);
  const [view, setView] = useState<'submit' | 'atlas'>('submit');
  const [analyses, setAnalyses] = useState<Partial<Record<AnalysisLayer, string>>>({});
  const [layerLoading, setLayerLoading] = useState(false);
  const [atlasDreams, setAtlasDreams] = useState<AtlasCard[] | null>(null);
  const [atlasStats, setAtlasStats] = useState<AtlasStats | null>(null);

  useEffect(() => {
    if (view !== 'atlas') return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/dreams');
        if (!res.ok) return;
        const data = await res.json();
        if (cancelled || !Array.isArray(data.dreams)) return;
        type Row = { id: number; title: string; createdAt: string; symbols: string[]; archetype: string; emotions: string };
        const rows: Row[] = data.dreams;
        // connections = other dreams sharing an archetype or symbol (computed over the fetched set)
        const cards: AtlasCard[] = rows.map(row => ({
          id: row.id,
          title: row.title,
          date: formatRelative(row.createdAt),
          symbols: row.symbols ?? [],
          archetype: row.archetype,
          emotion: row.emotions || 'Unrecorded',
          connections: rows.filter(other =>
            other.id !== row.id &&
            (other.archetype === row.archetype || (other.symbols ?? []).some(s => (row.symbols ?? []).includes(s)))
          ).length,
        }));
        if (cards.length > 0) setAtlasDreams(cards);
        if (data.stats) setAtlasStats(data.stats);
      } catch {
        // DB unreachable — atlas falls back to samples
      }
    })();
    return () => { cancelled = true; };
  }, [view]);

  const fetchLayer = async (layer: AnalysisLayer, dream: string): Promise<string> => {
    try {
      const res = await fetch('/api/dream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ layer, title, dream, emotions }),
      });
      if (res.ok) {
        const data = await res.json();
        if (typeof data.content === 'string' && data.content.trim() !== '') {
          return data.content;
        }
      }
    } catch {
      // network failure — fall through to template
    }
    return ANALYSIS_TEMPLATES[layer](dream);
  };

  const analyzeDream = async () => {
    if (!dreamText.trim()) return;
    setAnalysisState('analyzing');
    setAnalyses({});
    setActiveLayer('jungian');
    // persist to the Atlas in parallel with the first analysis
    const save = fetch('/api/dreams', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, dream: dreamText, emotions }),
    }).catch(() => null);
    const content = await fetchLayer('jungian', dreamText);
    setAnalyses({ jungian: content });
    setAnalysisState('complete');
    await save; // the atlas refetches on every open, so no cache invalidation needed
  };

  const selectLayer = async (layer: AnalysisLayer) => {
    setActiveLayer(layer);
    if (analyses[layer] || layerLoading) return;
    setLayerLoading(true);
    const content = await fetchLayer(layer, dreamText);
    setAnalyses(prev => ({ ...prev, [layer]: content }));
    setLayerLoading(false);
  };

  const LAYERS: { id: AnalysisLayer; label: string; color: string }[] = [
    { id: 'jungian', label: 'Jungian', color: '#6fa8ff' },
    { id: 'alchemical', label: 'Alchemical', color: '#ffd700' },
    { id: 'kabbalistic', label: 'Kabbalistic', color: '#ff00cc' },
    { id: 'mythological', label: 'Mythological', color: '#ff6b35' },
    { id: 'tarot', label: 'Tarot', color: '#ffb6e6' },
  ];

  return (
    <main className="min-h-screen pt-8 pb-24">
      <div className="fixed inset-0 pointer-events-none z-0"
        style={{ background: 'radial-gradient(ellipse at 70% 30%, rgba(111,168,255,0.06), transparent 60%)' }} />
      <div className="container-grimoire relative z-10">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
          className="text-center pt-16 mb-12">
          <div className="font-vt323 text-crt-blue/50 text-lg tracking-[0.4em] mb-3 animate-flicker">CHAMBER II</div>
          <h1 className="font-orbitron text-4xl md:text-5xl font-black uppercase tracking-wider mb-3"
            style={{ background: 'linear-gradient(135deg, #6fa8ff, #ffb6e6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            Chamber of Dreams
          </h1>
          <div className="divider-cyan max-w-sm mx-auto mb-4" />
          <p className="font-grotesk text-foreground/50 max-w-xl mx-auto">
            Submit your dreams to the collective archive. The Oracle analyzes through five esoteric lenses.
            Your dream joins the living Atlas of the collective unconscious.
          </p>
        </motion.div>

        {/* Tab Navigation */}
        <div className="flex justify-center gap-4 mb-10">
          {[['submit', 'Submit Dream', '🌙'], ['atlas', 'Dream Atlas', '🗺']].map(([v, l, s]) => (
            <button key={v} onClick={() => setView(v as 'submit' | 'atlas')}
              className={`flex items-center gap-2 px-6 py-3 font-orbitron text-xs uppercase tracking-widest transition-all duration-300 ${
                view === v
                  ? 'border border-crt-blue/60 text-crt-blue bg-crt-blue/10'
                  : 'border border-white/10 text-foreground/40 hover:text-pink-haze'
              }`}>
              <span>{s}</span><span>{l}</span>
            </button>
          ))}
        </div>

        {/* ─── SUBMIT ─── */}
        {view === 'submit' && (
          <motion.div key="submit" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-3xl mx-auto">
            {analysisState === 'idle' && (
              <div className="space-y-4">
                <div className="glass-panel-cyan p-6">
                  <label className="font-orbitron text-xs uppercase tracking-widest text-crt-blue/70 block mb-3">
                    Dream Title
                  </label>
                  <input value={title} onChange={e => setTitle(e.target.value)}
                    placeholder="Name this dream..."
                    className="input-grimoire" style={{ borderColor: 'rgba(111,168,255,0.3)' }} />
                </div>

                <div className="glass-panel-cyan p-6">
                  <label className="font-orbitron text-xs uppercase tracking-widest text-crt-blue/70 block mb-3">
                    Describe Your Dream
                  </label>
                  <textarea value={dreamText} onChange={e => setDreamText(e.target.value)}
                    placeholder="Record every detail you remember — setting, figures, objects, actions, sensations, color, temperature, sounds. Nothing is too small. The unconscious hides its messages in the overlooked detail..."
                    className="textarea-grimoire min-h-48"
                    style={{ borderColor: 'rgba(111,168,255,0.3)' }} />
                  <div className="flex justify-between mt-2">
                    <span className="font-mono-ibm text-xs text-foreground/30">{dreamText.length} characters</span>
                    <span className="font-mono-ibm text-xs text-crt-blue/40">Min recommended: 100</span>
                  </div>
                </div>

                <div className="glass-panel-cyan p-6">
                  <label className="font-orbitron text-xs uppercase tracking-widest text-crt-blue/70 block mb-3">
                    Emotional Signature
                  </label>
                  <input value={emotions} onChange={e => setEmotions(e.target.value)}
                    placeholder="e.g. Terror → Relief, or Melancholy with an undertone of knowing..."
                    className="input-grimoire" style={{ borderColor: 'rgba(111,168,255,0.3)' }} />
                </div>

                <div className="text-center pt-4">
                  <motion.button onClick={analyzeDream}
                    disabled={dreamText.length < 20}
                    className="btn-cyan px-10 py-4 disabled:opacity-40 disabled:cursor-not-allowed"
                    whileHover={dreamText.length >= 20 ? { scale: 1.05 } : {}}
                    whileTap={dreamText.length >= 20 ? { scale: 0.95 } : {}}>
                    🌙 Invoke the Dream Oracle
                  </motion.button>
                </div>
              </div>
            )}

            {analysisState === 'analyzing' && (
              <div className="flex flex-col items-center justify-center py-20">
                <motion.div className="text-6xl mb-6"
                  animate={{ rotate: [0, -10, 10, 0], scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}>🌙</motion.div>
                <div className="ritual-spinner mb-6" />
                <div className="font-vt323 text-crt-blue/70 text-xl tracking-widest animate-flicker">
                  The Oracle descends into your dreamscape...
                </div>
                <div className="font-mono-ibm text-xs text-foreground/30 mt-4">
                  Analyzing through 5 esoteric frameworks
                </div>
              </div>
            )}

            {analysisState === 'complete' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                {title && (
                  <div className="text-center mb-8">
                    <div className="font-vt323 text-crt-blue/50 text-sm tracking-widest mb-1">DREAM RECORDED</div>
                    <h2 className="font-orbitron text-2xl font-bold text-crt-blue uppercase tracking-wider">
                      "{title}"
                    </h2>
                  </div>
                )}

                {/* Layer selector */}
                <div className="flex flex-wrap justify-center gap-2 mb-6">
                  {LAYERS.map(layer => (
                    <button key={layer.id} onClick={() => selectLayer(layer.id)}
                      className={`px-4 py-2 font-orbitron text-xs uppercase tracking-widest transition-all duration-300 ${
                        activeLayer === layer.id
                          ? 'border text-foreground'
                          : 'border border-white/10 text-foreground/40 hover:text-foreground/70'
                      }`}
                      style={activeLayer === layer.id ? {
                        borderColor: layer.color,
                        color: layer.color,
                        background: `${layer.color}15`,
                        boxShadow: `0 0 15px ${layer.color}33`
                      } : {}}>
                      {layer.label}
                    </button>
                  ))}
                </div>

                {/* Analysis content */}
                <AnimatePresence mode="wait">
                  <motion.div key={activeLayer}
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="glass-panel p-8 mb-6"
                    style={{ borderColor: `${LAYERS.find(l => l.id === activeLayer)?.color}33` }}>
                    <div className="font-orbitron text-xs uppercase tracking-widest mb-4"
                      style={{ color: LAYERS.find(l => l.id === activeLayer)?.color }}>
                      {activeLayer.charAt(0).toUpperCase() + activeLayer.slice(1)} Analysis
                    </div>
                    {layerLoading && !analyses[activeLayer] ? (
                      <div className="flex flex-col items-center py-10">
                        <div className="ritual-spinner mb-4" />
                        <div className="font-vt323 text-sm tracking-widest animate-flicker"
                          style={{ color: LAYERS.find(l => l.id === activeLayer)?.color }}>
                          The Oracle turns the {activeLayer} lens upon your dream...
                        </div>
                      </div>
                    ) : (
                      <div className="font-grotesk text-sm text-foreground/75 leading-relaxed whitespace-pre-line">
                        {analyses[activeLayer] ?? ANALYSIS_TEMPLATES[activeLayer](dreamText)}
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>

                {/* Akashic connections */}
                <div className="glass-panel-cyan p-6 mb-6">
                  <div className="font-orbitron text-xs uppercase tracking-widest text-cyan/70 mb-4">
                    Akashic Resonances
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {['The Moon (Tarot)', 'Shadow Archetype', 'Alchemical Nigredo', 'Hecate', 'Liminal Spaces', 'Ouroboros', 'Individuation'].map(link => (
                      <Link key={link} href={`/akashic?q=${encodeURIComponent(link)}`}
                        className="tag-cyan hover:bg-cyan/20 transition-colors cursor-pointer">
                        {link}
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="flex justify-center gap-4">
                  <button onClick={() => { setAnalysisState('idle'); setDreamText(''); setTitle(''); setEmotions(''); }}
                    className="btn-cyan">
                    ↺ Submit Another Dream
                  </button>
                  <button onClick={() => setView('atlas')} className="btn-grimoire">
                    View Dream Atlas →
                  </button>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* ─── ATLAS ─── */}
        {view === 'atlas' && (
          <motion.div key="atlas" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="text-center mb-8">
              <h2 className="font-orbitron text-2xl font-bold uppercase tracking-wider mb-2"
                style={{ color: '#6fa8ff' }}>The Dream Atlas</h2>
              <p className="font-grotesk text-sm text-foreground/50">
                Dreams submitted by seekers worldwide. Pattern-matching the collective unconscious in real time.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-10">
              {[
                { label: 'Dreams Recorded', value: atlasStats ? atlasStats.total.toLocaleString() : '—', color: '#6fa8ff' },
                { label: 'Archetypes Active', value: atlasStats ? atlasStats.archetypes.toLocaleString() : '—', color: '#ff00cc' },
                { label: 'Symbols Indexed', value: atlasStats ? atlasStats.symbols.toLocaleString() : '—', color: '#ffd700' },
              ].map(stat => (
                <div key={stat.label} className="glass-panel p-4 text-center"
                  style={{ borderColor: `${stat.color}33` }}>
                  <div className="font-orbitron text-2xl font-black mb-1" style={{ color: stat.color }}>
                    {stat.value}
                  </div>
                  <div className="font-mono-ibm text-xs text-foreground/40 uppercase tracking-widest">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Dream cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
              {(atlasDreams ?? DREAM_ATLAS_SAMPLES).map((dream, i) => (
                <motion.div key={dream.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="glass-panel p-5 cursor-pointer hover:border-crt-blue/40 transition-all duration-300 group"
                  onClick={() => setActiveAtlasId(activeAtlasId === dream.id ? null : dream.id)}
                  style={{ borderColor: activeAtlasId === dream.id ? 'rgba(111,168,255,0.4)' : undefined }}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="text-2xl">🌙</div>
                    <div className="font-mono-ibm text-xs text-foreground/30">{dream.date}</div>
                  </div>
                  <h3 className="font-orbitron text-sm font-bold uppercase tracking-wider text-crt-blue mb-2">
                    {dream.title}
                  </h3>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {dream.symbols.map(s => <span key={s} className="tag-cyan text-xs">{s}</span>)}
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-mono-ibm text-xs text-foreground/40">Archetype:</div>
                      <div className="font-grotesk text-xs text-pink-haze">{dream.archetype}</div>
                    </div>
                    <div className="font-mono-ibm text-xs text-cyan/50">
                      {dream.connections} connections
                    </div>
                  </div>
                  <AnimatePresence>
                    {activeAtlasId === dream.id && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }} className="mt-4 pt-4 border-t border-crt-blue/20">
                        <div className="font-mono-ibm text-xs text-foreground/50 mb-2">Emotional Signature:</div>
                        <div className="font-grotesk text-sm text-foreground/80 mb-3">{dream.emotion}</div>
                        <Link href={`/akashic?q=${encodeURIComponent(dream.archetype)}`}
                          className="font-mono-ibm text-xs text-cyan/60 hover:text-cyan transition-colors">
                          → View in Akashic Library
                        </Link>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>

            <div className="text-center">
              <button onClick={() => setView('submit')} className="btn-cyan">
                + Add Your Dream to the Atlas
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </main>
  );
}
