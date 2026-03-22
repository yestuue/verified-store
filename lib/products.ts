/**
 * Product utilities and helper functions
 */

export interface Product {
  id: number;
  name: string;
  category: string;
  price: string;
  priceUSD: string;
  stock: number;
  description: string;
  tags: string[];
}

export type StockStatus = 'in-stock' | 'low-stock' | 'out-of-stock';

/**
 * Get stock status based on quantity
 */
export function getStockStatus(stock: number): StockStatus {
  if (stock === 0) return 'out-of-stock';
  if (stock < 20) return 'low-stock';
  return 'in-stock';
}

/**
 * Get stock status label
 */
export function getStockLabel(stock: number): string {
  if (stock === 0) return '❌ Out of Stock';
  if (stock < 20) return `⚠️ ${stock} pcs Left`;
  return `✅ ${stock} pcs Available`;
}

/**
 * Get stock status color classes
 */
export function getStockColorClass(stock: number): string {
  if (stock === 0) return 'bg-red-500/20 text-red-300';
  if (stock < 20) return 'bg-yellow-500/20 text-yellow-300';
  return 'bg-emerald-500/20 text-emerald-300';
}

/**
 * Get stock progress percentage (0-100)
 */
export function getStockProgress(stock: number, maxStock: number = 100): number {
  if (stock === 0) return 0;
  if (stock >= maxStock) return 100;
  return Math.round((stock / maxStock) * 100);
}

/**
 * Convert price string to numeric value
 */
export function extractPriceValue(priceString: string): number {
  const match = priceString.match(/[\d,]+/);
  if (!match) return 0;
  return parseInt(match[0].replace(/,/g, ''), 10);
}

/**
 * Calculate total price for quantity
 * Returns formatted string like "₦2,000"
 */
export function calculateTotalPrice(priceString: string, quantity: number): string {
  const value = extractPriceValue(priceString);
  const total = value * quantity;
  return `₦${total.toLocaleString()}`;
}

/**
 * Filter products by stock status
 */
export function filterByStockStatus(
  products: Product[],
  status: 'all' | 'in-stock' | 'low-stock'
): Product[] {
  switch (status) {
    case 'in-stock':
      return products.filter((p) => p.stock > 0);
    case 'low-stock':
      return products.filter((p) => p.stock > 0 && p.stock < 20);
    default:
      return products;
  }
}

/**
 * Search products by name or description
 */
export function searchProducts(products: Product[], query: string): Product[] {
  const lowerQuery = query.toLowerCase();
  return products.filter(
    (p) =>
      p.name.toLowerCase().includes(lowerQuery) ||
      p.description.toLowerCase().includes(lowerQuery) ||
      p.category.toLowerCase().includes(lowerQuery) ||
      p.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
  );
}

/**
 * Sort products by criteria
 */
export function sortProducts(
  products: Product[],
  sortBy: 'price-asc' | 'price-desc' | 'stock' | 'name'
): Product[] {
  const sorted = [...products];

  switch (sortBy) {
    case 'price-asc':
      return sorted.sort((a, b) => extractPriceValue(a.price) - extractPriceValue(b.price));
    case 'price-desc':
      return sorted.sort((a, b) => extractPriceValue(b.price) - extractPriceValue(a.price));
    case 'stock':
      return sorted.sort((a, b) => b.stock - a.stock);
    case 'name':
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    default:
      return sorted;
  }
}

/**
 * Group products by category
 */
export function groupByCategory(products: Product[]): Record<string, Product[]> {
  return products.reduce(
    (acc, product) => {
      if (!acc[product.category]) {
        acc[product.category] = [];
      }
      acc[product.category].push(product);
      return acc;
    },
    {} as Record<string, Product[]>
  );
}

/**
 * Check if product is available for purchase
 */
export function isProductAvailable(product: Product): boolean {
  return product.stock > 0;
}

/**
 * Validate email address
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Format currency
 */
export function formatCurrency(amount: number, currency: 'NGN' | 'USD' = 'NGN'): string {
  if (currency === 'NGN') {
    return `₦${amount.toLocaleString()}`;
  }
  return `$${amount.toFixed(2)}`;
}
