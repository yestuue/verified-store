import { neon } from '@neondatabase/serverless';
import bcrypt from 'bcrypt';

const sql = neon(process.env.DATABASE_URL!);

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function createUser(email: string, password: string, name: string): Promise<any> {
  try {
    const hashedPassword = await hashPassword(password);
    const result = await sql`
      INSERT INTO users (email, password, name, is_admin)
      VALUES (${email}, ${hashedPassword}, ${name}, false)
      RETURNING id, email, name, is_admin, created_at
    `;
    return result[0];
  } catch (error: any) {
    if (error.message.includes('duplicate key')) {
      throw new Error('Email already exists');
    }
    throw error;
  }
}

export async function getUserByEmail(email: string): Promise<any> {
  try {
    const result = await sql`
      SELECT * FROM users WHERE email = ${email}
    `;
    return result[0];
  } catch (error) {
    throw error;
  }
}

export async function getUserById(id: number): Promise<any> {
  try {
    const result = await sql`
      SELECT id, email, name, is_admin, created_at FROM users WHERE id = ${id}
    `;
    return result[0];
  } catch (error) {
    throw error;
  }
}

export async function createSession(userId: number, expiresAt: Date): Promise<string> {
  try {
    const sessionToken = require('crypto').randomBytes(32).toString('hex');
    await sql`
      INSERT INTO sessions (user_id, session_token, expires_at)
      VALUES (${userId}, ${sessionToken}, ${expiresAt.toISOString()})
    `;
    return sessionToken;
  } catch (error) {
    throw error;
  }
}

export async function getSessionUser(sessionToken: string): Promise<any> {
  try {
    const result = await sql`
      SELECT u.* FROM users u
      JOIN sessions s ON u.id = s.user_id
      WHERE s.session_token = ${sessionToken}
      AND s.expires_at > NOW()
    `;
    return result[0];
  } catch (error) {
    throw error;
  }
}

export async function deleteSession(sessionToken: string): Promise<void> {
  try {
    await sql`
      DELETE FROM sessions WHERE session_token = ${sessionToken}
    `;
  } catch (error) {
    throw error;
  }
}
