#!/usr/bin/env python3
import os
import sys
import psycopg2
from psycopg2 import sql
import bcrypt
from datetime import datetime

# Get database URL from environment
DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    print("[v0] ERROR: DATABASE_URL not set")
    sys.exit(1)

try:
    # Connect to Neon database
    print("[v0] Connecting to Neon database...")
    conn = psycopg2.connect(DATABASE_URL)
    cursor = conn.cursor()
    
    print("[v0] Creating tables...")
    
    # Create users table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            email VARCHAR(255) UNIQUE NOT NULL,
            password_hash VARCHAR(255) NOT NULL,
            name VARCHAR(255),
            role VARCHAR(50) DEFAULT 'user',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    """)
    
    # Create logs table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS logs (
            id SERIAL PRIMARY KEY,
            user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
            action VARCHAR(255) NOT NULL,
            details TEXT,
            ip_address VARCHAR(45),
            timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    """)
    
    # Create account_data table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS account_data (
            id SERIAL PRIMARY KEY,
            uploaded_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
            filename VARCHAR(255) NOT NULL,
            total_accounts INTEGER,
            data_content TEXT,
            uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            status VARCHAR(50) DEFAULT 'active'
        );
    """)
    
    # Hash passwords for demo accounts
    admin_password = "Admin@2026"
    user_password = "User@2026"
    
    admin_hash = bcrypt.hashpw(admin_password.encode(), bcrypt.gensalt()).decode()
    user_hash = bcrypt.hashpw(user_password.encode(), bcrypt.gensalt()).decode()
    
    print("[v0] Creating demo accounts...")
    
    # Check if admin exists
    cursor.execute("SELECT id FROM users WHERE email = %s", ("admin@verifiedstore.com",))
    if cursor.fetchone() is None:
        cursor.execute(
            "INSERT INTO users (email, password_hash, name, role) VALUES (%s, %s, %s, %s)",
            ("admin@verifiedstore.com", admin_hash, "Admin User", "admin")
        )
        print("[v0] Created admin account: admin@verifiedstore.com")
    
    # Check if user exists
    cursor.execute("SELECT id FROM users WHERE email = %s", ("user@verifiedstore.com",))
    if cursor.fetchone() is None:
        cursor.execute(
            "INSERT INTO users (email, password_hash, name, role) VALUES (%s, %s, %s, %s)",
            ("user@verifiedstore.com", user_hash, "Test User", "user")
        )
        print("[v0] Created user account: user@verifiedstore.com")
    
    # Commit changes
    conn.commit()
    cursor.close()
    conn.close()
    
    print("[v0] Database initialization complete!")
    print("[v0] Demo credentials:")
    print("[v0]   Admin: admin@verifiedstore.com / Admin@2026")
    print("[v0]   User: user@verifiedstore.com / User@2026")
    
except Exception as e:
    print(f"[v0] ERROR: {str(e)}")
    sys.exit(1)
