'use client';

import { useRouter } from 'next/navigation';
import TrustBadges from './TrustBadges';
import { LayoutDashboard, Shield, ShoppingBag, ArrowRight } from 'lucide-react';

interface HeroProps {
  user?: { is_admin: boolean; name?: string; email?: string } | null;
  onShopNow?: () => void;
  onLoginClick?: () => void;
}

export default function Hero({ user, onShopNow, onLoginClick }: HeroProps) {
  const router = useRouter();

  const scrollToProducts = () => {
    if (onShopNow) { onShopNow(); return; }
    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative overflow-hidden pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="text-center">
          <div className="inline-block mb-6 px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-full">
            <span className="text-emerald-400 text-sm font-semibold">🔥 Premium Digital Products</span>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Digital Solutions <br />
            <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Made Simple
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-400 mb-8 max-w-2xl mx-auto">
            Access premium social media accounts, VPN services, and digital tools.
            Fast delivery, secure transactions, and 24/7 support.
          </p>

          {/* ── CTA buttons — change based on auth state ── */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            {user ? (
              // Logged-in state: show role-appropriate dashboard button
              <>
                <button
                  onClick={() => router.push(user.is_admin ? '/admin' : '/dashboard')}
                  className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-semibold rounded-xl hover:opacity-90 hover:shadow-lg hover:shadow-emerald-500/30 active:scale-95 transition"
                >
                  {user.is_admin
                    ? <><Shield className="w-4 h-4" /> Go to Admin Panel</>
                    : <><LayoutDashboard className="w-4 h-4" /> Go to My Dashboard</>
                  }
                </button>
                <button
                  onClick={scrollToProducts}
                  className="flex items-center gap-2 px-8 py-3 border border-slate-600 text-white font-semibold rounded-xl hover:border-slate-400 hover:bg-slate-800/50 transition"
                >
                  <ShoppingBag className="w-4 h-4" /> Browse Products
                </button>
              </>
            ) : (
              // Guest state: original Shop Now + Login
              <>
                <button
                  onClick={scrollToProducts}
                  className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-emerald-500/30 hover:scale-105 active:scale-95 transition"
                >
                  Shop Now <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={onLoginClick}
                  className="px-8 py-3 border border-slate-600 text-white font-semibold rounded-xl hover:border-slate-400 hover:bg-slate-800/50 transition"
                >
                  Sign In
                </button>
              </>
            )}
          </div>

          {/* Trust Badges */}
          <div className="mb-12">
            <TrustBadges />
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
            <div className="p-4 rounded-xl border border-slate-700 bg-slate-800/30 backdrop-blur">
              <div className="text-3xl font-bold text-emerald-400">10K+</div>
              <p className="text-slate-400 text-sm">Products Listed</p>
            </div>
            <div className="p-4 rounded-xl border border-slate-700 bg-slate-800/30 backdrop-blur">
              <div className="text-3xl font-bold text-cyan-400">50K+</div>
              <p className="text-slate-400 text-sm">Happy Customers</p>
            </div>
            <div className="p-4 rounded-xl border border-slate-700 bg-slate-800/30 backdrop-blur">
              <div className="text-3xl font-bold text-blue-400">24/7</div>
              <p className="text-slate-400 text-sm">Customer Support</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
