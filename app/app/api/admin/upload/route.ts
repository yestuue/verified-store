import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const category = formData.get('category') as string;
    const description = formData.get('description') as string;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // 1. Read the text file content
    const bytes = await file.arrayBuffer();
    const content = new TextDecoder().decode(bytes);

    // 2. Split content into lines and remove empty lines
    const lines = content.split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);

    if (lines.length === 0) {
      return NextResponse.json({ error: 'File is empty' }, { status: 400 });
    }

    // 3. Save each line to the database
    // We use a "Transaction" to make sure either all lines save or none do
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      
      for (const line of lines) {
        await client.query(
          'INSERT INTO product_accounts (category, account_data, description) VALUES ($1, $2, $3)',
          [category, line, description]
        );
      }
      
      await client.query('COMMIT');
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }

    return NextResponse.json({ 
      message: 'Upload successful', 
      accountsCount: lines.length 
    }, { status: 200 });

  } catch (error: any) {
    console.error('Upload API Error:', error);
    return NextResponse.json({ error: 'Server error during upload' }, { status: 500 });
  }
}