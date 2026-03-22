import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

async function sendTelegram(message: string) {
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
    console.error('[Telegram] Report-issue notification failed:', e);
  }
}

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get('session_user');
    if (!session?.value) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const user = JSON.parse(session.value);
    const { orderId, category, accountData } = await request.json();

    if (!orderId) {
      return NextResponse.json({ error: 'Missing order ID' }, { status: 400 });
    }

    const now = new Date().toLocaleString('en-NG', { timeZone: 'Africa/Lagos' });

    // Truncate account data for Telegram (avoid huge messages)
    const preview = accountData
      ? String(accountData).slice(0, 200) + (accountData.length > 200 ? '…' : '')
      : 'N/A';

    await sendTelegram(
      `⚠️ *CUSTOMER ISSUE REPORT — Verified Store*\n\n` +
      `🆔 *Order ID:* \`${orderId}\`\n` +
      `📦 *Category:* ${category || 'Unknown'}\n` +
      `📧 *Customer:* ${user.email}\n` +
      `📅 *Reported:* ${now}\n\n` +
      `🔑 *Account Data (reported dead):*\n\`\`\`\n${preview}\n\`\`\`\n\n` +
      `Action needed: verify the account and replace or refund.`
    );

    console.log(`[Report] Order ${orderId} reported by ${user.email}`);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('[Report] Error:', error);
    return NextResponse.json({ error: 'Failed to send report' }, { status: 500 });
  }
}
