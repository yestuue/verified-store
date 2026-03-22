import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { pool } from '@/lib/db';

async function sendTelegramNotification(message: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return;
  try {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text: message, parse_mode: 'Markdown' }),
    });
  } catch (e) {
    console.error('Telegram notification failed:', e);
  }
}

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session_user');

    if (!sessionCookie?.value) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const user = JSON.parse(sessionCookie.value);
    if (!user.is_admin) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const category = formData.get('category') as string;
    const description = (formData.get('description') as string) || '';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (!file.name.endsWith('.txt')) {
      return NextResponse.json({ error: 'Only .txt files are allowed' }, { status: 400 });
    }

    const fileContent = await file.text();
    const lines = fileContent.split('\n').filter(line => line.trim().length > 0);

    if (lines.length === 0) {
      return NextResponse.json({ error: 'File is empty' }, { status: 400 });
    }

    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Insert each account line into product_accounts
      for (const line of lines) {
        await client.query(
          'INSERT INTO product_accounts (category, account_data, is_sold, description) VALUES ($1, $2, FALSE, $3)',
          [category, line.trim(), description]
        );
      }

      await client.query('COMMIT');
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }

    // Telegram notification
    const now = new Date().toLocaleString('en-NG', { timeZone: 'Africa/Lagos' });
    await sendTelegramNotification(
      `📤 *NEW STOCK UPLOADED — Verified Store*\n\n` +
      `📦 *Category:* ${category}\n` +
      `🔢 *Accounts Added:* ${lines.length}\n` +
      `📝 *Description:* ${description || 'None'}\n` +
      `👤 *Admin:* ${user.email}\n` +
      `📅 *Date:* ${now}`
    );

    console.log(`[Upload] Admin ${user.email} uploaded ${lines.length} accounts for ${category}`);

    return NextResponse.json({
      message: 'File uploaded and saved successfully',
      accountsCount: lines.length,
      category,
    }, { status: 201 });
  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session_user');
    if (!sessionCookie?.value) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const user = JSON.parse(sessionCookie.value);
    if (!user.is_admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const result = await pool.query(`
      SELECT category, COUNT(*) as count, MAX(created_at) as last_upload
      FROM product_accounts
      GROUP BY category
      ORDER BY last_upload DESC
    `);

    return NextResponse.json({ uploads: result.rows });
  } catch (error: any) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
