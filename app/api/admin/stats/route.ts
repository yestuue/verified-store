import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { pool } from '@/lib/db';

const LOW_STOCK_THRESHOLD = 5;

export async function GET() {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get('session_user');
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const user = JSON.parse(session.value);
    if (!user.is_admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const client = await pool.connect();
    try {
      // ── 1. Core stats: stock count, sold count, revenue from orders table ──
      const statsRes = await client.query(`
        SELECT
          (SELECT COUNT(*)           FROM product_accounts WHERE is_sold = FALSE)      AS total_in_stock,
          (SELECT COUNT(*)           FROM orders)                                       AS total_sold,
          (SELECT COALESCE(SUM(amount), 0) FROM orders WHERE status = 'completed')     AS revenue
      `);

      // ── 2. Last 10 sales for the Overview snapshot ──
      const recentRes = await client.query(`
        SELECT id, customer_email, category, amount, status, created_at
        FROM   orders
        ORDER  BY created_at DESC
        LIMIT  10
      `);

      // ── 3. All sales for the full Sales History tab ──
      const allSalesRes = await client.query(`
        SELECT id, customer_email, category, amount, status, created_at
        FROM   orders
        ORDER  BY created_at DESC
      `);

      // ── 4. Live stock per category — GROUP BY on unsold accounts ──
      const inventoryRes = await client.query(`
        SELECT   category,
                 COUNT(*)::int                            AS count,
                 COUNT(*) <= $1                           AS low_stock
        FROM     product_accounts
        WHERE    is_sold = FALSE
        GROUP BY category
        ORDER BY count ASC
      `, [LOW_STOCK_THRESHOLD]);

      const lowStockCount = inventoryRes.rows.filter(r => r.low_stock).length;

      return NextResponse.json({
        stats: {
          totalInStock:  parseInt(statsRes.rows[0].total_in_stock),
          totalSold:     parseInt(statsRes.rows[0].total_sold),
          revenue:       parseFloat(statsRes.rows[0].revenue),
          lowStockCount,
        },
        recentSales: recentRes.rows,
        allSales:    allSalesRes.rows,
        inventory:   inventoryRes.rows,
      });

    } finally {
      client.release();
    }
  } catch (error) {
    console.error('[Admin Stats]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
