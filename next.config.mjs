/** @type {import('next').NextConfig} */
const nextConfig = {
  // ── Turbopack: disabled ────────────────────────────────────────────────────
  // This machine does not support BMI2 instructions required by Turbopack.
  // Turbopack is opt-in via `next dev --turbo`; the dev script intentionally
  // omits that flag. The webpack key below makes the Webpack pipeline explicit.
  webpack(config) {
    return config; // no-op passthrough — just forces webpack to be active
  },

  // ── TypeScript ─────────────────────────────────────────────────────────────
  typescript: {
    ignoreBuildErrors: true,
  },

  // ── Images ────────────────────────────────────────────────────────────────
  images: {
    unoptimized: true,
  },

  // ── Logging ───────────────────────────────────────────────────────────────
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
};

export default nextConfig;
