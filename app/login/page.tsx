'use client';

import { Suspense, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation'; // Added searchParams for better redirect handling
import { useAuth } from '@/components/providers/auth-provider';
import { LogIn, Mail, Lock, Loader2, Shield, ShoppingBag } from 'lucide-react';
import Link from 'next/link';

function destinationFor(isAdmin: boolean) {
  return isAdmin ? '/admin' : '/dashboard';
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-cyan-500 animate-spin" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, signIn, loading } = useAuth();

  // Get the redirect URL if it exists (e.g., from middleware)
  const callbackUrl = searchParams.get('callbackUrl');

  useEffect(() => {
    if (!loading && user) {
      // If we have a callbackUrl, go there. Otherwise, go to dashboard/admin.
      const target = callbackUrl || destinationFor(user.is_admin);
      router.replace(target);
    }
  }, [user, loading, router, callbackUrl]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const result = await signIn(email, password);

      if (result.error) {
        setError(result.error);
        setIsSubmitting(false);
        return;
      }

      // ── FIXED: Use window.location for a "Hard" redirect on Vercel ─────────
      // Sometimes router.push is too fast for the session cookie to settle.
      // A hard redirect ensures the new page sees the logged-in state.
      const target = callbackUrl || destinationFor(result.user.is_admin);
      window.location.href = target; 
      
    } catch (err) {
      console.error('Login error:', err);
      setError('An unexpected error occurred. Please try again.');
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-cyan-500 animate-spin" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <span className="text-white font-bold text-sm">VS</span>
            </div>
            <span className="text-white font-bold text-lg">Verified Store</span>
          </div>
        </div>

        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 backdrop-blur-sm shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white">Welcome Back</h1>
            <p className="text-slate-400 text-sm mt-1">Sign in to your account</p>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500/50 transition"
                  placeholder="you@example.com"
                  autoComplete="email"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500/50 transition"
                  placeholder="••••••••"
                  autoComplete="current-password"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-semibold py-3 rounded-xl hover:opacity-90 active:scale-95 transition disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 mt-2"
            >
              {isSubmitting
                ? <><Loader2 className="w-4 h-4 animate-spin" /> Signing in…</>
                : <><LogIn className="w-4 h-4" /> Sign In</>
              }
            </button>
          </form>

          {/* Demo credentials hint */}
          <div className="mt-6 p-4 bg-slate-800/40 border border-slate-700/50 rounded-xl space-y-2">
            <p className="text-slate-500 text-xs font-medium uppercase tracking-wider text-center mb-3">Demo Accounts</p>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <ShoppingBag className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="text-slate-500">User:</span>
              <span className="font-mono">user@verifiedstore.com</span>
              <span className="text-slate-600">·</span>
              <span className="font-mono">User@2026</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Shield className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="text-slate-500">Admin:</span>
              <span className="font-mono">admin@verifiedstore.com</span>
              <span className="text-slate-600">·</span>
              <span className="font-mono">Admin@2026</span>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-slate-500 text-sm">
              New customer?{' '}
              <Link href="/signup" className="text-cyan-400 hover:text-cyan-300 transition font-medium">
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}