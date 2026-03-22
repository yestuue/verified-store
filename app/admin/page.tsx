'use client';

import { Suspense, useState, useEffect, useCallback } from 'react';
import {
  LayoutDashboard, Upload, Package, ShoppingBag, LogOut,
  TrendingUp, DollarSign, AlertTriangle, RefreshCcw,
  FileUp, CheckCircle, XCircle, Loader2, Search,
  Shield, Database, BarChart3, Zap, ArrowUpRight,
  Box, ClipboardList
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/providers/auth-provider';

type Tab = 'overview' | 'upload' | 'inventory' | 'sales';

export default function AdminPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <Loader2 className="w-6 h-6 text-amber-400 animate-spin" />
        </div>
      </div>
    }>
      <AdminDashboard />
    </Suspense>
  );
}

function AdminDashboard() {
  const router = useRouter();
  const { user, loading, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [stats, setStats] = useState({ totalInStock: 0, totalSold: 0, revenue: 0, lowStockCount: 0 });
  const [recentSales, setRecentSales] = useState<any[]>([]);
  const [inventory, setInventory] = useState<any[]>([]);
  const [allSales, setAllSales] = useState<any[]>([]);
  const [salesSearch, setSalesSearch] = useState('');
  const [dataLoading, setDataLoading] = useState(true);

  // Upload state
  const [file, setFile] = useState<File | null>(null);
  const [category, setCategory] = useState('Instagram');
  const [description, setDescription] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [uploadHistory, setUploadHistory] = useState<any[]>([]);
  const [showCredential, setShowCredential] = useState<string | null>(null);

  // Guard: only admins
  useEffect(() => {
    if (!loading && (!user || !user.is_admin)) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  const fetchData = useCallback(async () => {
    setDataLoading(true);
    try {
      const [statsRes, uploadsRes] = await Promise.all([
        fetch('/api/admin/stats'),
        fetch('/api/admin/upload'),
      ]);
      if (statsRes.ok) {
        const d = await statsRes.json();
        setStats(d.stats || { totalInStock: 0, totalSold: 0, revenue: 0, lowStockCount: 0 });
        setRecentSales(d.recentSales || []);
        setInventory(d.inventory || []);
        setAllSales(d.allSales || []);
      }
      if (uploadsRes.ok) {
        const u = await uploadsRes.json();
        setUploadHistory(u.uploads || []);
      }
    } catch {
      // silent
    } finally {
      setDataLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user?.is_admin) fetchData();
  }, [user, fetchData]);

  if (loading || !user?.is_admin) return null;

  const categories = [
    'Instagram', 'Facebook', 'TikTok', 'Twitter', 'Discord',
    'VPN', 'Snapchat', 'Email', 'YouTube', 'Reddit',
    'Dating', 'Apple', 'Other'
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!f.name.endsWith('.txt')) {
      setUploadResult({ type: 'error', message: 'Only .txt files are accepted.' });
      return;
    }
    setFile(f);
    setUploadResult(null);
  };

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) return;
    setIsUploading(true);
    setUploadResult(null);
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('category', category);
      fd.append('description', description);
      const res = await fetch('/api/admin/upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');
      setUploadResult({ type: 'success', message: `✅ ${data.accountsCount} accounts uploaded to ${category}` });
      setFile(null);
      setDescription('');
      fetchData();
    } catch (err: any) {
      setUploadResult({ type: 'error', message: err.message });
    } finally {
      setIsUploading(false);
    }
  };

  const filteredSales = allSales.filter(s =>
    salesSearch === '' ||
    s.customer_email?.toLowerCase().includes(salesSearch.toLowerCase()) ||
    s.category?.toLowerCase().includes(salesSearch.toLowerCase())
  );

  const maxStock = Math.max(...inventory.map((i: any) => Number(i.count) || 0), 1);

  const navItems: { id: Tab; label: string; icon: any; badge?: number }[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'upload', label: 'Upload Logs', icon: Upload },
    { id: 'inventory', label: 'Inventory', icon: Package, badge: inventory.length },
    { id: 'sales', label: 'Sales History', icon: ShoppingBag, badge: stats.totalSold },
  ];

  return (
    <div className="min-h-screen bg-slate-950 flex text-slate-200">
      {/* ── SIDEBAR ── */}
      <aside className="w-72 shrink-0 flex flex-col bg-slate-900 border-r border-slate-800 sticky top-0 h-screen">
        {/* Logo */}
        <div className="px-6 py-5 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-amber-900/30">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-bold text-white text-sm">Verified Store</p>
              <p className="text-[10px] text-amber-400 font-semibold uppercase tracking-widest">Admin Console</p>
            </div>
          </div>
        </div>

        {/* Admin badge */}
        <div className="px-6 py-4 border-b border-slate-800">
          <div className="flex items-center gap-3 bg-amber-500/10 border border-amber-500/20 rounded-xl px-4 py-3">
            <div className="w-8 h-8 bg-amber-500/20 rounded-full flex items-center justify-center">
              <span className="text-amber-400 font-bold text-xs">{user.name?.[0]?.toUpperCase() || 'A'}</span>
            </div>
            <div className="min-w-0">
              <p className="text-white text-sm font-semibold truncate">{user.name || 'Admin'}</p>
              <p className="text-amber-400 text-xs truncate">{user.email}</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {navItems.map(({ id, label, icon: Icon, badge }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all text-sm font-medium ${
                activeTab === id
                  ? 'bg-amber-500/15 text-amber-400 border border-amber-500/25 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className="w-4 h-4" />
                {label}
              </div>
              {badge !== undefined && badge > 0 && (
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  activeTab === id ? 'bg-amber-500/20 text-amber-300' : 'bg-slate-700 text-slate-400'
                }`}>
                  {badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Bottom */}
        <div className="px-4 pb-6 border-t border-slate-800 pt-4 space-y-2">
          <button
            onClick={fetchData}
            className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-xl transition text-sm"
          >
            <RefreshCcw className={`w-4 h-4 ${dataLoading ? 'animate-spin' : ''}`} />
            Refresh Data
          </button>
          <button
            onClick={signOut}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition text-sm"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <main className="flex-1 overflow-y-auto">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-slate-950/90 backdrop-blur border-b border-slate-800 px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-white capitalize">
              {activeTab === 'overview' ? 'Store Overview' :
               activeTab === 'upload' ? 'Upload Log Files' :
               activeTab === 'inventory' ? 'Inventory Management' : 'Sales History'}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">Verified Store Admin — full control panel</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-lg">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
              <span className="text-xs text-emerald-400 font-medium">Live</span>
            </div>
          </div>
        </header>

        <div className="p-8 space-y-8">
          {/* ── OVERVIEW ── */}
          {activeTab === 'overview' && (
            <div className="space-y-8 animate-in fade-in duration-300">
              {/* Stats row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
                <AdminStatCard
                  title="In Stock"
                  value={stats.totalInStock}
                  icon={Box}
                  color="cyan"
                  sub={`across ${inventory.length} categories`}
                />
                <AdminStatCard
                  title="Total Sold"
                  value={stats.totalSold}
                  icon={TrendingUp}
                  color="emerald"
                  sub="all time transactions"
                />
                <AdminStatCard
                  title="Total Revenue"
                  value={`₦${stats.revenue.toLocaleString()}`}
                  icon={DollarSign}
                  color="amber"
                  sub="confirmed payments"
                />
                <AdminStatCard
                  title="Low Stock Alerts"
                  value={stats.lowStockCount}
                  icon={AlertTriangle}
                  color={stats.lowStockCount > 0 ? 'red' : 'purple'}
                  sub="categories with ≤5 left"
                />
              </div>

              {/* Two columns */}
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Recent Sales table (2/3 width) */}
                <div className="xl:col-span-2 bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden">
                  <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
                    <h2 className="font-bold text-white flex items-center gap-2">
                      <ClipboardList className="w-4 h-4 text-amber-400" />
                      Recent Sales
                    </h2>
                    <button
                      onClick={() => setActiveTab('sales')}
                      className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 transition"
                    >
                      View all <ArrowUpRight className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-slate-800 text-slate-500 text-xs uppercase">
                          <th className="text-left px-6 py-3 font-medium">Customer</th>
                          <th className="text-left px-6 py-3 font-medium">Category</th>
                          <th className="text-left px-6 py-3 font-medium">Amount</th>
                          <th className="text-right px-6 py-3 font-medium">Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/50">
                        {dataLoading ? (
                          <tr><td colSpan={4} className="py-12 text-center"><Loader2 className="w-5 h-5 animate-spin text-amber-400 mx-auto" /></td></tr>
                        ) : recentSales.length === 0 ? (
                          <tr><td colSpan={4} className="py-12 text-center text-slate-600 text-sm">No sales recorded yet.</td></tr>
                        ) : recentSales.map((sale: any) => (
                          <tr key={sale.id} className="hover:bg-slate-800/30 transition">
                            <td className="px-6 py-4 text-slate-300 font-medium">{sale.customer_email}</td>
                            <td className="px-6 py-4">
                              <span className="text-xs bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-1 rounded-full font-semibold">
                                {sale.category}
                              </span>
                            </td>
                            <td className="px-6 py-4 font-bold text-white">₦{Number(sale.amount).toLocaleString()}</td>
                            <td className="px-6 py-4 text-right text-slate-500 text-xs">
                              {new Date(sale.created_at).toLocaleDateString('en-NG')}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Inventory snapshot (1/3 width) */}
                <div className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden">
                  <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
                    <h2 className="font-bold text-white flex items-center gap-2">
                      <BarChart3 className="w-4 h-4 text-cyan-400" />
                      Stock by Category
                    </h2>
                    <button
                      onClick={() => setActiveTab('inventory')}
                      className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition"
                    >
                      Manage <ArrowUpRight className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="p-6 space-y-4">
                    {dataLoading ? (
                      <div className="flex justify-center py-8"><Loader2 className="w-5 h-5 animate-spin text-cyan-400" /></div>
                    ) : inventory.length === 0 ? (
                      <p className="text-slate-600 text-sm text-center py-8">No inventory data.</p>
                    ) : inventory.slice(0, 8).map((item: any) => (
                      <div key={item.category}>
                        <div className="flex justify-between text-xs mb-1.5">
                          <span className="text-slate-300 font-medium">{item.category}</span>
                          <span className={`font-bold ${Number(item.count) > 20 ? 'text-emerald-400' : Number(item.count) > 5 ? 'text-yellow-400' : 'text-red-400'}`}>
                            {item.count}
                          </span>
                        </div>
                        <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${
                              Number(item.count) > 20 ? 'bg-emerald-500' :
                              Number(item.count) > 5 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${(Number(item.count) / maxStock) * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── UPLOAD ── */}
          {activeTab === 'upload' && (
            <div className="space-y-8 animate-in fade-in duration-300">
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                {/* Upload form (3/5) */}
                <div className="lg:col-span-3 bg-slate-900/50 border border-slate-800 rounded-2xl p-8">
                  <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                    <Upload className="w-5 h-5 text-amber-400" />
                    Upload Account Logs
                  </h2>

                  <form onSubmit={handleUpload} className="space-y-6">
                    {/* File drop zone */}
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        .txt File <span className="text-slate-500">(one account per line)</span>
                      </label>
                      <label
                        htmlFor="file-upload"
                        className={`flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-xl cursor-pointer transition-all ${
                          file
                            ? 'border-amber-500/50 bg-amber-500/5'
                            : 'border-slate-700 hover:border-slate-600 bg-slate-800/20'
                        }`}
                      >
                        <input
                          id="file-upload"
                          type="file"
                          accept=".txt"
                          className="hidden"
                          onChange={handleFileChange}
                        />
                        {file ? (
                          <div className="text-center">
                            <CheckCircle className="w-8 h-8 text-amber-400 mx-auto mb-2" />
                            <p className="text-white font-medium text-sm">{file.name}</p>
                            <p className="text-slate-500 text-xs mt-1">{(file.size / 1024).toFixed(1)} KB</p>
                          </div>
                        ) : (
                          <div className="text-center">
                            <FileUp className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                            <p className="text-slate-400 text-sm">Click to select a .txt file</p>
                            <p className="text-slate-600 text-xs mt-1">Each line = one account credential</p>
                          </div>
                        )}
                      </label>
                    </div>

                    {/* Category */}
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Category</label>
                      <select
                        value={category}
                        onChange={e => setCategory(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-800 border border-slate-700 text-white rounded-xl focus:ring-2 focus:ring-amber-500/50 outline-none text-sm"
                      >
                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>

                    {/* Description */}
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Description <span className="text-slate-500">(optional)</span></label>
                      <input
                        type="text"
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        placeholder="e.g. UK aged accounts, 2024 verified"
                        className="w-full px-4 py-3 bg-slate-800 border border-slate-700 text-white rounded-xl focus:ring-2 focus:ring-amber-500/50 outline-none text-sm placeholder-slate-600"
                      />
                    </div>

                    {/* Result */}
                    {uploadResult && (
                      <div className={`flex items-center gap-3 p-4 rounded-xl border text-sm ${
                        uploadResult.type === 'success'
                          ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                          : 'bg-red-500/10 border-red-500/20 text-red-400'
                      }`}>
                        {uploadResult.type === 'success'
                          ? <CheckCircle className="w-4 h-4 shrink-0" />
                          : <XCircle className="w-4 h-4 shrink-0" />}
                        {uploadResult.message}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={!file || isUploading}
                      className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl font-bold disabled:opacity-50 transition flex items-center justify-center gap-2 shadow-lg shadow-amber-900/30 hover:shadow-amber-900/50"
                    >
                      {isUploading ? (
                        <><Loader2 className="w-4 h-4 animate-spin" /> Processing...</>
                      ) : (
                        <><Upload className="w-4 h-4" /> Upload to Database</>
                      )}
                    </button>
                  </form>
                </div>

                {/* Upload history (2/5) */}
                <div className="lg:col-span-2 bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden">
                  <div className="px-6 py-4 border-b border-slate-800">
                    <h2 className="font-bold text-white flex items-center gap-2 text-sm">
                      <Database className="w-4 h-4 text-amber-400" />
                      Current Stock per Category
                    </h2>
                  </div>
                  <div className="p-4 space-y-3 overflow-y-auto max-h-[500px]">
                    {uploadHistory.length === 0 ? (
                      <p className="text-slate-600 text-sm text-center py-8">No uploads yet.</p>
                    ) : uploadHistory.map((item: any) => (
                      <div key={item.category} className="flex items-center justify-between bg-slate-800/40 border border-slate-700/50 rounded-xl px-4 py-3">
                        <div>
                          <p className="text-white text-sm font-medium">{item.category}</p>
                          <p className="text-slate-500 text-xs">
                            Last: {item.last_upload ? new Date(item.last_upload).toLocaleDateString('en-NG') : 'N/A'}
                          </p>
                        </div>
                        <span className={`text-sm font-bold ${
                          Number(item.count) > 20 ? 'text-emerald-400' :
                          Number(item.count) > 5 ? 'text-yellow-400' : 'text-red-400'
                        }`}>
                          {item.count} accts
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── INVENTORY ── */}
          {activeTab === 'inventory' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 text-center">
                  <p className="text-slate-500 text-xs font-medium uppercase tracking-wider mb-2">Total In Stock</p>
                  <p className="text-4xl font-bold text-cyan-400">{stats.totalInStock}</p>
                  <p className="text-slate-600 text-xs mt-1">available accounts</p>
                </div>
                <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 text-center">
                  <p className="text-slate-500 text-xs font-medium uppercase tracking-wider mb-2">Categories Active</p>
                  <p className="text-4xl font-bold text-amber-400">{inventory.length}</p>
                  <p className="text-slate-600 text-xs mt-1">product categories</p>
                </div>
                <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 text-center">
                  <p className="text-slate-500 text-xs font-medium uppercase tracking-wider mb-2">Low Stock Alerts</p>
                  <p className="text-4xl font-bold text-red-400">
                    {inventory.filter((i: any) => Number(i.count) <= 5).length}
                  </p>
                  <p className="text-slate-600 text-xs mt-1">categories with ≤5 left</p>
                </div>
              </div>

              <div className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
                  <h2 className="font-bold text-white flex items-center gap-2">
                    <Package className="w-4 h-4 text-cyan-400" />
                    Full Inventory Breakdown
                  </h2>
                  <button
                    onClick={() => setActiveTab('upload')}
                    className="text-xs bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20 px-3 py-1.5 rounded-lg transition flex items-center gap-1.5"
                  >
                    <Upload className="w-3 h-3" /> Add Stock
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-500 text-xs uppercase">
                        <th className="text-left px-6 py-3 font-medium">Category</th>
                        <th className="text-left px-6 py-3 font-medium">Available</th>
                        <th className="text-left px-6 py-3 font-medium">Stock Level</th>
                        <th className="text-right px-6 py-3 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50">
                      {dataLoading ? (
                        <tr><td colSpan={4} className="py-12 text-center"><Loader2 className="w-5 h-5 animate-spin text-cyan-400 mx-auto" /></td></tr>
                      ) : inventory.length === 0 ? (
                        <tr><td colSpan={4} className="py-12 text-center text-slate-600">No inventory data. Upload some accounts.</td></tr>
                      ) : inventory.map((item: any) => {
                        const count = Number(item.count);
                        const pct   = Math.round((count / maxStock) * 100);
                        const isOut  = count === 0;
                        const isLow  = item.low_stock && !isOut; // flag from API (≤5)
                        return (
                          <tr key={item.category} className="hover:bg-slate-800/20 transition">
                            <td className="px-6 py-4 font-semibold text-white">
                              <div className="flex items-center gap-2">
                                {item.category}
                                {isLow && (
                                  <span className="text-[10px] bg-red-500/15 text-red-400 border border-red-500/30 px-1.5 py-0.5 rounded font-bold uppercase tracking-wide">
                                    Low
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4 font-bold text-slate-200">{count}</td>
                            <td className="px-6 py-4 w-48">
                              <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                                <div
                                  className={`h-full rounded-full ${isOut ? 'bg-red-600' : isLow ? 'bg-yellow-500' : 'bg-emerald-500'}`}
                                  style={{ width: `${Math.max(pct, isOut ? 0 : 3)}%` }}
                                />
                              </div>
                              <span className="text-xs text-slate-600 mt-1 block">{pct}% of max</span>
                            </td>
                            <td className="px-6 py-4 text-right">
                              {isOut ? (
                                <span className="inline-flex items-center gap-1 text-xs bg-red-500/10 text-red-400 border border-red-500/20 px-2.5 py-1 rounded-full font-semibold">
                                  <AlertTriangle className="w-3 h-3" /> Out of Stock
                                </span>
                              ) : isLow ? (
                                <span className="inline-flex items-center gap-1 text-xs bg-red-500/10 text-red-400 border border-red-500/20 px-2.5 py-1 rounded-full font-semibold">
                                  <AlertTriangle className="w-3 h-3" /> Low Stock
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded-full font-semibold">
                                  <Zap className="w-3 h-3" /> Active
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ── SALES HISTORY ── */}
          {activeTab === 'sales' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between gap-4 flex-wrap">
                  <h2 className="font-bold text-white flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4 text-amber-400" />
                    Full Transaction History
                    <span className="text-xs bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full">{filteredSales.length}</span>
                  </h2>
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      value={salesSearch}
                      onChange={e => setSalesSearch(e.target.value)}
                      placeholder="Search email or category..."
                      className="bg-slate-800 border border-slate-700 rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:ring-2 focus:ring-amber-500/50 outline-none placeholder-slate-600 w-64"
                    />
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-500 text-xs uppercase">
                        <th className="text-left px-6 py-3 font-medium">#</th>
                        <th className="text-left px-6 py-3 font-medium">Customer</th>
                        <th className="text-left px-6 py-3 font-medium">Category</th>
                        <th className="text-left px-6 py-3 font-medium">Amount</th>
                        <th className="text-left px-6 py-3 font-medium">Status</th>
                        <th className="text-right px-6 py-3 font-medium">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50">
                      {dataLoading ? (
                        <tr><td colSpan={6} className="py-12 text-center"><Loader2 className="w-5 h-5 animate-spin text-amber-400 mx-auto" /></td></tr>
                      ) : filteredSales.length === 0 ? (
                        <tr><td colSpan={6} className="py-16 text-center text-slate-600">
                          {salesSearch ? 'No results match your search.' : 'No transactions yet.'}
                        </td></tr>
                      ) : filteredSales.map((sale: any, i: number) => (
                        <tr key={sale.id} className="hover:bg-slate-800/20 transition">
                          <td className="px-6 py-4 text-slate-600 text-xs">{i + 1}</td>
                          <td className="px-6 py-4 text-slate-300 font-medium">{sale.customer_email}</td>
                          <td className="px-6 py-4">
                            <span className="text-xs bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded-full font-semibold">
                              {sale.category}
                            </span>
                          </td>
                          <td className="px-6 py-4 font-bold text-white">₦{Number(sale.amount).toLocaleString()}</td>
                          <td className="px-6 py-4">
                            <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full font-semibold capitalize">
                              {sale.status || 'completed'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right text-slate-500 text-xs">
                            {new Date(sale.created_at).toLocaleString('en-NG')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {filteredSales.length > 0 && (
                  <div className="px-6 py-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500">
                    <span>Showing {filteredSales.length} transactions</span>
                    <span>Total Revenue: <span className="text-amber-400 font-bold">₦{stats.revenue.toLocaleString()}</span></span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function AdminStatCard({ title, value, icon: Icon, color, sub }: { title: string; value: any; icon: any; color: string; sub: string }) {
  const colors: Record<string, string> = {
    cyan:   'text-cyan-400   bg-cyan-500/10   border-cyan-500/20',
    emerald:'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    amber:  'text-amber-400  bg-amber-500/10  border-amber-500/20',
    purple: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
    red:    'text-red-400    bg-red-500/10    border-red-500/20',
  };
  const cls = colors[color] || colors.amber;
  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition">
      <div className={`w-10 h-10 rounded-xl border flex items-center justify-center mb-4 ${cls}`}>
        <Icon className="w-5 h-5" />
      </div>
      <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">{title}</p>
      <p className="text-3xl font-bold text-white mt-1">{value}</p>
      <p className="text-slate-600 text-xs mt-2">{sub}</p>
    </div>
  );
}
