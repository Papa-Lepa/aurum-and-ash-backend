import { neon } from '@neondatabase/serverless';

// DATABASE_URL is set in Vercel's project environment variables
// (Neon gives you this connection string when you create the database).
if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set');
}

// `sql` is a tagged-template query function — no connection pool to manage,
// which is what makes this a good fit for serverless functions.
export const sql = neon(process.env.DATABASE_URL);
