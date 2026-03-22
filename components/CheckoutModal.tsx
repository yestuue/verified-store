'use client';

import { X, Zap, ShieldCheck, Truck, Loader2 } from 'lucide-react';
import { useState } from 'react';

interface Product {
  id: any; // Can be string or number from DB
  name: string;
  category: string;
  price: string | number;
  stock: number;
  description?: string;
}

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  userEmail?: string;
}

export default function CheckoutModal({ isOpen, onClose, product, userEmail }: CheckoutModalProps) {
  const [email, setEmail] = useState(userEmail || '');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !product) return null;

  // Helper to convert "₦2,000" or 2000 into a clean number
  const getNumericPrice = (price: string | number) => {
    if (typeof price === 'number') return price;
    return Number(price.replace(/[^0-9.-]+/g, ""));
  };

  const numericPrice = getNumericPrice(product.price);

  const handleCheckout = async () => {
    setIsProcessing(true);
    setError('');

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email,
          amount: numericPrice, // Send raw number
          metadata: { 
            category: product.category,
            product_name: product.name 
          }
        }),
      });

      const data = await response.json();

      if (data.status && data.data.authorization_url) {
        // Redirect to Paystack Secure Checkout
        window.location.href = data.data.authorization_url;
      } else {
        throw new Error(data.message || 'Payment initialization failed');
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}></div>

      {/* Modal */}
      <div className="relative z-50 w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-slate-800 rounded-full transition">
          <X className="w-5 h-5 text-slate-400" />
        </button>

        <div className="p-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-1 text-center">Checkout</h2>
            <p className="text-slate-400 text-sm text-center">Instant automated delivery after payment</p>
          </div>

          {/* Product Info */}
          <div className="bg-slate-950/50 rounded-2xl p-6 border border-slate-800 mb-8">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-bold text-lg text-white">{product.name}</h3>
                <p className="text-emerald-400 text-sm font-semibold uppercase">{product.category}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-500 uppercase font-bold">Price</p>
                <p className="text-xl font-bold text-white">₦{numericPrice.toLocaleString()}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 pt-4 border-t border-slate-800">
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <Zap className="w-3 h-3 text-yellow-500" /> Instant Delivery
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <ShieldCheck className="w-3 h-3 text-emerald-500" /> Secure Payment
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm text-center">
              {error}
            </div>
          )}

          {/* Form */}
          <div className="space-y-6">
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">Delivery Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email to receive credentials"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500/50 outline-none transition"
              />
            </div>

            <button
              onClick={handleCheckout}
              disabled={!email || isProcessing}
              className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-bold py-4 rounded-xl hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2 text-lg shadow-lg shadow-emerald-500/20"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Initializing Paystack...
                </>
              ) : (
                <>Pay ₦{numericPrice.toLocaleString()}</>
              )}
            </button>

            <p className="text-center text-[10px] text-slate-500 uppercase tracking-widest font-bold">
              🔒 Payment secured by Paystack
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}