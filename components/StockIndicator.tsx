'use client';

interface StockIndicatorProps {
  stock: number;
  size?: 'sm' | 'md' | 'lg';
}

export default function StockIndicator({ stock, size = 'md' }: StockIndicatorProps) {
  const isOutOfStock = stock === 0;
  const isLowStock = stock > 0 && stock < 20;
  const isInStock = stock >= 20;

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  const statusConfig = isOutOfStock
    ? { label: '❌ Out of Stock', color: 'bg-red-500/20 text-red-300' }
    : isLowStock
    ? { label: `⚠️ ${stock} pcs Left`, color: 'bg-yellow-500/20 text-yellow-300' }
    : { label: `✅ ${stock} pcs Available`, color: 'bg-emerald-500/20 text-emerald-300' };

  return (
    <div className={`rounded-full font-semibold ${sizeClasses[size]} ${statusConfig.color}`}>
      {statusConfig.label}
    </div>
  );
}
