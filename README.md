# Young PG Media - Digital Products Marketplace

A high-fidelity Next.js and Tailwind CSS frontend for a premium digital products marketplace, featuring social media accounts, VPN services, and digital tools.

## Features

### 🎨 Design
- **Dark Mode Premium UI**: Modern dark theme with emerald and cyan accents
- **Responsive Layout**: Mobile-first design that works seamlessly across all devices
- **Smooth Animations**: Gradient backgrounds, hover effects, and transitions throughout

### 📦 Core Features
1. **Landing Page**
   - Compelling hero section with gradient text
   - Statistics showcase (10K+ products, 50K+ customers, 24/7 support)
   - Call-to-action buttons

2. **Product Grid for 'Social Logs'**
   - Responsive grid layout (1 column mobile, 2 MD, 3 LG)
   - 12 featured products with detailed information
   - Filter by availability (All, In Stock, Low Stock)
   - Product tags and categories

3. **Stock Indicator System**
   - **✅ In Stock**: Green indicator when stock ≥ 20 units
   - **⚠️ Low Stock**: Yellow indicator when 0 < stock < 20 units  
   - **❌ Out of Stock**: Red indicator and disabled purchase when stock = 0
   - Stock availability bar with visual progress indicator

4. **Category Navigation**
   - Scrollable category carousel (10+ categories)
   - Categories: Facebook, Instagram, TikTok, Twitter, YouTube, Discord, Reddit, Snapchat, VPN, Email
   - Visual feedback for selected category
   - Smooth horizontal scrolling on mobile

5. **Product Card Component**
   - Favorite/wishlist toggle
   - Stock status display
   - Price in local and USD currency
   - Product description and tags
   - Hover animations with gradient overlay

6. **Checkout Modal**
   - Product summary with stock verification
   - Quantity selector
   - Email input for delivery
   - Pricing breakdown with fees and delivery info
   - Order completion confirmation
   - Security badges (Stripe & PayPal)
   - Loading state during payment processing

### 🔧 Reusable Components
- `Header` - Sticky navigation with logo, search, and cart
- `Hero` - Hero section with statistics
- `CategoryNav` - Scrollable category navigation
- `ProductGrid` - Main product listing with filters
- `ProductCard` - Individual product display
- `CheckoutModal` - Purchase flow and confirmation
- `StockIndicator` - Reusable stock status badge

## Tech Stack

- **Framework**: Next.js 16+ (App Router)
- **UI Framework**: React 19.2
- **Styling**: Tailwind CSS 4.2
- **Icons**: Lucide React
- **Package Manager**: pnpm
- **Language**: TypeScript

## Project Structure

```
/vercel/share/v0-project/
├── app/
│   ├── layout.tsx          # Root layout with metadata
│   ├── page.tsx            # Main landing page
│   └── globals.css         # Global styles and utilities
├── components/
│   ├── Header.tsx          # Navigation header
│   ├── Hero.tsx            # Hero section
│   ├── CategoryNav.tsx      # Category navigation
│   ├── ProductGrid.tsx      # Product grid with filters
│   ├── ProductCard.tsx      # Individual product card
│   ├── CheckoutModal.tsx    # Checkout flow
│   └── StockIndicator.tsx   # Stock status indicator
├── tailwind.config.ts      # Tailwind configuration
└── next.config.mjs         # Next.js configuration
```

## Color Palette

- **Background**: Slate-950 (#020617)
- **Surface**: Slate-900 (#0f172a) to Slate-800 (#1e293b)
- **Primary Accent**: Emerald (#10b981)
- **Secondary Accent**: Cyan (#06b6d4)
- **Text**: White / Slate-400
- **Status Colors**: 
  - Success: Emerald-400
  - Warning: Yellow-400
  - Error: Red-500

## Features in Detail

### Stock Management
Each product displays real-time stock availability:
- Products with 0 units show "Out of Stock" with disabled purchase button
- Products with 1-19 units show warning indicator with quantity
- Products with 20+ units show "In Stock" with full availability

### Responsive Design
- **Mobile**: Single column layout, hamburger menu, scrollable categories
- **Tablet**: 2-column product grid, visible navigation
- **Desktop**: 3-column product grid, full category showcase

### Interactive Elements
- Sticky header with search and shopping cart
- Smooth category carousel with navigation buttons
- Product card hover effects with gradient overlay
- Modal checkout with quantity controls
- Loading states and success confirmations

## Getting Started

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start
```

Visit `http://localhost:3000` to see the application.

## Customization

### Updating Products
Edit the `products` array in `/components/ProductGrid.tsx` to add or modify products.

### Changing Colors
Update the color values in `/tailwind.config.ts` and the Tailwind classes in components.

### Adding Categories
Modify the `categories` array in `/components/CategoryNav.tsx`.

### Checkout Integration
Replace the mock checkout flow in `CheckoutModal.tsx` with your payment provider (Stripe, PayPal, etc.).

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance Optimizations

- Client-side state management with React hooks
- Efficient CSS with Tailwind's utility-first approach
- Smooth animations with CSS transitions
- No unnecessary re-renders with proper component structure
- Images lazy loaded where applicable

## License

MIT - Feel free to use this project for commercial purposes.
