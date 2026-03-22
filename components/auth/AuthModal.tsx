'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import SignInForm from './SignInForm';
import SignUpForm from './SignUpForm';
import ForgotPasswordForm from './ForgotPasswordForm';

type AuthView = 'signin' | 'signup' | 'forgot-password';

interface AuthModalProps {
  isOpen: boolean;
  initialView?: AuthView;
  onClose: () => void;
}

export default function AuthModal({ isOpen, initialView = 'signin', onClose }: AuthModalProps) {
  const [currentView, setCurrentView] = useState<AuthView>(initialView);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-2xl w-full max-w-md animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800">
          <h2 className="text-xl font-bold text-white">
            {currentView === 'signin' && 'Welcome Back'}
            {currentView === 'signup' && 'Create Account'}
            {currentView === 'forgot-password' && 'Reset Password'}
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-800 rounded-lg transition"
          >
            <X className="w-5 h-5 text-slate-400 hover:text-white transition" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {currentView === 'signin' && (
            <SignInForm
              onForgotPassword={() => setCurrentView('forgot-password')}
              onSwitchToSignUp={() => setCurrentView('signup')}
            />
          )}

          {currentView === 'signup' && (
            <SignUpForm
              onSwitchToSignIn={() => setCurrentView('signin')}
            />
          )}

          {currentView === 'forgot-password' && (
            <ForgotPasswordForm
              onBack={() => setCurrentView('signin')}
            />
          )}
        </div>

        {/* Footer - Trust Badges */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950 rounded-b-lg">
          <div className="flex items-center justify-center gap-4 text-xs text-slate-400">
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414L10 3.586l4.707 4.707a1 1 0 01-1.414 1.414L10 6.414l-3.293 3.293a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
              SSL Secure
            </div>
            <span className="text-slate-600">•</span>
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                <path fillRule="evenodd" d="M4 5a2 2 0 012-2 1 1 0 000 2H3v10a2 2 0 002 2h10a2 2 0 002-2V5h-3a1 1 0 000-2 2 2 0 00-2-2H4zm3 4a1 1 0 112 0 1 1 0 01-2 0zm2 6a1 1 0 100-2 1 1 0 000 2zm4-3a1 1 0 112 0 1 1 0 01-2 0z" clipRule="evenodd" />
              </svg>
              Verified
            </div>
            <span className="text-slate-600">•</span>
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              24/7 Support
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
