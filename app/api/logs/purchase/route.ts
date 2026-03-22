import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { product_id, product_name, quantity, price, email } = await request.json();

    if (!product_id || !product_name || !price || !email) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Updated to match the "purchases" table we created in Supabase earlier
    const query = `
      INSERT INTO purchases (user_email, product_name, amount_paid, purchase_date)
      VALUES ($1, $2, $3, NOW())
      RETURNING id
    `;
    
    const values = [email, product_name, price];
    const result = await pool.query(query, values);

    return NextResponse.json(
      { message: 'Purchase logged successfully', id: result.rows[0].id },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Purchase log error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Fetches the most recent 100 sales for your Admin Dashboard
    const result = await pool.query('SELECT * FROM purchases ORDER BY purchase_date DESC LIMIT 100');

    return NextResponse.json(
      { logs: result.rows },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Get logs error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}