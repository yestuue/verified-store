import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Suspense } from 'react'
import './globals.css'
import { AuthProvider } from '../components/providers/auth-provider'

const geistSans = Geist({
  subsets: ['latin'],
  variable: '--font-geist-sans',
});

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
});

// ── SEO Metadata ─────────────────────────────────────────────────────────────
export const metadata: Metadata = {
  title: {
    default: 'Verified Store | Premium Digital Assets',
    template: '%s | Verified Store',
  },
  description:
    'Automated delivery of high-quality social logs and premium accounts. ' +
    'Instant, verified, and secure — trusted by thousands of buyers.',
  keywords: [
    'digital accounts', 'social media accounts', 'premium logs',
    'Instagram accounts', 'TikTok accounts', 'verified accounts',
    'buy accounts', 'instant delivery',
  ],
  authors: [{ name: 'Verified Store' }],
  creator: 'Verified Store',
  robots: { index: true, follow: true },
  openGraph: {
    type: 'website',
    siteName: 'Verified Store',
    title: 'Verified Store | Premium Digital Assets',
    description:
      'Automated delivery of high-quality social logs and premium accounts.',
  },
  twitter: {
    card: 'summary',
    title: 'Verified Store | Premium Digital Assets',
    description:
      'Automated delivery of high-quality social logs and premium accounts.',
  },
};

// ── Viewport / theme-color (dark slate to match the UI) ──────────────────────
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#020617', // slate-950
};

// ── Root Layout ───────────────────────────────────────────────────────────────
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased bg-slate-950`}
      >
        <AuthProvider>
          <Suspense fallback={null}>
            {children}
          </Suspense>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}
