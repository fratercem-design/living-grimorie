'use client';
import { motion } from 'framer-motion';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { signIn, signUp, signOut, useSession } from '@/lib/auth-client';
import { INITIATION_LEVELS } from '@/lib/data/initiation';

type Me = {
  user: { name: string; email: string } | null;
  points?: number;
  rank?: number;
  nextThreshold?: number | null;
  recent?: { action: string; points: number; createdAt: string }[];
};

export default function SanctumPage() {
  const { data: session, isPending } = useSession();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [me, setMe] = useState<Me | null>(null);

  const loadMe = useCallback(async () => {
    try {
      const res = await fetch('/api/me');
      if (res.ok) setMe(await res.json());
    } catch {
      // ignore — profile shows once reachable
    }
  }, []);

  useEffect(() => {
    if (session?.user) loadMe();
  }, [session, loadMe]);

  const submit = async () => {
    if (busy) return;
    setError('');
    setBusy(true);
    try {
      if (mode === 'signup') {
        if (!name.trim() || !email.trim() || password.length < 8) {
          setError('A name, an email, and a password of at least 8 characters are required.');
          setBusy(false);
          return;
        }
        const { error: err } = await signUp.email({ name: name.trim(), email: email.trim(), password });
        if (err) setError(err.message ?? 'The gate did not open. Try again.');
      } else {
        const { error: err } = await signIn.email({ email: email.trim(), password });
        if (err) setError(err.message ?? 'The gate did not open. Check your credentials.');
      }
    } catch {
      setError('The gate did not open. Try again.');
    }
    setBusy(false);
  };

  const level = me?.rank != null ? INITIATION_LEVELS[me.rank] : INITIATION_LEVELS[0];

  return (
    <main className="min-h-screen pt-8 pb-24">
      <div className="fixed inset-0 pointer-events-none z-0"
        style={{ background: 'radial-gradient(ellipse at 50% 40%, rgba(255,215,0,0.04), transparent 60%)' }} />
      <div className="container-grimoire relative z-10">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
          className="text-center pt-16 mb-12">
          <div className="font-vt323 text-gold/50 text-lg tracking-[0.4em] mb-3 animate-flicker">THE INNER GATE</div>
          <h1 className="font-orbitron text-4xl md:text-5xl font-black uppercase tracking-wider mb-3"
            style={{ background: 'linear-gradient(135deg, #ffd700, #ff00cc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            The Sanctum
          </h1>
          <div className="divider-gold max-w-sm mx-auto mb-4" />
          <p className="font-grotesk text-foreground/50 max-w-xl mx-auto">
            Your identity within the Grimoire. Akashic Points accrue to your name;
            your grade on the initiatory path is recorded here.
          </p>
        </motion.div>

        {isPending ? (
          <div className="flex justify-center py-20"><div className="ritual-spinner" /></div>
        ) : session?.user ? (
          /* ─── PROFILE ─── */
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl mx-auto space-y-6">
            <div className="glass-panel-gold p-8">
              <div className="flex items-center gap-5 mb-6">
                <div className="text-5xl" style={{ color: level.color, filter: `drop-shadow(0 0 12px ${level.color}88)` }}>
                  {level.symbol}
                </div>
                <div>
                  <div className="font-orbitron text-xl font-bold uppercase tracking-wider text-gold">
                    {session.user.name}
                  </div>
                  <div className="font-vt323 text-sm text-foreground/40">{session.user.email}</div>
                  <div className="font-mono-ibm text-xs mt-1" style={{ color: level.color }}>
                    Grade: {level.name} — {level.title}
                  </div>
                </div>
                <div className="ml-auto text-right">
                  <div className="font-orbitron text-3xl font-black text-gold">{me?.points ?? '—'}</div>
                  <div className="font-mono-ibm text-xs text-foreground/40">Akashic Points</div>
                </div>
              </div>
              {me?.nextThreshold != null && (
                <div className="space-y-1 mb-6">
                  <div className="flex justify-between font-mono-ibm text-xs text-foreground/40">
                    <span>Progress to {INITIATION_LEVELS[(me.rank ?? 0) + 1]?.name}</span>
                    <span>{me.points}/{me.nextThreshold} AP</span>
                  </div>
                  <div className="progress-grimoire">
                    <div className="progress-grimoire-fill" style={{ width: `${Math.min(100, ((me.points ?? 0) / me.nextThreshold) * 100)}%` }} />
                  </div>
                </div>
              )}
              <div className="flex gap-3">
                <Link href="/initiation"><button className="btn-gold text-xs px-5 py-2.5">🏛 Initiation Path</button></Link>
                <button onClick={() => signOut()} className="btn-grimoire text-xs px-5 py-2.5">Leave the Sanctum</button>
              </div>
            </div>

            {me?.recent && me.recent.length > 0 && (
              <div className="glass-panel p-6">
                <div className="font-orbitron text-xs uppercase tracking-widest text-gold/60 mb-4">
                  Recent Akashic Activity
                </div>
                <div className="space-y-2">
                  {me.recent.map((r, i) => (
                    <div key={i} className="flex items-center justify-between border-b border-white/5 pb-2">
                      <span className="font-grotesk text-sm text-foreground/70">{r.action}</span>
                      <span className="font-mono-ibm text-xs text-gold">+{r.points} AP</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        ) : (
          /* ─── SIGN IN / UP ─── */
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-md mx-auto">
            <div className="flex justify-center gap-3 mb-6">
              {[['signin', 'Enter'], ['signup', 'Begin Initiation']].map(([m, l]) => (
                <button key={m} onClick={() => { setMode(m as typeof mode); setError(''); }}
                  className={`px-5 py-2.5 font-orbitron text-xs uppercase tracking-widest transition-all duration-300 ${
                    mode === m ? 'border border-gold/60 text-gold bg-gold/10' : 'border border-white/10 text-foreground/40 hover:text-gold/60'
                  }`}>
                  {l}
                </button>
              ))}
            </div>

            <div className="glass-panel-gold p-8 space-y-4">
              {mode === 'signup' && (
                <div>
                  <label className="font-orbitron text-xs uppercase tracking-widest text-gold/70 block mb-2">
                    Initiate Name
                  </label>
                  <input value={name} onChange={e => setName(e.target.value)}
                    placeholder="The name you take within the Grimoire..."
                    className="input-grimoire" style={{ borderColor: 'rgba(255,215,0,0.3)' }} />
                </div>
              )}
              <div>
                <label className="font-orbitron text-xs uppercase tracking-widest text-gold/70 block mb-2">
                  Email
                </label>
                <input value={email} onChange={e => setEmail(e.target.value)} type="email"
                  placeholder="your@email.com"
                  className="input-grimoire" style={{ borderColor: 'rgba(255,215,0,0.3)' }} />
              </div>
              <div>
                <label className="font-orbitron text-xs uppercase tracking-widest text-gold/70 block mb-2">
                  Password
                </label>
                <input value={password} onChange={e => setPassword(e.target.value)} type="password"
                  onKeyDown={e => e.key === 'Enter' && submit()}
                  placeholder={mode === 'signup' ? 'At least 8 characters...' : 'Your password...'}
                  className="input-grimoire" style={{ borderColor: 'rgba(255,215,0,0.3)' }} />
              </div>

              {error && (
                <div className="font-mono-ibm text-xs text-ember border border-ember/30 bg-ember/5 p-3">
                  {error}
                </div>
              )}

              <div className="pt-2 text-center">
                <motion.button onClick={submit} disabled={busy}
                  className="btn-gold px-10 py-4 disabled:opacity-40"
                  whileHover={!busy ? { scale: 1.05 } : {}} whileTap={!busy ? { scale: 0.95 } : {}}>
                  {busy ? '◌ The gate turns...' : mode === 'signup' ? '🗝 Take the First Step' : '🗝 Enter the Sanctum'}
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </main>
  );
}
