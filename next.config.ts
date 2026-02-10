import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ['via.placeholder.com'],
  },
  allowedDevOrigins: ['http://localhost:3000', 'http://192.168.202.207:3000'],
};

export default nextConfig;
