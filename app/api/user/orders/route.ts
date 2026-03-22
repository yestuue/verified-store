import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { pool } from '@/lib/db';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get('session_user');
    if (!session) return NextResponse.json([], { status: 401 });

    const user = JSON.parse(session.value);
    const result = await pool.query(
      'SELECT * FROM orders WHERE customer_email = $1 ORDER BY created_at DESC',
      [user.email]
    );

    return NextResponse.json(result.rows);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}