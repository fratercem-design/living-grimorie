'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { INITIATION_LEVELS, AKASHIC_POINT_ACTIONS, type InitiationLevel, type Lesson } from '@/lib/data/initiation';
import Link from 'next/link';

export default function InitiationPage() {
  const [activeLevel, setActiveLevel] = useState<InitiationLevel>(INITIATION_LEVELS[0]);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [view, setView] = useState<'path' | 'lessons' | 'points'>('path');
  const [progress, setProgress] = useState<{ rank: number; points: number; next: number | null; signedIn: boolean }>({
    rank: 0, points: 0, next: 300, signedIn: false,
  });

  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [marking, setMarking] = useState(false);

  const refreshProgress = async () => {
    try {
      const res = await fetch('/api/me');
      if (!res.ok) return;
      const data = await res.json();
      if (data.user) {
        setProgress({ rank: data.rank ?? 0, points: data.points ?? 0, next: data.nextThreshold ?? null, signedIn: true });
      }
    } catch {
      // guest view stays at Seeker / 0 AP
    }
  };

  useEffect(() => {
    refreshProgress();
    (async () => {
      try {
        const res = await fetch('/api/completions');
        if (!res.ok) return;
        const data = await res.json();
        if (Array.isArray(data.completed)) setCompleted(new Set(data.completed));
      } catch {
        // completions stay empty for guests
      }
    })();
  }, []);

  const markComplete = async (itemId: string, kind: 'lesson' | 'quest') => {
    if (marking || completed.has(itemId)) return;
    setMarking(true);
    try {
      const res = await fetch('/api/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId, kind }),
      });
      if (res.ok) {
        setCompleted(prev => new Set([...prev, itemId]));
        refreshProgress(); // AP and possibly rank just changed
      }
    } catch {
      // leave the button active to retry
    }
    setMarking(false);
  };

  const CURRENT_LEVEL = progress.rank;
  const CURRENT_XP = progress.points;
  const NEXT_LEVEL_XP = progress.next ?? progress.points;

  const LEVEL_COLORS: Record<string, string> = {
    seeker: '#e8d5ff', adept: '#00e5ff', magician: '#ff00cc',
    alchemist: '#ffd700', oracle: '#ff6b35', hierophant: '#ffb6e6', illuminated: '#ffd700',
  };

  return (
    <main className="min-h-screen pt-8 pb-24">
      <div className="fixed inset-0 pointer-events-none z-0"
        style={{ background: 'radial-gradient(ellipse at 50% 30%, rgba(255,107,53,0.05), transparent 60%)' }} />
      <div className="container-grimoire relative z-10">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
          className="text-center pt-16 mb-12">
          <div className="font-vt323 text-ember/50 text-lg tracking-[0.4em] mb-3 animate-flicker">CHAMBER VI</div>
          <h1 className="font-orbitron text-4xl md:text-5xl font-black uppercase tracking-wider mb-3"
            style={{ background: 'linear-gradient(135deg, #ff6b35, #ffd700)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            Chamber of Initiation
          </h1>
          <div className="mb-4" style={{ height: 1, background: 'linear-gradient(90deg, transparent, #ff6b35, transparent)', maxWidth: 300, margin: '0 auto 16px' }} />
          <p className="font-grotesk text-foreground/50 max-w-xl mx-auto">
            Seven degrees of occult education. Ascend from Seeker to Illuminated.
            Each level unlocks new chambers and reveals deeper mysteries.
          </p>
        </motion.div>

        {/* Current Status */}
        <div className="glass-panel p-6 mb-8 max-w-2xl mx-auto"
          style={{ borderColor: `${LEVEL_COLORS[INITIATION_LEVELS[CURRENT_LEVEL].id]}44` }}>
          <div className="flex items-center gap-4 mb-4">
            <div className="text-4xl" style={{
              color: LEVEL_COLORS[INITIATION_LEVELS[CURRENT_LEVEL].id],
              filter: `drop-shadow(0 0 10px ${LEVEL_COLORS[INITIATION_LEVELS[CURRENT_LEVEL].id]}88)`
            }}>
              {INITIATION_LEVELS[CURRENT_LEVEL].symbol}
            </div>
            <div>
              <div className="font-mono-ibm text-xs text-foreground/40 uppercase tracking-widest mb-1">Current Grade</div>
              <div className="font-orbitron text-xl font-bold uppercase tracking-wider"
                style={{ color: LEVEL_COLORS[INITIATION_LEVELS[CURRENT_LEVEL].id] }}>
                {INITIATION_LEVELS[CURRENT_LEVEL].name}
              </div>
              <div className="font-vt323 text-sm text-foreground/40">{INITIATION_LEVELS[CURRENT_LEVEL].title}</div>
            </div>
            <div className="ml-auto text-right">
              <div className="font-orbitron text-2xl font-black text-gold">{CURRENT_XP}</div>
              <div className="font-mono-ibm text-xs text-foreground/40">Akashic Points</div>
            </div>
          </div>
          {INITIATION_LEVELS[CURRENT_LEVEL + 1] && progress.next !== null && (
            <div className="space-y-1">
              <div className="flex justify-between font-mono-ibm text-xs text-foreground/40">
                <span>Progress to {INITIATION_LEVELS[CURRENT_LEVEL + 1].name}</span>
                <span>{CURRENT_XP}/{NEXT_LEVEL_XP} AP</span>
              </div>
              <div className="progress-grimoire">
                <motion.div className="progress-grimoire-fill"
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, (CURRENT_XP / Math.max(1, NEXT_LEVEL_XP)) * 100)}%` }}
                  transition={{ duration: 1.5, ease: 'easeOut' }} />
              </div>
            </div>
          )}
          {!progress.signedIn && (
            <div className="mt-3 font-mono-ibm text-xs text-foreground/40">
              Your steps on the path are not yet being recorded —{' '}
              <Link href="/sanctum" className="text-gold hover:text-gold/80 transition-colors">
                🗝 enter the Sanctum
              </Link>{' '}
              to bind your progress to your name.
            </div>
          )}
        </div>

        {/* Tab Nav */}
        <div className="flex justify-center gap-4 mb-10">
          {[['path', '🏛 Initiation Path'], ['lessons', '📜 Lessons'], ['points', '◈ Akashic Points']].map(([v, l]) => (
            <button key={v} onClick={() => setView(v as typeof view)}
              className={`px-5 py-2.5 font-orbitron text-xs uppercase tracking-widest transition-all duration-300 ${
                view === v ? 'border text-ember' : 'border border-white/10 text-foreground/40 hover:text-ember/60'
              }`}
              style={view === v ? { borderColor: 'rgba(255,107,53,0.6)', background: 'rgba(255,107,53,0.08)' } : {}}>
              {l}
            </button>
          ))}
        </div>

        {/* ─── PATH ─── */}
        {view === 'path' && (
          <motion.div key="path" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="relative">
              {/* Vertical spine */}
              <div className="absolute left-8 top-0 bottom-0 w-px hidden md:block"
                style={{ background: 'linear-gradient(180deg, rgba(255,107,53,0.5), rgba(255,215,0,0.2))' }} />

              <div className="space-y-4">
                {INITIATION_LEVELS.map((level, i) => {
                  const isUnlocked = i <= CURRENT_LEVEL;
                  const isCurrent = i === CURRENT_LEVEL;
                  const color = LEVEL_COLORS[level.id];

                  return (
                    <motion.div key={level.id}
                      initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.08 }}
                      className={`flex gap-6 cursor-pointer group`}
                      onClick={() => setActiveLevel(level)}>
                      {/* Node */}
                      <div className="flex-shrink-0 relative z-10 w-16 h-16 hidden md:flex items-center justify-center">
                        <div className={`w-10 h-10 flex items-center justify-center text-2xl transition-all duration-300`}
                          style={{
                            border: `1px solid ${isUnlocked ? color : 'rgba(255,255,255,0.1)'}`,
                            background: isCurrent ? `${color}22` : 'rgba(5,1,10,0.8)',
                            color: isUnlocked ? color : 'rgba(255,255,255,0.15)',
                            boxShadow: isCurrent ? `0 0 20px ${color}66` : 'none',
                          }}>
                          {level.symbol}
                        </div>
                      </div>

                      {/* Card */}
                      <div className={`flex-1 p-6 transition-all duration-300 ${
                        activeLevel.id === level.id ? 'border' : 'border border-white/5 hover:border-white/15'
                      }`}
                        style={activeLevel.id === level.id ? {
                          borderColor: `${color}66`,
                          background: `${color}08`,
                          boxShadow: `0 0 30px ${color}22`,
                        } : {}}>
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <div className="flex items-center gap-3 mb-1">
                              <span className="md:hidden text-xl" style={{ color }}>{level.symbol}</span>
                              <span className="font-orbitron text-lg font-bold uppercase tracking-wider"
                                style={{ color: isUnlocked ? color : 'rgba(255,255,255,0.2)' }}>
                                {level.name}
                              </span>
                              {isCurrent && <span className="tag-gold text-xs">Current</span>}
                              {!isUnlocked && <span className="font-mono-ibm text-xs text-foreground/30">🔒 Locked</span>}
                            </div>
                            <div className="font-vt323 text-sm" style={{ color: `${color}60` }}>{level.title}</div>
                          </div>
                          <div className="font-mono-ibm text-xs text-foreground/30 text-right">
                            Grade {i + 1} of 7
                          </div>
                        </div>

                        <p className="font-grotesk text-sm text-foreground/60 leading-relaxed mb-4">
                          {level.description}
                        </p>

                        {isUnlocked && (
                          <>
                            <div className="font-orbitron text-xs uppercase tracking-widest mb-2"
                              style={{ color: `${color}60` }}>
                              Unlocked Chambers
                            </div>
                            <div className="flex flex-wrap gap-1 mb-4">
                              {level.unlockedChambers.map(c => (
                                <span key={c} className="font-mono-ibm text-xs px-2 py-0.5"
                                  style={{ border: `1px solid ${color}30`, color: `${color}80`, background: `${color}08` }}>
                                  {c}
                                </span>
                              ))}
                            </div>
                          </>
                        )}

                        {level.requirement && (
                          <div className="font-mono-ibm text-xs text-foreground/30 italic">
                            Requires: {level.requirement}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}

        {/* ─── LESSONS ─── */}
        {view === 'lessons' && (
          <motion.div key="lessons" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {/* Level selector */}
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {INITIATION_LEVELS.map((level, i) => {
                const color = LEVEL_COLORS[level.id];
                const unlocked = i <= CURRENT_LEVEL;
                return (
                  <button key={level.id}
                    onClick={() => unlocked && setActiveLevel(level)}
                    disabled={!unlocked}
                    className={`px-4 py-2 font-orbitron text-xs uppercase tracking-widest transition-all ${
                      activeLevel.id === level.id ? 'border' : 'border border-white/10 text-foreground/40'
                    } ${!unlocked ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'}`}
                    style={activeLevel.id === level.id ? {
                      borderColor: `${color}60`, color, background: `${color}10`
                    } : {}}>
                    {level.symbol} {level.name}
                  </button>
                );
              })}
            </div>

            <AnimatePresence mode="wait">
              {activeLesson ? (
                <motion.div key="lesson-detail"
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  className="max-w-3xl mx-auto">
                  <button onClick={() => setActiveLesson(null)}
                    className="font-orbitron text-xs uppercase tracking-widest text-foreground/40 hover:text-foreground/70 transition-colors mb-6 flex items-center gap-2">
                    ← Back to Lessons
                  </button>
                  <div className="glass-panel p-8">
                    <div className="flex items-start gap-4 mb-6">
                      <div className="flex-1">
                        <div className="font-mono-ibm text-xs text-foreground/30 uppercase tracking-widest mb-1">
                          {activeLevel.name} · {activeLesson.duration}
                        </div>
                        <h2 className="font-orbitron text-2xl font-bold uppercase tracking-wider mb-2"
                          style={{ color: LEVEL_COLORS[activeLevel.id] }}>
                          {activeLesson.title}
                        </h2>
                      </div>
                    </div>
                    <div className="divider-magenta mb-6" />
                    <div className="font-grotesk text-base text-foreground/80 leading-relaxed mb-8 whitespace-pre-line">
                      {activeLesson.content}
                    </div>
                    {activeLesson.quest && (
                      <div className="glass-panel-gold p-6">
                        <div className="font-orbitron text-xs uppercase tracking-widest text-gold mb-3">
                          Quest: {activeLesson.quest.title}
                        </div>
                        <p className="font-grotesk text-sm text-foreground/70 mb-3">{activeLesson.quest.description}</p>
                        <div className="border-l-2 border-gold/40 pl-4 mb-4">
                          <div className="font-mono-ibm text-xs text-gold/60 uppercase tracking-wider mb-1">Task</div>
                          <p className="font-grotesk text-sm text-foreground/80">{activeLesson.quest.task}</p>
                        </div>
                        <div className="flex items-center gap-2 mb-4">
                          <span className="font-mono-ibm text-xs text-gold/60">Reward:</span>
                          <span className="tag-gold text-xs">{activeLesson.quest.reward}</span>
                        </div>
                        {progress.signedIn && (
                          completed.has(activeLesson.quest.id) ? (
                            <div className="font-orbitron text-xs uppercase tracking-widest text-gold/60">
                              ◈ Quest Fulfilled (+75 AP earned)
                            </div>
                          ) : (
                            <button onClick={() => markComplete(activeLesson.quest!.id, 'quest')}
                              disabled={marking}
                              className="btn-gold text-xs px-5 py-2.5 disabled:opacity-40">
                              ◈ I Have Fulfilled This Quest (+75 AP)
                            </button>
                          )
                        )}
                      </div>
                    )}
                    <div className="flex gap-4 mt-6">
                      {!progress.signedIn ? (
                        <Link href="/sanctum" className="flex-1">
                          <button className="btn-gold w-full">🗝 Enter the Sanctum to Record Progress</button>
                        </Link>
                      ) : completed.has(activeLesson.id) ? (
                        <button disabled className="btn-gold flex-1 opacity-50 cursor-default">
                          ✓ Lesson Completed (+25 AP earned)
                        </button>
                      ) : (
                        <button onClick={() => markComplete(activeLesson.id, 'lesson')}
                          disabled={marking}
                          className="btn-gold flex-1 disabled:opacity-40">
                          {marking ? '◌ Recording...' : '✓ Mark Complete (+25 AP)'}
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div key="lesson-list"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="max-w-3xl mx-auto">
                  {activeLevel.lessons.length > 0 ? (
                    <div className="space-y-4">
                      {activeLevel.lessons.map((lesson, i) => (
                        <motion.div key={lesson.id}
                          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.1 }}
                          className="glass-panel p-6 cursor-pointer hover:border-gold/30 transition-all duration-300"
                          onClick={() => setActiveLesson(lesson)}>
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="font-mono-ibm text-xs text-gold/50 uppercase tracking-widest mb-1">
                                {lesson.duration}
                              </div>
                              <h3 className="font-orbitron text-base font-bold uppercase tracking-wider text-gold mb-2">
                                {lesson.title}
                              </h3>
                              <p className="font-grotesk text-sm text-foreground/60 line-clamp-2">
                                {lesson.content.slice(0, 100)}...
                              </p>
                            </div>
                            <div className="flex-shrink-0 ml-4">
                              {completed.has(lesson.id) ? (
                                <div className="font-orbitron text-xs text-gold">✓</div>
                              ) : (
                                <div className="font-orbitron text-xs text-gold/40">→</div>
                              )}
                            </div>
                          </div>
                          {lesson.quest && (
                            <div className="mt-3 flex items-center gap-2">
                              <span className="tag-gold text-xs">Quest Available</span>
                              <span className="font-mono-ibm text-xs text-foreground/30">{lesson.quest.reward}</span>
                            </div>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 glass-panel opacity-50">
                      <div className="text-4xl mb-4">🔒</div>
                      <div className="font-orbitron text-sm uppercase tracking-wider text-foreground/40">
                        Complete previous grades to unlock these lessons
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* ─── AKASHIC POINTS ─── */}
        {view === 'points' && (
          <motion.div key="points" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl mx-auto">
            <div className="glass-panel-gold p-8 mb-8 text-center">
              <div className="font-orbitron text-xs uppercase tracking-widest text-gold/60 mb-2">Your Balance</div>
              <div className="font-orbitron text-6xl font-black text-gold glow-gold mb-2">{CURRENT_XP}</div>
              <div className="font-vt323 text-lg text-gold/50 tracking-widest">AKASHIC POINTS</div>
            </div>
            <div className="glass-panel p-6 mb-6">
              <h3 className="font-orbitron text-sm uppercase tracking-widest text-gold/70 mb-4">Ways to Earn</h3>
              <div className="space-y-3">
                {AKASHIC_POINT_ACTIONS.map(action => (
                  <div key={action.action} className="flex items-center justify-between py-2 border-b border-white/5">
                    <span className="font-grotesk text-sm text-foreground/70">{action.action}</span>
                    <span className="font-orbitron text-sm text-gold font-bold">+{action.points} AP</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Link href="/divination"><button className="btn-gold w-full">🔮 Do a Reading</button></Link>
              <Link href="/dreams"><button className="btn-cyan w-full">🌙 Submit a Dream</button></Link>
              <Link href="/symbols"><button className="btn-grimoire w-full">🜂 Study Symbols</button></Link>
              <Link href="/oracles"><button className="btn-grimoire w-full" style={{ borderColor: 'rgba(255,107,53,0.6)', color: '#ff6b35' }}>◈ Consult Oracle</button></Link>
            </div>
          </motion.div>
        )}
      </div>
    </main>
  );
}
