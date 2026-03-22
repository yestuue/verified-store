'use client';

import { ShoppingCart, Heart } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  category: string;
  price: string;
  priceUSD: string;
  stock: number;
  description: string;
  tags: string[];
}

interface ProductCardProps {
  product: Product;
  isFavorite: boolean;
  onToggleFavorite: (id: number) => void;
  onAddToCart: (product: Product) => void;
}

export default function ProductCard({
  product,
  isFavorite,
  onToggleFavorite,
  onAddToCart,
}: ProductCardProps) {
  const isOutOfStock = product.stock === 0;
  const isLowStock = product.stock > 0 && product.stock < 20;

  return (
    <div className="group relative bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700 rounded-xl overflow-hidden hover:border-emerald-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/10">
      {/* Stock Indicator Badge */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
        <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
          isOutOfStock
            ? 'bg-red-500/20 text-red-300'
            : isLowStock
            ? 'bg-yellow-500/20 text-yellow-300'
            : 'bg-emerald-500/20 text-emerald-300'
        }`}>
          {isOutOfStock 
            ? '❌ Out of Stock' 
            : isLowStock
            ? `⚠️ ${product.stock} pcs`
            : `✅ ${product.stock} pcs`}
        </div>

        <button
          onClick={() => onToggleFavorite(product.id)}
          className="p-2 bg-slate-800/80 hover:bg-slate-700 rounded-full transition"
        >
          <Heart
            className={`w-5 h-5 transition ${
              isFavorite
                ? 'fill-red-500 text-red-500'
                : 'text-slate-400 hover:text-red-400'
            }`}
          />
        </button>
      </div>

      {/* Product Image Area */}
      <div className="relative h-40 bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-r from-emerald-500/20 to-cyan-500/20"></div>
        
        {/* Category Badge */}
        <div className="absolute bottom-4 left-4 px-3 py-1 bg-emerald-500/20 border border-emerald-500/50 rounded-lg">
          <span className="text-xs font-semibold text-emerald-300">{product.category}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-1">
        {/* Title */}
        <h3 className="text-white font-semibold text-base mb-2 line-clamp-2 group-hover:text-emerald-400 transition">
          {product.name}
        </h3>

        {/* Description */}
        <p className="text-slate-400 text-sm mb-4 line-clamp-2">
          {product.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {product.tags.map((tag, idx) => (
            <span
              key={idx}
              className="text-xs px-2 py-1 bg-slate-700/50 text-slate-300 rounded"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Pricing */}
        <div className="flex items-baseline gap-2 mb-4">
          <span className="text-xl font-bold text-white">{product.price}</span>
          <span className="text-sm text-slate-400">({product.priceUSD})</span>
        </div>

        {/* Stock Status Bar */}
        <div className="mb-4">
          <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
            <div
              className={`h-full transition-all ${
                isOutOfStock
                  ? 'w-0 bg-red-500'
                  : isLowStock
                  ? `w-1/4 bg-yellow-500`
                  : 'w-full bg-emerald-500'
              }`}
            ></div>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={() => onAddToCart(product)}
          disabled={isOutOfStock}
          className={`w-full py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition transform hover:scale-105 ${
            isOutOfStock
              ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white hover:shadow-lg hover:shadow-emerald-500/50'
          }`}
        >
          <ShoppingCart className="w-4 h-4" />
          {isOutOfStock ? 'Out of Stock' : 'Buy Now'}
        </button>
      </div>

      {/* Out of Stock Overlay */}
      {isOutOfStock && (
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-xl">
          <span className="text-white font-bold text-lg">OUT OF STOCK</span>
        </div>
      )}
    </div>
  );
}
