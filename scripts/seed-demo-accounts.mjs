/**
 * seed-demo-accounts.mjs
 * ─────────────────────────────────────────────────────────────────────────────
 * Creates (or re-creates) the two demo accounts with REAL bcrypt hashes.
 * The hashes in 01-init-schema.sql are placeholder strings and will never
 * match any password — this script fixes that.
 *
 * Run once from your project root:
 *   node scripts/seed-demo-accounts.mjs
 * ─────────────────────────────────────────────────────────────────────────────
 */

import bcrypt from 'bcryptjs';
import pg from 'pg';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

// ── Load .env manually (no dotenv dependency needed) ─────────────────────────
const __dir = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dir, '../.env');

try {
  const lines = readFileSync(envPath, 'utf8').split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const [key, ...rest] = trimmed.split('=');
    if (key && rest.length) {
      process.env[key.trim()] = rest.join('=').replace(/^["']|["']$/g, '').trim();
    }
  }
  console.log('✓ .env loaded');
} catch {
  console.warn('⚠  Could not read .env — using existing environment variables');
}

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error('✗ DATABASE_URL is not set. Check your .env file.');
  process.exit(1);
}

// ── Demo account definitions ──────────────────────────────────────────────────
const DEMO_ACCOUNTS = [
  {
    email:    'admin@verifiedstore.com',
    password: 'Admin@2026',
    name:     'Admin User',
    is_admin: true,
  },
  {
    email:    'user@verifiedstore.com',
    password: 'User@2026',
    name:     'Demo User',
    is_admin: false,
  },
];

// ── Main ──────────────────────────────────────────────────────────────────────
const pool = new pg.Pool({
  connectionString: DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

async function seed() {
  console.log('\n─── Verified Store — Demo Account Seeder ───');
  const client = await pool.connect();

  try {
    // Ensure the users table has is_admin column (in case schema is old)
    await client.query(`
      ALTER TABLE users
        ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE
    `);

    for (const account of DEMO_ACCOUNTS) {
      console.log(`\n▶ Processing: ${account.email}`);
      const hash = await bcrypt.hash(account.password, 10);
      console.log(`  ✓ Hash generated`);

      await client.query(
        `INSERT INTO users (email, password, name, is_admin, created_at)
         VALUES ($1, $2, $3, $4, NOW())
         ON CONFLICT (email) DO UPDATE
           SET password = EXCLUDED.password,
               name     = EXCLUDED.name,
               is_admin = EXCLUDED.is_admin`,
        [account.email, hash, account.name, account.is_admin]
      );

      console.log(`  ✓ Upserted — is_admin: ${account.is_admin}`);
    }

    // Verify
    console.log('\n─── Verification ───');
    const { rows } = await client.query(
      'SELECT id, email, name, is_admin FROM users WHERE email = ANY($1)',
      [DEMO_ACCOUNTS.map(a => a.email)]
    );
    for (const row of rows) {
      console.log(`  ✓ ${row.email} | is_admin: ${row.is_admin} | id: ${row.id}`);
    }

    console.log('\n✅ Seed complete — demo accounts are ready.\n');
  } catch (err) {
    console.error('\n✗ Seed failed:', err.message);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

seed();
