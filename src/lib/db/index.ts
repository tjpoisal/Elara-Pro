import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

type DB = ReturnType<typeof drizzle<typeof schema>>;

function getDb(): DB {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error('DATABASE_URL environment variable is not set');
  }
  const sql = neon(url);
  return drizzle(sql, { schema });
}

let _db: DB | undefined;

export const db = new Proxy({} as DB, {
  get(_target, prop: string | symbol) {
    if (!_db) _db = getDb();
    return (_db as unknown as Record<string | symbol, unknown>)[prop];
  },
});

export type Database = DB;
