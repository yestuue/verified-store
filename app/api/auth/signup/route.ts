import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';
import { pool } from '@/lib/db';

export async function POST(request: NextRequest) {
  console.log('[SIGNUP] ▶ Request received');
  try {
    const { email, password, name } = await request.json();

    if (!email || !password || !name) {
      return NextResponse.json({ error: 'Email, password, and name are required' }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
    }

    console.log(`[SIGNUP] ▶ Checking if email exists: ${email}`);
    const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email.toLowerCase().trim()]);
    if (existing.rows.length > 0) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 400 });
    }

    console.log('[SIGNUP] ▶ Hashing password...');
    const hashedPassword = await bcrypt.hash(password, 10);

    console.log('[SIGNUP] ▶ Inserting user...');
    const result = await pool.query(
      `INSERT INTO users (email, password, name, is_admin, created_at)
       VALUES ($1, $2, $3, FALSE, NOW())
       RETURNING id, email, name, is_admin`,
      [email.toLowerCase().trim(), hashedPassword, name.trim()]
    );

    const newUser = result.rows[0];
    const sessionPayload = {
      id:       String(newUser.id),
      email:    newUser.email,
      name:     newUser.name,
      is_admin: false,
    };

    const cookieStore = await cookies();
    cookieStore.set('session_user', JSON.stringify(sessionPayload), {
      httpOnly: true,
      secure:   process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge:   60 * 60 * 24 * 7, // 7 days
      path:     '/',
    });

    console.log(`[SIGNUP] ✓ User created — id: ${newUser.id}`);
    return NextResponse.json(
      { message: 'Account created successfully', user: sessionPayload },
      { status: 201 }
    );

  } catch (error: any) {
    console.error('[SIGNUP] ✗ Error:', error.message);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
