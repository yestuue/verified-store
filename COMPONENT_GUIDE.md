# Component Architecture Guide

## Component Hierarchy

```
page.tsx (Main Container)
│
├── Header
│   ├── Logo Section
│   ├── Navigation (Desktop)
│   ├── Search Bar
│   ├── Cart Button
│   └── Mobile Menu Toggle
│
├── Hero
│   ├── Background Gradient
│   ├── Headline
│   ├── Subheading
│   ├── CTA Buttons
│   └── Stats Grid (3 items)
│
├── CategoryNav
│   ├── Left Scroll Button
│   ├── Category Carousel
│   │   └── Category Items (10)
│   └── Right Scroll Button
│
├── ProductGrid (Social Logs Section)
│   ├── Section Title
│   ├── Filter Buttons (3)
│   └── Products Grid (Responsive)
│       └── ProductCard × 12
│           ├── Stock Indicator Badge
│           ├── Favorite Button
│           ├── Category Badge
│           ├── Product Title
│           ├── Description
│           ├── Tags
│           ├── Pricing
│           ├── Stock Progress Bar
│           └── Buy Now Button
│
├── CheckoutModal (Overlay)
│   ├── Close Button
│   ├── Product Summary
│   ├── Quantity Selector
│   ├── Pricing Breakdown
│   ├── Email Input
│   ├── Features Grid
│   ├── Checkout Button
│   └── Security Badge (or Success State)
│
└── Footer
    ├── Links Grid (4 columns)
    └── Copyright
```

## Component APIs

### Header
**Props:** None  
**State:** `isMenuOpen` (boolean)  
**Features:**
- Responsive navigation
- Mobile menu toggle
- Search input field
- Shopping cart indicator

```tsx
import Header from '@/components/Header';
<Header />
```

### Hero
**Props:** None  
**State:** None  
**Features:**
- Gradient background animation
- Three statistics
- Primary and secondary CTA buttons

```tsx
import Hero from '@/components/Hero';
<Hero />
```

### CategoryNav
**Props:** None  
**State:** `scrollPosition`, `selectedCategory`  
**Features:**
- Horizontal scrolling carousel
- Category selection
- Left/right navigation buttons

```tsx
import CategoryNav from '@/components/CategoryNav';
<CategoryNav />
```

### ProductGrid
**Props:**
- `onProductSelect` (function) - Callback when product is selected

**State:** 
- `favorites` (number[])
- `filter` ('all' | 'in-stock' | 'low-stock')

**Features:**
- Product listing (12 products)
- Filter by availability
- Favorites/wishlist toggle

```tsx
import ProductGrid from '@/components/ProductGrid';
<ProductGrid onProductSelect={(product) => handleAddToCart(product)} />
```

### ProductCard
**Props:**
- `product` (Product object)
- `isFavorite` (boolean)
- `onToggleFavorite` (function)
- `onAddToCart` (function)

**State:** None  
**Features:**
- Stock indicator with color coding
- Wishlist button
- Stock progress bar
- Price display
- Product metadata (tags, description)

```tsx
import ProductCard from '@/components/ProductCard';
<ProductCard 
  product={product}
  isFavorite={isFavorite}
  onToggleFavorite={toggleFavorite}
  onAddToCart={handleAddToCart}
/>
```

### CheckoutModal
**Props:**
- `isOpen` (boolean) - Modal visibility
- `onClose` (function) - Close handler
- `product` (Product | null) - Selected product

**State:**
- `quantity` (number)
- `email` (string)
- `isProcessing` (boolean)
- `orderComplete` (boolean)

**Features:**
- Quantity selector with stock limits
- Email validation
- Order summary
- Payment processing simulation
- Success confirmation

```tsx
import CheckoutModal from '@/components/CheckoutModal';
<CheckoutModal 
  isOpen={isCheckoutOpen}
  onClose={() => setIsCheckoutOpen(false)}
  product={selectedProduct}
/>
```

### StockIndicator
**Props:**
- `stock` (number) - Current stock quantity
- `size` ('sm' | 'md' | 'lg') - Optional badge size

**State:** None  
**Features:**
- Automatic status detection
- Color-coded messaging
- Size variants

```tsx
import StockIndicator from '@/components/StockIndicator';
<StockIndicator stock={42} size="md" />
```

## Data Structures

### Product Interface
```typescript
interface Product {
  id: number;
  name: string;
  category: string;
  price: string;           // e.g., "₦3,900"
  priceUSD: string;        // e.g., "$9.99"
  stock: number;           // e.g., 42
  description: string;
  tags: string[];          // e.g., ["USA", "Verified"]
}
```

### Category Interface
```typescript
interface Category {
  id: number;
  name: string;           // e.g., "Facebook"
  icon: string;           // e.g., "📘"
}
```

## Styling System

### Color Classes Used

**Primary Gradient:**
```tailwind
from-emerald-500 via-cyan-500 to-blue-400
```

**Stock Status Colors:**
- In Stock: `emerald-500`, `emerald-400`
- Low Stock: `yellow-500`, `yellow-300`
- Out of Stock: `red-500`, `red-300`

**Text Colors:**
- Primary: `text-white`
- Secondary: `text-slate-300`
- Tertiary: `text-slate-400`
- Muted: `text-slate-500`

**Background Colors:**
- Primary: `bg-slate-950`
- Secondary: `bg-slate-900`
- Tertiary: `bg-slate-800`
- Surface: `bg-slate-800/50`

### Responsive Classes

```tailwind
/* Mobile First */
text-lg sm:text-xl md:text-2xl lg:text-3xl

/* Grid Layouts */
grid-cols-1 md:grid-cols-2 lg:grid-cols-3

/* Spacing */
px-4 sm:px-6 lg:px-8
py-4 sm:py-6 lg:py-8

/* Display */
hidden md:flex
block md:hidden
```

## State Management Pattern

### Main Page State
```typescript
const [selectedProduct, setSelectedProduct] = useState(null);
const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

const handleAddToCart = (product) => {
  setSelectedProduct(product);
  setIsCheckoutOpen(true);
};
```

### Local Component State
- Header: `isMenuOpen`
- CategoryNav: `scrollPosition`, `selectedCategory`
- ProductGrid: `favorites`, `filter`
- CheckoutModal: `quantity`, `email`, `isProcessing`, `orderComplete`

## Event Flow Diagram

```
User clicks "Buy Now" on ProductCard
    ↓
ProductCard calls onAddToCart(product)
    ↓
page.tsx handleAddToCart() sets selectedProduct and isCheckoutOpen
    ↓
CheckoutModal appears with product details
    ↓
User adjusts quantity, enters email, clicks "Proceed to Payment"
    ↓
CheckoutModal simulates payment (1.5s delay)
    ↓
Success state shown (animated checkmark)
    ↓
Modal closes after 2s, state resets
```

## Customization Points

### Adding a New Product
Edit `ProductGrid.tsx`:
```typescript
const products = [
  // ... existing products
  {
    id: 13,
    name: 'New Product Name',
    category: 'Category',
    price: '₦X,XXX',
    priceUSD: '$XX.XX',
    stock: 50,
    description: 'Product description',
    tags: ['tag1', 'tag2'],
  },
];
```

### Adding a New Category
Edit `CategoryNav.tsx`:
```typescript
const categories = [
  // ... existing categories
  { id: 11, name: 'New Category', icon: '🎯' },
];
```

### Changing Colors
Option 1: Update Tailwind classes in components  
Option 2: Modify `tailwind.config.ts` to extend theme

```typescript
// tailwind.config.ts
theme: {
  extend: {
    colors: {
      primary: '#10b981',
      secondary: '#06b6d4',
    },
  },
}
```

### Adding New Features

**Add to Product Card:**
1. Add property to Product interface
2. Update ProductGrid sample data
3. Add display logic to ProductCard JSX
4. Update styling/layout

**Add to Checkout:**
1. Add state variable to CheckoutModal
2. Add form input or selector
3. Update pricing calculation if needed
4. Update review section

## Performance Considerations

### Component Optimization
- Use `useMemo` for expensive calculations
- Use `useCallback` for event handlers
- Lazy load images with Next.js Image component
- Code split with dynamic imports if needed

### Current Setup
- All components are lightweight
- State updates are efficient
- No unnecessary re-renders
- CSS transitions are GPU-accelerated

## Testing Suggestions

### Manual Testing Checklist
- [ ] Mobile responsiveness (test at 375px, 768px, 1024px)
- [ ] Product filtering (All, In Stock, Low Stock)
- [ ] Stock indicators (verify colors and states)
- [ ] Checkout flow (quantity selection, email input)
- [ ] Category navigation (scroll left/right)
- [ ] Favorites toggle (heart icon)
- [ ] Modal open/close
- [ ] Success confirmation animation
- [ ] Browser compatibility
- [ ] Keyboard navigation

### Automated Testing
Consider adding:
- Component unit tests with Jest
- Integration tests with React Testing Library
- E2E tests with Cypress or Playwright
- Visual regression tests

## Accessibility Features

**Implemented:**
- ✅ Semantic HTML elements
- ✅ Alt text ready for images
- ✅ ARIA labels on buttons
- ✅ Keyboard navigation
- ✅ Color contrast (WCAG AA)
- ✅ Focus states on interactive elements
- ✅ Tab order optimization

**To Improve:**
- Add aria-labels to icon buttons
- Add skip-to-main link
- Implement keyboard shortcuts
- Add screen reader optimizations
- Test with accessibility tools

## Production Checklist

- [ ] Environment variables configured
- [ ] API endpoints integrated
- [ ] Payment gateway connected
- [ ] Email service configured
- [ ] Error boundary added
- [ ] Loading states optimized
- [ ] Analytics integrated
- [ ] SEO metadata updated
- [ ] Performance optimized
- [ ] Security headers set
- [ ] HTTPS enabled
- [ ] CDN configured
- [ ] Monitoring enabled
- [ ] Backup strategy in place

---

**Quick Reference:** All components use 'use client' directive and are fully interactive with client-side state management.
