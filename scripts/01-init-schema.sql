-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  role VARCHAR(50) DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create logs table for transaction history
CREATE TABLE IF NOT EXISTS logs (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  action VARCHAR(100) NOT NULL,
  product_name VARCHAR(255),
  amount VARCHAR(50),
  description TEXT,
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create account_data table for uploaded .txt file data
CREATE TABLE IF NOT EXISTS account_data (
  id SERIAL PRIMARY KEY,
  uploaded_by INTEGER REFERENCES users(id) ON DELETE CASCADE,
  category VARCHAR(100),
  account_data TEXT NOT NULL,
  file_name VARCHAR(255),
  line_count INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_logs_user_id ON logs(user_id);
CREATE INDEX idx_logs_created_at ON logs(created_at);
CREATE INDEX idx_account_data_category ON account_data(category);
CREATE INDEX idx_account_data_uploaded_by ON account_data(uploaded_by);

-- Create sessions table for NextAuth
CREATE TABLE IF NOT EXISTS sessions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  session_token VARCHAR(255) UNIQUE NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_sessions_token ON sessions(session_token);
CREATE INDEX idx_sessions_expires_at ON sessions(expires_at);

-- Insert demo users
INSERT INTO users (email, password, name, role) VALUES
  ('admin@verifiedstore.com', '$2b$10$mP.EW0F2.3Yz3MbQ7K9h2u8J4H3G5E2Z1D9C8B7A6F5E4D3C2B1A0K', 'Admin User', 'admin'),
  ('user@verifiedstore.com', '$2b$10$nK7J8H9G0F1E2D3C4B5A6Z7Y8X9W0V1U2T3S4R5Q6P7O8N9M0L', 'Demo User', 'user')
ON CONFLICT (email) DO NOTHING;
