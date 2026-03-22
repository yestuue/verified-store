import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session_user');

    // If no cookie, return a 200 with null so the frontend 
    // knows the check finished but no one is logged in.
    if (!sessionCookie?.value) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    try {
      const userData = JSON.parse(sessionCookie.value);
      return NextResponse.json({ user: userData }, { status: 200 });
    } catch (parseError) {
      // If cookie is corrupted, clear it and return null
      return NextResponse.json({ user: null }, { status: 200 });
    }
  } catch (error) {
    console.error('Session API Error:', error);
    return NextResponse.json({ user: null, error: 'Session check failed' }, { status: 500 });
  }
}