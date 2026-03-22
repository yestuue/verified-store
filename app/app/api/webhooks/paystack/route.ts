import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';
import crypto from 'crypto';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const hash = crypto
      .createHmac('sha512', process.env.PAYSTACK_SECRET_KEY!)
      .update(body)
      .digest('hex');

    // 1. Verify the request actually came from Paystack
    if (hash !== request.headers.get('x-paystack-signature')) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const event = JSON.parse(body);

    // 2. Only proceed if the payment was successful
    if (event.event === 'charge.success') {
      const customerEmail = event.data.customer.email;
      const category = event.data.metadata.category;

      const client = await pool.connect();
      try {
        await client.query('BEGIN');

        // 3. Find one available log for this category
        const result = await client.query(
          'SELECT id, account_data FROM product_accounts WHERE category = $1 AND is_sold = FALSE LIMIT 1 FOR UPDATE SKIP LOCKED',
          [category]
        );

        if (result.rows.length > 0) {
          const logId = result.rows[0].id;
          const logData = result.rows[0].account_data;

          // 4. Mark it as sold
          await client.query('UPDATE product_accounts SET is_sold = TRUE WHERE id = $1', [logId]);

          // 5. Save the order for the customer to see in their dashboard
          await client.query(
            'INSERT INTO orders (customer_email, category, log_data, amount, status) VALUES ($1, $2, $3, $4, $5)',
            [customerEmail, category, logData, event.data.amount / 100, 'completed']
          );

          console.log(`✅ Log delivered to ${customerEmail}`);
        }
        
        await client.query('COMMIT');
      } catch (e) {
        await client.query('ROLLBACK');
        throw e;
      } finally {
        client.release();
      }
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error: any) {
    console.error('Webhook Error:', error);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }
}