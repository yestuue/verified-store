import pkg from 'pg';
const { Client } = pkg;
import bcrypt from 'bcryptjs';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error('DATABASE_URL environment variable is not set');
  process.exit(1);
}

const client = new Client({
  connectionString,
  ssl: { rejectUnauthorized: false },
});

async function initDB() {
  try {
    await client.connect();
    console.log('[v0] Connected to Neon database');

    // Drop existing tables if they exist (for clean setup)
    await client.query('DROP TABLE IF EXISTS account_data CASCADE');
    await client.query('DROP TABLE IF EXISTS logs CASCADE');
    await client.query('DROP TABLE IF EXISTS users CASCADE');
    console.log('[v0] Dropped existing tables');

    // Create users table
    await client.query(`
      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('[v0] Created users table');

    // Create logs table
    await client.query(`
      CREATE TABLE logs (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        action VARCHAR(255) NOT NULL,
        product_id INTEGER,
        product_name VARCHAR(255),
        amount DECIMAL(10, 2),
        description TEXT,
        ip_address VARCHAR(45),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('[v0] Created logs table');

    // Create account_data table
    await client.query(`
      CREATE TABLE account_data (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        filename VARCHAR(255) NOT NULL,
        data_count INTEGER NOT NULL,
        uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        content TEXT NOT NULL
      )
    `);
    console.log('[v0] Created account_data table');

    // Hash demo passwords
    const adminPassword = await bcrypt.hash('Admin@2026', 10);
    const userPassword = await bcrypt.hash('User@2026', 10);

    // Insert demo admin user
    await client.query(
      `INSERT INTO users (email, password_hash, name, role) VALUES ($1, $2, $3, $4)`,
      ['admin@verifiedstore.com', adminPassword, 'Admin User', 'admin']
    );
    console.log('[v0] Created admin user: admin@verifiedstore.com / Admin@2026');

    // Insert demo regular user
    await client.query(
      `INSERT INTO users (email, password_hash, name, role) VALUES ($1, $2, $3, $4)`,
      ['user@verifiedstore.com', userPassword, 'Regular User', 'user']
    );
    console.log('[v0] Created user: user@verifiedstore.com / User@2026');

    console.log('[v0] Database initialization complete!');
  } catch (error) {
    console.error('[v0] Database initialization error:', error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

initDB();
