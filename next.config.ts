// next.config.ts

import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Enable strict mode for catching timing/effect bugs in development
  reactStrictMode: true,

  // Experimental: Turbopack for faster dev builds
  // experimental: { turbo: {} },
};

export default nextConfig;
