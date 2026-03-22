import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';
import { pool } from '@/lib/db';

export async function POST(request: NextRequest) {
  console.log('\n─────────────────────────────────────────');
  console.log('[SIGNIN] ▶ Request received');

  try {
    // ── 1. Parse body ──────────────────────────────────────────────────────
    let email: string, password: string;
    try {
      ({ email, password } = await request.json());
    } catch {
      console.error('[SIGNIN] ✗ Failed to parse request body');
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    console.log(`[SIGNIN] ▶ Email received: ${email}`);

    if (!email || !password) {
      console.warn('[SIGNIN] ✗ Missing email or password');
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    // ── 2. Query database ──────────────────────────────────────────────────
    console.log('[SIGNIN] ▶ Attempting DB connection...');
    let client;
    try {
      client = await pool.connect();
      console.log('[SIGNIN] ✓ DB connected');
    } catch (connErr: any) {
      console.error('[SIGNIN] ✗ DB connection failed:', connErr.message);
      return NextResponse.json({ error: 'Database connection failed' }, { status: 500 });
    }

    let user: any;
    try {
      console.log(`[SIGNIN] ▶ Looking up user: ${email}`);
      const result = await client.query(
        'SELECT id, email, name, password, is_admin FROM users WHERE email = $1',
        [email.toLowerCase().trim()]
      );
      user = result.rows[0];
    } catch (queryErr: any) {
      console.error('[SIGNIN] ✗ DB query failed:', queryErr.message);
      client.release();
      return NextResponse.json({ error: 'Database query failed' }, { status: 500 });
    } finally {
      client.release();
    }

    if (!user) {
      console.warn(`[SIGNIN] ✗ No user found for email: ${email}`);
      // Return generic message — don't reveal whether the email exists
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    console.log(`[SIGNIN] ✓ User found — id: ${user.id}, is_admin: ${user.is_admin}`);

    // ── 3. Verify password ─────────────────────────────────────────────────
    console.log('[SIGNIN] ▶ Comparing password hash...');

    if (!user.password) {
      console.error('[SIGNIN] ✗ User row has no password column — check DB schema');
      return NextResponse.json({ error: 'Account configuration error' }, { status: 500 });
    }

    let passwordMatch = false;
    try {
      passwordMatch = await bcrypt.compare(password, user.password);
    } catch (bcryptErr: any) {
      console.error('[SIGNIN] ✗ bcrypt error:', bcryptErr.message);
      return NextResponse.json({ error: 'Password verification failed' }, { status: 500 });
    }

    if (!passwordMatch) {
      console.warn(`[SIGNIN] ✗ Password mismatch for: ${email}`);
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    console.log('[SIGNIN] ✓ Password matched');

    // ── 4. Build session payload ───────────────────────────────────────────
    const sessionPayload = {
      id:       String(user.id),
      email:    user.email,
      name:     user.name   || '',
      is_admin: user.is_admin === true,   // force boolean — never undefined
    };

    console.log('[SIGNIN] ▶ Setting session cookie...');

    // ── 5. Set HTTP-only cookie ────────────────────────────────────────────
    const cookieStore = await cookies();
    cookieStore.set('session_user', JSON.stringify(sessionPayload), {
      httpOnly: true,
      secure:   process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge:   60 * 60 * 24 * 7, // 7 days
      path:     '/',
    });

    console.log(`[SIGNIN] ✓ Session set — is_admin: ${sessionPayload.is_admin}`);
    console.log(`[SIGNIN] ✓ Redirecting to: ${sessionPayload.is_admin ? '/admin' : '/dashboard'}`);
    console.log('─────────────────────────────────────────\n');

    return NextResponse.json({
      message: 'Signed in successfully',
      user: sessionPayload,      // <── frontend reads this to decide redirect
    });

  } catch (error: any) {
    console.error('[SIGNIN] ✗ Unhandled error:', error.message);
    console.error('[SIGNIN] Stack:', error.stack);
    console.log('─────────────────────────────────────────\n');
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
