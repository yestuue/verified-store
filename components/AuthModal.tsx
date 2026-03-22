'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import SignInForm from './SignInForm';
import SignUpForm from './SignUpForm';
import ForgotPasswordForm from './ForgotPasswordForm';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultView?: 'signin' | 'signup';
}

type AuthView = 'signin' | 'signup' | 'forgot-password';

export default function AuthModal({ isOpen, onClose, defaultView = 'signin' }: AuthModalProps) {
  const [currentView, setCurrentView] = useState<AuthView>(defaultView === 'signup' ? 'signup' : 'signin');

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-slate-900 rounded-xl border border-slate-800 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
            <h1 className="text-lg font-semibold text-white">Verified Store</h1>
            <button
              onClick={onClose}
              className="p-1 hover:bg-slate-800 rounded-lg transition text-slate-400 hover:text-slate-300"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="px-6 py-8">
            {currentView === 'signin' && (
              <SignInForm
                onSwitchToSignUp={() => setCurrentView('signup')}
                onSwitchToForgotPassword={() => setCurrentView('forgot-password')}
                onClose={onClose}
              />
            )}

            {currentView === 'signup' && (
              <SignUpForm
                onSwitchToSignIn={() => setCurrentView('signin')}
                onClose={onClose}
              />
            )}

            {currentView === 'forgot-password' && (
              <ForgotPasswordForm
                onSwitchToSignIn={() => setCurrentView('signin')}
                onClose={onClose}
              />
            )}
          </div>

          {/* Security Footer */}
          <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/50">
            <div className="flex items-center justify-center gap-4 text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                SSL Secure
              </span>
              <span className="text-slate-600">•</span>
              <span className="flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Verified
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
