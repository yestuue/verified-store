'use client';

import { useState, useEffect, Suspense } from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import CategoryNav from '@/components/CategoryNav';
import ProductGrid from '@/components/ProductGrid';
import CheckoutModal from '@/components/CheckoutModal';
import AuthModal from '@/components/AuthModal';
import Footer from '@/components/Footer';
import { useAuth } from '@/components/providers/auth-provider';

export default function Home() {
  const { user, loading: authLoading } = useAuth();
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authView, setAuthView] = useState<'signin' | 'signup'>('signin');
  const [products, setProducts] = useState<any[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);

  // 1. Fetch Live Inventory for the Marketplace
  useEffect(() => {
    async function fetchLiveStock() {
      try {
        const res = await fetch('/api/products');
        const data = await res.json();
        // Guard: API may return an error object if DB is unreachable
        setProducts(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch inventory");
        setProducts([]);
      } finally {
        setIsLoadingProducts(false);
      }
    }
    fetchLiveStock();
  }, []);

  const handleAddToCart = (product: any) => {
    if (!user) {
      setAuthView('signin');
      setIsAuthOpen(true);
      return;
    }
    setSelectedProduct(product);
    setIsCheckoutOpen(true);
  };

  const handleAuthClick = (view: 'signin' | 'signup') => {
    setAuthView(view);
    setIsAuthOpen(true);
  };

  return (
    <main className="min-h-screen bg-slate-950">
      <Suspense fallback={null}>
        <Header onAuthClick={handleAuthClick} user={user} />
        <Hero
          user={user}
          onLoginClick={() => handleAuthClick('signin')}
          onShopNow={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
        />
        
        {/* Real-time Category Navigation */}
        <CategoryNav items={['All', 'Instagram', 'Facebook', 'TikTok', 'VPN']} />
        
        <section id="products" className="relative z-10 px-4 sm:px-6 lg:px-8 py-16 max-w-7xl mx-auto">
          <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-emerald-500 text-xs font-bold uppercase tracking-widest">Live Inventory</span>
              </div>
              <h2 className="text-4xl font-bold text-white tracking-tight">Available Logs</h2>
              <p className="text-slate-400 mt-2 text-lg">Premium accounts delivered instantly after payment.</p>
            </div>
          </div>

          {/* 2. Passing the LIVE products to the Grid */}
          <ProductGrid 
            products={products} 
            loading={isLoadingProducts} 
            onProductSelect={handleAddToCart} 
          />
        </section>

        {/* 3. The Paystack-Integrated Checkout */}
        <CheckoutModal 
          isOpen={isCheckoutOpen} 
          onClose={() => setIsCheckoutOpen(false)} 
          product={selectedProduct}
          userEmail={user?.email}
        />

        <AuthModal 
          isOpen={isAuthOpen}
          onClose={() => setIsAuthOpen(false)}
          initialView={authView}
        />

        <Footer />
      </Suspense>
    </main>
  );
}