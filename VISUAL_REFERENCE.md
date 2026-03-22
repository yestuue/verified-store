# Verified Store - Visual Reference Guide

## Complete UI Overview

### 1. HEADER SECTION

```
┌─────────────────────────────────────────────────────────────────────┐
│  [VS] Verified Store        Products  Categories  Help   🔍    🛒   │
│       Premium Accounts                                   Sign In Sign Up
└─────────────────────────────────────────────────────────────────────┘
```

**Components:**
- Logo box: Gradient background (emerald to cyan), "VS" text
- Brand name: "Verified Store" with tagline "Premium Accounts"
- Navigation: Products, Categories, Help
- Search bar: Dark slate background
- Cart icon: With notification dot
- Auth buttons: "Sign In" (text button), "Sign Up" (gradient CTA)

**Colors:**
- Background: Slate-950/95 with backdrop blur
- Text: White (headers), Slate-300 (links)
- Accent: Emerald-400 to Cyan-500 gradient
- Border: Slate-800

---

### 2. HERO SECTION

```
┌─────────────────────────────────────────────────────────────────────┐
│                                                                       │
│                    🔥 PREMIUM DIGITAL PRODUCTS                       │
│                                                                       │
│                  Digital Solutions Made Simple                       │
│                                                                       │
│          Access premium social media accounts, VPN services...       │
│                                                                       │
│               [Shop Now]          [Learn More]                       │
│                                                                       │
│    [🔒 SSL Secure]  [🏅 Money-Back Guarantee]                       │
│    [✓ Verified Seller]  [👥 10K+ Users]                             │
│                                                                       │
│    ┌──────────────────┬──────────────────┬──────────────────┐       │
│    │ 10K+             │ 50K+             │ 24/7             │       │
│    │ Products Listed  │ Happy Customers  │ Support          │       │
│    └──────────────────┴──────────────────┴──────────────────┘       │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
```

**Features:**
- Animated background elements (emerald/cyan blobs)
- Main headline with gradient text
- Subtitle and copy
- 2 CTA buttons
- Trust badges (4 items)
- Stats grid (3 columns)

**Colors:**
- Background: Slate-950 to Slate-900 gradient
- Headlines: White
- Text: Slate-400
- Accent text: Emerald-400, Cyan-400
- Badges: Emerald/Cyan with borders

---

### 3. CATEGORY CAROUSEL

```
┌─────────────────────────────────────────────────────────────────────┐
│  ◄  [Facebook]  [Instagram]  [TikTok]  [Twitter]  [YouTube]  [...]  ►│
└─────────────────────────────────────────────────────────────────────┘
```

**Features:**
- Scrollable horizontal carousel
- 10 categories visible
- Navigation arrows (left/right)
- Smooth scroll behavior
- Hover highlighting

---

### 4. PRODUCT GRID SECTION

```
┌─────────────────────────────────────────────────────────────────────┐
│                                                                       │
│  Social Logs                                                          │
│  Premium accounts and digital credentials                             │
│                                                                       │
│  Filter: [All]  [In Stock]  [Low Stock]                              │
│                                                                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐               │
│  │              │  │              │  │              │               │
│  │  Product 1   │  │  Product 2   │  │  Product 3   │               │
│  │              │  │              │  │              │               │
│  │ ✓ In Stock   │  │ ⚠ 5 pcs      │  │ ✗ Out Stock  │               │
│  │ $29.99       │  │ $39.99       │  │ $49.99       │               │
│  │ Add to Cart  │  │ Add to Cart  │  │ Add to Cart  │               │
│  └──────────────┘  └──────────────┘  └──────────────┘               │
│                                                                       │
│  [12 total products in 3-column grid on desktop]                    │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
```

**Features:**
- Section title and description
- Filter buttons (All, In Stock, Low Stock)
- Product cards (12 total)
- Stock indicator badges
- Price display
- Add to Cart button

**Stock Indicators:**
- ✅ Green "In Stock" (≥20 items)
- ⚠️ Yellow "Low Stock" (1-19 items)
- ❌ Red "Out of Stock" (0 items)

---

### 5. AUTHENTICATION MODAL

```
┌──────────────────────────────────────────────────────────────────┐
│  Verified Store                                           [×]    │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  SIGN IN                                                          │
│                                                                   │
│  Email Address                                                    │
│  ✉️ [____________________________]                                │
│                                                                   │
│  Password                                                         │
│  🔒 [____________________________] [👁️]                           │
│                                                                   │
│  [Forgot password?]                                               │
│                                                                   │
│  [Sign In Button - Gradient]                                     │
│                                                                   │
│  Don't have account? [Sign up]                                   │
│                                                                   │
├──────────────────────────────────────────────────────────────────┤
│  🔒 SSL Secure • ✓ Verified                                      │
└──────────────────────────────────────────────────────────────────┘
```

**Features:**
- Modal overlay with backdrop blur
- Close button (×)
- Form switching (Sign In/Up/Forgot Password)
- Icon-prefixed inputs
- Error messages (red)
- Loading states
- Success confirmations
- Security footer

**Form Variants:**
1. **Sign In**: Email, Password
2. **Sign Up**: Name, Email, Password, Confirm Password
3. **Forgot Password**: 3-step (Email → Code → Reset)

---

### 6. CHECKOUT MODAL

```
┌──────────────────────────────────────────────────────────────────┐
│  Complete Your Purchase                               [×]         │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  Order Summary                                                    │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ [Product Image]  Facebook Account (High Followers)     │    │
│  │                  Price: $29.99                          │    │
│  │                  Stock: 157 Available                   │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                   │
│  Email Address                                                    │
│  [____________________________]                                  │
│                                                                   │
│  Quantity                                                         │
│  [−] [1] [+]  (max: 157)                                        │
│                                                                   │
│  ┌─ Pricing ──────────────────────────────────────────┐         │
│  │ Subtotal: $29.99                                   │         │
│  │ Service Fee: $2.00                                 │         │
│  │ Total: $31.99                                      │         │
│  └────────────────────────────────────────────────────┘         │
│                                                                   │
│  [Complete Purchase - Gradient Button]                          │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

**Features:**
- Product summary card
- Email input
- Quantity selector (min: 1, max: stock)
- Price breakdown
- Pricing details
- Complete button
- Success screen

---

### 7. FOOTER SECTION

```
┌─────────────────────────────────────────────────────────────────────┐
│                                                                       │
│  TRUSTED BY THOUSANDS                                                │
│  [🔒 SSL Secure]  [🏆 Money-Back]  [✓ Verified Seller]  [👥 10K+] │
│                                                                       │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  SECURE PAYMENT METHODS                                              │
│                                                                       │
│  ┌────────┐  ┌────────┐  ┌────────┐  ┌────────┐  ┌────────┐        │
│  │Stripe  │  │ PayPal │  │  Visa  │  │Master  │  │ Google │        │
│  └────────┘  └────────┘  └────────┘  └────────┘  └────────┘        │
│  ┌────────┐  ┌────────┐                                             │
│  │ Apple  │  │ Crypto │                                             │
│  └────────┘  └────────┘                                             │
│                                                                       │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  Verified Store           │  Categories        │  Products          │
│  Premium digital products │  - Facebook        │  - Social Accts    │
│  with verified sellers... │  - Instagram       │  - VPN Services    │
│                           │  - TikTok          │  - Email Tools     │
│                           │  - Twitter         │  - Premium Tools   │
│                           │                    │                    │
│  Support                                                             │
│  - Help Center                                                       │
│  - Contact Support                                                   │
│  - Privacy Policy                                                    │
│  - Terms of Service                                                  │
│                                                                       │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  [Facebook] [Twitter] [Instagram] [Email]                            │
│                                                                       │
│  © 2024 Verified Store. All rights reserved.                         │
│  Secure • Verified • Trusted                                         │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
```

**Features:**
- Trust badges section (4 badges)
- Payment methods grid (7 colorized cards)
- 4-column links grid
- Social media links
- Copyright and tagline
- Hover effects on payment cards

**Payment Gateway Colors:**
```
Stripe:     🔵 Blue gradient
PayPal:     🔵 Dark blue
Visa:       🟣 Indigo
Mastercard: 🔴 Red-orange
Google Pay: 🔵 Multi-color
Apple Pay:  ⚫ Dark slate
Crypto:     🟡 Yellow
```

---

## Component Visual States

### Button States

```
┌─────────────────────┐
│ [Normal Button]     │  Gray text on transparent
├─────────────────────┤
│ [Hover State]       │  Text changes to white, bg-slate-800
├─────────────────────┤
│ [Active/Focused]    │  Border highlight, brighter
├─────────────────────┤
│ [Disabled]          │  Opacity reduced, not clickable
└─────────────────────┘

┌─────────────────────────┐
│ [CTA Button]            │  Gradient bg emerald→cyan
├─────────────────────────┤
│ [CTA Hover]             │  Darker gradient, shadow glow
├─────────────────────────┤
│ [CTA Loading]           │  Opacity 50%, text changes
├─────────────────────────┤
│ [CTA Disabled]          │  Opacity 50%, not clickable
└─────────────────────────┘
```

### Input States

```
┌─────────────────────────┐
│ 📧 [Empty State]        │  Border: Slate-700
├─────────────────────────┤
│ 📧 [Focus State]        │  Border: Emerald-500, glow
├─────────────────────────┤
│ 📧 [Filled State]       │  Border: Slate-700, content shown
├─────────────────────────┤
│ ⚠️ [Error State]        │  Border: Red-500, error msg below
└─────────────────────────┘
```

### Badge States

```
✅ IN STOCK           ⚠️ LOW STOCK (5 pcs)    ❌ OUT OF STOCK
Green background      Yellow background      Red background
Emerald accent        Orange accent          Red accent
Button enabled        Button enabled         Button disabled
```

---

## Responsive Breakpoints

### Mobile (< 640px)
```
┌────────────────────┐
│ Header             │  Stack vertically
│ Hero               │  Full width
│ Categories         │  Horizontal scroll
│ Products (1 col)   │  Single column grid
│ Footer             │  Single column
└────────────────────┘
```

### Tablet (640px - 1024px)
```
┌────────────────────────┐
│ Header (normal)        │
│ Hero                   │
│ Categories             │  2 column grid
│ Products (2 cols)      │
│ Footer (2 columns)     │
└────────────────────────┘
```

### Desktop (> 1024px)
```
┌──────────────────────────────┐
│ Header (full featured)       │
│ Hero (with sidebars)         │
│ Categories (scrollable)      │
│ Products (3-4 columns)       │
│ Footer (4 columns)           │
└──────────────────────────────┘
```

---

## Color Palette Visual

```
PRIMARY COLORS
┌─────────────────────────┐
│ Emerald-400             │  #10b981 - Buttons, badges
│ Cyan-400                │  #06b6d4 - Accents
└─────────────────────────┘

BACKGROUND COLORS
┌─────────────────────────┐
│ Slate-950               │  #030712 - Main bg
│ Slate-900               │  #0f172a - Secondary bg
│ Slate-800               │  #1e293b - Input, hover
└─────────────────────────┘

TEXT COLORS
┌─────────────────────────┐
│ White                   │  #ffffff - Headlines
│ Slate-300               │  #cbd5e1 - Secondary text
│ Slate-400               │  #94a3b8 - Tertiary text
│ Slate-500               │  #64748b - Disabled text
└─────────────────────────┘

ACCENT COLORS
┌─────────────────────────┐
│ Red-500                 │  #ef4444 - Errors
│ Yellow-400              │  #facc15 - Warnings
│ Blue-400                │  #60a5fa - Info
└─────────────────────────┘
```

---

## Icon Usage

### Location Icons
```
Header Search:      🔍
Header Cart:        🛒 with dot notification
Auth Modal:         🔒, ✉️, 👤, 👁️/👁️‍🗨️
Forms:              ✉️, 🔒, 👤
Trust Badges:       🔒, 🏆, ✓, 👥
Footer Social:      📘, 𝕏, 📷, ✉️
```

### Stock Indicators
```
In Stock:           ✅ Green
Low Stock:          ⚠️ Orange/Yellow
Out of Stock:       ❌ Red
```

---

## Animation & Transitions

```
1. MODAL ANIMATIONS
   Open:   Fade in + zoom in (200ms, ease-out)
   Close:  Fade out + zoom out (200ms, ease-in)

2. BUTTON ANIMATIONS
   Hover:  Scale 1.05 + shadow glow
   Click:  Scale 0.95
   Loading: Opacity pulse

3. INPUT ANIMATIONS
   Focus:  Border color transition (300ms)
   Error:  Shake animation (100ms)

4. PAGE TRANSITIONS
   Scroll: Smooth (300ms)
   Fade:   Opacity transition (200ms)

5. CARD ANIMATIONS
   Hover:  Lift effect + shadow increase
   Tap:    Scale down then back

6. PAYMENT CARDS
   Hover:  Scale 1.05 + opacity increase tooltip
```

---

## Accessibility Features

```
KEYBOARD NAVIGATION
├─ Tab: Navigate through buttons
├─ Enter: Activate buttons
├─ Escape: Close modals
└─ Arrow keys: Navigate carousel

SCREEN READER
├─ Semantic HTML headings
├─ ARIA labels on buttons
├─ Form labels associated
├─ Error messages announced
└─ Live regions for modals

VISUAL
├─ 4.5:1 contrast ratio (WCAG AA)
├─ Focus indicators (ring)
├─ Color not only indicator
├─ Icon + text labels
└─ Resizable text support
```

---

## Mobile Optimizations

```
TOUCH TARGETS
├─ Minimum 44px × 44px
├─ Adequate spacing between buttons
├─ Easy-to-tap form inputs
└─ Large touch-friendly carousel

LAYOUT
├─ Full-width on mobile
├─ Stack elements vertically
├─ Hamburger menu for nav
├─ Bottom sheet for modals
└─ Scrollable sections

PERFORMANCE
├─ Optimized images
├─ Minimal animations on mobile
├─ Lazy loading for modals
└─ Touch-optimized scrolling
```

---

**Visual design optimized for clarity, accessibility, and user engagement**
