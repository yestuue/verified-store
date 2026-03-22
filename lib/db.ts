import { Pool } from 'pg';

// ── Guard: DATABASE_URL must be present ──────────────────────────────────────
const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  throw new Error(
    '[DB] DATABASE_URL is not set.\n' +
    '     • Local dev: add it to .env\n' +
    '     • Vercel: add it in Project Settings → Environment Variables'
  );
}

// ── Log which host we are connecting to ──────────────────────────────────────
try {
  const u    = new URL(DATABASE_URL);
  const host = u.hostname;
  const port = u.port || '5432';
  const type = host.includes('pooler.supabase.com') ? 'Pooler ✓'
             : host.startsWith('db.')               ? 'Direct ⚠ (may fail on Windows DNS)'
             : 'Custom';
  console.log(`[DB] Connecting — host: ${host}  port: ${port}  type: ${type}`);
} catch {
  console.warn('[DB] Could not parse DATABASE_URL — attempting connection anyway');
}

// ── Single shared pool ───────────────────────────────────────────────────────
export const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl:              { rejectUnauthorized: false }, // required for Supabase / Neon
  max:              10,
  idleTimeoutMillis:      30_000,
  connectionTimeoutMillis: 10_000,
});

pool.on('error', (err) => {
  const msg = err.message ?? '';
  if (msg.includes('ENOTFOUND')) {
    console.error('[DB] ✗ ENOTFOUND — DNS cannot resolve the host. Switch to the Supabase Pooler URL (port 6543) in .env.');
  } else if (msg.includes('ECONNREFUSED')) {
    console.error('[DB] ✗ ECONNREFUSED — wrong port or host. Pooler=6543, Direct=5432.');
  } else {
    console.error('[DB] Pool error:', msg);
  }
});

// ── Startup ping ─────────────────────────────────────────────────────────────
// Runs once when Next.js first imports this module.
// Check terminal output immediately after `npm run dev` to see the result.
pool.connect()
  .then((client) => {
    return client.query('SELECT NOW() AS ts')
      .then(({ rows }) => console.log(`[DB] ✓ Connected — server time: ${rows[0].ts}`))
      .finally(() => client.release());
  })
  .catch((err: any) => {
    const msg: string = err.message ?? '';
    if (msg.includes('ENOTFOUND')) {
      console.error(
        '[DB] ✗ ENOTFOUND — run   node scripts/check-db.js   for a detailed fix guide.'
      );
    } else {
      console.error('[DB] ✗ Startup ping failed:', msg);
    }
  });
