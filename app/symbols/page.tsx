'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { SYMBOLS, SYMBOL_CATEGORIES, type OccultSymbol } from '@/lib/data/symbols';
import Link from 'next/link';

export default function SymbolsPage() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [activeTradition, setActiveTradition] = useState<string>('all');
  const [selected, setSelected] = useState<OccultSymbol | null>(null);
  const [activeTab, setActiveTab] = useState<'history' | 'magic' | 'psychology' | 'links'>('history');

  const allTraditions = Array.from(new Set(SYMBOLS.flatMap(s => s.tradition))).sort();

  const filtered = SYMBOLS.filter(s => {
    const matchSearch = !search ||
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.summary.toLowerCase().includes(search.toLowerCase()) ||
      s.tradition.some(t => t.toLowerCase().includes(search.toLowerCase()));
    const matchCat = activeCategory === 'all' || s.categories.includes(activeCategory);
    const matchTrad = activeTradition === 'all' || s.tradition.includes(activeTradition);
    return matchSearch && matchCat && matchTrad;
  });

  const TRADITION_COLORS: Record<string, string> = {
    'Wicca': '#ff00cc', 'Kabbalah': '#00e5ff', 'Hermetic': '#ffd700',
    'Greek': '#6fa8ff', 'Egyptian': '#ffb6e6', 'Hindu': '#ff6b35',
    'Alchemical': '#e8d5ff', 'Norse': '#00e5ff',
  };

  return (
    <main className="min-h-screen pt-8 pb-24">
      <div className="fixed inset-0 pointer-events-none z-0"
        style={{ background: 'radial-gradient(ellipse at 80% 40%, rgba(255,215,0,0.05), transparent 60%)' }} />
      <div className="container-grimoire relative z-10">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
          className="text-center pt-16 mb-12">
          <div className="font-vt323 text-gold/50 text-lg tracking-[0.4em] mb-3 animate-flicker">CHAMBER IV</div>
          <h1 className="font-orbitron text-4xl md:text-5xl font-black gradient-gold-pink uppercase tracking-wider mb-3">
            Chamber of Symbols
          </h1>
          <div className="divider-gold max-w-sm mx-auto mb-4" />
          <p className="font-grotesk text-foreground/50 max-w-xl mx-auto">
            The most referenced occult symbol database. History, magical uses, psychological meaning,
            and the hidden connections between every symbol in every tradition.
          </p>
        </motion.div>

        {/* Search & Filters */}
        <div className="glass-panel-gold p-4 mb-6">
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search symbols, traditions, meanings..."
            className="input-grimoire mb-4"
            style={{ borderColor: 'rgba(255,215,0,0.3)' }} />
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex flex-wrap gap-2 flex-1">
              <button onClick={() => setActiveCategory('all')}
                className={`font-mono-ibm text-xs px-3 py-1.5 uppercase tracking-wider transition-all duration-200 ${
                  activeCategory === 'all' ? 'border border-gold/60 text-gold bg-gold/10' : 'border border-white/10 text-foreground/40 hover:text-gold/60'
                }`}>All</button>
              {SYMBOL_CATEGORIES.map(cat => (
                <button key={cat} onClick={() => setActiveCategory(cat === activeCategory ? 'all' : cat)}
                  className={`font-mono-ibm text-xs px-3 py-1.5 uppercase tracking-wider transition-all duration-200 ${
                    activeCategory === cat ? 'border border-gold/60 text-gold bg-gold/10' : 'border border-white/10 text-foreground/40 hover:text-gold/60'
                  }`}>{cat.replace('-', ' ')}</button>
              ))}
            </div>
            <select value={activeTradition} onChange={e => setActiveTradition(e.target.value)}
              className="input-grimoire sm:w-40 cursor-pointer"
              style={{ borderColor: 'rgba(255,215,0,0.3)' }}>
              <option value="all">All Traditions</option>
              {allTraditions.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Symbol Grid */}
          <div className="lg:col-span-1">
            <div className="font-orbitron text-xs uppercase tracking-widest text-gold/50 mb-4">
              {filtered.length} Symbols
            </div>
            <div className="space-y-2">
              {filtered.map((symbol, i) => (
                <motion.button key={symbol.id}
                  initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => { setSelected(symbol); setActiveTab('history'); }}
                  className={`w-full text-left p-4 transition-all duration-300 group ${
                    selected?.id === symbol.id
                      ? 'border border-gold/60 bg-gold/10'
                      : 'border border-white/10 bg-void-deep/30 hover:border-gold/30'
                  }`}>
                  <div className="flex items-center gap-3">
                    <div className="text-3xl flex-shrink-0"
                      style={{ filter: selected?.id === symbol.id ? 'drop-shadow(0 0 10px #ffd700)' : 'none' }}>
                      {symbol.glyph}
                    </div>
                    <div className="min-w-0">
                      <div className="font-orbitron text-sm font-bold uppercase tracking-wider text-gold">{symbol.name}</div>
                      <div className="font-grotesk text-xs text-foreground/50 truncate">{symbol.tradition.slice(0, 2).join(' · ')}</div>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Detail Panel */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {selected ? (
                <motion.div key={selected.id}
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="glass-panel-gold p-8 sticky top-24">
                  {/* Symbol header */}
                  <div className="flex items-start gap-6 mb-6">
                    <div className="text-7xl flex-shrink-0"
                      style={{ filter: 'drop-shadow(0 0 20px #ffd70088)' }}>
                      {selected.glyph}
                    </div>
                    <div>
                      <h2 className="font-orbitron text-2xl font-black text-gold uppercase tracking-wider mb-2">
                        {selected.name}
                      </h2>
                      <div className="flex flex-wrap gap-1 mb-2">
                        {selected.tradition.map(t => (
                          <span key={t} className="tag-gold text-xs">{t}</span>
                        ))}
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {selected.categories.map(c => (
                          <span key={c} className="font-mono-ibm text-xs px-2 py-0.5 border border-gold/20 text-gold/50">
                            {c.replace('-', ' ')}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <p className="font-grotesk text-sm text-foreground/70 leading-relaxed mb-6">{selected.summary}</p>

                  {/* Tab navigation */}
                  <div className="flex gap-2 mb-6 border-b border-gold/20 pb-3">
                    {(['history', 'magic', 'psychology', 'links'] as const).map(tab => (
                      <button key={tab} onClick={() => setActiveTab(tab)}
                        className={`font-orbitron text-xs uppercase tracking-wider px-3 py-1.5 transition-all ${
                          activeTab === tab ? 'text-gold border-b-2 border-gold' : 'text-foreground/40 hover:text-gold/60'
                        }`}>{tab === 'links' ? 'Akashic Links' : tab}</button>
                    ))}
                  </div>

                  <AnimatePresence mode="wait">
                    <motion.div key={activeTab}
                      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}>
                      {activeTab === 'history' && (
                        <p className="font-grotesk text-sm text-foreground/70 leading-relaxed">{selected.history}</p>
                      )}
                      {activeTab === 'magic' && (
                        <ul className="space-y-2">
                          {selected.magicalUses.map((use, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="text-gold/60 mt-0.5 flex-shrink-0">◈</span>
                              <span className="font-grotesk text-sm text-foreground/70">{use}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                      {activeTab === 'psychology' && (
                        <p className="font-grotesk text-sm text-foreground/70 leading-relaxed">{selected.psychologicalMeaning}</p>
                      )}
                      {activeTab === 'links' && (
                        <div className="space-y-4">
                          <div>
                            <div className="font-orbitron text-xs uppercase tracking-widest text-gold/50 mb-2">Related Symbols</div>
                            <div className="flex flex-wrap gap-2">
                              {selected.relatedSymbols.map(s => (
                                <button key={s} onClick={() => {
                                  const sym = SYMBOLS.find(x => x.id === s);
                                  if (sym) setSelected(sym);
                                }} className="tag-gold text-xs hover:bg-gold/20 cursor-pointer transition-colors">
                                  {s.replace(/-/g, ' ')}
                                </button>
                              ))}
                            </div>
                          </div>
                          <div>
                            <div className="font-orbitron text-xs uppercase tracking-widest text-cyan/50 mb-2">Akashic Archive</div>
                            <div className="flex flex-wrap gap-2">
                              {selected.akashicLinks.map(l => (
                                <Link key={l} href={`/akashic?q=${encodeURIComponent(l)}`}
                                  className="tag-cyan text-xs hover:bg-cyan/20 transition-colors">
                                  {l.replace(/-/g, ' ')}
                                </Link>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </motion.div>
              ) : (
                <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center h-80 glass-panel-gold opacity-50">
                  <div className="text-5xl mb-4 animate-breathe">🜂</div>
                  <div className="font-orbitron text-sm uppercase tracking-widest text-gold/50">
                    Select a symbol to reveal its mysteries
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </main>
  );
}
