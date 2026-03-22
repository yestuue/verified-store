/**
 * check-db.js — Standalone Postgres connection tester
 * ─────────────────────────────────────────────────────
 * Runs completely outside Next.js so you can verify the
 * database connection without starting the dev server.
 *
 * Usage:
 *   node scripts/check-db.js
 *   npm run check-db
 */

'use strict';

const path   = require('path');
const fs     = require('fs');

// ── Load .env manually (no dotenv dependency assumed) ─────────────────────────
const envFile = path.resolve(__dirname, '../.env');

if (!fs.existsSync(envFile)) {
  console.error('✗  .env file not found at:', envFile);
  process.exit(1);
}

const envLines = fs.readFileSync(envFile, 'utf8').split('\n');
for (const raw of envLines) {
  const line = raw.trim();
  if (!line || line.startsWith('#')) continue;
  const eq = line.indexOf('=');
  if (eq === -1) continue;
  const key = line.slice(0, eq).trim();
  const val = line.slice(eq + 1).trim().replace(/^["']|["']$/g, '');
  if (key && !(key in process.env)) process.env[key] = val;
}

console.log('✓  .env loaded from', envFile);

// ── Validate DATABASE_URL ─────────────────────────────────────────────────────
const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('✗  DATABASE_URL is not set in .env');
  process.exit(1);
}

// Parse and display connection details (without exposing the password)
let host = 'unknown', port = 'unknown', database = 'unknown', user = 'unknown';
try {
  const u    = new URL(DATABASE_URL);
  host       = u.hostname;
  port       = u.port || '5432';
  database   = u.pathname.replace(/^\//, '') || 'postgres';
  user       = u.username;
  const pwd  = u.password ? '***' : '(none)';
  console.log('\n── Connection details ───────────────────────────────');
  console.log('  Host    :', host);
  console.log('  Port    :', port);
  console.log('  Database:', database);
  console.log('  User    :', user);
  console.log('  Password:', pwd);
  if (host.includes('pooler.supabase.com')) {
    console.log('  Type    : Supabase Pooler ✓ (recommended)');
  } else if (host.startsWith('db.') && host.includes('supabase.co')) {
    console.log('  Type    : Supabase Direct ⚠  (may fail on Windows DNS)');
  }
  console.log('─────────────────────────────────────────────────────\n');
} catch {
  console.error('✗  DATABASE_URL is not a valid URL:', DATABASE_URL);
  process.exit(1);
}

// ── Connect and test ──────────────────────────────────────────────────────────
const { Client } = require('pg');

const client = new Client({
  connectionString: DATABASE_URL,
  ssl:              { rejectUnauthorized: false },
  connectionTimeoutMillis: 10_000,
});

console.log('▶  Connecting to', host + ':' + port, '...');

client.connect()
  .then(() => {
    console.log('✓  TCP connection established');
    return client.query('SELECT NOW() AS ts, current_database() AS db, current_user AS usr');
  })
  .then(({ rows }) => {
    const r = rows[0];
    console.log('✓  Query succeeded');
    console.log('   Server time :', r.ts);
    console.log('   Database    :', r.db);
    console.log('   Logged in as:', r.usr);

    // Check that the users table exists
    return client.query(`
      SELECT COUNT(*) AS cnt FROM information_schema.tables
      WHERE table_schema = 'public' AND table_name = 'users'
    `);
  })
  .then(({ rows }) => {
    const exists = rows[0].cnt > 0;
    if (exists) {
      console.log('✓  Table "users" exists');
      return client.query('SELECT id, email, is_admin FROM users LIMIT 5');
    } else {
      console.warn('⚠  Table "users" does NOT exist — run your schema migration first');
      return null;
    }
  })
  .then((result) => {
    if (result) {
      console.log(`✓  Found ${result.rows.length} user row(s):`);
      for (const row of result.rows) {
        console.log(`     id=${row.id}  email=${row.email}  is_admin=${row.is_admin}`);
      }
    }
    console.log('\n✅  DATABASE CONNECTION OK — your app should work.\n');
  })
  .catch((err) => {
    const msg = err.message ?? '';
    console.error('\n✗  Connection failed:', msg);

    if (msg.includes('ENOTFOUND')) {
      console.error(
        '\n── FIX: ENOTFOUND ───────────────────────────────────────────────────',
        '\n  Your DNS cannot resolve:', host,
        '\n  You are using the Supabase DIRECT host (db.*.supabase.co).',
        '\n  Switch to the POOLER URL instead:',
        '\n',
        '\n  1. Open https://supabase.com/dashboard/project/' + (host.split('.')[1] ?? '<ref>'),
        '\n  2. Settings → Database → Connection string',
        '\n  3. Click "Transaction Pooler" tab (port 6543)',
        '\n  4. Copy the URI and paste it as DATABASE_URL in .env',
        '\n  5. URL-encode @ in your password as %40',
        '\n─────────────────────────────────────────────────────────────────────\n'
      );
    } else if (msg.includes('password authentication failed')) {
      console.error(
        '\n── FIX: Wrong password ──────────────────────────────────────────────',
        '\n  Double-check your DATABASE_URL password.',
        '\n  If the password contains @ or # encode them: @ → %40  # → %23',
        '\n─────────────────────────────────────────────────────────────────────\n'
      );
    } else if (msg.includes('ECONNREFUSED')) {
      console.error(
        '\n── FIX: ECONNREFUSED ────────────────────────────────────────────────',
        '\n  Host reached but connection refused on port', port,
        '\n  Pooler = 6543   Direct = 5432   Check your URL.',
        '\n─────────────────────────────────────────────────────────────────────\n'
      );
    }
  })
  .finally(() => client.end());
