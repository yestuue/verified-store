# Authentication System Guide

## Overview

The Verified Store now includes a complete authentication system with Sign In, Sign Up, and Forgot Password functionality. All authentication forms are accessible through the AuthModal component.

## Components

### 1. AuthModal (`components/auth/AuthModal.tsx`)

The main authentication modal that manages the authentication flow. It handles three views:
- **Sign In** - User login
- **Sign Up** - New account creation
- **Forgot Password** - Password reset flow

**Props:**
```typescript
interface AuthModalProps {
  isOpen: boolean;
  initialView?: 'signin' | 'signup' | 'forgot-password';
  onClose: () => void;
}
```

**Usage:**
```tsx
<AuthModal 
  isOpen={isAuthOpen}
  onClose={() => setIsAuthOpen(false)}
  initialView="signin"
/>
```

### 2. SignInForm (`components/auth/SignInForm.tsx`)

Handles user authentication with email and password validation.

**Features:**
- Email validation
- Password visibility toggle
- Forgot password link
- Switch to Sign Up option
- Error handling
- Loading state with spinner
- Success feedback

**Validation:**
- Email must be valid format
- Password minimum 6 characters
- Both fields required

### 3. SignUpForm (`components/auth/SignUpForm.tsx`)

Creates new user accounts with comprehensive validation.

**Features:**
- Full name, email, password fields
- Password confirmation matching
- Terms & conditions checkbox
- Password visibility toggles
- Error handling
- Loading state
- Success feedback with animation

**Validation:**
- Full name required (non-empty)
- Email must be valid format
- Password minimum 8 characters
- Password and confirm password must match
- Must agree to terms and conditions

### 4. ForgotPasswordForm (`components/auth/ForgotPasswordForm.tsx`)

Initiates password reset flow.

**Features:**
- Email input with validation
- Reset link confirmation screen
- Back to Sign In option
- Try another email option
- 24-hour link expiry message

**Validation:**
- Email must be valid format
- Email required

## Integration

### 1. Header Integration

The Header component accepts an `onAuthClick` callback:

```tsx
<Header onAuthClick={(view) => {
  setAuthView(view);
  setIsAuthOpen(true);
}} />
```

This allows users to click Sign In or Sign Up buttons to open the auth modal.

### 2. Main Page Integration

In `app/page.tsx`:

```tsx
const [isAuthOpen, setIsAuthOpen] = useState(false);
const [authView, setAuthView] = useState<'signin' | 'signup'>('signin');

const handleAuthClick = (view: 'signin' | 'signup') => {
  setAuthView(view);
  setIsAuthOpen(true);
};

return (
  <main>
    <Header onAuthClick={handleAuthClick} />
    <AuthModal 
      isOpen={isAuthOpen}
      onClose={() => setIsAuthOpen(false)}
      initialView={authView}
    />
  </main>
);
```

## Features

### Form Validation

All forms include real-time client-side validation:

**Sign In:**
- Email format validation (RFC 5322 basic)
- Password minimum length check
- Required field validation

**Sign Up:**
- Full name non-empty check
- Email format validation
- Password minimum length (8 chars)
- Password confirmation matching
- Terms agreement requirement

**Forgot Password:**
- Email format validation
- Required field validation

### User Feedback

- Error messages for validation failures
- Success confirmations on form submission
- Loading spinners during processing
- Animated success states
- Email confirmation screen for password reset

### Navigation

Users can easily navigate between auth flows:
- Sign In → Sign Up (link at bottom)
- Sign In → Forgot Password (link above button)
- Forgot Password → Sign In (back button)
- Sign Up → Sign In (link at bottom)

## Styling

All authentication components use:
- Dark theme (slate-950 background)
- Emerald and cyan gradients
- Consistent spacing and typography
- Responsive design for mobile and desktop
- Hover effects and transitions
- Proper focus states for accessibility

## API Integration (Future)

Currently, forms simulate API calls with 1.5-second delays. To integrate with a real backend:

1. In `SignInForm.tsx`, replace the setTimeout in `handleSubmit`:
```tsx
const response = await fetch('/api/auth/signin', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
});
```

2. Similar pattern for `SignUpForm.tsx` and `ForgotPasswordForm.tsx`
3. Create API routes in `app/api/auth/` folder

## Security Notes

**Current Implementation:**
- Client-side validation only (for demo)
- Passwords shown in console (remove before production)
- No actual authentication (simulated)

**Production Recommendations:**
- Always validate on server-side
- Never store passwords in plain text
- Use HTTPS for all auth endpoints
- Implement rate limiting
- Add CSRF protection
- Use secure HTTP-only cookies for sessions
- Consider OAuth2/OpenID Connect
- Implement MFA for enhanced security

## Testing

To test the authentication flow:

1. **Sign In:**
   - Enter any email format: `test@example.com`
   - Enter password 6+ characters
   - Click "Sign In"
   - Should show success message

2. **Sign Up:**
   - Enter full name
   - Enter email address
   - Enter password 8+ characters
   - Confirm password
   - Check terms checkbox
   - Click "Sign Up"
   - Should show success message

3. **Forgot Password:**
   - Click "Forgot password?" on Sign In form
   - Enter email address
   - Click "Send Reset Link"
   - Should show confirmation screen
   - Click "Back to Sign In" to return

## Customization

### Changing Colors

Edit color classes in each form component:
```tsx
// Change from emerald to cyan
className="focus:border-emerald-500"  // Change to focus:border-cyan-500
className="from-emerald-500 to-cyan-500"  // Change primary colors
```

### Updating Validation Rules

Modify validation in `handleSubmit`:
```tsx
if (email.length < 10) {
  setError('Email too short');
  return;
}
```

### Adding Fields

Add new state and form fields:
```tsx
const [phone, setPhone] = useState('');
// Add phone input element
// Add phone validation
```

## Troubleshooting

**Issue:** Auth modal doesn't open
- Check that `isAuthOpen` state is being set correctly
- Verify `onAuthClick` callback is connected to Header buttons

**Issue:** Form submission doesn't work
- Check browser console for JavaScript errors
- Verify all required fields are filled
- Check that validation logic is not blocking submission

**Issue:** Password visibility toggle not working
- Ensure Eye/EyeOff icons from lucide-react are imported
- Check that `showPassword` state is updating correctly

## Next Steps

1. **Backend Integration:** Connect forms to API endpoints
2. **Session Management:** Implement persistent user sessions
3. **Email Verification:** Add email confirmation step
4. **Password Reset:** Implement actual password reset via email
5. **Social Auth:** Add Google/GitHub OAuth options
6. **Two-Factor Auth:** Implement MFA
7. **Profile Management:** Add user profile editing
8. **Password Requirements:** Implement password strength meter

## File Structure

```
components/
├── auth/
│   ├── AuthModal.tsx          # Main modal controller
│   ├── SignInForm.tsx         # Login form
│   ├── SignUpForm.tsx         # Registration form
│   └── ForgotPasswordForm.tsx  # Password reset initiation
├── Header.tsx                 # Navigation with auth triggers
└── Footer.tsx                 # Footer with trust badges

app/
└── page.tsx                   # Main page with auth state
```

## License

All authentication components are part of the Verified Store project and are provided as-is.
