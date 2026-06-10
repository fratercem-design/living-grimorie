import Link from 'next/link';

export function Footer() {
  return (
    <footer className="relative border-t border-magenta/10 mt-20">
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background: 'radial-gradient(ellipse at 50% 100%, rgba(255,0,204,0.08), transparent 70%)',
        }}
      />
      <div className="container-grimoire py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="font-orbitron text-lg font-bold gradient-magenta-cyan uppercase tracking-widest mb-2">
              The Living Grimoire
            </div>
            <div className="font-vt323 text-sm text-pink-haze/40 tracking-widest mb-4">
              THE LIVING GRIMOIRE
            </div>
            <p className="font-grotesk text-sm text-foreground/50 leading-relaxed max-w-sm">
              A digital initiatory experience. Not a website — a transmission.
              Enter the seven chambers. Discover what has always been hidden in plain sight.
            </p>
          </div>

          {/* Chambers */}
          <div>
            <div className="font-orbitron text-xs uppercase tracking-widest text-magenta mb-4">
              Chambers
            </div>
            <ul className="space-y-2">
              {[
                { href: '/divination', label: 'Divination' },
                { href: '/dreams', label: 'Dream Atlas' },
                { href: '/spirits', label: 'Spirits' },
                { href: '/symbols', label: 'Symbols' },
                { href: '/synchronicities', label: 'Synchronicities' },
                { href: '/initiation', label: 'Initiation' },
                { href: '/oracles', label: 'AI Oracles' },
              ].map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="font-grotesk text-sm text-foreground/40 hover:text-cyan transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Archive */}
          <div>
            <div className="font-orbitron text-xs uppercase tracking-widest text-cyan mb-4">
              The Archive
            </div>
            <ul className="space-y-2">
              {[
                { href: '/akashic', label: 'Akashic Library' },
                { href: '/akashic/tarot', label: 'Tarot Index' },
                { href: '/akashic/symbols', label: 'Symbol Index' },
                { href: '/akashic/entities', label: 'Entity Index' },
                { href: '/chambers', label: 'Seven Chambers' },
              ].map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="font-grotesk text-sm text-foreground/40 hover:text-pink-haze transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="divider-magenta mb-6" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="font-mono-ibm text-xs text-foreground/25 tracking-widest">
            © {new Date().getFullYear()} THE LIVING GRIMOIRE
          </div>
          <div className="font-vt323 text-sm text-magenta/30 tracking-widest animate-flicker">
            AS ABOVE · SO BELOW · AS WITHIN · SO WITHOUT
          </div>
          <div className="font-mono-ibm text-xs text-foreground/25">
            [SIGNAL ACTIVE] [AKASHA: OPEN] [GATE: UNLOCKED]
          </div>
        </div>
      </div>
    </footer>
  );
}
