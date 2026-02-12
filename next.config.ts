import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 's3.ap-northeast-2.amazonaws.com' },
      { protocol: 'https', hostname: 'durumo.s3.ap-northeast-2.amazonaws.com' },
    ],
  },
  allowedDevOrigins: ['http://localhost:3000', 'http://192.168.202.207:3000'],
};

export default nextConfig;
