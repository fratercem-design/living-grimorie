'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { useSession } from '@/lib/auth-client';

const NAV_LINKS = [
  { href: '/chambers', label: 'The Chambers', sigil: '⬡' },
  { href: '/divination', label: 'Divination', sigil: '🔮' },
  { href: '/dreams', label: 'Dream Atlas', sigil: '🌙' },
  { href: '/spirits', label: 'Spirits', sigil: '👁' },
  { href: '/symbols', label: 'Symbols', sigil: '🜂' },
  { href: '/synchronicities', label: 'Synchronicities', sigil: '✨' },
  { href: '/initiation', label: 'Initiation', sigil: '🏛' },
  { href: '/oracles', label: 'Oracles', sigil: '◈' },
  { href: '/akashic', label: 'Akashic Library', sigil: '📚' },
];

export function Navigation() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { data: session } = useSession();
  const sanctumLabel = session?.user?.name ? session.user.name.split(' ')[0] : 'Sanctum';

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      <div
        className="border-b border-magenta/10"
        style={{
          background: 'rgba(5, 1, 10, 0.85)',
          backdropFilter: 'blur(20px)',
        }}
      >
        <div className="container-grimoire flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <motion.span
              className="text-2xl"
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            >
              ✦
            </motion.span>
            <div>
              <div className="font-orbitron text-sm font-bold gradient-magenta-cyan uppercase tracking-widest">
                The Living Grimoire
              </div>
              <div className="font-vt323 text-xs text-pink-haze/50 tracking-widest -mt-1">
                THE LIVING GRIMOIRE
              </div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.slice(0, 5).map((link) => (
              <NavLink key={link.href} {...link} active={pathname === link.href} />
            ))}
            <div className="w-px h-5 bg-magenta/20 mx-2" />
            {NAV_LINKS.slice(5).map((link) => (
              <NavLink key={link.href} {...link} active={pathname === link.href} />
            ))}
            <div className="w-px h-5 bg-magenta/20 mx-2" />
            <NavLink href="/sanctum" label={sanctumLabel} sigil="🗝" active={pathname === '/sanctum'} />
          </div>

          {/* Mobile toggle */}
          <button
            className="lg:hidden text-magenta/70 hover:text-magenta transition-colors font-orbitron text-xs uppercase tracking-widest"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? '✕ Close' : '☰ Enter'}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="lg:hidden border-b border-magenta/20"
            style={{
              background: 'rgba(5, 1, 10, 0.97)',
              backdropFilter: 'blur(20px)',
            }}
          >
            <div className="container-grimoire py-4 grid grid-cols-2 gap-2">
              {[...NAV_LINKS, { href: '/sanctum', label: sanctumLabel, sigil: '🗝' }].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    'flex items-center gap-2 px-3 py-2 font-orbitron text-xs uppercase tracking-wider transition-colors',
                    pathname === link.href
                      ? 'text-cyan border-l-2 border-cyan'
                      : 'text-foreground/60 hover:text-pink-haze border-l-2 border-transparent'
                  )}
                >
                  <span>{link.sigil}</span>
                  <span>{link.label}</span>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

function NavLink({
  href,
  label,
  sigil,
  active,
}: {
  href: string;
  label: string;
  sigil: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        'relative flex items-center gap-1.5 px-3 py-2 font-orbitron text-xs uppercase tracking-wider transition-all duration-200',
        active
          ? 'text-cyan glow-cyan'
          : 'text-foreground/50 hover:text-pink-haze'
      )}
    >
      {active && (
        <motion.span
          layoutId="nav-active"
          className="absolute inset-0 bg-cyan/5 border-b border-cyan/50"
        />
      )}
      <span className="relative z-10">{sigil}</span>
      <span className="relative z-10">{label}</span>
    </Link>
  );
}
