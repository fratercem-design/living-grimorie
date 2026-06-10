'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';

const CHAMBERS = [
  {
    id: 'divination',
    name: 'Chamber of Divination',
    sigil: '🔮',
    romanNumeral: 'I',
    color: '#ff00cc',
    glowColor: 'rgba(255,0,204,0.15)',
    borderColor: 'rgba(255,0,204,0.3)',
    description: 'Peer through the veil of time. Draw the cards, cast the runes, consult the I Ching. Each reading becomes a permanent page in your personal grimoire.',
    tools: ['Tarot', 'I Ching', 'Runes', 'Geomancy', 'Bibliomancy'],
    href: '/divination',
    unlocked: true,
  },
  {
    id: 'dreams',
    name: 'Chamber of Dreams',
    sigil: '🌙',
    romanNumeral: 'II',
    color: '#6fa8ff',
    glowColor: 'rgba(111,168,255,0.15)',
    borderColor: 'rgba(111,168,255,0.3)',
    description: 'Submit your dreams to the collective archive. The AI Oracle analyzes them through Jungian psychology, alchemy, Kabbalah, and mythology. Your dream joins the living Atlas.',
    tools: ['Dream Submission', 'Jungian Analysis', 'Dream Atlas', 'Archetype Detection'],
    href: '/dreams',
    unlocked: true,
  },
  {
    id: 'spirits',
    name: 'Chamber of Spirits',
    sigil: '👁',
    romanNumeral: 'III',
    color: '#00e5ff',
    glowColor: 'rgba(0,229,255,0.12)',
    borderColor: 'rgba(0,229,255,0.3)',
    description: 'Encyclopedia of beings beyond the mortal threshold. Angels, demons, deities, and mythological entities mapped in their full complexity and inter-relationship.',
    tools: ['Angel Index', 'Demon Index', 'Deity Maps', 'Entity Relationships', 'Grimoire Sources'],
    href: '/spirits',
    unlocked: true,
  },
  {
    id: 'symbols',
    name: 'Chamber of Symbols',
    sigil: '🜂',
    romanNumeral: 'IV',
    color: '#ffd700',
    glowColor: 'rgba(255,215,0,0.12)',
    borderColor: 'rgba(255,215,0,0.3)',
    description: 'The most referenced occult symbol database. Every glyph — its history, magical uses, psychological meaning, and connections to every tradition that touched it.',
    tools: ['Symbol Search', 'Tradition Filter', 'Magical Uses', 'Psychology Layer', 'Cross-Links'],
    href: '/symbols',
    unlocked: true,
  },
  {
    id: 'synchronicities',
    name: 'Chamber of Synchronicities',
    sigil: '✨',
    romanNumeral: 'V',
    color: '#ffb6e6',
    glowColor: 'rgba(255,182,230,0.12)',
    borderColor: 'rgba(255,182,230,0.3)',
    description: 'Record strange coincidences. The system finds global patterns. A collective unconscious experiment in real time — what is the universe trying to say?',
    tools: ['Report Synchronicity', 'Pattern Engine', 'Global Map', 'Collective Statistics'],
    href: '/synchronicities',
    unlocked: true,
  },
  {
    id: 'initiation',
    name: 'Chamber of Initiation',
    sigil: '🏛',
    romanNumeral: 'VI',
    color: '#ff6b35',
    glowColor: 'rgba(255,107,53,0.12)',
    borderColor: 'rgba(255,107,53,0.3)',
    description: 'The mystery school. Seven degrees of occult education. Complete lessons, fulfill quests, and ascend from Seeker to Illuminated.',
    tools: ['Lesson Library', 'Quest System', 'Akashic Points', 'Level Progression', 'Grimoire Builder'],
    href: '/initiation',
    unlocked: true,
  },
  {
    id: 'oracles',
    name: 'Chamber of AI Oracles',
    sigil: '◈',
    romanNumeral: 'VII',
    color: '#e8d5ff',
    glowColor: 'rgba(232,213,255,0.1)',
    borderColor: 'rgba(232,213,255,0.25)',
    description: 'Seven AI entities speak from seven traditions. Ask the same question to Hermes and to Jung and to the anonymous Alchemist — receive seven different truths.',
    tools: ['Hermes Trismegistus', 'Carl Jung', 'John Dee', 'Aleister Crowley', 'Matangi', 'The Alchemist', 'Oracle of Psyche'],
    href: '/oracles',
    unlocked: true,
  },
];

export default function ChambersPage() {
  const [hovered, setHovered] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <main className="min-h-screen pt-8 pb-24">
      {/* Ambient bg */}
      <div className="fixed inset-0 pointer-events-none z-0"
        style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(255,0,204,0.05) 0%, transparent 60%)' }} />

      <div className="container-grimoire relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center pt-16 mb-20"
        >
          <div className="font-vt323 text-cyan/50 text-lg tracking-[0.4em] mb-4 animate-flicker">
            THE SEVEN SACRED GATES
          </div>
          <h1 className="font-orbitron text-4xl md:text-6xl font-black gradient-magenta-cyan uppercase tracking-wider mb-4">
            The Chambers
          </h1>
          <div className="divider-magenta max-w-sm mx-auto mb-6" />
          <p className="font-grotesk text-foreground/50 max-w-2xl mx-auto leading-relaxed">
            Each chamber holds a different dimension of hidden knowledge. You do not navigate menus —
            you descend through gates. Some are open. Some require initiation. All of them remember you.
          </p>
        </motion.div>

        {/* Chambers Grid */}
        <div className="space-y-6">
          {CHAMBERS.map((chamber, i) => (
            <motion.div
              key={chamber.id}
              initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              onHoverStart={() => setHovered(chamber.id)}
              onHoverEnd={() => setHovered(null)}
            >
              <Link href={chamber.href}>
                <div
                  className="relative overflow-hidden cursor-pointer transition-all duration-500 group"
                  style={{
                    background: hovered === chamber.id
                      ? `linear-gradient(135deg, ${chamber.glowColor}, rgba(18,0,31,0.8))`
                      : 'rgba(18,0,31,0.5)',
                    border: `1px solid ${hovered === chamber.id ? chamber.borderColor : 'rgba(255,255,255,0.05)'}`,
                    boxShadow: hovered === chamber.id ? `0 0 40px ${chamber.glowColor}, inset 0 0 40px ${chamber.glowColor}` : 'none',
                    backdropFilter: 'blur(12px)',
                  }}
                >
                  {/* Background roman numeral */}
                  <div
                    className="absolute right-6 top-1/2 -translate-y-1/2 font-orbitron text-8xl md:text-9xl font-black pointer-events-none select-none transition-opacity duration-500"
                    style={{
                      color: chamber.color,
                      opacity: hovered === chamber.id ? 0.08 : 0.04,
                    }}
                  >
                    {chamber.romanNumeral}
                  </div>

                  {/* Glow line bottom */}
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-px"
                    style={{ background: `linear-gradient(90deg, transparent, ${chamber.color}, transparent)` }}
                    animate={{ opacity: hovered === chamber.id ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                  />

                  <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-6 p-6 md:p-8">
                    {/* Sigil */}
                    <div className="flex-shrink-0 relative w-20 h-20 flex items-center justify-center">
                      <motion.div
                        animate={hovered === chamber.id ? {
                          scale: [1, 1.15, 1],
                          rotate: [0, 5, -5, 0],
                        } : {}}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="text-5xl"
                        style={{ filter: hovered === chamber.id ? `drop-shadow(0 0 20px ${chamber.color})` : 'none' }}
                      >
                        {chamber.sigil}
                      </motion.div>
                      {hovered === chamber.id && (
                        <motion.div
                          className="absolute inset-0 rounded-full"
                          style={{ border: `1px solid ${chamber.color}44` }}
                          animate={{ scale: [1, 1.5, 1], opacity: [0.6, 0, 0.6] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-orbitron text-xs tracking-widest" style={{ color: `${chamber.color}66` }}>
                          CHAMBER {chamber.romanNumeral}
                        </span>
                        {chamber.unlocked && (
                          <span className="tag-cyan" style={{
                            borderColor: `${chamber.color}44`,
                            color: chamber.color,
                            background: `${chamber.color}11`
                          }}>
                            OPEN
                          </span>
                        )}
                      </div>
                      <h2 className="font-orbitron text-xl md:text-2xl font-bold uppercase tracking-wider mb-3"
                        style={{ color: hovered === chamber.id ? chamber.color : '#e8d5ff' }}>
                        {chamber.name}
                      </h2>
                      <p className="font-grotesk text-sm text-foreground/60 leading-relaxed mb-4 max-w-2xl">
                        {chamber.description}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {chamber.tools.map((tool) => (
                          <span key={tool} className="font-mono-ibm text-xs px-2 py-1"
                            style={{
                              border: `1px solid ${chamber.color}30`,
                              color: `${chamber.color}88`,
                              background: `${chamber.color}08`,
                            }}>
                            {tool}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Arrow */}
                    <div className="hidden md:flex flex-shrink-0 items-center">
                      <motion.div
                        className="font-orbitron text-2xl"
                        style={{ color: chamber.color }}
                        animate={hovered === chamber.id ? { x: [0, 8, 0] } : {}}
                        transition={{ duration: 1, repeat: Infinity }}
                      >
                        →
                      </motion.div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Akashic CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-20"
        >
          <div className="glass-panel p-10 max-w-2xl mx-auto glow-border-cyan">
            <div className="text-5xl mb-4 animate-float">📚</div>
            <h3 className="font-orbitron text-xl font-bold gradient-cyan-magenta uppercase tracking-wider mb-3">
              The Akashic Library
            </h3>
            <p className="font-grotesk text-sm text-foreground/60 mb-6">
              All seven chambers are interconnected in the Akashic Library. Every tarot card, symbol,
              spirit, and synchronicity is linked. Pull any thread — find the whole tapestry.
            </p>
            <Link href="/akashic">
              <button className="btn-cyan">Enter the Archive →</button>
            </Link>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
