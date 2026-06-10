'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { MAJOR_ARCANA } from '@/lib/data/tarot';
import { SYMBOLS } from '@/lib/data/symbols';
import { ENTITIES } from '@/lib/data/entities';
import Link from 'next/link';

type ContentType = 'tarot' | 'symbol' | 'entity' | 'concept';
type AkashicEntry = {
  id: string;
  type: ContentType;
  title: string;
  glyph: string;
  summary: string;
  connections: string[];
  color: string;
  href?: string;
};

function buildIndex(): AkashicEntry[] {
  const tarotEntries: AkashicEntry[] = MAJOR_ARCANA.map(c => ({
    id: c.id,
    type: 'tarot' as ContentType,
    title: c.name,
    glyph: c.symbol,
    summary: c.upright.slice(0, 150) + '...',
    connections: c.akashicLinks,
    color: '#ffd700',
    href: '/divination',
  }));

  const symbolEntries: AkashicEntry[] = SYMBOLS.map(s => ({
    id: s.id,
    type: 'symbol' as ContentType,
    title: s.name,
    glyph: s.glyph,
    summary: s.summary,
    connections: [...s.relatedSymbols, ...s.akashicLinks],
    color: '#00e5ff',
    href: '/symbols',
  }));

  const entityEntries: AkashicEntry[] = ENTITIES.map(e => ({
    id: e.id,
    type: 'entity' as ContentType,
    title: e.name,
    glyph: e.sigil || '⊙',
    summary: e.description.slice(0, 150) + '...',
    connections: [...e.relationships.map(r => r.entityId), ...e.akashicLinks],
    color: '#ff00cc',
    href: '/spirits',
  }));

  return [...tarotEntries, ...symbolEntries, ...entityEntries];
}

const ALL_ENTRIES = buildIndex();

const TYPE_COLORS = { tarot: '#ffd700', symbol: '#00e5ff', entity: '#ff00cc', concept: '#ff6b35' };
const TYPE_LABELS = { tarot: 'Tarot', symbol: 'Symbol', entity: 'Entity', concept: 'Concept' };

function AkashicContent() {
  const searchParams = useSearchParams();
  const queryParam = searchParams.get('q') || '';
  const [search, setSearch] = useState(queryParam);
  const [activeType, setActiveType] = useState<ContentType | 'all'>('all');
  const [selected, setSelected] = useState<AkashicEntry | null>(null);
  const [connectionPath, setConnectionPath] = useState<AkashicEntry[]>([]);

  useEffect(() => {
    if (queryParam) {
      setSearch(queryParam);
    }
  }, [queryParam]);

  const filtered = ALL_ENTRIES.filter(entry => {
    const matchSearch = !search ||
      entry.title.toLowerCase().includes(search.toLowerCase()) ||
      entry.summary.toLowerCase().includes(search.toLowerCase()) ||
      entry.connections.some(c => c.toLowerCase().includes(search.toLowerCase()));
    const matchType = activeType === 'all' || entry.type === activeType;
    return matchSearch && matchType;
  }).slice(0, 50);

  const navigateTo = (entry: AkashicEntry) => {
    setConnectionPath(prev => [...prev, entry]);
    setSelected(entry);
    setSearch(entry.title);
  };

  const followConnection = (connId: string) => {
    const found = ALL_ENTRIES.find(e => e.id === connId || e.title.toLowerCase() === connId.toLowerCase() ||
      e.connections.some(c => c.toLowerCase() === connId.toLowerCase()));
    if (found) navigateTo(found);
  };

  return (
    <div>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
        className="text-center pt-16 mb-12">
        <div className="font-vt323 text-cyan/50 text-lg tracking-[0.4em] mb-3 animate-flicker">
          THE LIVING ARCHIVE
        </div>
        <h1 className="font-orbitron text-4xl md:text-5xl font-black gradient-cyan-magenta uppercase tracking-wider mb-3">
          The Akashic Library
        </h1>
        <div className="divider-cyan max-w-sm mx-auto mb-4" />
        <p className="font-grotesk text-foreground/50 max-w-2xl mx-auto">
          Every tarot card, symbol, spirit, and oracle exchange — interconnected in an infinite web.
          Pull any thread. Follow any link. The library has no bottom.
        </p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Tarot Entries', count: MAJOR_ARCANA.length, color: '#ffd700' },
          { label: 'Symbols', count: SYMBOLS.length, color: '#00e5ff' },
          { label: 'Entities', count: ENTITIES.length, color: '#ff00cc' },
          { label: 'Cross-Links', count: ALL_ENTRIES.reduce((sum, e) => sum + e.connections.length, 0), color: '#ffb6e6' },
        ].map(s => (
          <div key={s.label} className="glass-panel p-4 text-center" style={{ borderColor: `${s.color}33` }}>
            <div className="font-orbitron text-2xl font-black mb-1" style={{ color: s.color }}>{s.count}+</div>
            <div className="font-mono-ibm text-xs text-foreground/40 uppercase tracking-wider">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="glass-panel-cyan p-4 mb-6">
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search the Akashic Archive — tarot cards, symbols, entities, concepts..."
          className="input-grimoire mb-3"
          style={{ borderColor: 'rgba(0,229,255,0.3)' }} />
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setActiveType('all')}
            className={`font-mono-ibm text-xs px-3 py-1.5 uppercase tracking-wider transition-all ${
              activeType === 'all' ? 'border border-cyan/60 text-cyan bg-cyan/10' : 'border border-white/10 text-foreground/40 hover:text-cyan/60'
            }`}>All ({ALL_ENTRIES.length})</button>
          {(['tarot', 'symbol', 'entity'] as ContentType[]).map(t => (
            <button key={t} onClick={() => setActiveType(activeType === t ? 'all' : t)}
              className={`font-mono-ibm text-xs px-3 py-1.5 uppercase tracking-wider transition-all ${
                activeType === t ? 'border text-foreground' : 'border border-white/10 text-foreground/40'
              }`}
              style={activeType === t ? {
                borderColor: `${TYPE_COLORS[t]}60`, color: TYPE_COLORS[t], background: `${TYPE_COLORS[t]}10`
              } : {}}>
              {TYPE_LABELS[t]} ({ALL_ENTRIES.filter(e => e.type === t).length})
            </button>
          ))}
        </div>
      </div>

      {/* Breadcrumb path */}
      {connectionPath.length > 0 && (
        <div className="flex items-center gap-2 mb-6 flex-wrap">
          <button onClick={() => { setConnectionPath([]); setSelected(null); setSearch(''); }}
            className="font-mono-ibm text-xs text-foreground/30 hover:text-foreground/60 transition-colors">
            Archive
          </button>
          {connectionPath.map((entry, i) => (
            <span key={i} className="flex items-center gap-2">
              <span className="font-mono-ibm text-xs text-foreground/20">→</span>
              <button onClick={() => { setSelected(entry); setConnectionPath(prev => prev.slice(0, i + 1)); }}
                className="font-mono-ibm text-xs transition-colors hover:text-cyan"
                style={{ color: i === connectionPath.length - 1 ? TYPE_COLORS[entry.type] : 'rgba(255,255,255,0.3)' }}>
                {entry.title}
              </button>
            </span>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Entry list */}
        <div className="lg:col-span-1 space-y-2">
          <div className="font-orbitron text-xs uppercase tracking-widest text-foreground/30 mb-3">
            {filtered.length} Results
          </div>
          {filtered.map((entry, i) => (
            <motion.button key={entry.id}
              initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.03 }}
              onClick={() => navigateTo(entry)}
              className={`w-full text-left p-4 transition-all duration-200 ${
                selected?.id === entry.id ? 'border' : 'border border-white/10 hover:border-white/20'
              }`}
              style={selected?.id === entry.id ? {
                borderColor: `${TYPE_COLORS[entry.type]}66`,
                background: `${TYPE_COLORS[entry.type]}0a`,
              } : {}}>
              <div className="flex items-center gap-3">
                <div className="text-xl flex-shrink-0">{entry.glyph}</div>
                <div className="min-w-0">
                  <div className="font-orbitron text-xs font-bold uppercase tracking-wider truncate"
                    style={{ color: TYPE_COLORS[entry.type] }}>{entry.title}</div>
                  <div className="font-mono-ibm text-xs" style={{ color: `${TYPE_COLORS[entry.type]}60` }}>
                    {TYPE_LABELS[entry.type]}
                  </div>
                </div>
                <div className="ml-auto font-mono-ibm text-xs text-foreground/25 flex-shrink-0">
                  {entry.connections.length} links
                </div>
              </div>
            </motion.button>
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-10 glass-panel opacity-50">
              <div className="font-vt323 text-foreground/40 text-lg">No results in the Archive</div>
            </div>
          )}
        </div>

        {/* Detail view */}
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            {selected ? (
              <motion.div key={selected.id}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="glass-panel p-8 sticky top-24"
                style={{ borderColor: `${TYPE_COLORS[selected.type]}44` }}>
                <div className="flex items-start gap-5 mb-6">
                  <div className="text-5xl flex-shrink-0"
                    style={{ filter: `drop-shadow(0 0 15px ${TYPE_COLORS[selected.type]})` }}>
                    {selected.glyph}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="tag-cyan text-xs"
                        style={{ borderColor: `${TYPE_COLORS[selected.type]}44`, color: TYPE_COLORS[selected.type], background: `${TYPE_COLORS[selected.type]}11` }}>
                        {TYPE_LABELS[selected.type]}
                      </span>
                    </div>
                    <h2 className="font-orbitron text-2xl font-black uppercase tracking-wider mb-1"
                      style={{ color: TYPE_COLORS[selected.type] }}>
                      {selected.title}
                    </h2>
                  </div>
                </div>

                <p className="font-grotesk text-sm text-foreground/75 leading-relaxed mb-6">
                  {selected.summary}
                </p>

                <div className="divider-cyan mb-6" />

                {/* Connections */}
                <div className="mb-6">
                  <div className="font-orbitron text-xs uppercase tracking-widest text-cyan/60 mb-4">
                    Akashic Connections ({selected.connections.length})
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {selected.connections.map(conn => {
                      const linked = ALL_ENTRIES.find(e =>
                        e.id === conn || e.title.toLowerCase() === conn.toLowerCase());
                      return (
                        <button key={conn}
                          onClick={() => followConnection(conn)}
                          className={`text-left p-2 border transition-all duration-200 ${
                            linked ? 'border-cyan/20 hover:border-cyan/50 hover:bg-cyan/5' : 'border-white/10 opacity-50'
                          }`}>
                          <div className="font-mono-ibm text-xs text-cyan/70 truncate">
                            {linked ? linked.glyph + ' ' : '◇ '}
                            {conn.replace(/-/g, ' ')}
                          </div>
                          {linked && (
                            <div className="font-mono-ibm text-xs mt-0.5"
                              style={{ color: `${TYPE_COLORS[linked.type]}60` }}>
                              {TYPE_LABELS[linked.type]}
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Network mini-viz */}
                <div className="glass-panel-cyan p-4 mb-6">
                  <div className="font-orbitron text-xs uppercase tracking-widest text-cyan/50 mb-3">
                    Connection Web
                  </div>
                  <svg viewBox="0 0 200 80" className="w-full">
                    {selected.connections.slice(0, 6).map((conn, i) => {
                      const angle = (i / 6) * Math.PI * 2;
                      const x = 100 + 60 * Math.cos(angle);
                      const y = 40 + 25 * Math.sin(angle);
                      return (
                        <g key={conn}>
                          <motion.line x1={100} y1={40} x2={x} y2={y}
                            stroke="rgba(0,229,255,0.3)" strokeWidth="0.5"
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.1 }} />
                          <circle cx={x} cy={y} r={3} fill={TYPE_COLORS[selected.type]} opacity={0.7} />
                          <text x={x} y={y + 6} textAnchor="middle" fill="rgba(0,229,255,0.5)"
                            fontSize="3" fontFamily="IBM Plex Mono">
                            {conn.slice(0, 12)}
                          </text>
                        </g>
                      );
                    })}
                    <circle cx={100} cy={40} r={8} fill={TYPE_COLORS[selected.type]} opacity={0.8} />
                    <text x={100} y={43} textAnchor="middle" fill="#fff" fontSize="4" fontFamily="IBM Plex Mono">
                      {selected.glyph}
                    </text>
                  </svg>
                </div>

                <div className="flex gap-3">
                  {selected.href && (
                    <Link href={selected.href}>
                      <button className="btn-cyan text-xs px-4 py-2">
                        View in Chamber →
                      </button>
                    </Link>
                  )}
                  <button onClick={() => { setSelected(null); setConnectionPath([]); }}
                    className="btn-grimoire text-xs px-4 py-2">
                    ← Back to Archive
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div key="akashic-empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="glass-panel-cyan p-10 text-center flex flex-col items-center justify-center" style={{ minHeight: 400 }}>
                <motion.div className="text-6xl mb-6"
                  animate={{ rotate: 360 }} transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}>
                  ◈
                </motion.div>
                <h3 className="font-orbitron text-xl font-bold gradient-cyan-magenta uppercase tracking-wider mb-3">
                  The Archive is Open
                </h3>
                <p className="font-grotesk text-sm text-foreground/60 max-w-md mb-6">
                  Search for any concept, symbol, entity, or tarot card.
                  Follow the connections — there is no end to the rabbit hole.
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  {['The Fool', 'Ouroboros', 'Hecate', 'Alchemy', 'Shadow', 'Mercury'].map(term => (
                    <button key={term} onClick={() => setSearch(term)}
                      className="tag-cyan hover:bg-cyan/20 transition-colors cursor-pointer">
                      {term}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Browse sections */}
      <div className="mt-16 space-y-10">
        {/* Featured tarot */}
        <div>
          <div className="font-orbitron text-xs uppercase tracking-widest text-gold/60 mb-4">
            Major Arcana — Quick Access
          </div>
          <div className="flex flex-wrap gap-2">
            {MAJOR_ARCANA.map(card => (
              <button key={card.id}
                onClick={() => navigateTo({
                  id: card.id, type: 'tarot',
                  title: card.name, glyph: card.symbol,
                  summary: card.upright.slice(0, 150) + '...',
                  connections: card.akashicLinks, color: '#ffd700', href: '/divination',
                })}
                className="font-mono-ibm text-xs px-2 py-1.5 border border-gold/20 text-gold/60 hover:border-gold/50 hover:text-gold transition-all">
                {card.symbol} {card.name}
              </button>
            ))}
          </div>
        </div>

        {/* Featured symbols */}
        <div>
          <div className="font-orbitron text-xs uppercase tracking-widest text-cyan/60 mb-4">
            Sacred Symbols — Quick Access
          </div>
          <div className="flex flex-wrap gap-2">
            {SYMBOLS.map(s => (
              <button key={s.id}
                onClick={() => navigateTo({
                  id: s.id, type: 'symbol',
                  title: s.name, glyph: s.glyph,
                  summary: s.summary,
                  connections: [...s.relatedSymbols, ...s.akashicLinks],
                  color: '#00e5ff', href: '/symbols',
                })}
                className="font-mono-ibm text-xs px-2 py-1.5 border border-cyan/20 text-cyan/60 hover:border-cyan/50 hover:text-cyan transition-all">
                {s.glyph} {s.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AkashicPage() {
  return (
    <main className="min-h-screen pt-8 pb-24">
      <div className="fixed inset-0 pointer-events-none z-0"
        style={{ background: 'radial-gradient(ellipse at center, rgba(0,229,255,0.04), rgba(255,0,204,0.03), transparent 70%)' }} />
      <div className="container-grimoire relative z-10">
        <Suspense fallback={
          <div className="flex items-center justify-center py-20">
            <div className="ritual-spinner" />
          </div>
        }>
          <AkashicContent />
        </Suspense>
      </div>
    </main>
  );
}
