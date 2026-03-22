import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export async function GET() {
  try {
    const query = `
      SELECT 
        category, 
        COUNT(*) as stock, 
        MAX(price) as price,
        description
      FROM product_accounts 
      WHERE is_sold = FALSE 
      GROUP BY category, description
      HAVING COUNT(*) > 0
    `;
    const result = await pool.query(query);
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('[Products API]', error);
    // Return empty array so the frontend never receives a non-array
    return NextResponse.json([], { status: 200 });
  }
}