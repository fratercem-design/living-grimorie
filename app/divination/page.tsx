'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { MAJOR_ARCANA, TAROT_SPREADS } from '@/lib/data/tarot';
import type { TarotCard } from '@/lib/data/tarot';

interface DrawnCardType extends TarotCard {
  isReversed: boolean;
}
import { shuffle, randomPick } from '@/lib/utils';
import Link from 'next/link';

type DivinationType = 'tarot' | 'iching' | 'runes' | 'geomancy' | 'bibliomancy';
type ReadingState = 'idle' | 'shuffling' | 'drawn' | 'revealed';

const RUNES = [
  { name: 'Fehu', symbol: 'ᚠ', meaning: 'Wealth, abundance, success, fertility' },
  { name: 'Uruz', symbol: 'ᚢ', meaning: 'Strength, vitality, wild power, health' },
  { name: 'Thurisaz', symbol: 'ᚦ', meaning: 'Protection, defense, reactive force, Thor' },
  { name: 'Ansuz', symbol: 'ᚨ', meaning: 'Communication, wisdom, divine inspiration, Odin' },
  { name: 'Raido', symbol: 'ᚱ', meaning: 'Journey, quest, travel, right action' },
  { name: 'Kenaz', symbol: 'ᚲ', meaning: 'Creativity, illumination, knowledge, fire' },
  { name: 'Gebo', symbol: 'ᚷ', meaning: 'Gift, partnership, exchange, sacred union' },
  { name: 'Wunjo', symbol: 'ᚹ', meaning: 'Joy, harmony, pleasure, belonging' },
  { name: 'Hagalaz', symbol: 'ᚺ', meaning: 'Disruption, hail, uncontrolled forces, crisis' },
  { name: 'Nauthiz', symbol: 'ᚾ', meaning: 'Need, constraint, resistance, survival' },
  { name: 'Isa', symbol: 'ᛁ', meaning: 'Ice, stillness, stasis, delay' },
  { name: 'Jera', symbol: 'ᛃ', meaning: 'Harvest, cycles, reward for effort, year' },
  { name: 'Eihwaz', symbol: 'ᛇ', meaning: 'Yew tree, endurance, Yggdrasil, the axis mundi' },
  { name: 'Perthro', symbol: 'ᛈ', meaning: 'Fate, mystery, chance, the unknowable' },
  { name: 'Algiz', symbol: 'ᛉ', meaning: 'Protection, sanctuary, connection to the divine' },
  { name: 'Sowilo', symbol: 'ᛊ', meaning: 'Sun, victory, clarity, life force, success' },
  { name: 'Tiwaz', symbol: 'ᛏ', meaning: 'Justice, sacrifice, honor, Tyr, the warrior spirit' },
  { name: 'Berkano', symbol: 'ᛒ', meaning: 'Growth, rebirth, fertility, the birch goddess' },
  { name: 'Ehwaz', symbol: 'ᛖ', meaning: 'Movement, progress, the horse, partnership' },
  { name: 'Mannaz', symbol: 'ᛗ', meaning: 'Humanity, the self, social order, collective' },
  { name: 'Laguz', symbol: 'ᛚ', meaning: 'Water, intuition, the unconscious, flow' },
  { name: 'Ingwaz', symbol: 'ᛜ', meaning: 'Fertility, inner growth, new beginning, gestation' },
  { name: 'Dagaz', symbol: 'ᛞ', meaning: 'Dawn, breakthrough, transformation, new day' },
  { name: 'Othala', symbol: 'ᛟ', meaning: 'Ancestral land, heritage, legacy, the homeland' },
];

const ICHING_HEXAGRAMS = [
  { number: 1, name: 'Ch\'ien — The Creative', meaning: 'Heaven · Pure yang · Primal power · The dragon ascends. Creative force moves without obstacle. This is the moment of pure initiation.' },
  { number: 2, name: 'K\'un — The Receptive', meaning: 'Earth · Pure yin · Yielding · The mare follows. Do not initiate — respond. Receptivity is not weakness; it is the earth itself.' },
  { number: 11, name: 'T\'ai — Peace', meaning: 'Heaven beneath Earth · The small departs, the great arrives. All is in right order. Harmony between heaven and earth creates flourishing.' },
  { number: 12, name: 'P\'i — Standstill', meaning: 'Earth beneath Heaven · The great departs, the small arrives. A time of obstruction — not collapse but waiting. The inferior advances, the superior retreats inward.' },
  { number: 29, name: 'K\'an — The Abysmal', meaning: 'Water over Water · Danger doubled · But water flows through. Danger that repeats develops the heart. Flow through the abyss without grasping at the walls.' },
  { number: 30, name: 'Li — The Clinging', meaning: 'Fire over Fire · Dependence on what one clings to. Clarity, beauty, the sun. But fire must have fuel — what are you feeding your flame?' },
  { number: 42, name: 'I — Increase', meaning: 'Wind over Thunder · Decrease of the upper for increase of the lower. The time of increase calls for decisive action. Gifts come from above.' },
  { number: 43, name: 'Kuai — Breakthrough', meaning: 'Lake over Heaven · Resoluteness · The moment of decisive severance. One must speak openly of what must be severed. Compromise with the inferior weakens the position.' },
  { number: 63, name: 'Chi Chi — After Completion', meaning: 'Water over Fire · All in order · But small things go out of balance. After the great task is complete, vigilance is still required. The fox has crossed the river but wets its tail.' },
  { number: 64, name: 'Wei Chi — Before Completion', meaning: 'Fire over Water · The young fox, almost across, wets its tail. The end is near but not yet achieved. This is the liminal moment before the new order is born.' },
];

const BIBLIOMANCY_PASSAGES = [
  { source: 'The Emerald Tablet', text: 'That which is above is like to that which is below, and that which is below is like to that which is above, to accomplish the miracles of the one thing.' },
  { source: 'Liber AL vel Legis I:3', text: 'Every man and every woman is a star.' },
  { source: 'The Gospel of Thomas, Logion 3', text: 'The Kingdom is inside of you, and it is outside of you. When you come to know yourselves, then you will be known.' },
  { source: 'Corpus Hermeticum IV', text: 'God made Man after the image of God. Man fell in love with his image and desired to dwell in it. And Nature, beholding the image of God reflected in the water, fell in love with it.' },
  { source: 'Zohar, Bereshit 1:15a', text: 'When the most hidden of all opened a beginning, He made a palace for his honor. This beginning He called Wisdom.' },
  { source: 'Nag Hammadi, Trimorphic Protennoia', text: 'I am the movement and the pause. I am the voice that can be heard throughout all creation.' },
  { source: 'Rumi, Masnavi I', text: 'Listen to the reed, how it tells a tale, complaining of separations.' },
  { source: 'Upanishads, Chandogya 6.8.7', text: 'Tat tvam asi — Thou art that.' },
];

export default function DivinationPage() {
  const [activeType, setActiveType] = useState<DivinationType>('tarot');
  const [selectedSpread, setSelectedSpread] = useState(TAROT_SPREADS[0]);
  const [readingState, setReadingState] = useState<ReadingState>('idle');
  const [drawnCards, setDrawnCards] = useState<DrawnCardType[]>([]);
  const [revealedIndex, setRevealedIndex] = useState(-1);
  const [drawnRunes, setDrawnRunes] = useState<typeof RUNES>([]);
  const [hexagram, setHexagram] = useState<typeof ICHING_HEXAGRAMS[0] | null>(null);
  const [passage, setPassage] = useState<typeof BIBLIOMANCY_PASSAGES[0] | null>(null);
  const [question, setQuestion] = useState('');

  const performTarotReading = () => {
    setReadingState('shuffling');
    setTimeout(() => {
      const shuffled = shuffle(MAJOR_ARCANA);
      const drawn = shuffled.slice(0, selectedSpread.cardCount).map(card => ({
        ...card,
        isReversed: Math.random() > 0.7,
      }));
      setDrawnCards(drawn);
      setRevealedIndex(-1);
      setReadingState('drawn');
    }, 2000);
  };

  const revealNext = () => {
    if (revealedIndex < drawnCards.length - 1) {
      setRevealedIndex(prev => prev + 1);
      if (revealedIndex === drawnCards.length - 2) setReadingState('revealed');
    }
  };

  const revealAll = () => {
    setRevealedIndex(drawnCards.length - 1);
    setReadingState('revealed');
  };

  const performRuneReading = () => {
    setReadingState('shuffling');
    setTimeout(() => {
      const picked = shuffle([...RUNES]).slice(0, 3);
      setDrawnRunes(picked);
      setReadingState('revealed');
    }, 1500);
  };

  const performIChingReading = () => {
    setReadingState('shuffling');
    setTimeout(() => {
      setHexagram(randomPick(ICHING_HEXAGRAMS));
      setReadingState('revealed');
    }, 2000);
  };

  const performBibliomancy = () => {
    setReadingState('shuffling');
    setTimeout(() => {
      setPassage(randomPick(BIBLIOMANCY_PASSAGES));
      setReadingState('revealed');
    }, 1500);
  };

  const resetReading = () => {
    setReadingState('idle');
    setDrawnCards([]);
    setRevealedIndex(-1);
    setDrawnRunes([]);
    setHexagram(null);
    setPassage(null);
  };

  const DIVINATION_TYPES: { id: DivinationType; label: string; sigil: string }[] = [
    { id: 'tarot', label: 'Tarot', sigil: '🃏' },
    { id: 'iching', label: 'I Ching', sigil: '☯' },
    { id: 'runes', label: 'Runes', sigil: 'ᚱ' },
    { id: 'geomancy', label: 'Geomancy', sigil: '⊕' },
    { id: 'bibliomancy', label: 'Bibliomancy', sigil: '📖' },
  ];

  return (
    <main className="min-h-screen pt-8 pb-24">
      <div className="fixed inset-0 pointer-events-none z-0"
        style={{ background: 'radial-gradient(ellipse at 30% 50%, rgba(255,0,204,0.06), transparent 60%)' }} />

      <div className="container-grimoire relative z-10">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
          className="text-center pt-16 mb-12">
          <div className="font-vt323 text-magenta/50 text-lg tracking-[0.4em] mb-3 animate-flicker">CHAMBER I</div>
          <h1 className="font-orbitron text-4xl md:text-5xl font-black gradient-magenta-cyan uppercase tracking-wider mb-3">
            Chamber of Divination
          </h1>
          <div className="divider-magenta max-w-sm mx-auto mb-4" />
          <p className="font-grotesk text-foreground/50 max-w-xl mx-auto">
            Peer through the veil of time. Each reading becomes a permanent page in your grimoire.
          </p>
        </motion.div>

        {/* Type Selector */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {DIVINATION_TYPES.map(t => (
            <button key={t.id} onClick={() => { setActiveType(t.id); resetReading(); }}
              className={`flex items-center gap-2 px-4 py-2.5 font-orbitron text-xs uppercase tracking-widest transition-all duration-300 ${
                activeType === t.id
                  ? 'border border-magenta/60 text-magenta bg-magenta/10 glow-border-magenta'
                  : 'border border-white/10 text-foreground/40 hover:text-pink-haze hover:border-pink-haze/30'
              }`}>
              <span>{t.sigil}</span><span>{t.label}</span>
            </button>
          ))}
        </div>

        {/* ─── TAROT ─── */}
        {activeType === 'tarot' && (
          <motion.div key="tarot" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {readingState === 'idle' && (
              <div className="max-w-2xl mx-auto">
                {/* Spread selector */}
                <div className="glass-panel p-6 mb-6">
                  <h3 className="font-orbitron text-sm uppercase tracking-widest text-magenta mb-4">Choose Your Spread</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {TAROT_SPREADS.map(spread => (
                      <button key={spread.id} onClick={() => setSelectedSpread(spread)}
                        className={`p-3 text-left transition-all duration-300 ${
                          selectedSpread.id === spread.id
                            ? 'border border-magenta/60 bg-magenta/10'
                            : 'border border-white/10 hover:border-magenta/30'
                        }`}>
                        <div className="font-orbitron text-xs text-magenta uppercase tracking-wider mb-1">{spread.name}</div>
                        <div className="font-mono-ibm text-xs text-foreground/40">{spread.cardCount} card{spread.cardCount > 1 ? 's' : ''}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Question input */}
                <div className="glass-panel p-6 mb-6">
                  <h3 className="font-orbitron text-sm uppercase tracking-widest text-cyan/70 mb-3">Hold a Question</h3>
                  <textarea
                    value={question}
                    onChange={e => setQuestion(e.target.value)}
                    placeholder="What do you wish to understand? (Optional — the cards will speak regardless)"
                    className="textarea-grimoire"
                    rows={3}
                  />
                </div>

                {/* Draw button */}
                <div className="text-center">
                  <motion.button
                    onClick={performTarotReading}
                    className="btn-grimoire text-base px-10 py-4"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    🃏 Draw the {selectedSpread.name}
                  </motion.button>
                </div>
              </div>
            )}

            {readingState === 'shuffling' && <ShuffleAnimation text="The cards are being laid..." />}

            {(readingState === 'drawn' || readingState === 'revealed') && (
              <div className="max-w-4xl mx-auto">
                {question && (
                  <div className="glass-panel-cyan p-4 mb-8 text-center">
                    <span className="font-mono-ibm text-xs text-cyan/60 uppercase tracking-widest">Your Question: </span>
                    <span className="font-grotesk text-sm text-foreground/80 italic">"{question}"</span>
                  </div>
                )}
                <h3 className="font-orbitron text-xs uppercase tracking-widest text-magenta/60 text-center mb-6">
                  {selectedSpread.name} — {selectedSpread.description}
                </h3>
                <div className={`grid gap-4 mb-8 ${
                  drawnCards.length === 1 ? 'grid-cols-1 max-w-xs mx-auto' :
                  drawnCards.length === 3 ? 'grid-cols-3' :
                  'grid-cols-2 md:grid-cols-5'
                }`}>
                  {drawnCards.map((card, i) => (
                    <TarotCardDisplay
                      key={card.id}
                      card={card}
                      position={selectedSpread.positions[i]}
                      revealed={i <= revealedIndex}
                      index={i}
                      onClick={() => i === revealedIndex + 1 && revealNext()}
                    />
                  ))}
                </div>
                <div className="flex justify-center gap-4">
                  {revealedIndex < drawnCards.length - 1 && (
                    <>
                      <button onClick={revealNext} className="btn-grimoire">
                        Reveal Next Card →
                      </button>
                      <button onClick={revealAll} className="btn-cyan">
                        Reveal All
                      </button>
                    </>
                  )}
                  {readingState === 'revealed' && (
                    <button onClick={resetReading} className="btn-gold">
                      ↺ New Reading
                    </button>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* ─── I CHING ─── */}
        {activeType === 'iching' && (
          <motion.div key="iching" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl mx-auto">
            {readingState === 'idle' && (
              <div className="text-center">
                <div className="glass-panel p-8 mb-8">
                  <div className="text-6xl mb-4 animate-breathe">☯</div>
                  <h3 className="font-orbitron text-lg font-bold gradient-cyan-magenta uppercase tracking-wider mb-4">
                    The I Ching Oracle
                  </h3>
                  <p className="font-grotesk text-sm text-foreground/60 mb-6 leading-relaxed">
                    The Book of Changes. 64 hexagrams mapping every possible state of transformation.
                    Formulate a question in your mind, then cast the coins.
                  </p>
                  <input value={question} onChange={e => setQuestion(e.target.value)}
                    placeholder="What situation do you wish to understand?"
                    className="input-grimoire mb-6" />
                  <motion.button onClick={performIChingReading} className="btn-cyan px-10 py-4"
                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    ☯ Cast the Hexagram
                  </motion.button>
                </div>
              </div>
            )}
            {readingState === 'shuffling' && <ShuffleAnimation text="The coins fall, the hexagram forms..." />}
            {readingState === 'revealed' && hexagram && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="glass-panel-cyan p-8 text-center">
                <div className="font-orbitron text-xs uppercase tracking-widest text-cyan/50 mb-4">
                  Hexagram {hexagram.number}
                </div>
                <div className="text-5xl mb-4 animate-float">☯</div>
                <h3 className="font-orbitron text-2xl font-bold text-cyan mb-2">
                  {hexagram.name}
                </h3>
                <div className="divider-cyan max-w-xs mx-auto mb-6" />
                <p className="font-grotesk text-foreground/70 leading-relaxed mb-8">{hexagram.meaning}</p>
                {question && <div className="oracle-bubble mb-6">
                  <span className="font-mono-ibm text-xs text-cyan/60">Re: </span>
                  <span className="font-grotesk text-sm italic">"{question}"</span>
                </div>}
                <div className="flex justify-center gap-4">
                  <button onClick={resetReading} className="btn-cyan">↺ Cast Again</button>
                  <Link href="/akashic"><button className="btn-grimoire">View in Akashic Library</button></Link>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* ─── RUNES ─── */}
        {activeType === 'runes' && (
          <motion.div key="runes" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl mx-auto">
            {readingState === 'idle' && (
              <div className="text-center">
                <div className="glass-panel p-8 mb-8">
                  <div className="text-5xl mb-4 font-vt323 text-gold glow-gold animate-breathe">ᚠᚢᚦᚨᚱ</div>
                  <h3 className="font-orbitron text-lg font-bold gradient-gold-pink uppercase tracking-wider mb-4">
                    The Elder Futhark
                  </h3>
                  <p className="font-grotesk text-sm text-foreground/60 mb-6 leading-relaxed">
                    24 runes carved from the World Tree. Odin hung nine days to receive them.
                    Draw three to reveal Past · Present · Future.
                  </p>
                  <input value={question} onChange={e => setQuestion(e.target.value)}
                    placeholder="What do you seek to know?"
                    className="input-grimoire mb-6" />
                  <motion.button onClick={performRuneReading} className="btn-gold px-10 py-4"
                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    ᚱ Draw Three Runes
                  </motion.button>
                </div>
                {/* Rune gallery */}
                <div className="flex flex-wrap justify-center gap-2">
                  {RUNES.map(r => (
                    <div key={r.name} className="font-vt323 text-2xl text-gold/30 hover:text-gold/70 transition-colors cursor-default" title={r.name}>
                      {r.symbol}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {readingState === 'shuffling' && <ShuffleAnimation text="The runes are drawn from the bag..." />}
            {readingState === 'revealed' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="grid grid-cols-3 gap-4 mb-8">
                  {drawnRunes.map((rune, i) => (
                    <motion.div key={rune.name}
                      initial={{ opacity: 0, rotateY: 180 }} animate={{ opacity: 1, rotateY: 0 }}
                      transition={{ delay: i * 0.3 }}
                      className="glass-panel-gold p-6 text-center">
                      <div className="font-vt323 text-xs uppercase tracking-widest text-gold/50 mb-2">
                        {['Past', 'Present', 'Future'][i]}
                      </div>
                      <div className="font-vt323 text-6xl text-gold glow-gold mb-3">{rune.symbol}</div>
                      <div className="font-orbitron text-sm font-bold text-gold uppercase tracking-wider mb-2">{rune.name}</div>
                      <p className="font-grotesk text-xs text-foreground/60 leading-relaxed">{rune.meaning}</p>
                    </motion.div>
                  ))}
                </div>
                <div className="text-center">
                  <button onClick={resetReading} className="btn-gold">↺ Draw Again</button>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* ─── GEOMANCY ─── */}
        {activeType === 'geomancy' && (
          <motion.div key="geomancy" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl mx-auto">
            <GeomancyOracle />
          </motion.div>
        )}

        {/* ─── BIBLIOMANCY ─── */}
        {activeType === 'bibliomancy' && (
          <motion.div key="bibliomancy" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl mx-auto">
            {readingState === 'idle' && (
              <div className="text-center">
                <div className="glass-panel p-8 mb-8">
                  <div className="text-6xl mb-4 animate-float">📖</div>
                  <h3 className="font-orbitron text-lg font-bold gradient-gold-pink uppercase tracking-wider mb-4">
                    Bibliomancy
                  </h3>
                  <p className="font-grotesk text-sm text-foreground/60 mb-6 leading-relaxed">
                    The sacred texts speak. Close your eyes. Hold your question. Open the grimoire at random —
                    the passage that appears is your answer.
                  </p>
                  <input value={question} onChange={e => setQuestion(e.target.value)}
                    placeholder="What do you seek guidance on?"
                    className="input-grimoire mb-6" />
                  <motion.button onClick={performBibliomancy} className="btn-gold px-10 py-4"
                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    📖 Open the Grimoire
                  </motion.button>
                </div>
              </div>
            )}
            {readingState === 'shuffling' && <ShuffleAnimation text="The grimoire opens itself..." />}
            {readingState === 'revealed' && passage && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="glass-panel-gold p-10 text-center">
                <div className="text-4xl mb-6 animate-breathe">📖</div>
                <blockquote className="font-grotesk text-xl md:text-2xl text-foreground/90 italic leading-relaxed mb-6">
                  "{passage.text}"
                </blockquote>
                <div className="divider-gold max-w-xs mx-auto mb-4" />
                <div className="font-mono-ibm text-sm text-gold/70 tracking-wider">— {passage.source}</div>
                {question && <div className="oracle-bubble mt-8 text-left">
                  <span className="font-mono-ibm text-xs text-gold/50">Your question: </span>
                  <span className="font-grotesk text-sm italic">"{question}"</span>
                </div>}
                <div className="flex justify-center gap-4 mt-8">
                  <button onClick={resetReading} className="btn-gold">↺ Open Again</button>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </div>
    </main>
  );
}

function ShuffleAnimation({ text }: { text: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="ritual-spinner mb-6" />
      <div className="font-vt323 text-magenta/70 text-xl tracking-widest animate-flicker">{text}</div>
    </div>
  );
}

function TarotCardDisplay({ card, position, revealed, index, onClick }:
  { card: DrawnCardType; position: string; revealed: boolean; index: number; onClick: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="flex flex-col items-center gap-3"
    >
      <div className="font-orbitron text-xs uppercase tracking-wider text-gold/60 text-center">{position}</div>
      <motion.div
        onClick={onClick}
        className="tarot-card w-full cursor-pointer"
        style={{ transform: revealed && card.isReversed ? 'rotate(180deg)' : 'none' }}
        whileHover={!revealed ? { scale: 1.05 } : {}}
      >
        <div className="tarot-card-back flex flex-col items-center justify-center gap-2 p-2">
          {revealed ? (
            <>
              <div className="text-3xl" style={{ filter: 'drop-shadow(0 0 8px #ffd700)' }}>
                {card.symbol}
              </div>
              <div className="font-orbitron text-xs text-gold uppercase tracking-wider text-center leading-tight">
                {card.name}
              </div>
              <div className="font-vt323 text-xs text-foreground/30">{card.isReversed ? 'Reversed' : 'Upright'}</div>
            </>
          ) : (
            <>
              <motion.div
                className="text-3xl text-magenta/30"
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
              >✦</motion.div>
              <div className="font-vt323 text-xs text-foreground/20">Tap to reveal</div>
            </>
          )}
        </div>
      </motion.div>

      {revealed && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="glass-panel p-3 w-full"
        >
          <p className="font-grotesk text-xs text-foreground/70 leading-relaxed line-clamp-4">
            {card.isReversed ? card.reversed : card.upright}
          </p>
          <div className="flex flex-wrap gap-1 mt-2">
            {card.keywords.slice(0, 3).map(k => (
              <span key={k} className="tag-magenta text-xs">{k}</span>
            ))}
          </div>
          {card.akashicLinks.length > 0 && (
            <Link href={`/akashic?q=${card.akashicLinks[0]}`}
              className="font-mono-ibm text-xs text-cyan/50 hover:text-cyan mt-2 block transition-colors">
              → Akashic: {card.akashicLinks[0]}
            </Link>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}

function GeomancyOracle() {
  const FIGURES = [
    { name: 'Via', dots: [[1],[1],[1],[1]], element: 'Water', meaning: 'The road — movement, travel, change. The path is clear but you must walk it.' },
    { name: 'Cauda Draconis', dots: [[2],[1],[1],[2]], element: 'Saturn', meaning: "The dragon's tail — endings, loss, departure. What must leave, will leave." },
    { name: 'Puer', dots: [[2],[1],[2],[1]], element: 'Mars', meaning: 'The boy — rash action, courage, conflict. Boldness is required but so is restraint.' },
    { name: 'Fortuna Major', dots: [[2],[2],[1],[1]], element: 'Sun', meaning: 'Great fortune — inner strength, protection, safe passage. Fate is in your favor.' },
    { name: 'Rubeus', dots: [[2],[2],[1],[2]], element: 'Mars', meaning: 'Red — passion, vice, dangerous impulse. Tread carefully here.' },
    { name: 'Acquisitio', dots: [[2],[1],[1],[1]], element: 'Jupiter', meaning: 'Gain — acquisition, abundance, success in material matters.' },
    { name: 'Laetitia', dots: [[1],[2],[2],[2]], element: 'Jupiter', meaning: 'Joy — happiness, health, beauty. The spirit rises.' },
  ];

  const [drawn, setDrawn] = useState<typeof FIGURES[0] | null>(null);
  const [casting, setCasting] = useState(false);
  const [question, setQuestion] = useState('');

  const cast = () => {
    setCasting(true);
    setTimeout(() => {
      setDrawn(randomPick(FIGURES));
      setCasting(false);
    }, 2000);
  };

  return (
    <div className="text-center">
      {!drawn && !casting && (
        <div className="glass-panel p-8 mb-8">
          <div className="text-5xl mb-4 animate-breathe">⊕</div>
          <h3 className="font-orbitron text-lg font-bold gradient-magenta-cyan uppercase tracking-wider mb-4">Geomancy</h3>
          <p className="font-grotesk text-sm text-foreground/60 mb-6 leading-relaxed">
            The ancient art of earth divination — casting marks, reading figures.
            Sixteen geomantic figures reveal the forces at work in any situation.
          </p>
          <input value={question} onChange={e => setQuestion(e.target.value)}
            placeholder="State your question..."
            className="input-grimoire mb-6" />
          <motion.button onClick={cast} className="btn-grimoire px-10 py-4"
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            ⊕ Cast the Figure
          </motion.button>
        </div>
      )}
      {casting && <ShuffleAnimation text="The earth speaks..." />}
      {drawn && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="glass-panel p-10">
          <div className="font-orbitron text-xs uppercase tracking-widest text-magenta/50 mb-4">Geomantic Figure</div>
          <div className="flex justify-center gap-8 mb-6">
            {drawn.dots.map((row, ri) => (
              <div key={ri} className="flex flex-col gap-2">
                {row.map((dot, di) => (
                  <div key={di} className="flex gap-2 justify-center">
                    {Array.from({ length: dot }).map((_, k) => (
                      <div key={k} className="w-3 h-3 rounded-full bg-magenta animate-pulse-glow" />
                    ))}
                  </div>
                ))}
              </div>
            ))}
          </div>
          <h3 className="font-orbitron text-2xl font-bold text-magenta glow-magenta mb-2">{drawn.name}</h3>
          <div className="tag-magenta inline-block mb-4">Element: {drawn.element}</div>
          <p className="font-grotesk text-foreground/70 leading-relaxed mb-6">{drawn.meaning}</p>
          <button onClick={() => setDrawn(null)} className="btn-grimoire">↺ Cast Again</button>
        </motion.div>
      )}
    </div>
  );
}
