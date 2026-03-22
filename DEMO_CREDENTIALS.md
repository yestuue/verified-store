# VERIFIED STORE - DEMO LOGIN CREDENTIALS

## Quick Access

### Admin Dashboard
- **URL:** `http://localhost:3000/admin`
- **Email:** `admin@verifiedstore.com`
- **Password:** `Admin@2026`
- **Role:** Administrator with file upload access

### User Dashboard
- **URL:** `http://localhost:3000` (Browse products)
- **Email:** `user@verifiedstore.com`
- **Password:** `User@2026`
- **Role:** Regular user - can browse and checkout products

---

## Admin Dashboard Features

### Location: `/admin`

**Access Requirements:**
- Must be logged in with admin account
- Demo admin account created automatically

**Features Available:**
1. **File Upload (.txt)**
   - Upload account data files
   - Select category (Instagram, Facebook, TikTok, etc.)
   - Add optional descriptions
   - Real-time upload feedback

2. **Upload History**
   - View all uploaded files
   - See account counts per file
   - Track upload timestamps
   - Category organization

3. **Statistics**
   - Total uploads count
   - Total accounts imported
   - Last upload timestamp
   - Quick metrics display

4. **Account Categories Supported**
   - Instagram
   - Facebook
   - TikTok
   - Twitter
   - Discord
   - Snapchat
   - YouTube
   - Reddit
   - VPN
   - Email

5. **File Format**
   - Format: `.txt` files only
   - One account per line
   - Format: `username:password` or `email:password`
   - Example:
     ```
     user123:pass456
     test@example.com:testpass123
     john.doe:securepass
     ```

---

## User Dashboard Features

### Location: `/` (Home page)

**Access Features:**
1. **Browse Products**
   - 12 Premium accounts available
   - All prices in Nigerian Naira (₦)
   - Stock indicator (Green/Yellow/Red)
   - Product details and tags

2. **Product Categories**
   - Scrollable category navigation
   - Filter by social platform
   - View all or filter by availability

3. **Stock System**
   - Green badge: In Stock (≥20 items)
   - Yellow badge: Low Stock (1-19 items)
   - Red badge: Out of Stock (0 items)

4. **Checkout**
   - Select quantity
   - See real-time pricing in Naira
   - Email for delivery
   - Professional checkout modal

5. **Authentication**
   - Sign In / Sign Up buttons in header
   - Forgot Password option
   - Secure session management

---

## Testing Login Flow

### Step 1: Sign In as Admin
1. Open http://localhost:3000
2. Click "Sign In" button (top right)
3. Enter:
   - Email: `admin@verifiedstore.com`
   - Password: `Admin@2026`
4. Click "Sign In"
5. You'll be logged in - click "Sign In" button again to see your status
6. Navigate to `/admin` to access dashboard

### Step 2: Sign In as Regular User
1. Open http://localhost:3000
2. Click "Sign In" button
3. Enter:
   - Email: `user@verifiedstore.com`
   - Password: `User@2026`
4. Click "Sign In"
5. Browse products and test checkout

### Step 3: Create New Account
1. Click "Sign Up" in header
2. Enter:
   - Full Name: Your name
   - Email: Your email
   - Password: 6+ characters
   - Confirm Password: Match
3. Accept terms
4. Click "Sign Up"
5. New account created and logged in

### Step 4: Test Forgot Password
1. On Sign In form, click "Forgot Password?"
2. Enter email address
3. Verify code (demo: any code works)
4. Enter new password
5. Confirm new password
6. Password reset complete

---

## API Routes

### Authentication Endpoints

**POST /api/auth/signin**
```json
{
  "email": "admin@verifiedstore.com",
  "password": "Admin@2026"
}
```

**POST /api/auth/signup**
```json
{
  "email": "newuser@example.com",
  "password": "SecurePass123",
  "name": "New User"
}
```

**POST /api/auth/signout**
- No body required
- Clears session cookie

**GET /api/auth/session**
- Returns current logged-in user
- Returns null if not authenticated

**POST /api/admin/upload**
- Form data: file, category
- Admin only
- Returns account count from file

---

## Demo Account Details

| Field | Admin | User |
|-------|-------|------|
| Email | admin@verifiedstore.com | user@verifiedstore.com |
| Password | Admin@2026 | User@2026 |
| Name | Admin User | Demo User |
| Role | Administrator | Regular User |
| Access | All features | Browsing & checkout |
| Admin Panel | ✅ Yes | ❌ No |

---

## Session Management

- **Session Duration:** 30 days
- **Session Storage:** HTTP-only cookies (secure)
- **Auto Logout:** After 30 days of inactivity
- **Multi-tab Support:** Session shared across tabs
- **Manual Logout:** Click logout button

---

## Security Features

- HTTP-only session cookies
- Secure password transmission
- Admin role verification
- File upload validation
- .txt file format only
- Input validation on all forms
- CORS protection built-in

---

## Testing Checklist

### Authentication Tests
- [ ] Sign in with admin credentials
- [ ] Sign in with user credentials
- [ ] Sign up with new account
- [ ] Forgot password flow
- [ ] Logout functionality
- [ ] Session persistence

### Admin Tests
- [ ] Access /admin route
- [ ] Upload test .txt file
- [ ] View upload history
- [ ] Check statistics
- [ ] Test all categories
- [ ] Admin-only protection

### User Tests
- [ ] Browse products
- [ ] View product details
- [ ] Check stock status
- [ ] Test checkout modal
- [ ] Verify Naira pricing
- [ ] Trust badges display

### UI Tests
- [ ] Responsive design
- [ ] Dark theme consistency
- [ ] Trust badges visible
- [ ] Payment gateways displayed
- [ ] Footer copyright (© 2026)
- [ ] All icons render

---

## Troubleshooting

### Can't Login
- Check email spelling (case-insensitive)
- Verify password is exact (case-sensitive)
- Clear browser cookies
- Check console for errors

### Can't Access Admin
- Must login with admin account first
- Non-admin accounts cannot access /admin
- Check user role in session

### Upload Not Working
- File must be .txt format
- File cannot be empty
- One account per line required
- Select category before upload

### Session Expired
- Session lasts 30 days
- Clear cookies to reset
- Login again to refresh

---

## Environment Variables

Required for full functionality:
```
DATABASE_URL=postgresql://... (for Neon)
NODE_ENV=development
```

For demo mode (current):
- No environment variables required
- Uses in-memory demo accounts
- Sessions stored in cookies

---

## Next Steps

1. **Run the app:** `pnpm dev`
2. **Test login:** Use demo credentials above
3. **Explore features:** Try admin and user flows
4. **Setup database:** Connect Neon for persistence
5. **Deploy:** Use Vercel deployment

---

**All features are working and ready for testing!**
