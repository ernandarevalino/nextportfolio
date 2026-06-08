import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: [
    'localhost:3000',
    '192.168.1.7:3000',
    '192.168.1.7',
    '10.136.33.5:3000',
    '10.136.33.5'
  ]
};

export default nextConfig;