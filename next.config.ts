import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: 'standalone',
  
  // Enable experimental features that might help with CSS
  experimental: {
    optimizePackageImports: ['@tailwindcss/typography'],
  },
  
  // Ensure proper CSS handling
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
    };
    return config;
  },
};

export default nextConfig;
