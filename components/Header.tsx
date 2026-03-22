'use client';

import { Menu, X, LogIn, UserPlus, LayoutDashboard, Shield, LogOut } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/providers/auth-provider';

interface HeaderProps {
  onAuthClick?: (view: 'signin' | 'signup') => void;
  user?: any; // kept for backward-compat — we read from useAuth directly
}

export default function Header({ onAuthClick }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const router = useRouter();

  const dashboardHref = user?.is_admin ? '/admin' : '/dashboard';
  const dashboardLabel = user?.is_admin ? 'Admin Panel' : 'My Dashboard';
  const DashboardIcon  = user?.is_admin ? Shield : LayoutDashboard;

  return (
    <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">VS</span>
          </div>
          <div>
            <h1 className="text-white font-bold text-lg hidden sm:block">Verified Store</h1>
            <p className="text-xs text-slate-400">Premium Accounts</p>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <a href="#" className="text-slate-300 hover:text-white transition text-sm font-medium">Products</a>
          <a href="#" className="text-slate-300 hover:text-white transition text-sm font-medium">Categories</a>
          <a href="#" className="text-slate-300 hover:text-white transition text-sm font-medium">Help</a>
        </nav>

        {/* Trust Badges */}
        <div className="hidden lg:flex items-center gap-2">
          <div className="flex items-center gap-1 px-2 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded-full">
            <svg className="w-3 h-3 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span className="text-xs text-emerald-400">SSL Secure</span>
          </div>
          <div className="flex items-center gap-1 px-2 py-1 bg-cyan-500/10 border border-cyan-500/30 rounded-full">
            <svg className="w-3 h-3 text-cyan-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
              <path fillRule="evenodd" d="M4 5a2 2 0 012-2 1 1 0 000 2H3v10a2 2 0 002 2h10a2 2 0 002-2V5h-3a1 1 0 000-2 2 2 0 00-2-2H4zm3 4a1 1 0 112 0 1 1 0 01-2 0zm2 6a1 1 0 100-2 1 1 0 000 2zm4-3a1 1 0 112 0 1 1 0 01-2 0z" clipRule="evenodd" />
            </svg>
            <span className="text-xs text-cyan-400">Verified</span>
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-3">
          {user ? (
            /* ── Logged-in state ── */
            <div className="hidden sm:flex items-center gap-2">
              <button
                onClick={() => router.push(dashboardHref)}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-lg hover:opacity-90 transition font-medium text-sm"
              >
                <DashboardIcon className="w-4 h-4" />
                {dashboardLabel}
              </button>
              <button
                onClick={() => signOut()}
                className="flex items-center gap-2 px-3 py-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition text-sm"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden lg:block">Sign Out</span>
              </button>
            </div>
          ) : (
            /* ── Logged-out state ── */
            <div className="hidden sm:flex items-center gap-2">
              <button
                onClick={() => onAuthClick?.('signin')}
                className="flex items-center gap-2 px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition text-sm"
              >
                <LogIn className="w-4 h-4" />
                Sign In
              </button>
              <button
                onClick={() => onAuthClick?.('signup')}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-lg hover:opacity-90 transition font-medium text-sm"
              >
                <UserPlus className="w-4 h-4" />
                Sign Up
              </button>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 hover:bg-slate-800 rounded-lg transition"
          >
            {isMenuOpen ? (
              <X className="w-5 h-5 text-slate-300" />
            ) : (
              <Menu className="w-5 h-5 text-slate-300" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-slate-900/50 backdrop-blur">
          <div className="max-w-7xl mx-auto px-4 py-4 space-y-3">
            <a href="#" className="block text-slate-300 hover:text-white transition text-sm py-2">Products</a>
            <a href="#" className="block text-slate-300 hover:text-white transition text-sm py-2">Categories</a>
            <a href="#" className="block text-slate-300 hover:text-white transition text-sm py-2">Help</a>
            <div className="flex gap-2 pt-2 border-t border-slate-800">
              {user ? (
                <>
                  <button
                    onClick={() => { router.push(dashboardHref); setIsMenuOpen(false); }}
                    className="flex-1 px-3 py-2 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-lg transition font-medium text-sm"
                  >
                    {dashboardLabel}
                  </button>
                  <button
                    onClick={() => { signOut(); setIsMenuOpen(false); }}
                    className="flex-1 px-3 py-2 text-red-400 hover:bg-red-500/10 rounded-lg transition text-sm"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => { onAuthClick?.('signin'); setIsMenuOpen(false); }}
                    className="flex-1 px-3 py-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition text-sm"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => { onAuthClick?.('signup'); setIsMenuOpen(false); }}
                    className="flex-1 px-3 py-2 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-lg hover:opacity-90 transition font-medium text-sm"
                  >
                    Sign Up
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
