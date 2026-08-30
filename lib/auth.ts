import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { getDb } from '@/lib/db';
import * as authSchema from '@/lib/db/auth-schema';

function createAuth() {
  return betterAuth({
    database: drizzleAdapter(getDb(), {
      provider: 'pg',
      schema: {
        user: authSchema.user,
        session: authSchema.session,
        account: authSchema.account,
        verification: authSchema.verification,
      },
    }),
    emailAndPassword: {
      enabled: true,
      // no SMTP configured — accounts work without email verification
      requireEmailVerification: false,
    },
    secret: process.env.BETTER_AUTH_SECRET,
    baseURL: process.env.BETTER_AUTH_URL,
  });
}

// Lazy auth — defers the DB connection to runtime so builds don't fail without
// DATABASE_URL.
//
// The traps below are both load-bearing. better-auth's toNextJsHandler does:
//     return "handler" in auth ? auth.handler(request) : auth(request);
// `in` goes through the `has` trap, not `get`. With only a `get` trap it fell
// through to the empty target, so "handler" in auth was false and better-auth
// called auth(request) — invoking a non-callable Proxy. That surfaced in
// production as `TypeError: r is not a function` on every /api/auth/* request,
// which is what broke sign-in and the Sanctum.
//
// Methods are bound to the real instance because better-auth's handler relies
// on `this`; returning them unbound from `get` breaks them once detached.
let _auth: ReturnType<typeof createAuth> | undefined;

function getAuth(): ReturnType<typeof createAuth> {
  if (!_auth) _auth = createAuth();
  return _auth;
}

export const auth = new Proxy({} as ReturnType<typeof createAuth>, {
  get(_target, prop) {
    const instance = getAuth() as Record<string | symbol, unknown>;
    const value = instance[prop];
    return typeof value === 'function' ? value.bind(instance) : value;
  },
  has(_target, prop) {
    return prop in (getAuth() as object);
  },
});
