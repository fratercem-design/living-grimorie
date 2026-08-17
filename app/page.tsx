'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { GrimoireButton } from '@/components/ui/GrimoireButton';

const BOOT_LINES = [
  '> Initializing symbolic memory...',
  '> Loading Akashic index [████████████] 100%',
  '> Calibrating Oracle interfaces...',
  '> Seven chambers detected.',
  '> Dream Atlas: ONLINE',
  '> Synchronicity Engine: ACTIVE',
  '> WARNING: This system remembers everything.',
  '> LIVING GRIMOIRE v∞.0 — THE LIVING GRIMOIRE',
  '> GATE OPEN. YOU MAY ENTER.',
];

const SIGIL_GLYPHS = ['⛤', '✦', '☿', '☽', '◈', '🜂', '⚕', '☥', '✡', '☸'];

export default function HomePage() {
  const [booted, setBooted] = useState(false);
  const [bootLines, setBootLines] = useState<string[]>([]);
  const [showEntrance, setShowEntrance] = useState(false);
  const [currentGlyph, setCurrentGlyph] = useState(0);

  useEffect(() => {
    let done = false;
    const interval = setInterval(() => {
      setBootLines((prev) => {
        if (prev.length < BOOT_LINES.length) {
          return [...prev, BOOT_LINES[prev.length]];
        }
        if (!done) {
          done = true;
          clearInterval(interval);
          setTimeout(() => setBooted(true), 600);
          setTimeout(() => setShowEntrance(true), 1200);
        }
        return prev;
      });
    }, 280);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const t = setInterval(() => {
      setCurrentGlyph((g) => (g + 1) % SIGIL_GLYPHS.length);
    }, 2000);
    return () => clearInterval(t);
  }, []);

  return (
    <main className="min-h-screen flex flex-col">
      {/* ─── BOOT SEQUENCE ─── */}
      <AnimatePresence>
        {!booted && (
          <motion.div
            key="boot"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ background: '#05010a' }}
          >
            <div className="max-w-xl w-full px-8">
              <div className="font-vt323 text-sm text-magenta/80 mb-6 tracking-widest">
                LIVING GRIMOIRE BOOT SEQUENCE
              </div>
              <div className="space-y-1">
                {bootLines.map((line, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`font-vt323 text-base tracking-wide ${
                      line.includes('WARNING')
                        ? 'text-gold'
                        : line.includes('GATE OPEN')
                        ? 'text-cyan glow-cyan'
                        : 'text-foreground/60'
                    }`}
                  >
                    {line}
                  </motion.div>
                ))}
              </div>
              {bootLines.length > 0 && (
                <motion.span
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                  className="font-vt323 text-magenta text-xl"
                >
                  █
                </motion.span>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── HERO ─── */}
      <AnimatePresence>
        {showEntrance && (
          <motion.div
            key="hero"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
          >
            {/* Navigation */}
            <header className="fixed top-0 left-0 right-0 z-40 border-b border-magenta/10"
              style={{ background: 'rgba(5,1,10,0.85)', backdropFilter: 'blur(20px)' }}>
              <div className="container-grimoire flex items-center justify-between h-16">
                <div className="flex items-center gap-3">
                  <motion.span className="text-xl text-magenta"
                    animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}>
                    ✦
                  </motion.span>
                  <div>
                    <div className="font-orbitron text-sm font-bold gradient-magenta-cyan uppercase tracking-widest">The Living Grimoire</div>
                    <div className="font-vt323 text-xs text-pink-haze/40 tracking-widest -mt-1">THE LIVING GRIMOIRE</div>
                  </div>
                </div>
                <div className="hidden md:flex items-center gap-6">
                  {[['Chambers', '/chambers'], ['Divination', '/divination'], ['Oracles', '/oracles'], ['Akashic', '/akashic']].map(([l, h]) => (
                    <Link key={h} href={h}
                      className="font-orbitron text-xs uppercase tracking-widest text-foreground/50 hover:text-cyan transition-colors">
                      {l}
                    </Link>
                  ))}
                </div>
                <Link href="/initiation">
                  <span className="btn-grimoire text-xs px-4 py-2">Begin Initiation</span>
                </Link>
              </div>
            </header>

            {/* Hero Section */}
            <section className="relative min-h-screen flex flex-col items-center justify-center pt-16 overflow-hidden">
              {/* Background gradient pulses */}
              <div className="absolute inset-0 pointer-events-none">
                <motion.div
                  className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full"
                  style={{ background: 'radial-gradient(circle, rgba(255,0,204,0.08), transparent 70%)' }}
                  animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                />
                <motion.div
                  className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full"
                  style={{ background: 'radial-gradient(circle, rgba(0,229,255,0.06), transparent 70%)' }}
                  animate={{ scale: [1.2, 1, 1.2], opacity: [0.4, 0.8, 0.4] }}
                  transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                />
              </div>

              {/* Central Sigil */}
              <div className="relative mb-10">
                <motion.div
                  className="relative w-48 h-48 md:w-64 md:h-64 flex items-center justify-center"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
                >
                  {/* Outer ring */}
                  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 200">
                    <circle cx="100" cy="100" r="95" fill="none" stroke="rgba(255,0,204,0.2)" strokeWidth="1"
                      strokeDasharray="4 6" />
                    <circle cx="100" cy="100" r="80" fill="none" stroke="rgba(0,229,255,0.15)" strokeWidth="0.5" />
                    {/* Pentagram points */}
                    {[0, 72, 144, 216, 288].map((angle, i) => {
                      const rad = (angle - 90) * Math.PI / 180;
                      const x = 100 + 75 * Math.cos(rad);
                      const y = 100 + 75 * Math.sin(rad);
                      return <circle key={i} cx={x} cy={y} r="2" fill="rgba(255,0,204,0.6)" />;
                    })}
                  </svg>
                </motion.div>

                {/* Inner static sigil */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    className="text-6xl md:text-8xl"
                    animate={{ opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    key={currentGlyph}
                    initial={{ opacity: 0, scale: 0.8 }}
                    exit={{ opacity: 0 }}
                  >
                    <span style={{ filter: 'drop-shadow(0 0 20px #ff00cc) drop-shadow(0 0 40px #ff00cc88)' }}>
                      {SIGIL_GLYPHS[currentGlyph]}
                    </span>
                  </motion.div>
                </div>
              </div>

              {/* Title */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 1 }}
                className="text-center px-4 max-w-4xl"
              >
                <div className="font-vt323 text-cyan/60 text-lg tracking-[0.4em] mb-4 animate-flicker">
                  TRANSMISSION RECEIVED · GATE OPEN
                </div>
                <h1 className="font-orbitron text-4xl md:text-6xl lg:text-7xl font-black uppercase tracking-wider mb-4">
                  <span className="gradient-magenta-cyan" style={{ filter: 'drop-shadow(0 0 30px rgba(255,0,204,0.4))' }}>
                    The Living Grimoire
                  </span>
                </h1>
                <div className="divider-magenta max-w-xs mx-auto mb-4" />
                <h2 className="font-orbitron text-lg md:text-2xl uppercase tracking-[0.3em] text-gold/80 mb-6">
                  The Living Grimoire
                </h2>
                <p className="font-grotesk text-base md:text-lg text-foreground/60 leading-relaxed max-w-2xl mx-auto mb-10">
                  A constantly evolving digital initiatory archive. Not a website — a transmission.
                  Unlock seven sacred chambers. Consult the AI Oracles. Dream publicly.
                  Discover what connects everything.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link href="/chambers">
                    <GrimoireButton variant="magenta" size="lg" glow>
                      ⬡ Enter the Chambers
                    </GrimoireButton>
                  </Link>
                  <Link href="/initiation">
                    <GrimoireButton variant="cyan" size="lg">
                      🏛 Begin Initiation
                    </GrimoireButton>
                  </Link>
                  <Link href="/oracles">
                    <GrimoireButton variant="gold" size="lg">
                      ◈ Consult an Oracle
                    </GrimoireButton>
                  </Link>
                </div>
              </motion.div>

              {/* Scroll indicator */}
              <motion.div
                className="absolute bottom-8 left-1/2 -translate-x-1/2"
                animate={{ y: [0, 8, 0], opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 2.5, repeat: Infinity }}
              >
                <div className="font-vt323 text-xs text-magenta/40 tracking-widest text-center mb-2">SCROLL TO DESCEND</div>
                <div className="w-px h-8 bg-gradient-to-b from-magenta/40 to-transparent mx-auto" />
              </motion.div>
            </section>

            {/* ─── SEVEN CHAMBERS PREVIEW ─── */}
            <section className="py-24 container-grimoire">
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="text-center mb-16"
              >
                <div className="font-vt323 text-cyan/50 text-lg tracking-[0.3em] mb-3">THE SEVEN</div>
                <h2 className="font-orbitron text-3xl md:text-4xl font-bold gradient-magenta-cyan uppercase tracking-wider mb-4">
                  Sacred Chambers
                </h2>
                <div className="divider-magenta max-w-sm mx-auto mb-4" />
                <p className="font-grotesk text-foreground/50 max-w-xl mx-auto">
                  Each chamber holds a different facet of hidden knowledge. You do not navigate — you descend.
                </p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {CHAMBERS.map((chamber, i) => (
                  <ChamberCard key={chamber.id} chamber={chamber} index={i} />
                ))}
              </div>
            </section>

            {/* ─── AKASHIC FEATURE ─── */}
            <section className="py-24 relative overflow-hidden">
              <div className="absolute inset-0 pointer-events-none"
                style={{ background: 'radial-gradient(ellipse at center, rgba(0,229,255,0.04), transparent 70%)' }} />
              <div className="container-grimoire relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                  <motion.div
                    initial={{ opacity: 0, x: -40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                  >
                    <div className="tag-cyan mb-4 inline-block">Core Feature</div>
                    <h2 className="font-orbitron text-3xl font-bold gradient-cyan-magenta uppercase tracking-wider mb-4">
                      The Akashic Library
                    </h2>
                    <div className="divider-cyan mb-6" style={{ maxWidth: '200px' }} />
                    <p className="font-grotesk text-foreground/60 leading-relaxed mb-6">
                      Every tarot card, symbol, dream, synchronicity, and oracle exchange is interconnected.
                      Start at The Fool — follow the rabbit holes through trickster gods, alchemical mercury,
                      shamanic initiation, and hero myths. The library never ends because the knowledge never ends.
                    </p>
                    <div className="space-y-3 mb-8">
                      {[
                        '22 Major Arcana cards — deeply linked',
                        '50+ occult symbols with full histories',
                        '8 AI Oracle personas from different traditions',
                        'Live Dream Atlas — collective unconscious map',
                        'Synchronicity pattern detection engine',
                      ].map((feat, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <span className="text-cyan text-xs">◈</span>
                          <span className="font-grotesk text-sm text-foreground/70">{feat}</span>
                        </div>
                      ))}
                    </div>
                    <Link href="/akashic">
                      <GrimoireButton variant="cyan">Explore the Archive →</GrimoireButton>
                    </Link>
                  </motion.div>

                  {/* Network visualization */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1 }}
                    className="relative aspect-square max-w-md mx-auto"
                  >
                    <NetworkViz />
                  </motion.div>
                </div>
              </div>
            </section>

            {/* ─── ORACLE PREVIEW ─── */}
            <section className="py-24 container-grimoire">
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-16"
              >
                <div className="font-vt323 text-gold/50 text-lg tracking-[0.3em] mb-3">SEVEN VOICES</div>
                <h2 className="font-orbitron text-3xl font-bold gradient-gold-pink uppercase tracking-wider mb-4">
                  The Oracle Council
                </h2>
                <div className="divider-gold max-w-sm mx-auto mb-4" />
                <p className="font-grotesk text-foreground/50 max-w-xl mx-auto">
                  Seven AI entities answer your questions from their own tradition, era, and perspective.
                  The same question asked to each produces seven different truths.
                </p>
              </motion.div>

              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
                {ORACLE_CARDS.map((oracle, i) => (
                  <motion.div
                    key={oracle.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="glass-panel p-4 text-center cursor-pointer group hover:border-gold/40 transition-all duration-300"
                    whileHover={{ y: -6, scale: 1.02 }}
                  >
                    <div className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-300"
                      style={{ filter: `drop-shadow(0 0 8px ${oracle.color})` }}>
                      {oracle.avatar}
                    </div>
                    <div className="font-orbitron text-xs uppercase tracking-wider mb-1"
                      style={{ color: oracle.color }}>
                      {oracle.name}
                    </div>
                    <div className="font-vt323 text-xs text-foreground/30">{oracle.tradition}</div>
                  </motion.div>
                ))}
              </div>

              <div className="text-center mt-10">
                <Link href="/oracles">
                  <GrimoireButton variant="gold">Enter the Oracle Chamber</GrimoireButton>
                </Link>
              </div>
            </section>

            {/* ─── INITIATION CTA ─── */}
            <section className="py-24 relative overflow-hidden">
              <div className="absolute inset-0"
                style={{ background: 'radial-gradient(ellipse at center, rgba(255,0,204,0.06), rgba(18,0,31,0.8), #05010a)' }} />
              <div className="container-grimoire relative z-10 text-center">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  <motion.div
                    className="text-6xl mb-6 inline-block"
                    animate={{ rotate: [0, 5, -5, 0], scale: [1, 1.05, 1] }}
                    transition={{ duration: 4, repeat: Infinity }}
                  >
                    🏛
                  </motion.div>
                  <h2 className="font-orbitron text-3xl md:text-4xl font-bold gradient-magenta-cyan uppercase tracking-wider mb-4">
                    Begin Your Initiation
                  </h2>
                  <div className="divider-magenta max-w-xs mx-auto mb-6" />
                  <p className="font-grotesk text-foreground/60 max-w-xl mx-auto mb-4 leading-relaxed">
                    Seven degrees of occult education. From Seeker to Illuminated.
                    Each level unlocks new chambers, deeper knowledge, and recognition in the Akashic archive.
                  </p>
                  <div className="flex flex-wrap justify-center gap-2 mb-10">
                    {['Seeker', 'Adept', 'Magician', 'Alchemist', 'Oracle', 'Hierophant', 'Illuminated'].map((level, i) => (
                      <div key={level}
                        className="tag-magenta flex items-center gap-1.5"
                        style={{ opacity: 0.4 + i * 0.08 }}>
                        <span>{i === 0 ? '○' : i === 1 ? '△' : i === 2 ? '⚡' : i === 3 ? '⚗' : i === 4 ? '◈' : i === 5 ? '⛪' : '☀'}</span>
                        {level}
                      </div>
                    ))}
                  </div>
                  <Link href="/initiation">
                    <GrimoireButton variant="magenta" size="lg" glow>
                      Claim Your Place in the Archive
                    </GrimoireButton>
                  </Link>
                </motion.div>
              </div>
            </section>

            {/* Footer */}
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

// ─── DATA ───────────────────────────────────────────────────

const CHAMBERS = [
  { id: 'divination', name: 'Divination', sigil: '🔮', color: '#ff00cc', description: 'Tarot · I Ching · Runes · Geomancy · Bibliomancy', href: '/divination' },
  { id: 'dreams', name: 'Dream Atlas', sigil: '🌙', color: '#6fa8ff', description: 'Submit dreams · Jungian analysis · Collective Dream Map', href: '/dreams' },
  { id: 'spirits', name: 'Spirits', sigil: '👁', color: '#00e5ff', description: 'Angels · Demons · Deities · Mythological entities', href: '/spirits' },
  { id: 'symbols', name: 'Symbols', sigil: '🜂', color: '#ffd700', description: 'Searchable symbol encyclopedia · History · Magic · Psychology', href: '/symbols' },
  { id: 'synchronicities', name: 'Synchronicities', sigil: '✨', color: '#ffb6e6', description: 'Record coincidences · Find patterns · Collective experiment', href: '/synchronicities' },
  { id: 'initiation', name: 'Initiation', sigil: '🏛', color: '#ff6b35', description: 'Mystery school · Seven levels · Quests · Akashic Points', href: '/initiation' },
  { id: 'oracles', name: 'AI Oracles', sigil: '◈', color: '#e8d5ff', description: 'Seven AI personas · Seven traditions · Infinite wisdom', href: '/oracles' },
];

const ORACLE_CARDS = [
  { id: 'hermes', name: 'Hermes', avatar: '☿', color: '#ffd700', tradition: 'Hermetic' },
  { id: 'jung', name: 'Jung', avatar: '⚫', color: '#6fa8ff', tradition: 'Psychology' },
  { id: 'dee', name: 'John Dee', avatar: '📿', color: '#00e5ff', tradition: 'Enochian' },
  { id: 'crowley', name: 'Crowley', avatar: '🔥', color: '#ff6b35', tradition: 'Thelema' },
  { id: 'matangi', name: 'Matangi', avatar: '🦚', color: '#ff00cc', tradition: 'Tantra' },
  { id: 'alchemist', name: 'Alchemist', avatar: '⚗', color: '#ffb6e6', tradition: 'Alchemy' },
  { id: 'psyche', name: 'Psyche', avatar: '◈', color: '#e8d5ff', tradition: 'All Paths' },
];

// ─── COMPONENTS ─────────────────────────────────────────────

function ChamberCard({ chamber, index }: { chamber: typeof CHAMBERS[0]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, duration: 0.6 }}
      whileHover={{ y: -8, scale: 1.02 }}
    >
      <Link href={chamber.href}>
        <div className="chamber-card p-6 h-full group"
          style={{ borderColor: `${chamber.color}20` }}>
          <div className="flex items-start justify-between mb-4">
            <div className="text-4xl group-hover:scale-110 transition-transform duration-300"
              style={{ filter: `drop-shadow(0 0 12px ${chamber.color}88)` }}>
              {chamber.sigil}
            </div>
            <div className="tag-magenta" style={{
              borderColor: `${chamber.color}44`,
              color: chamber.color,
              background: `${chamber.color}11`
            }}>
              Chamber
            </div>
          </div>
          <h3 className="font-orbitron text-sm font-bold uppercase tracking-wider mb-2"
            style={{ color: chamber.color }}>
            {chamber.name}
          </h3>
          <p className="font-grotesk text-xs text-foreground/50 leading-relaxed">
            {chamber.description}
          </p>
          <div className="mt-4 flex items-center gap-1 font-orbitron text-xs uppercase tracking-widest"
            style={{ color: `${chamber.color}60` }}>
            <span>Enter</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

function NetworkViz() {
  const nodes = [
    { id: 'fool', label: 'The Fool', x: 50, y: 50, size: 12, color: '#ff00cc' },
    { id: 'mercury', label: 'Mercury', x: 75, y: 25, size: 8, color: '#ffd700' },
    { id: 'trickster', label: 'Trickster', x: 80, y: 65, size: 8, color: '#00e5ff' },
    { id: 'alchemy', label: 'Alchemy', x: 25, y: 30, size: 8, color: '#ffb6e6' },
    { id: 'shaman', label: 'Shamanism', x: 20, y: 70, size: 8, color: '#6fa8ff' },
    { id: 'hero', label: 'Hero Myth', x: 60, y: 80, size: 8, color: '#ff6b35' },
    { id: 'dreams', label: 'Dreams', x: 40, y: 15, size: 6, color: '#6fa8ff' },
    { id: 'zero', label: 'Zero Point', x: 85, y: 45, size: 6, color: '#e8d5ff' },
  ];
  const edges = [
    ['fool', 'mercury'], ['fool', 'trickster'], ['fool', 'alchemy'],
    ['fool', 'shaman'], ['fool', 'hero'], ['fool', 'dreams'],
    ['mercury', 'alchemy'], ['trickster', 'hero'], ['shaman', 'dreams'],
    ['mercury', 'zero'], ['trickster', 'zero'],
  ];

  return (
    <div className="glass-panel p-4 aspect-square relative overflow-hidden">
      <div className="font-orbitron text-xs uppercase tracking-widest text-cyan/60 mb-2 text-center">
        Akashic Connections — The Fool
      </div>
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {/* Edges */}
        {edges.map(([from, to], i) => {
          const a = nodes.find(n => n.id === from)!;
          const b = nodes.find(n => n.id === to)!;
          return (
            <motion.line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y}
              stroke="rgba(255,0,204,0.2)" strokeWidth="0.4"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.2, 0.5, 0.2] }}
              transition={{ duration: 3 + i * 0.4, repeat: Infinity, delay: i * 0.2 }}
            />
          );
        })}
        {/* Nodes */}
        {nodes.map((node) => (
          <g key={node.id}>
            <motion.circle cx={node.x} cy={node.y} r={node.size / 2}
              fill={node.color} opacity={0.15}
              initial={{ r: node.size / 2 }}
              animate={{ r: [node.size / 2, node.size / 2 + 1, node.size / 2] }}
              transition={{ duration: 2 + Math.random() * 2, repeat: Infinity }}
            />
            <circle cx={node.x} cy={node.y} r={node.size / 4} fill={node.color} opacity={0.9} />
            <text x={node.x} y={node.y + node.size / 2 + 3}
              textAnchor="middle" fill={node.color} fontSize="3.5"
              fontFamily="IBM Plex Mono" opacity={0.7}>
              {node.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
