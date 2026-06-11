import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center text-center px-6">
      <div className="font-vt323 text-magenta/60 text-lg tracking-[0.4em] mb-4 animate-flicker">
        SIGNAL LOST
      </div>
      <h1 className="font-orbitron text-6xl md:text-8xl font-black gradient-magenta-cyan mb-4">
        404
      </h1>
      <p className="font-grotesk text-foreground/50 max-w-md mb-2">
        This chamber does not exist — or exists on a plane this terminal cannot reach.
      </p>
      <p className="font-mono-ibm text-xs text-foreground/30 mb-10">
        The Akashic Record holds no entry at this address.
      </p>
      <Link href="/">
        <button className="btn-grimoire px-8 py-3">↩ Return to the Gate</button>
      </Link>
    </main>
  );
}
