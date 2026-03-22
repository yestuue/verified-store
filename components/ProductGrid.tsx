'use client';

import { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import { Loader2, Package, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface ProductGridProps {
  onProductSelect: (product: any) => void;
  // We accept products as a prop from page.tsx for better state management
  products: any[];
  loading: boolean;
}

export default function ProductGrid({ onProductSelect, products, loading }: ProductGridProps) {
  const [filter, setFilter] = useState<'all' | 'in-stock' | 'low-stock'>('all');

  // Filter logic based on live stock counts — guard against non-array prop
  const safeProducts = Array.isArray(products) ? products : [];
  const filteredProducts = safeProducts.filter(product => {
    const stockCount = parseInt(product.stock);
    if (filter === 'in-stock') return stockCount > 0;
    if (filter === 'low-stock') return stockCount > 0 && stockCount < 10;
    return true;
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
        <p className="text-slate-500 animate-pulse font-medium">Syncing Live Inventory...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* 🚀 Filter Navigation - Professional Look */}
      <div className="flex flex-wrap items-center gap-3 bg-slate-900/20 p-1.5 rounded-2xl border border-slate-800 w-fit">
        <button
          onClick={() => setFilter('all')}
          className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
            filter === 'all'
              ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          All Assets
        </button>
        <button
          onClick={() => setFilter('in-stock')}
          className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
            filter === 'in-stock'
              ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          Available
        </button>
        <button
          onClick={() => setFilter('low-stock')}
          className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
            filter === 'low-stock'
              ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          Limited Stock
        </button>
      </div>

      {/* 📦 The Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProducts.map((product) => {
          const isLowStock = parseInt(product.stock) < 10;
          
          return (
            <div key={product.category} className="relative group">
              {/* Live Stock Badge Overlay */}
              <div className="absolute top-5 right-5 z-20">
                <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-black tracking-widest uppercase backdrop-blur-md ${
                  isLowStock 
                    ? 'bg-orange-500/10 border-orange-500/30 text-orange-400' 
                    : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                }`}>
                  {isLowStock ? <AlertTriangle className="w-3 h-3" /> : <CheckCircle2 className="w-3 h-3" />}
                  {product.stock} Units Left
                </div>
              </div>

              {/* Individual Product Card */}
              <ProductCard
                product={{
                  ...product,
                  id: product.category, // using category as unique key
                  name: `${product.category} Premium Logs`,
                  price: `₦${Number(product.price).toLocaleString()}`,
                }}
                onAddToCart={() => onProductSelect(product)}
              />
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredProducts.length === 0 && (
        <div className="text-center py-24 bg-slate-900/20 border border-dashed border-slate-800 rounded-3xl">
          <Package className="w-12 h-12 text-slate-700 mx-auto mb-4" />
          <h3 className="text-white font-bold text-xl">Restocking Soon</h3>
          <p className="text-slate-500 mt-2">All items in this category have been sold out.</p>
        </div>
      )}
    </div>
  );
}