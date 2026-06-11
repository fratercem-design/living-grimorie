// In-memory sliding-window rate limiter. Single-replica Railway deployment,
// so process memory is the source of truth; swap for Redis if replicas grow.

type Window = { timestamps: number[] };

const buckets = new Map<string, Window>();
let lastSweep = Date.now();

function sweep(now: number, windowMs: number) {
  // periodic cleanup so the map doesn't grow unbounded
  if (now - lastSweep < 60_000) return;
  lastSweep = now;
  for (const [key, win] of buckets) {
    win.timestamps = win.timestamps.filter(t => now - t < windowMs);
    if (win.timestamps.length === 0) buckets.delete(key);
  }
}

export function clientIp(request: Request): string {
  const fwd = request.headers.get('x-forwarded-for');
  if (fwd) return fwd.split(',')[0].trim();
  return request.headers.get('x-real-ip') ?? 'unknown';
}

/**
 * Returns true if the request is allowed, false if rate-limited.
 * Key by route name + client IP.
 */
export function rateLimit(request: Request, route: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  sweep(now, windowMs);
  const key = `${route}:${clientIp(request)}`;
  const win = buckets.get(key) ?? { timestamps: [] };
  win.timestamps = win.timestamps.filter(t => now - t < windowMs);
  if (win.timestamps.length >= limit) {
    buckets.set(key, win);
    return false;
  }
  win.timestamps.push(now);
  buckets.set(key, win);
  return true;
}

export function rateLimitResponse(): Response {
  return Response.json(
    { error: 'The Grimoire requires patience. Too many requests — wait a moment.' },
    { status: 429 },
  );
}
