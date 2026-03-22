'use client';

import { Suspense, useState, useEffect, useCallback } from 'react';
import {
  ShoppingBag, LogOut, Loader2, Clock,
  CheckCircle, Package, Eye, EyeOff, Copy, Check,
  ChevronRight, Zap, ShieldCheck, Home, AlertTriangle
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/providers/auth-provider';

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
      </div>
    }>
      <UserDashboard />
    </Suspense>
  );
}

function UserDashboard() {
  const router = useRouter();
  const { user, loading, signOut } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [visibleCredentials, setVisibleCredentials] = useState<Set<number>>(new Set());
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [reportingId, setReportingId] = useState<number | null>(null);
  const [reportedIds, setReportedIds] = useState<Set<number>>(new Set());

  // Guard: only logged-in non-admin users (admins go to /admin)
  useEffect(() => {
    if (!loading) {
      if (!user) router.push('/login');
      else if (user.is_admin) router.push('/admin');
    }
  }, [user, loading, router]);

  const fetchOrders = useCallback(async () => {
    setOrdersLoading(true);
    try {
      const res = await fetch('/api/user/orders');
      if (res.ok) {
        const data = await res.json();
        setOrders(Array.isArray(data) ? data : []);
      }
    } catch {
      setOrders([]);
    } finally {
      setOrdersLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user && !user.is_admin) fetchOrders();
  }, [user, fetchOrders]);

  if (loading || !user) return null;

  const toggleCredential = (id: number) => {
    setVisibleCredentials(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const copyToClipboard = async (text: string, id: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch { /* silent */ }
  };

  const reportIssue = async (order: any) => {
    setReportingId(order.id);
    try {
      await fetch('/api/report-issue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: order.id,
          category: order.category,
          accountData: order.log_data,
        }),
      });
      setReportedIds(prev => new Set(prev).add(order.id));
    } catch { /* silent — Telegram alert best-effort */ }
    finally { setReportingId(null); }
  };

  const totalSpent = orders.reduce((sum, o) => sum + Number(o.amount || 0), 0);

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950/95 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xs">VS</span>
            </div>
            <span className="font-bold text-white text-sm hidden sm:block">Verified Store</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => router.push('/')}
              className="flex items-center gap-2 px-3 py-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition text-sm"
            >
              <Home className="w-4 h-4" />
              <span className="hidden sm:block">Store</span>
            </button>
            <button
              onClick={signOut}
              className="flex items-center gap-2 px-3 py-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition text-sm"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:block">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-8">
        {/* Welcome block */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold text-white">
              Welcome back{user.name ? `, ${user.name.split(' ')[0]}` : ''}
            </h1>
            <p className="text-slate-400 text-sm mt-1">{user.email}</p>
          </div>
          <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-xl">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="text-emerald-400 text-sm font-medium">Verified Account</span>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-center">
                <ShoppingBag className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="text-slate-400 text-sm">Total Orders</p>
            </div>
            <p className="text-3xl font-bold text-white">{orders.length}</p>
          </div>
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 bg-cyan-500/10 border border-cyan-500/20 rounded-xl flex items-center justify-center">
                <Package className="w-4 h-4 text-cyan-400" />
              </div>
              <p className="text-slate-400 text-sm">Delivered</p>
            </div>
            <p className="text-3xl font-bold text-white">
              {orders.filter(o => o.status === 'completed').length}
            </p>
          </div>
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 bg-yellow-500/10 border border-yellow-500/20 rounded-xl flex items-center justify-center">
                <Zap className="w-4 h-4 text-yellow-400" />
              </div>
              <p className="text-slate-400 text-sm">Total Spent</p>
            </div>
            <p className="text-3xl font-bold text-white">₦{totalSpent.toLocaleString()}</p>
          </div>
        </div>

        {/* Orders list */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
            <h2 className="font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-400" />
              My Orders & Delivered Accounts
            </h2>
            <button
              onClick={fetchOrders}
              className="text-xs text-slate-500 hover:text-slate-300 transition px-3 py-1.5 hover:bg-slate-800 rounded-lg"
            >
              Refresh
            </button>
          </div>

          {ordersLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-6 h-6 text-emerald-400 animate-spin" />
            </div>
          ) : orders.length === 0 ? (
            <div className="py-20 text-center space-y-4">
              <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto">
                <ShoppingBag className="w-7 h-7 text-slate-600" />
              </div>
              <div>
                <p className="text-slate-400 font-medium">No orders yet</p>
                <p className="text-slate-600 text-sm mt-1">Browse the store and make your first purchase</p>
              </div>
              <button
                onClick={() => router.push('/')}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-xl text-sm font-semibold hover:opacity-90 transition"
              >
                Browse Products <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="divide-y divide-slate-800/60">
              {orders.map((order: any) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  isVisible={visibleCredentials.has(order.id)}
                  isCopied={copiedId === order.id}
                  isReporting={reportingId === order.id}
                  isReported={reportedIds.has(order.id)}
                  onToggle={() => toggleCredential(order.id)}
                  onCopy={() => copyToClipboard(order.log_data || '', order.id)}
                  onReport={() => reportIssue(order)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Info footer */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-slate-900/30 border border-slate-800/50 rounded-2xl p-5 flex items-start gap-4">
            <div className="w-9 h-9 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-center shrink-0">
              <Zap className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <p className="text-white text-sm font-semibold">Instant Delivery</p>
              <p className="text-slate-500 text-xs mt-1">Your account credentials are delivered automatically right after payment confirmation.</p>
            </div>
          </div>
          <div className="bg-slate-900/30 border border-slate-800/50 rounded-2xl p-5 flex items-start gap-4">
            <div className="w-9 h-9 bg-cyan-500/10 border border-cyan-500/20 rounded-xl flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
            </div>
            <div>
              <p className="text-white text-sm font-semibold">Need Help?</p>
              <p className="text-slate-500 text-xs mt-1">All purchases are backed by our guarantee. Contact support if you have any issues.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function OrderCard({
  order, isVisible, isCopied, isReporting, isReported, onToggle, onCopy, onReport
}: {
  order: any;
  isVisible: boolean;
  isCopied: boolean;
  isReporting: boolean;
  isReported: boolean;
  onToggle: () => void;
  onCopy: () => void;
  onReport: () => void;
}) {
  const date = new Date(order.created_at).toLocaleDateString('en-NG', {
    year: 'numeric', month: 'short', day: 'numeric'
  });
  const time = new Date(order.created_at).toLocaleTimeString('en-NG', {
    hour: '2-digit', minute: '2-digit'
  });

  return (
    <div className="p-6 hover:bg-slate-800/10 transition">
      <div className="flex items-start justify-between gap-4 flex-wrap mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-800 border border-slate-700 rounded-xl flex items-center justify-center shrink-0">
            <Package className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <p className="text-white font-semibold text-sm">{order.category}</p>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-slate-500 text-xs">{date}</span>
              <span className="text-slate-700 text-xs">·</span>
              <span className="text-slate-500 text-xs">{time}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-bold text-white">₦{Number(order.amount).toLocaleString()}</span>
          <span className="inline-flex items-center gap-1 text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded-full font-semibold">
            <CheckCircle className="w-3 h-3" /> {order.status || 'Delivered'}
          </span>
        </div>
      </div>

      {/* Credential block */}
      {order.log_data && (
        <div className="bg-slate-950/60 border border-slate-700/50 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Account Credentials</p>
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={onCopy}
                className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-emerald-400 transition px-2.5 py-1.5 bg-slate-800 hover:bg-emerald-500/10 rounded-lg border border-slate-700 hover:border-emerald-500/30"
              >
                {isCopied ? (
                  <><Check className="w-3 h-3 text-emerald-400" /> Copied!</>
                ) : (
                  <><Copy className="w-3 h-3" /> Copy</>
                )}
              </button>
              <button
                onClick={onToggle}
                className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700"
              >
                {isVisible ? (
                  <><EyeOff className="w-3 h-3" /> Hide</>
                ) : (
                  <><Eye className="w-3 h-3" /> Reveal</>
                )}
              </button>
              <button
                onClick={onReport}
                disabled={isReported || isReporting}
                className="flex items-center gap-1.5 text-xs transition px-2.5 py-1.5 rounded-lg border disabled:opacity-60 disabled:cursor-not-allowed
                  text-red-400 hover:text-red-300 bg-slate-800 hover:bg-red-500/10 border-slate-700 hover:border-red-500/30"
              >
                {isReporting ? (
                  <><Loader2 className="w-3 h-3 animate-spin" /> Sending…</>
                ) : isReported ? (
                  <><Check className="w-3 h-3" /> Reported</>
                ) : (
                  <><AlertTriangle className="w-3 h-3" /> Report Issue</>
                )}
              </button>
            </div>
          </div>
          <div className="font-mono text-sm">
            {isVisible ? (
              <p className="text-emerald-300 break-all leading-relaxed whitespace-pre-wrap">{order.log_data}</p>
            ) : (
              <p className="text-slate-600 select-none tracking-widest">{'● '.repeat(Math.min(order.log_data.length / 4, 20)).trim()}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
