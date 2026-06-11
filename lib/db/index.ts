import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

// Lazy singleton — survives Next.js dev hot-reload without leaking connections
const globalForDb = globalThis as unknown as { dbClient?: ReturnType<typeof postgres> };

function getClient() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error('DATABASE_URL is not configured');
  if (!globalForDb.dbClient) {
    globalForDb.dbClient = postgres(url, { max: 5, idle_timeout: 30 });
  }
  return globalForDb.dbClient;
}

export function getDb() {
  return drizzle(getClient(), { schema });
}

export { schema };
