# Backend Setup - Verified Store

## Overview

The Verified Store backend uses:
- **Database:** Neon PostgreSQL (serverless)
- **Authentication:** NextAuth v5 with custom session management
- **API Routes:** Next.js 16 API routes with server actions
- **File Uploads:** Admin dashboard for batch .txt file uploads

## Database Setup

### 1. Create Neon Database

Go to [neon.tech](https://neon.tech) and:
1. Create a new project
2. Copy your `DATABASE_URL` connection string
3. Add to `.env.local`:

```env
DATABASE_URL=postgresql://user:password@ep-xxxxx.region.compute.neon.tech/dbname
```

### 2. Initialize Database Schema

Run the database initialization script:

```bash
# Using Neon CLI or psql
psql $DATABASE_URL -f scripts/init-db.sql
```

This creates:
- `users` table - user accounts
- `purchase_logs` table - transaction logs
- `account_uploads` table - batch uploads
- `uploaded_accounts` table - account data
- `sessions` table - user sessions
- Indexes for performance optimization

## Authentication

### User Registration

**Endpoint:** `POST /api/auth/signup`

**Request:**
```json
{
  "email": "user@example.com",
  "password": "securepassword",
  "name": "User Name"
}
```

**Response:**
```json
{
  "message": "User created successfully",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "User Name"
  }
}
```

### User Login

**Endpoint:** `POST /api/auth/signin`

**Request:**
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

**Response:**
```json
{
  "message": "Signed in successfully",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "User Name",
    "is_admin": false
  }
}
```

Sets an HTTP-only session cookie valid for 30 days.

### User Logout

**Endpoint:** `POST /api/auth/signout`

**Response:**
```json
{
  "message": "Signed out successfully"
}
```

Clears the session cookie and database record.

## Purchase Logging

### Log a Purchase

**Endpoint:** `POST /api/logs/purchase`

**Request:**
```json
{
  "product_id": 1,
  "product_name": "USA Instagram 50-100 Followers",
  "quantity": 1,
  "price": "₦2,000",
  "email": "customer@example.com"
}
```

**Response:**
```json
{
  "message": "Purchase logged successfully",
  "id": 42
}
```

### Get Purchase Logs

**Endpoint:** `GET /api/logs/purchase`

**Response:**
```json
{
  "logs": [
    {
      "id": 42,
      "product_id": 1,
      "product_name": "USA Instagram 50-100 Followers",
      "quantity": 1,
      "price": "₦2,000",
      "email": "customer@example.com",
      "status": "completed",
      "created_at": "2026-03-20T10:30:00Z"
    }
  ]
}
```

## Admin Dashboard

### Access

Navigate to `/admin` route

**Requirements:**
- Must be signed in
- User must have `is_admin = true` in database

### File Upload

**Process:**
1. Click "Upload File"
2. Select a `.txt` file
3. Choose category (Instagram, Facebook, TikTok, etc.)
4. Add optional description
5. Click "Upload File"

**File Format:**
Each line should contain account data (typically `email:password`):

```
user1@example.com:password123
user2@example.com:password456
user3@example.com:password789
```

**Storage:**
- Files are parsed and stored in `uploaded_accounts` table
- Each line becomes a separate record
- Status is set to "available"
- Upload metadata stored in `account_uploads` table

## API Routes

### Authentication Routes

```
POST   /api/auth/signup      - Create new user account
POST   /api/auth/signin      - User login
POST   /api/auth/signout     - User logout
```

### Logging Routes

```
POST   /api/logs/purchase    - Log a purchase transaction
GET    /api/logs/purchase    - Get recent purchase logs
```

### Admin Routes

```
POST   /api/admin/upload     - Upload account data (.txt file)
```

## Security Features

### Password Security
- Passwords hashed with bcrypt (10 salt rounds)
- Never stored or logged in plain text
- Constant-time comparison for verification

### Session Management
- HTTP-only cookies prevent XSS attacks
- Secure flag on HTTPS
- SameSite=Lax for CSRF protection
- 30-day expiration

### Database Security
- Parameterized queries prevent SQL injection
- Row-level security policies (optional, can be added)
- User ID association for all user-specific data

### Admin Access
- Admin-only routes require `is_admin = true`
- Session verification on all protected endpoints
- File uploads validated for `.txt` format

## Making Users Admin

To make a user an admin, update the database directly:

```sql
UPDATE users SET is_admin = true WHERE email = 'admin@example.com';
```

Or create a new admin account with a script.

## Environment Variables

Required for `.env.local`:

```env
# Database
DATABASE_URL=postgresql://...

# Optional
NODE_ENV=production
```

## Monitoring and Logs

### View Recent Purchases

```sql
SELECT * FROM purchase_logs ORDER BY created_at DESC LIMIT 50;
```

### View User Registrations

```sql
SELECT id, email, name, is_admin, created_at FROM users ORDER BY created_at DESC;
```

### View File Uploads

```sql
SELECT * FROM account_uploads ORDER BY created_at DESC;
```

### View Uploaded Accounts

```sql
SELECT * FROM uploaded_accounts WHERE upload_id = 1;
```

## Troubleshooting

### Database Connection Error

Check:
1. `DATABASE_URL` is set correctly
2. Neon project is active
3. IP whitelist allows your connection (if applicable)
4. Database exists and schema is initialized

### Upload Fails

Check:
1. User is logged in
2. User has admin access (`is_admin = true`)
3. File is valid `.txt` format
4. File size < 50MB

### Session Issues

Check:
1. Cookie is being set (check browser DevTools)
2. Cookie is not expired
3. Session exists in database
4. NODE_ENV is set correctly

## Future Enhancements

- [ ] OAuth integration (Google, GitHub)
- [ ] Email verification for new accounts
- [ ] Password reset functionality
- [ ] Rate limiting on login attempts
- [ ] Audit logging for admin actions
- [ ] Backup and restore functionality
- [ ] Account data encryption at rest
- [ ] API key authentication for programmatic access

## Support

For issues, check:
1. Database connection
2. Environment variables
3. API response status codes
4. Browser console for errors
5. Server logs in terminal

