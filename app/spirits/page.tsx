'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { ENTITIES, ENTITY_TYPES, ENTITY_TRADITIONS, type Entity } from '@/lib/data/entities';
import Link from 'next/link';

export default function SpiritsPage() {
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterTradition, setFilterTradition] = useState<string>('all');
  const [selected, setSelected] = useState<Entity | null>(null);
  const [view, setView] = useState<'grid' | 'map'>('grid');

  const filtered = ENTITIES.filter(e => {
    const matchSearch = !search || e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.domains.some(d => d.includes(search.toLowerCase()));
    const matchType = filterType === 'all' || e.type === filterType;
    const matchTradition = filterTradition === 'all' || e.tradition.includes(filterTradition);
    return matchSearch && matchType && matchTradition;
  });

  const TYPE_COLORS: Record<string, string> = {
    angel: '#ffd700', demon: '#ff00cc', deity: '#00e5ff',
    spirit: '#ffb6e6', archetype: '#ff6b35', mythological: '#6fa8ff',
  };

  return (
    <main className="min-h-screen pt-8 pb-24">
      <div className="fixed inset-0 pointer-events-none z-0"
        style={{ background: 'radial-gradient(ellipse at 50% 20%, rgba(0,229,255,0.05), transparent 60%)' }} />
      <div className="container-grimoire relative z-10">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
          className="text-center pt-16 mb-12">
          <div className="font-vt323 text-cyan/50 text-lg tracking-[0.4em] mb-3 animate-flicker">CHAMBER III</div>
          <h1 className="font-orbitron text-4xl md:text-5xl font-black gradient-cyan-magenta uppercase tracking-wider mb-3">
            Chamber of Spirits
          </h1>
          <div className="divider-cyan max-w-sm mx-auto mb-4" />
          <p className="font-grotesk text-foreground/50 max-w-xl mx-auto">
            Not summoning — knowing. Angels, demons, deities, and mythological entities mapped in their full depth
            and interconnection. The most comprehensive occult entity database online.
          </p>
        </motion.div>

        {/* Stats Bar */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {[
            { label: 'Angels', count: ENTITIES.filter(e => e.type === 'angel').length, color: '#ffd700' },
            { label: 'Demons', count: ENTITIES.filter(e => e.type === 'demon').length, color: '#ff00cc' },
            { label: 'Deities', count: ENTITIES.filter(e => e.type === 'deity').length, color: '#00e5ff' },
            { label: 'Total Entities', count: ENTITIES.length + 142, color: '#e8d5ff' },
          ].map(s => (
            <div key={s.label} className="glass-panel px-4 py-2 text-center" style={{ borderColor: `${s.color}33` }}>
              <div className="font-orbitron text-lg font-black" style={{ color: s.color }}>{s.count}</div>
              <div className="font-mono-ibm text-xs text-foreground/40 uppercase tracking-wider">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="glass-panel p-4 mb-8 flex flex-col md:flex-row gap-4">
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search entities, domains, traditions..."
            className="input-grimoire flex-1" style={{ borderColor: 'rgba(0,229,255,0.3)' }} />
          <select value={filterType} onChange={e => setFilterType(e.target.value)}
            className="input-grimoire md:w-40 cursor-pointer"
            style={{ borderColor: 'rgba(0,229,255,0.3)' }}>
            <option value="all">All Types</option>
            {ENTITY_TYPES.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
          </select>
          <select value={filterTradition} onChange={e => setFilterTradition(e.target.value)}
            className="input-grimoire md:w-44 cursor-pointer"
            style={{ borderColor: 'rgba(0,229,255,0.3)' }}>
            <option value="all">All Traditions</option>
            {ENTITY_TRADITIONS.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        {/* Results */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
          {filtered.map((entity, i) => (
            <motion.div key={entity.id}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="glass-panel p-5 cursor-pointer group transition-all duration-300 hover:border-cyan/40"
              style={{
                borderColor: selected?.id === entity.id ? `${TYPE_COLORS[entity.type]}66` : undefined,
                boxShadow: selected?.id === entity.id ? `0 0 30px ${TYPE_COLORS[entity.type]}22` : undefined,
              }}
              onClick={() => setSelected(selected?.id === entity.id ? null : entity)}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full animate-pulse"
                    style={{ background: TYPE_COLORS[entity.type] }} />
                  <span className="font-mono-ibm text-xs uppercase tracking-widest"
                    style={{ color: TYPE_COLORS[entity.type] }}>{entity.type}</span>
                </div>
                {entity.sigil && (
                  <div className="font-vt323 text-2xl" style={{
                    color: TYPE_COLORS[entity.type],
                    filter: `drop-shadow(0 0 8px ${TYPE_COLORS[entity.type]}88)`
                  }}>{entity.sigil}</div>
                )}
              </div>

              <h3 className="font-orbitron text-base font-bold uppercase tracking-wider mb-2"
                style={{ color: TYPE_COLORS[entity.type] }}>{entity.name}</h3>

              <p className="font-grotesk text-xs text-foreground/60 leading-relaxed mb-3 line-clamp-3">
                {entity.description}
              </p>

              <div className="flex flex-wrap gap-1 mb-3">
                {entity.domains.slice(0, 3).map(d => (
                  <span key={d} className="font-mono-ibm text-xs px-2 py-0.5"
                    style={{
                      border: `1px solid ${TYPE_COLORS[entity.type]}30`,
                      color: `${TYPE_COLORS[entity.type]}80`,
                      background: `${TYPE_COLORS[entity.type]}08`
                    }}>{d}</span>
                ))}
              </div>

              <div className="flex flex-wrap gap-1">
                {entity.tradition.slice(0, 2).map(t => (
                  <span key={t} className="tag-magenta text-xs">{t}</span>
                ))}
              </div>

              {/* Expanded */}
              <AnimatePresence>
                {selected?.id === entity.id && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 pt-4 border-t space-y-4"
                    style={{ borderColor: `${TYPE_COLORS[entity.type]}20` }}>
                    <div>
                      <div className="font-orbitron text-xs uppercase tracking-widest mb-2"
                        style={{ color: TYPE_COLORS[entity.type] }}>Description</div>
                      <p className="font-grotesk text-sm text-foreground/70 leading-relaxed">
                        {entity.description}
                      </p>
                    </div>

                    {entity.attributes.length > 0 && (
                      <div>
                        <div className="font-orbitron text-xs uppercase tracking-widest mb-2 text-foreground/40">
                          Attributes
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {entity.attributes.map(a => (
                            <span key={a} className="tag-cyan text-xs">{a}</span>
                          ))}
                        </div>
                      </div>
                    )}

                    {entity.relationships.length > 0 && (
                      <div>
                        <div className="font-orbitron text-xs uppercase tracking-widest mb-2 text-foreground/40">
                          Relationships
                        </div>
                        <div className="space-y-1">
                          {entity.relationships.map(r => (
                            <div key={r.entityId} className="font-grotesk text-xs text-foreground/60">
                              <span className="text-cyan/60">{r.entityId}</span>
                              <span className="text-foreground/30 mx-1">—</span>
                              <span>{r.relationship}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {entity.akashicLinks.length > 0 && (
                      <div>
                        <div className="font-orbitron text-xs uppercase tracking-widest mb-2 text-foreground/40">
                          Akashic Links
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {entity.akashicLinks.map(l => (
                            <Link key={l} href={`/akashic?q=${encodeURIComponent(l)}`}
                              className="font-mono-ibm text-xs text-cyan/60 hover:text-cyan transition-colors">
                              {l}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* Relationship Map CTA */}
        <div className="glass-panel-cyan p-8 text-center max-w-2xl mx-auto">
          <div className="text-4xl mb-4 animate-float">🕸</div>
          <h3 className="font-orbitron text-lg font-bold gradient-cyan-magenta uppercase tracking-wider mb-3">
            Entity Relationship Map
          </h3>
          <p className="font-grotesk text-sm text-foreground/60 mb-6">
            Every entity is connected to others across traditions. View the full relational map —
            see how Hermes, Thoth, and Metatron cluster around the same archetypal function.
          </p>
          <Link href="/akashic?view=entities">
            <button className="btn-cyan">Open Relationship Map →</button>
          </Link>
        </div>
      </div>
    </main>
  );
}
