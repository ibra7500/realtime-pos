import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    serverActions: {
        bodySizeLimit: '10mb',
    },
  },

  devIndicators: false,
  images: {
    domains: ["https://nibmcgmaxgmurnstougs.supabase.co"],
    remotePatterns: [
        {
            protocol: 'https',
            hostname: 'nibmcgmaxgmurnstougs.supabase.co',
            port: '',
            pathname: '/**',
            
        }
    ]
  }
};

export default nextConfig;
