'use client';

import { useState } from 'react';
import { Mail, ArrowLeft, Loader, CheckCircle } from 'lucide-react';

interface ForgotPasswordFormProps {
  onBack: () => void;
}

export default function ForgotPasswordForm({ onBack }: ForgotPasswordFormProps) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    // Validation
    if (!email.trim()) {
      setError('Email address is required');
      return;
    }
    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSuccess(true);
      setEmailSent(true);
      setEmail('');
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError('Failed to send reset email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="space-y-6 text-center">
        <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle className="w-8 h-8 text-emerald-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white mb-2">Check your email</h3>
          <p className="text-slate-400 text-sm mb-2">
            We've sent a password reset link to
          </p>
          <p className="text-white font-medium mb-4">{email}</p>
          <p className="text-slate-400 text-sm">
            Click the link in the email to reset your password. The link will expire in 24 hours.
          </p>
        </div>
        <button
          onClick={onBack}
          className="w-full py-2.5 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-lg hover:from-emerald-600 hover:to-cyan-600 transition font-medium"
        >
          Back to Sign In
        </button>
        <button
          onClick={() => {
            setEmailSent(false);
            setEmail('');
          }}
          className="w-full py-2.5 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 transition"
        >
          Try another email
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Back Button */}
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition text-sm mb-2"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Sign In
      </button>

      <div>
        <h3 className="text-lg font-semibold text-white mb-1">Reset your password</h3>
        <p className="text-slate-400 text-sm mb-4">
          Enter your email address and we'll send you a link to reset your password.
        </p>
      </div>

      {/* Email Field */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
        <div className="relative">
          <Mail className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-700 text-white rounded-lg focus:border-emerald-500 focus:outline-none transition"
          />
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-400 text-sm">
          Reset link sent successfully!
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-2.5 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-lg hover:from-emerald-600 hover:to-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed transition font-medium flex items-center justify-center gap-2"
      >
        {isLoading ? <Loader className="w-4 h-4 animate-spin" /> : null}
        {isLoading ? 'Sending reset link...' : 'Send Reset Link'}
      </button>

      {/* Help Text */}
      <p className="text-center text-slate-400 text-xs pt-2">
        Don't receive the email? Check your spam folder or try another email address.
      </p>
    </form>
  );
}
