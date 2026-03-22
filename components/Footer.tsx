'use client';

import { Facebook, Twitter, Instagram, Mail } from 'lucide-react';
import TrustBadges from './TrustBadges';

export default function Footer() {
  const paymentGateways = [
    { name: 'Stripe', color: 'from-purple-600 to-purple-700', icon: '⊡' },
    { name: 'PayPal', color: 'from-blue-600 to-blue-700', icon: 'P' },
    { name: 'Visa', color: 'from-blue-700 to-blue-900', icon: 'V' },
    { name: 'Mastercard', color: 'from-red-600 to-orange-600', icon: 'M' },
    { name: 'Google Pay', color: 'from-slate-700 to-slate-900', icon: 'G' },
    { name: 'Apple Pay', color: 'from-gray-800 to-black', icon: '◆' },
    { name: 'Crypto', color: 'from-orange-500 to-yellow-500', icon: '₿' },
  ];

  return (
    <footer className="border-t border-slate-800 bg-slate-950/50 backdrop-blur">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Trust Badges Section */}
        <div className="mb-12 pb-8 border-b border-slate-800">
          <h3 className="text-sm font-semibold text-slate-300 mb-4 uppercase tracking-wider">Trusted by Thousands</h3>
          <TrustBadges />
        </div>

        {/* Payment Gateways Section */}
        <div className="mb-12 pb-8 border-b border-slate-800">
          <h3 className="text-sm font-semibold text-slate-300 mb-6 uppercase tracking-wider">Secure Payment Methods</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {paymentGateways.map((gateway) => (
              <div
                key={gateway.name}
                className={`h-20 rounded-lg bg-gradient-to-br ${gateway.color} flex items-center justify-center hover:scale-105 transition-transform cursor-pointer group relative`}
              >
                <div className="text-2xl font-bold text-white opacity-80 group-hover:opacity-100 transition">
                  {gateway.icon}
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-black/50 backdrop-blur-sm rounded-b-lg py-1 text-center opacity-0 group-hover:opacity-100 transition">
                  <p className="text-xs font-medium text-white">{gateway.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <h3 className="text-white font-semibold mb-4">Verified Store</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Premium digital products and social media services with verified sellers and secure transactions.
            </p>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-white font-semibold mb-4">Categories</h3>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><a href="#" className="hover:text-white transition">Facebook Accounts</a></li>
              <li><a href="#" className="hover:text-white transition">Instagram Accounts</a></li>
              <li><a href="#" className="hover:text-white transition">TikTok Accounts</a></li>
              <li><a href="#" className="hover:text-white transition">Twitter Accounts</a></li>
            </ul>
          </div>

          {/* Products */}
          <div>
            <h3 className="text-white font-semibold mb-4">Products</h3>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><a href="#" className="hover:text-white transition">Social Accounts</a></li>
              <li><a href="#" className="hover:text-white transition">VPN Services</a></li>
              <li><a href="#" className="hover:text-white transition">Email Tools</a></li>
              <li><a href="#" className="hover:text-white transition">Premium Tools</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><a href="#" className="hover:text-white transition">Help Center</a></li>
              <li><a href="#" className="hover:text-white transition">Contact Support</a></li>
              <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        {/* Social Links & Bottom Info */}
        <div className="border-t border-slate-800 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Social Icons */}
            <div className="flex items-center gap-4">
              <a href="#" className="p-2 hover:bg-slate-800 rounded-lg transition text-slate-400 hover:text-emerald-400">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 hover:bg-slate-800 rounded-lg transition text-slate-400 hover:text-cyan-400">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 hover:bg-slate-800 rounded-lg transition text-slate-400 hover:text-pink-400">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 hover:bg-slate-800 rounded-lg transition text-slate-400 hover:text-yellow-400">
                <Mail className="w-5 h-5" />
              </a>
            </div>

            {/* Copyright */}
            <div className="text-center md:text-right text-slate-500 text-sm">
              <p>&copy; 2026 Verified Store. All rights reserved.</p>
              <p className="text-xs text-slate-600 mt-1">Secure • Verified • Trusted</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
