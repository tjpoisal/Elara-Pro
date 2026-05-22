import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

// Lazily initialised so that importing this module at build time (when
// DATABASE_URL is not available) does not throw.  The real connection is
// established on first use at runtime.
let _db: ReturnType<typeof drizzle<typeof schema>> | undefined;

export function getDb() {
  if (!_db) {
    const url = process.env.DATABASE_URL;
    if (!url) throw new Error('DATABASE_URL environment variable is not set');
    const sql = neon(url);
    _db = drizzle(sql, { schema });
  }
  return _db;
}

// Convenience re-export so existing `import { db } from '@/lib/db'` callers
// continue to work.  The proxy ensures the connection is only created on first
// property access (i.e. at request time, not at module evaluation time).
export const db = new Proxy({} as ReturnType<typeof drizzle<typeof schema>>, {
  get(_target, prop) {
    return getDb()[prop as keyof ReturnType<typeof drizzle<typeof schema>>];
  },
});

export type Database = typeof db;
