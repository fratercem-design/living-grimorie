'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import Link from 'next/link';

type SyncCategory = 'animal' | 'number' | 'person' | 'dream' | 'object' | 'event' | 'color' | 'word';

const SAMPLE_SYNCS = [
  { id: 1, title: 'Crow before the change', category: 'animal', count: 23, description: 'Seeing crows in unusual circumstances before significant life transitions', date: '2 days ago', symbol: '🐦‍⬛', intensity: 'high' },
  { id: 2, title: 'The number 11:11', category: 'number', count: 847, description: 'Noticing 11:11 on clocks at pivotal decision moments', date: '1 hour ago', symbol: '🕐', intensity: 'extreme' },
  { id: 3, title: 'Red thread in dreams and waking', category: 'dream', count: 12, description: 'A red thread appearing in both dreams and waking life simultaneously', date: '4 days ago', symbol: '🧵', intensity: 'medium' },
  { id: 4, title: 'Unknown person appears in life', category: 'person', count: 67, description: 'Dreaming of a stranger who then appears in real life within 48 hours', date: '1 week ago', symbol: '👤', intensity: 'high' },
  { id: 5, title: 'Books falling open to relevant pages', category: 'object', count: 31, description: 'Books dropping or being found open to passages of uncanny relevance', date: '3 days ago', symbol: '📖', intensity: 'medium' },
  { id: 6, title: 'Radio speaks directly', category: 'event', count: 89, description: 'Turning on radio/music to hear lyrics that perfectly describe the current moment', date: '5 hours ago', symbol: '📻', intensity: 'high' },
  { id: 7, title: 'Owl at threshold moments', category: 'animal', count: 18, description: 'Owl sightings directly before or after a significant ending or beginning', date: '6 days ago', symbol: '🦉', intensity: 'high' },
  { id: 8, title: 'Three coincidences in one day', category: 'event', count: 156, description: 'Multiple meaningful coincidences clustering in a single 24-hour period', date: '2 hours ago', symbol: '✨', intensity: 'extreme' },
];

const INTENSITY_COLORS = { low: '#6fa8ff', medium: '#ffd700', high: '#ff6b35', extreme: '#ff00cc' };

const CATEGORY_LABELS: Record<SyncCategory, string> = {
  animal: 'Animal Signs', number: 'Numbers & Patterns', person: 'Meaningful Encounters',
  dream: 'Dream Echoes', object: 'Objects & Books', event: 'Coincident Events',
  color: 'Colors & Visions', word: 'Words & Phrases',
};

export default function SynchronicitiesPage() {
  const [view, setView] = useState<'report' | 'patterns' | 'map'>('patterns');
  const [formData, setFormData] = useState({ title: '', description: '', category: 'event' as SyncCategory, date: '', emotion: '', question: '' });
  const [submitted, setSubmitted] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [selectedSync, setSelectedSync] = useState<typeof SAMPLE_SYNCS[0] | null>(null);

  const handleSubmit = () => {
    if (!formData.title || !formData.description) return;
    setSubmitted(true);
  };

  const filtered = filterCategory === 'all' ? SAMPLE_SYNCS : SAMPLE_SYNCS.filter(s => s.category === filterCategory);

  return (
    <main className="min-h-screen pt-8 pb-24">
      <div className="fixed inset-0 pointer-events-none z-0"
        style={{ background: 'radial-gradient(ellipse at 50% 60%, rgba(255,182,230,0.05), transparent 60%)' }} />
      <div className="container-grimoire relative z-10">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
          className="text-center pt-16 mb-12">
          <div className="font-vt323 text-pink-haze/50 text-lg tracking-[0.4em] mb-3 animate-flicker">CHAMBER V</div>
          <h1 className="font-orbitron text-4xl md:text-5xl font-black uppercase tracking-wider mb-3"
            style={{ background: 'linear-gradient(135deg, #ffb6e6, #ff00cc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            Chamber of Synchronicities
          </h1>
          <div className="mb-4" style={{ height: 1, background: 'linear-gradient(90deg, transparent, #ffb6e6, transparent)', maxWidth: 300, margin: '0 auto 16px' }} />
          <p className="font-grotesk text-foreground/50 max-w-xl mx-auto">
            The universe speaks in patterns. Record the strange coincidences you've witnessed.
            The system finds what connects them. A collective experiment in meaning.
          </p>
        </motion.div>

        {/* Live ticker */}
        <div className="border border-pink-haze/20 bg-pink-haze/5 p-3 mb-8 overflow-hidden relative">
          <div className="absolute left-0 top-0 bottom-0 w-20 z-10"
            style={{ background: 'linear-gradient(90deg, #05010a, transparent)' }} />
          <div className="absolute right-0 top-0 bottom-0 w-20 z-10"
            style={{ background: 'linear-gradient(270deg, #05010a, transparent)' }} />
          <motion.div className="flex gap-8 whitespace-nowrap"
            animate={{ x: [0, -800] }} transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}>
            {[...SAMPLE_SYNCS, ...SAMPLE_SYNCS].map((s, i) => (
              <span key={i} className="font-mono-ibm text-xs text-pink-haze/60">
                {s.symbol} {s.title} — {s.count} reports
              </span>
            ))}
          </motion.div>
        </div>

        {/* Tab navigation */}
        <div className="flex justify-center gap-4 mb-10">
          {[['patterns', '✨ Active Patterns'], ['report', '+ Report Synchronicity'], ['map', '🗺 Global Map']].map(([v, l]) => (
            <button key={v} onClick={() => setView(v as typeof view)}
              className={`px-5 py-2.5 font-orbitron text-xs uppercase tracking-widest transition-all duration-300 ${
                view === v
                  ? 'border text-pink-haze'
                  : 'border border-white/10 text-foreground/40 hover:text-pink-haze/60'
              }`}
              style={view === v ? { borderColor: 'rgba(255,182,230,0.6)', background: 'rgba(255,182,230,0.08)' } : {}}>
              {l}
            </button>
          ))}
        </div>

        {/* ─── PATTERNS ─── */}
        {view === 'patterns' && (
          <motion.div key="patterns" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                { label: 'Reports Today', value: '127', delta: '+23%', color: '#ff00cc' },
                { label: 'Active Patterns', value: '34', delta: '+5 new', color: '#ffb6e6' },
                { label: 'Global Contributors', value: '8,421', delta: 'worldwide', color: '#6fa8ff' },
                { label: 'Pattern Matches', value: '2.1M', delta: 'cross-linked', color: '#ffd700' },
              ].map(s => (
                <div key={s.label} className="glass-panel p-4 text-center"
                  style={{ borderColor: `${s.color}33` }}>
                  <div className="font-orbitron text-2xl font-black mb-1" style={{ color: s.color }}>{s.value}</div>
                  <div className="font-mono-ibm text-xs text-foreground/40 uppercase tracking-wider mb-1">{s.label}</div>
                  <div className="font-mono-ibm text-xs" style={{ color: `${s.color}88` }}>{s.delta}</div>
                </div>
              ))}
            </div>

            {/* Category filter */}
            <div className="flex flex-wrap gap-2 mb-6">
              <button onClick={() => setFilterCategory('all')}
                className={`font-mono-ibm text-xs px-3 py-1.5 uppercase tracking-wider transition-all ${
                  filterCategory === 'all' ? 'border border-pink-haze/60 text-pink-haze bg-pink-haze/10' : 'border border-white/10 text-foreground/40 hover:text-pink-haze/50'
                }`}>All</button>
              {Object.entries(CATEGORY_LABELS).map(([cat, label]) => (
                <button key={cat} onClick={() => setFilterCategory(filterCategory === cat ? 'all' : cat)}
                  className={`font-mono-ibm text-xs px-3 py-1.5 uppercase tracking-wider transition-all ${
                    filterCategory === cat ? 'border border-pink-haze/60 text-pink-haze bg-pink-haze/10' : 'border border-white/10 text-foreground/40 hover:text-pink-haze/50'
                  }`}>{label}</button>
              ))}
            </div>

            {/* Pattern cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filtered.map((sync, i) => (
                <motion.div key={sync.id}
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                  className="glass-panel p-5 cursor-pointer group hover:border-pink-haze/30 transition-all duration-300"
                  onClick={() => setSelectedSync(selectedSync?.id === sync.id ? null : sync)}>
                  <div className="flex items-start gap-4">
                    <div className="text-4xl">{sync.symbol}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-orbitron text-sm font-bold uppercase tracking-wider"
                          style={{ color: INTENSITY_COLORS[sync.intensity as keyof typeof INTENSITY_COLORS] }}>
                          {sync.title}
                        </span>
                      </div>
                      <p className="font-grotesk text-xs text-foreground/60 mb-3">{sync.description}</p>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5">
                          <div className="w-2 h-2 rounded-full animate-pulse"
                            style={{ background: INTENSITY_COLORS[sync.intensity as keyof typeof INTENSITY_COLORS] }} />
                          <span className="font-mono-ibm text-xs"
                            style={{ color: INTENSITY_COLORS[sync.intensity as keyof typeof INTENSITY_COLORS] }}>
                            {sync.count} reports
                          </span>
                        </div>
                        <span className="tag-magenta text-xs"
                          style={{ borderColor: 'rgba(255,182,230,0.3)', color: '#ffb6e6', background: 'rgba(255,182,230,0.08)' }}>
                          {CATEGORY_LABELS[sync.category as SyncCategory]}
                        </span>
                        <span className="font-mono-ibm text-xs text-foreground/25">{sync.date}</span>
                      </div>
                    </div>
                  </div>

                  {/* Intensity bar */}
                  <div className="mt-3 progress-grimoire">
                    <motion.div className="progress-grimoire-fill"
                      initial={{ width: 0 }}
                      animate={{ width: sync.intensity === 'extreme' ? '95%' : sync.intensity === 'high' ? '70%' : sync.intensity === 'medium' ? '45%' : '25%' }}
                      transition={{ delay: i * 0.1, duration: 1 }}
                      style={{ background: `linear-gradient(90deg, ${INTENSITY_COLORS[sync.intensity as keyof typeof INTENSITY_COLORS]}, #00e5ff)` }} />
                  </div>

                  <AnimatePresence>
                    {selectedSync?.id === sync.id && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4 pt-4 border-t border-pink-haze/20">
                        <div className="font-orbitron text-xs uppercase tracking-widest text-pink-haze/50 mb-3">Pattern Analysis</div>
                        <p className="font-grotesk text-sm text-foreground/70 leading-relaxed mb-4">
                          This pattern has been reported {sync.count} times across different time zones and cultures.
                          Jung would categorize this as a manifestation of the collective unconscious — an archetype
                          attempting to break through into conscious awareness. The recurrence across independent
                          observers suggests this symbol carries significant psychic charge at this moment in time.
                        </p>
                        <div className="flex gap-2">
                          <button onClick={() => setView('report')} className="btn-grimoire text-xs px-4 py-2">
                            + Add Your Report
                          </button>
                          <Link href={`/akashic?q=${encodeURIComponent(sync.title)}`}>
                            <button className="btn-cyan text-xs px-4 py-2">Akashic Link</button>
                          </Link>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ─── REPORT ─── */}
        {view === 'report' && (
          <motion.div key="report" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl mx-auto">
            {!submitted ? (
              <div className="glass-panel p-8" style={{ borderColor: 'rgba(255,182,230,0.3)' }}>
                <h2 className="font-orbitron text-xl font-bold uppercase tracking-wider mb-2"
                  style={{ color: '#ffb6e6' }}>Report a Synchronicity</h2>
                <p className="font-grotesk text-sm text-foreground/50 mb-8">
                  Your report joins the collective archive. Patterns emerge across thousands of reports.
                </p>

                <div className="space-y-4">
                  <div>
                    <label className="font-orbitron text-xs uppercase tracking-widest text-pink-haze/70 block mb-2">
                      Title / Summary *
                    </label>
                    <input value={formData.title} onChange={e => setFormData(p => ({ ...p, title: e.target.value }))}
                      placeholder="Name this synchronicity..."
                      className="input-grimoire" style={{ borderColor: 'rgba(255,182,230,0.3)' }} />
                  </div>

                  <div>
                    <label className="font-orbitron text-xs uppercase tracking-widest text-pink-haze/70 block mb-2">
                      Category
                    </label>
                    <select value={formData.category} onChange={e => setFormData(p => ({ ...p, category: e.target.value as SyncCategory }))}
                      className="input-grimoire cursor-pointer" style={{ borderColor: 'rgba(255,182,230,0.3)' }}>
                      {Object.entries(CATEGORY_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="font-orbitron text-xs uppercase tracking-widest text-pink-haze/70 block mb-2">
                      Full Description *
                    </label>
                    <textarea value={formData.description} onChange={e => setFormData(p => ({ ...p, description: e.target.value }))}
                      placeholder="Describe the synchronicity in detail. What happened? What was unusual? What was the context? What meaning, if any, did it seem to carry?"
                      className="textarea-grimoire" style={{ borderColor: 'rgba(255,182,230,0.3)' }} rows={5} />
                  </div>

                  <div>
                    <label className="font-orbitron text-xs uppercase tracking-widest text-pink-haze/70 block mb-2">
                      Emotional Response
                    </label>
                    <input value={formData.emotion} onChange={e => setFormData(p => ({ ...p, emotion: e.target.value }))}
                      placeholder="How did it feel? What did you intuitively sense?"
                      className="input-grimoire" style={{ borderColor: 'rgba(255,182,230,0.3)' }} />
                  </div>

                  <div>
                    <label className="font-orbitron text-xs uppercase tracking-widest text-pink-haze/70 block mb-2">
                      The Question You Were Holding
                    </label>
                    <input value={formData.question} onChange={e => setFormData(p => ({ ...p, question: e.target.value }))}
                      placeholder="What were you thinking about or struggling with when this occurred?"
                      className="input-grimoire" style={{ borderColor: 'rgba(255,182,230,0.3)' }} />
                  </div>

                  <div className="pt-4 text-center">
                    <motion.button onClick={handleSubmit}
                      disabled={!formData.title || !formData.description}
                      className="px-10 py-4 font-orbitron text-xs uppercase tracking-widest disabled:opacity-40 disabled:cursor-not-allowed border transition-all duration-300"
                      style={{ borderColor: 'rgba(255,182,230,0.6)', color: '#ffb6e6', background: 'rgba(255,182,230,0.08)' }}
                      whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      ✨ Submit to the Archive
                    </motion.button>
                  </div>
                </div>
              </div>
            ) : (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                className="glass-panel p-10 text-center" style={{ borderColor: 'rgba(255,182,230,0.4)' }}>
                <div className="text-5xl mb-6 animate-float">✨</div>
                <h3 className="font-orbitron text-xl font-bold uppercase tracking-wider mb-3"
                  style={{ color: '#ffb6e6' }}>Synchronicity Recorded</h3>
                <p className="font-grotesk text-sm text-foreground/60 mb-6">
                  Your experience has been added to the collective archive.
                  The pattern engine is already searching for resonances across thousands of reports.
                </p>
                <div className="oracle-bubble text-left mb-6" style={{ borderColor: '#ffb6e6' }}>
                  <p className="font-grotesk text-sm text-foreground/80 italic">
                    "There are no coincidences, only the illusion of coincidences." — V for Vendetta<br />
                    Or as Jung would say: synchronicities are acausal connecting principles —
                    meaningful events connected not by cause but by meaning itself.
                  </p>
                </div>
                <div className="flex justify-center gap-4">
                  <button onClick={() => { setSubmitted(false); setFormData({ title: '', description: '', category: 'event', date: '', emotion: '', question: '' }); }}
                    className="btn-grimoire" style={{ borderColor: 'rgba(255,182,230,0.5)', color: '#ffb6e6' }}>
                    ↺ Report Another
                  </button>
                  <button onClick={() => setView('patterns')} className="btn-cyan">
                    View Active Patterns
                  </button>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* ─── MAP ─── */}
        {view === 'map' && (
          <motion.div key="map" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <GlobalSyncMap />
          </motion.div>
        )}
      </div>
    </main>
  );
}

function GlobalSyncMap() {
  const HOTSPOTS = [
    { city: 'London', x: 48, y: 28, count: 234, symbol: '🐦‍⬛' },
    { city: 'New York', x: 22, y: 32, count: 412, symbol: '✨' },
    { city: 'São Paulo', x: 28, y: 65, count: 178, symbol: '🌑' },
    { city: 'Cairo', x: 55, y: 38, count: 89, symbol: '👁' },
    { city: 'Mumbai', x: 68, y: 45, count: 156, symbol: '🦚' },
    { city: 'Tokyo', x: 82, y: 33, count: 267, symbol: '🌕' },
    { city: 'Sydney', x: 84, y: 72, count: 134, symbol: '🦉' },
    { city: 'Mexico City', x: 16, y: 42, count: 98, symbol: '🌊' },
  ];

  return (
    <div className="glass-panel p-6">
      <div className="font-orbitron text-xs uppercase tracking-widest text-pink-haze/60 mb-4 text-center">
        Global Synchronicity Map — Live Reports
      </div>
      <div className="relative aspect-video bg-void-deep/50 border border-pink-haze/10 overflow-hidden">
        {/* Grid lines */}
        <svg className="absolute inset-0 w-full h-full opacity-10">
          {Array.from({ length: 9 }).map((_, i) => (
            <line key={`v${i}`} x1={`${(i + 1) * 10}%`} y1="0%" x2={`${(i + 1) * 10}%`} y2="100%"
              stroke="#ffb6e6" strokeWidth="0.5" />
          ))}
          {Array.from({ length: 5 }).map((_, i) => (
            <line key={`h${i}`} x1="0%" y1={`${(i + 1) * 16.6}%`} x2="100%" y2={`${(i + 1) * 16.6}%`}
              stroke="#ffb6e6" strokeWidth="0.5" />
          ))}
        </svg>

        {HOTSPOTS.map((h, i) => (
          <motion.div key={h.city}
            className="absolute flex flex-col items-center cursor-pointer group"
            style={{ left: `${h.x}%`, top: `${h.y}%`, transform: 'translate(-50%, -50%)' }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: i * 0.15 }}>
            <motion.div
              className="relative"
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 2 + i * 0.3, repeat: Infinity }}>
              <div className="w-3 h-3 rounded-full bg-pink-haze"
                style={{ boxShadow: '0 0 10px #ffb6e6, 0 0 20px #ffb6e644' }} />
              <div className="absolute inset-0 rounded-full border border-pink-haze/40 animate-ping" />
            </motion.div>
            <div className="font-vt323 text-xs text-pink-haze/60 mt-1 whitespace-nowrap group-hover:text-pink-haze transition-colors">
              {h.symbol} {h.city}
            </div>
            <div className="font-mono-ibm text-xs text-foreground/30">{h.count}</div>
          </motion.div>
        ))}

        {/* Connecting lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {HOTSPOTS.slice(0, -1).map((h, i) => {
            const next = HOTSPOTS[i + 1];
            return (
              <motion.line key={i}
                x1={`${h.x}%`} y1={`${h.y}%`} x2={`${next.x}%`} y2={`${next.y}%`}
                stroke="rgba(255,182,230,0.15)" strokeWidth="0.5" strokeDasharray="4 4"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                transition={{ delay: i * 0.2, duration: 1 }} />
            );
          })}
        </svg>
      </div>
      <div className="flex justify-between mt-4">
        <div className="font-mono-ibm text-xs text-foreground/30">
          Showing reports from last 24 hours
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-pink-haze animate-pulse" />
          <span className="font-mono-ibm text-xs text-pink-haze/60">Live</span>
        </div>
      </div>
    </div>
  );
}
