import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/db';
import crypto from 'crypto';

// ─── Telegram helper ─────────────────────────────────────────────────────────
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
    console.error('[Telegram] Notification failed:', e);
  }
}

// ─── Webhook handler ──────────────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    const body = await request.text();

    // 1. Verify signature — every request must come from Paystack
    const hash = crypto
      .createHmac('sha512', process.env.PAYSTACK_SECRET_KEY!)
      .update(body)
      .digest('hex');

    if (hash !== request.headers.get('x-paystack-signature')) {
      console.warn('[Webhook] Invalid Paystack signature — request rejected.');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const event = JSON.parse(body);

    // 2. Only handle successful charges
    if (event.event !== 'charge.success') {
      return NextResponse.json({ received: true }, { status: 200 });
    }

    const customerEmail  = event.data.customer.email;
    const reference      = event.data.reference;
    const category       = event.data.metadata?.category       || 'Unknown';
    const productName    = event.data.metadata?.product_name   || category;
    const amountNaira    = event.data.amount / 100;
    const now            = new Date().toLocaleString('en-NG', { timeZone: 'Africa/Lagos' });

    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      // 3. Lock one unsold account row for this category (SKIP LOCKED prevents
      //    double-delivery if two webhooks fire simultaneously for the same category)
      const pick = await client.query(
        `SELECT id, account_data
         FROM product_accounts
         WHERE category = $1 AND is_sold = FALSE
         LIMIT 1
         FOR UPDATE SKIP LOCKED`,
        [category]
      );

      // ── OUT-OF-STOCK SAFETY NET ──────────────────────────────────────────
      if (pick.rows.length === 0) {
        // Record the failed delivery so the admin can manually refund / re-deliver
        await client.query(
          `INSERT INTO failed_deliveries
             (customer_email, category, amount, paystack_reference, reason, created_at)
           VALUES ($1, $2, $3, $4, 'out_of_stock', NOW())
           ON CONFLICT DO NOTHING`,
          [customerEmail, category, amountNaira, reference]
        );

        await client.query('COMMIT');

        // Fire URGENT Telegram alert — do NOT crash the webhook response
        await sendTelegram(
          `🚨🚨 *URGENT — PAYMENT RECEIVED BUT STOCK EMPTY*\n\n` +
          `📦 *Category:* ${category}\n` +
          `📧 *Customer:* ${customerEmail}\n` +
          `💰 *Amount Paid:* ₦${amountNaira.toLocaleString()}\n` +
          `🔖 *Reference:* \`${reference}\`\n` +
          `📅 *Time:* ${now}\n\n` +
          `⚠️ No account was delivered. Immediate action required:\n` +
          `1\\. Refund the customer manually, OR\n` +
          `2\\. Upload stock and re\\-deliver\\.`
        );

        console.error(`[Webhook] OUT OF STOCK — ${category} | customer: ${customerEmail} | ref: ${reference}`);
        // Always return 200 so Paystack doesn't keep retrying
        return NextResponse.json({ received: true }, { status: 200 });
      }

      // ── SUCCESSFUL DELIVERY ──────────────────────────────────────────────
      const logId   = pick.rows[0].id;
      const logData = pick.rows[0].account_data;

      // Step A: Mark the account as sold
      await client.query(
        'UPDATE product_accounts SET is_sold = TRUE WHERE id = $1',
        [logId]
      );

      // Step B: Insert the order — ONLY AFTER the UPDATE succeeded.
      //         If this INSERT throws, the ROLLBACK below un-marks is_sold.
      await client.query(
        `INSERT INTO orders
           (customer_email, category, log_data, amount, paystack_reference, status, created_at)
         VALUES ($1, $2, $3, $4, $5, 'completed', NOW())`,
        [customerEmail, category, logData, amountNaira, reference]
      );

      // Step C: Commit both writes atomically
      await client.query('COMMIT');

      // Notify admin of the successful sale
      await sendTelegram(
        `🛍️ *NEW SALE — Verified Store*\n\n` +
        `📦 *Product:* ${productName}\n` +
        `📧 *Customer:* ${customerEmail}\n` +
        `💰 *Amount:* ₦${amountNaira.toLocaleString()}\n` +
        `🔖 *Reference:* \`${reference}\`\n` +
        `📅 *Time:* ${now}\n\n` +
        `✅ Account delivered automatically\\.`
      );

      console.log(`[Webhook] ✅ Delivered ${category} to ${customerEmail} | ref: ${reference}`);

    } catch (dbError) {
      // Roll back both the UPDATE and the INSERT — nothing is permanently changed
      await client.query('ROLLBACK');

      await sendTelegram(
        `🔴 *DB ERROR — Delivery Failed*\n\n` +
        `📧 Customer: ${customerEmail}\n` +
        `📦 Category: ${category}\n` +
        `💰 Amount: ₦${amountNaira.toLocaleString()}\n` +
        `🔖 Ref: \`${reference}\`\n\n` +
        `Error: ${(dbError as Error).message}`
      );

      throw dbError; // Re-throw so the outer catch returns 500
    } finally {
      client.release();
    }

    return NextResponse.json({ received: true }, { status: 200 });

  } catch (error: any) {
    console.error('[Webhook] Fatal error:', error);
    // Return 500 so Paystack retries (only for genuine server failures)
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }
}
